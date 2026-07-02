'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { getSocketService } from '@/services/socketService';
import {
  Page,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  IconButton,
  Menu,
  MenuItem,
  ResponsiveStack,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  TextField,
  Textarea,
  Select,
  Checkbox,
  ToggleGroup,
  Progress,
  Skeleton,
} from '@infinibay/harbor';
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  CircleSlash,
  Trash2,
  RefreshCcw,
} from 'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { RowContextMenu } from '@/components/common/RowContextMenu';
import { fetchTemplates } from '@/state/slices/templates';
import { fetchVms } from '@/state/slices/vms';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:images');

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const GOLDEN_IMAGE_FIELDS = gql`
  fragment GoldenImageFields on GoldenImage {
    id
    name
    osType
    osVersion
    baseDiskPath
    sizeBytes
    status
    version
    parentImageId
    sourceType
    sourceMachineId
    sourceTemplateId
    hardeningApplied
    notes
    createdById
    createdAt
    updatedAt
    sealedAt
    deprecatedAt
  }
`;

const GOLDEN_IMAGES_QUERY = gql`
  query GoldenImages {
    goldenImages {
      ...GoldenImageFields
    }
  }
  ${GOLDEN_IMAGE_FIELDS}
`;

const CREATE_FROM_TEMPLATE = gql`
  mutation CreateGoldenImageFromTemplate($input: CreateGoldenImageFromTemplateInput!) {
    createGoldenImageFromTemplate(input: $input) {
      success
      error
      image { ...GoldenImageFields }
    }
  }
  ${GOLDEN_IMAGE_FIELDS}
`;

const CAPTURE_FROM_MACHINE = gql`
  mutation CaptureGoldenImageFromMachine($input: CaptureGoldenImageFromMachineInput!) {
    captureGoldenImageFromMachine(input: $input) {
      success
      error
      image { ...GoldenImageFields }
    }
  }
  ${GOLDEN_IMAGE_FIELDS}
`;

const PUBLISH = gql`
  mutation PublishGoldenImage($id: ID!) {
    publishGoldenImage(id: $id) { success error image { id status updatedAt } }
  }
`;

const DEPRECATE = gql`
  mutation DeprecateGoldenImage($id: ID!) {
    deprecateGoldenImage(id: $id) { success error image { id status deprecatedAt } }
  }
`;

const DELETE = gql`
  mutation DeleteGoldenImage($id: ID!) {
    deleteGoldenImage(id: $id)
  }
`;

const RETRY_BUILD = gql`
  mutation RetryBuildGoldenImage($id: ID!) {
    retryBuildGoldenImage(id: $id) { success error image { id status updatedAt } }
  }
`;
function timeAgo(value) {
  if (!value) return '—';
  const ms = Date.now() - new Date(value).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

function formatSize(bytes) {
  const n = Number(bytes || 0);
  if (!n) return '—';
  const gb = n / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(n / 1024 ** 2).toFixed(0)} MB`;
}

const STATUS_TONE = {
  building: 'info',
  draft: 'warning',
  published: 'success',
  deprecated: 'neutral',
  failed: 'danger',
};

const STEP_LABELS = {
  queued: 'Queued',
  creating_temp_vm: 'Creating temp VM',
  spawning_vm: 'Spawning VM',
  waiting_for_agent: 'Waiting for agent',
  sealing: 'Sealing image',
  waiting_for_shutdown: 'Waiting for shutdown',
  promoting_disk: 'Promoting disk',
  stopping_source: 'Stopping source',
  cloning_disk: 'Cloning disk',
  starting_for_seal: 'Starting for seal',
  preparing: 'Preparing',
};

/**
 * Group images into families. A family is the root (no parentImageId) plus
 * every descendant reachable via parentImageId. Ungrouped images appear as
 * single-member families.
 */
function groupIntoFamilies(images) {
  const byId = new Map(images.map((img) => [img.id, img]));
  const roots = images.filter((img) => !img.parentImageId || !byId.has(img.parentImageId));
  const descendants = (rootId) => {
    const out = [];
    const queue = images.filter((img) => img.parentImageId === rootId);
    while (queue.length) {
      const next = queue.shift();
      out.push(next);
      for (const child of images) {
        if (child.parentImageId === next.id) queue.push(child);
      }
    }
    return out;
  };
  return roots.map((root) => ({
    root,
    versions: [root, ...descendants(root.id)].sort(
      (a, b) => a.version - b.version
    ),
  }));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GoldenImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefillMachineId, setPrefillMachineId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const progressRef = useRef({});
  // Tracks row mutations currently in flight (keyed by `${resultKey}:${id}`) so a
  // rapid double-click on a Publish/Deprecate/Retry action can't fire the same
  // mutation twice.
  const inFlightRef = useRef(new Set());

  const searchParams = useSearchParams();
  const router = useRouter();

  // Support `/images?capture=<vmId>` — opened from the desktops context
  // menu. Clear the query once the dialog is visible so a refresh
  // doesn't reopen it.
  useEffect(() => {
    const capture = searchParams?.get('capture');
    if (capture) {
      setPrefillMachineId(capture);
      setDialogOpen(true);
      router.replace('/images');
    }
  }, [searchParams, router]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GOLDEN_IMAGES_QUERY,
        fetchPolicy: 'network-only',
      });
      const next = data?.goldenImages ?? [];
      // Prune stale progress entries for images that are no longer building
      // so a finished build doesn't leave a dangling progress bar behind.
      const building = new Set(
        next.filter((img) => img.status === 'building').map((img) => img.id)
      );
      for (const id of Object.keys(progressRef.current)) {
        if (!building.has(id)) delete progressRef.current[id];
      }
      setImages(next);
      setError(null);
    } catch (err) {
      debug.error('fetch', err);
      const message = err.message || 'Failed to load golden images';
      setError(message);
      // The empty-state branch renders a persistent ErrorState; when a refresh
      // fails while a list is already on screen that branch never shows, so
      // surface a toast too rather than failing silently.
      toast.error(`Failed to load golden images: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Subscribe to real-time build progress events via WebSocket.
  // Progress updates ({ id, progressPercent, step }) are stored in a ref
  // so rows can render them without triggering full list re-renders.
  useEffect(() => {
    let unsubProgress;
    let unsubUpdate;
    try {
      const socketService = getSocketService();

      unsubProgress = socketService.subscribeToResource('golden_images', 'progress', (event) => {
        const d = event?.data;
        if (!d?.id) return;
        progressRef.current[d.id] = { progressPercent: d.progressPercent ?? 0, step: d.step ?? '' };
        // Trigger a shallow re-render to pick up the new progress data.
        setImages((prev) => prev.map((img) => img.id === d.id ? { ...img } : img));
      });

      // Also listen for 'update' events (publish / deprecate / status changes)
      // so the list stays fresh without manual polling.
      unsubUpdate = socketService.subscribeToResource('golden_images', 'update', (event) => {
        const d = event?.data;
        if (!d?.id) return;
        // A build that has moved past 'building' no longer needs its transient
        // progress entry; drop it so the row stops rendering a progress bar.
        if (d.status && d.status !== 'building') delete progressRef.current[d.id];
        let known = false;
        setImages((prev) => {
          known = prev.some((img) => img.id === d.id);
          if (!known) return prev;
          return prev.map((img) =>
            img.id === d.id ? { ...img, ...d, updatedAt: d.updatedAt ?? img.updatedAt } : img
          );
        });
        // The event references an image we don't have yet (created elsewhere,
        // or a family member we never fetched) — reconcile with a full refetch.
        if (!known) fetchImages();
      });
    } catch (err) {
      debug.warn('WebSocket subscription for golden_images failed', err);
    }

    return () => {
      unsubProgress?.();
      unsubUpdate?.();
    };
  }, [fetchImages]);

  const families = useMemo(() => groupIntoFamilies(images), [images]);

  // resultKey is the mutation's top-level field. The publish/deprecate/retry
  // mutations return a { success, error } envelope (HTTP 200 even on failure),
  // so we must inspect it rather than relying on a thrown error.
  const onAction = useCallback(
    async (mutation, id, successMsg, resultKey) => {
      const key = `${resultKey}:${id}`;
      if (inFlightRef.current.has(key)) return;
      inFlightRef.current.add(key);
      try {
        const { data } = await client.mutate({ mutation, variables: { id } });
        const payload = data?.[resultKey];
        if (!payload?.success) {
          throw new Error(payload?.error || 'Operation failed');
        }
        toast.success(successMsg);
        fetchImages();
      } catch (err) {
        toast.error(err.message || 'Operation failed');
      } finally {
        inFlightRef.current.delete(key);
      }
    },
    [fetchImages]
  );

  // Delete returns a bare Boolean, so its success check differs from the
  // envelope mutations above. The confirm dialog stays open on failure.
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data } = await client.mutate({
        mutation: DELETE,
        variables: { id: deleteTarget.id },
      });
      if (data?.deleteGoldenImage !== true) {
        throw new Error('Delete failed');
      }
      toast.success(`Deleted ${deleteTarget.name} v${deleteTarget.version}`);
      setDeleteTarget(null);
      fetchImages();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, fetchImages]);

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Golden Images"
          count={`${images.length} image${images.length !== 1 ? 's' : ''}`}
          secondary={
            <IconButton
              size="sm"
              variant="ghost"
              label="Refresh"
              icon={<RefreshCcw size={14} />}
              onClick={fetchImages}
              disabled={loading}
            />
          }
          primary={
            <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setDialogOpen(true)}
            >
              New Golden Image
            </Button>
          }
        />

        {loading && images.length === 0 ? (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading golden images">
            {[0, 1].map((f) => (
              <section key={f} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[color:var(--harbor-border-subtle)]">
                  <Skeleton height={20} width={180} />
                  <Skeleton height={14} width={120} />
                </div>
                <div className="flex flex-col gap-2">
                  {[0, 1].map((r) => (
                    <div key={r} className="flex items-center gap-3 py-2 px-2">
                      <Skeleton height={16} width={32} />
                      <Skeleton height={20} width={72} />
                      <div className="flex-1">
                        <Skeleton height={14} />
                      </div>
                      <Skeleton height={14} width={60} />
                      <Skeleton height={14} width={64} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : error && images.length === 0 ? (
          <ErrorState
            title="Couldn’t load golden images"
            description={error}
            onRetry={fetchImages}
          />
        ) : images.length === 0 ? (
          <EmptyState
            title="No golden images yet"
            description="Seal a base disk to bootstrap thin-clone desktops."
            actions={
              <Button variant="primary" icon={<Plus size={14} />} onClick={() => setDialogOpen(true)}>
                New Golden Image
              </Button>
            }
          />
        ) : (
          <RowContextMenu
            rows={images}
            buildItems={(img) => buildRowItems(img, { onAction, onRequestDelete: setDeleteTarget })}
            labelFor={(img) => `${img.name} · v${img.version}`}
          >
            <div className="flex flex-col gap-4">
            {families.map(({ root, versions }) => (
              <section key={root.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-[color:var(--harbor-border-subtle)]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold m-0">{root.name}</h2>
                    <span className="text-fg-muted text-xs">
                      · {root.osType}
                      {root.osVersion ? ` ${root.osVersion}` : ''} · {versions.length}{' '}
                      version{versions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col divide-y divide-[color:var(--harbor-border-subtle)]">
                  {versions
                    .slice()
                    .reverse()
                    .map((v) => (
                      <GoldenImageRow
                        key={v.id}
                        image={v}
                        progress={progressRef.current[v.id]}
                        onPublish={() =>
                          onAction(PUBLISH, v.id, `Published ${v.name} v${v.version}`, 'publishGoldenImage')
                        }
                        onDeprecate={() =>
                          onAction(DEPRECATE, v.id, `Deprecated ${v.name} v${v.version}`, 'deprecateGoldenImage')
                        }
                        onRetry={() =>
                          onAction(RETRY_BUILD, v.id, `Retrying build for ${v.name} v${v.version}`, 'retryBuildGoldenImage')
                        }
                        onDelete={() => setDeleteTarget(v)}
                      />
                    ))}
                </div>
              </section>
            ))}
            </div>
          </RowContextMenu>
        )}
      </ResponsiveStack>

      {dialogOpen && (
        <NewGoldenImageDialog
          prefillMachineId={prefillMachineId}
          onClose={() => {
            setDialogOpen(false);
            setPrefillMachineId(null);
          }}
          onCreated={() => {
            setDialogOpen(false);
            setPrefillMachineId(null);
            fetchImages();
          }}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} size="sm">
        <DialogTitle>
          {deleteTarget ? `Delete ${deleteTarget.name} v${deleteTarget.version}?` : 'Delete golden image'}
        </DialogTitle>
        <DialogDescription>
          This permanently removes the sealed qcow2. Existing clones are unaffected, but you
          won’t be able to create new desktops from this version.
        </DialogDescription>
        <DialogButtons>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete} loading={deleting}>
            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

// Shared between the kebab Menu and the right-click RowContextMenu so both
// surfaces offer exactly the same actions for a given image.
function buildRowItems(image, { onAction, onRequestDelete }) {
  const items = [];
  if (image.status === 'draft') {
    items.push({
      label: 'Publish',
      icon: <CheckCircle2 size={14} />,
      onSelect: () => onAction(PUBLISH, image.id, `Published ${image.name} v${image.version}`, 'publishGoldenImage'),
    });
  }
  if (image.status === 'published') {
    items.push({
      label: 'Deprecate',
      icon: <CircleSlash size={14} />,
      onSelect: () => onAction(DEPRECATE, image.id, `Deprecated ${image.name} v${image.version}`, 'deprecateGoldenImage'),
    });
  }
  if (image.status === 'failed') {
    items.push({
      label: 'Retry build',
      icon: <RefreshCcw size={14} />,
      onSelect: () => onAction(RETRY_BUILD, image.id, `Retrying build for ${image.name} v${image.version}`, 'retryBuildGoldenImage'),
    });
  }
  items.push({
    label: 'Delete',
    icon: <Trash2 size={14} />,
    danger: true,
    onSelect: () => onRequestDelete(image),
  });
  return items;
}

function GoldenImageRow({ image, progress, onPublish, onDeprecate, onRetry, onDelete }) {
  const tone = STATUS_TONE[image.status] || 'neutral';
  const isBuilding = image.status === 'building';
  // `progress` is only present once a live 'progress' socket event has arrived.
  // Until then (e.g. right after a page load mid-build) we render an
  // indeterminate bar instead of a misleading "· 0%".
  const hasProgress = !!progress;
  const pct = progress?.progressPercent ?? 0;
  const step = progress?.step ?? '';
  const stepLabel = STEP_LABELS[step] || step;

  return (
    <div role="row" data-row-id={image.id} className="flex items-center gap-3 py-2 px-2">
      <span className="font-mono text-sm w-12 shrink-0">v{image.version}</span>
      <Badge tone={tone}>
        {image.status}
      </Badge>
      {isBuilding && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-1 min-w-[80px] max-w-[160px]">
            <Progress
              value={pct}
              tone="purple"
              indeterminate={!hasProgress}
              showValue={false}
            />
          </div>
          <span className="text-xs text-fg-muted whitespace-nowrap">
            {hasProgress ? `${stepLabel ? `${stepLabel} · ` : ''}${pct}%` : 'Building…'}
          </span>
        </div>
      )}
      {!isBuilding && (
        <span className="text-sm text-fg-muted flex-1 truncate" title={image.notes || ''}>
          {image.notes || <em className="text-fg-subtle">no notes</em>}
        </span>
      )}
      <span className="font-mono text-xs text-fg-subtle">{formatSize(image.sizeBytes)}</span>
      <span className="text-xs text-fg-muted w-20 text-right">{timeAgo(image.createdAt)}</span>
      <Menu
        trigger={
          <IconButton size="sm" variant="ghost" label="Actions" icon={<MoreHorizontal size={14} />} />
        }
      >
        {image.status === 'draft' && (
          <MenuItem icon={<CheckCircle2 size={14} />} onClick={onPublish}>
            Publish
          </MenuItem>
        )}
        {image.status === 'published' && (
          <MenuItem icon={<CircleSlash size={14} />} onClick={onDeprecate}>
            Deprecate
          </MenuItem>
        )}
        {image.status === 'failed' && (
          <MenuItem icon={<RefreshCcw size={14} />} onClick={onRetry}>
            Retry build
          </MenuItem>
        )}
        <MenuItem
          icon={<Trash2 size={14} />}
          danger
          onClick={onDelete}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

// ---------------------------------------------------------------------------
// New Golden Image dialog
// ---------------------------------------------------------------------------

function NewGoldenImageDialog({ onClose, onCreated, prefillMachineId }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(prefillMachineId ? 'desktop' : 'blueprint');
  const templates = useSelector((s) => s.templates?.items ?? []);
  const templatesLoading = useSelector((s) => s.templates?.loading?.fetch ?? false);
  const vms = useSelector((s) => s.vms?.items ?? []);
  const vmsLoading = useSelector((s) => s.vms?.loading?.fetch ?? false);

  // Neither blueprints nor desktops are part of this page's own data tier, so
  // fetch both when the dialog mounts — otherwise the "From Blueprint" and
  // "From existing Desktop" Selects are empty on a fresh session (and a
  // ?capture=<vmId> prefill can't resolve to an option) with no indication why.
  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchVms());
  }, [dispatch]);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [machineId, setMachineId] = useState(prefillMachineId ?? '');
  const [sanitizeUserData, setSanitizeUserData] = useState(true);
  const [destroySource, setDestroySource] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // VMs eligible to be captured as a Golden Image must have completed install
  // (setupComplete=true) and not be in error state. Their power state can be
  // anything except error — capture handles snapshotting/stopping itself.
  const eligibleVms = vms.filter((v) => v.setupComplete && v.status !== 'error');

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'blueprint') {
        if (!templateId) {
          toast.error('Pick a blueprint');
          return;
        }
        const { data } = await client.mutate({
          mutation: CREATE_FROM_TEMPLATE,
          variables: { input: { templateId, name: name.trim(), notes: notes.trim() || undefined } },
        });
        const res = data?.createGoldenImageFromTemplate;
        if (!res?.success) throw new Error(res?.error || 'create failed');
        toast.success('Build started — this will take a while');
      } else {
        if (!machineId) {
          toast.error('Pick a desktop');
          return;
        }
        const { data } = await client.mutate({
          mutation: CAPTURE_FROM_MACHINE,
          variables: {
            input: {
              machineId,
              name: name.trim(),
              notes: notes.trim() || undefined,
              sanitizeUserData,
              destroySource,
            },
          },
        });
        const res = data?.captureGoldenImageFromMachine;
        if (!res?.success) throw new Error(res?.error || 'capture failed');
        toast.success('Capture started — desktop will power-cycle while sealing');
      }
      onCreated();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }, [mode, templateId, machineId, name, notes, sanitizeUserData, destroySource, onCreated]);

  return (
    <Dialog open onClose={onClose} size="lg">
      <DialogTitle>New Golden Image</DialogTitle>
      <DialogBody>
      <div className="flex flex-col gap-4 w-full">
        <ToggleGroup
          className="self-start"
          value={mode}
          onChange={(v) => setMode(Array.isArray(v) ? v[0] : v)}
          items={[
            { value: 'blueprint', label: 'From Blueprint' },
            { value: 'desktop', label: 'From existing Desktop' },
          ]}
        />

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Win11 Office · v1"
          required
        />

        {mode === 'blueprint' ? (
          <div className="flex flex-col gap-1">
            <Select
              label="Blueprint"
              value={templateId}
              onChange={setTemplateId}
              disabled={templatesLoading}
              options={[
                {
                  value: '',
                  label: templatesLoading ? 'Loading blueprints…' : '— pick a blueprint —',
                },
                ...templates.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
            {!templatesLoading && templates.length === 0 && (
              <p className="text-xs text-fg-muted m-0">
                No blueprints yet.{' '}
                <Link
                  href="/blueprints/new"
                  className="underline text-[rgb(var(--harbor-accent))]"
                >
                  Create one
                </Link>{' '}
                to build a golden image from a blueprint.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <Select
                label="Source desktop"
                value={machineId}
                onChange={setMachineId}
                disabled={vmsLoading}
                options={[
                  {
                    value: '',
                    label: vmsLoading ? 'Loading desktops…' : '— pick a desktop —',
                  },
                  ...eligibleVms.map((v) => {
                    // `os` isn't a top-level field on the machines query; it lives
                    // in the JSON `configuration`. Guard so the label never reads
                    // "name · undefined".
                    const os = v.configuration?.os || v.os;
                    return { value: v.id, label: os ? `${v.name} · ${os}` : v.name };
                  }),
                ]}
              />
              {!vmsLoading && eligibleVms.length === 0 && (
                <p className="text-xs text-fg-muted m-0">
                  No eligible desktops. A desktop must have finished installing and
                  not be in an error state before it can be sealed into a golden image.
                </p>
              )}
            </div>
            <Checkbox
              label="Sanitize user data"
              description="Remove home directories / profiles from the sealed image."
              checked={sanitizeUserData}
              onChange={(e) => setSanitizeUserData(e.target.checked)}
            />
            <Checkbox
              label="Destroy source desktop after sealing"
              description="Faster but irreversible — the source desktop will no longer be usable."
              checked={destroySource}
              onChange={(e) => setDestroySource(e.target.checked)}
            />
          </>
        )}

        <Textarea
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What changed in this version?"
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Start build
          </Button>
        </div>
      </div>
      </DialogBody>
    </Dialog>
  );
}
