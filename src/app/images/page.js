'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { getSocketService } from '@/services/socketService';
import {
  Page,
  Badge,
  Button,
  EmptyState,
  IconButton,
  Menu,
  ResponsiveStack,
  Dialog,
  TextField,
  Select,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefillMachineId, setPrefillMachineId] = useState(null);
  const progressRef = useRef({});

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
      setImages(data?.goldenImages ?? []);
    } catch (err) {
      debug.error('fetch', err);
      toast.error(`Failed to load golden images: ${err.message}`);
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
        setImages((prev) =>
          prev.map((img) =>
            img.id === d.id ? { ...img, ...d, updatedAt: d.updatedAt ?? img.updatedAt } : img
          )
        );
      });
    } catch (err) {
      debug.warn('WebSocket subscription for golden_images failed', err);
    }

    return () => {
      unsubProgress?.();
      unsubUpdate?.();
    };
  }, []);

  const families = useMemo(() => groupIntoFamilies(images), [images]);

  const onAction = useCallback(
    async (mutation, id, successMsg) => {
      try {
        await client.mutate({ mutation, variables: { id } });
        toast.success(successMsg);
        fetchImages();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [fetchImages]
  );

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
              aria-label="Refresh"
              onClick={fetchImages}
              disabled={loading}
            >
              <RefreshCcw size={14} />
            </IconButton>
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
          <div className="text-fg-muted text-sm">Loading…</div>
        ) : images.length === 0 ? (
          <EmptyState
            title="No golden images yet"
            description="Seal a base disk to bootstrap thin-clone desktops."
            action={
              <Button variant="primary" icon={<Plus size={14} />} onClick={() => setDialogOpen(true)}>
                New Golden Image
              </Button>
            }
          />
        ) : (
          families.map(({ root, versions }) => (
            <section key={root.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold m-0">{root.name}</h2>
                  <span className="text-fg-muted text-xs">
                    · {root.osType}
                    {root.osVersion ? ` ${root.osVersion}` : ''} · {versions.length}{' '}
                    version{versions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-white/5">
                {versions
                  .slice()
                  .reverse()
                  .map((v) => (
                      <GoldenImageRow
                      key={v.id}
                      image={v}
                      progress={progressRef.current[v.id]}
                      onPublish={() => onAction(PUBLISH, v.id, `Published ${v.name} v${v.version}`)}
                      onDeprecate={() =>
                        onAction(DEPRECATE, v.id, `Deprecated ${v.name} v${v.version}`)
                      }
                      onRetry={() => onAction(RETRY_BUILD, v.id, `Retrying build for ${v.name} v${v.version}`)}
                      onDelete={() => onAction(DELETE, v.id, `Deleted ${v.name} v${v.version}`)}
                    />
                  ))}
              </div>
            </section>
          ))
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
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

function GoldenImageRow({ image, progress, onPublish, onDeprecate, onRetry, onDelete }) {
  const tone = STATUS_TONE[image.status] || 'neutral';
  const isBuilding = image.status === 'building';
  const pct = progress?.progressPercent ?? 0;
  const step = progress?.step ?? '';

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

  return (
    <div className="flex items-center gap-3 py-2 px-2">
      <span className="font-mono text-sm w-12 shrink-0">v{image.version}</span>
      <Badge tone={tone} size="sm">
        {image.status}
      </Badge>
      {isBuilding && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[80px] max-w-[160px]">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className="text-xs text-fg-muted whitespace-nowrap">
            {STEP_LABELS[step] || step} · {pct}%
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
          <IconButton size="sm" variant="ghost" aria-label="Actions">
            <MoreHorizontal size={14} />
          </IconButton>
        }
        items={[
          image.status === 'draft' && {
            id: 'publish',
            label: 'Publish',
            icon: <CheckCircle2 size={14} />,
            onSelect: onPublish,
          },
          image.status === 'published' && {
            id: 'deprecate',
            label: 'Deprecate',
            icon: <CircleSlash size={14} />,
            onSelect: onDeprecate,
          },
          image.status === 'failed' && {
            id: 'retry',
            label: 'Retry build',
            icon: <RefreshCcw size={14} />,
            onSelect: onRetry,
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 size={14} />,
            tone: 'danger',
            onSelect: () => {
              if (confirm(`Delete ${image.name} v${image.version}? This removes the sealed qcow2.`)) {
                onDelete();
              }
            },
          },
        ].filter(Boolean)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// New Golden Image dialog
// ---------------------------------------------------------------------------

function NewGoldenImageDialog({ onClose, onCreated, prefillMachineId }) {
  const [mode, setMode] = useState(prefillMachineId ? 'desktop' : 'blueprint');
  const templates = useSelector((s) => s.templates?.items ?? []);
  const vms = useSelector((s) => s.vms?.items ?? []);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [machineId, setMachineId] = useState(prefillMachineId ?? '');
  const [sanitizeUserData, setSanitizeUserData] = useState(true);
  const [destroySource, setDestroySource] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const eligibleVms = vms.filter((v) => v.status !== 'building' && v.status !== 'error');

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
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [mode, templateId, machineId, name, notes, sanitizeUserData, destroySource, onCreated]);

  return (
    <Dialog open onClose={onClose} title="New Golden Image">
      <div className="flex flex-col gap-4 min-w-[480px]">
        <div className="flex gap-1 p-1 bg-white/5 rounded-md self-start">
          <button
            className={`px-3 py-1 text-sm rounded ${mode === 'blueprint' ? 'bg-white/10' : 'text-fg-muted'}`}
            onClick={() => setMode('blueprint')}
            type="button"
          >
            From Blueprint
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${mode === 'desktop' ? 'bg-white/10' : 'text-fg-muted'}`}
            onClick={() => setMode('desktop')}
            type="button"
          >
            From existing Desktop
          </button>
        </div>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Win11 Office · v1"
          required
        />

        {mode === 'blueprint' ? (
          <Select
            label="Blueprint"
            value={templateId}
            onChange={setTemplateId}
            options={[
              { value: '', label: '— pick a blueprint —' },
              ...templates.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        ) : (
          <>
            <Select
              label="Source desktop"
              value={machineId}
              onChange={setMachineId}
              options={[
                { value: '', label: '— pick a desktop —' },
                ...eligibleVms.map((v) => ({ value: v.id, label: `${v.name} · ${v.os}` })),
              ]}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sanitizeUserData}
                onChange={(e) => setSanitizeUserData(e.target.checked)}
              />
              Sanitize user data (remove home directories / profiles)
            </label>
            <label className="flex items-start gap-2 text-sm text-warn-fg">
              <input
                type="checkbox"
                checked={destroySource}
                onChange={(e) => setDestroySource(e.target.checked)}
              />
              <span>
                Destroy source desktop after sealing
                <span className="block text-xs text-fg-muted">
                  Faster but irreversible — the source desktop will no longer be usable.
                </span>
              </span>
            </label>
          </>
        )}

        <TextField
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What changed in this version?"
          multiline
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
    </Dialog>
  );
}
