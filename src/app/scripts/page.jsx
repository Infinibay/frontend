'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileCode,
  Search,
  Plus,
  Trash2,
  Pencil,
  Copy,
  Lock,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  Page,
  Button,
  IconButton,
  Alert,
  EmptyState,
  Spinner,
  TextField,
  SegmentedControl,
  Select,
  ResponsiveStack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  MenuItem,
  Z,
} from '@infinibay/harbor';
import { PageHeader } from '@/components/common/PageHeader';
import { OsBadge } from '@/components/common/OsBadge';

import { useScriptsQuery, useDeleteScriptMutation } from '@/gql/hooks';
import { usePageHeader } from '@/hooks/usePageHeader';

const OS_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'security', label: 'Security' },
  { value: 'configuration', label: 'Configuration' },
  { value: 'monitoring', label: 'Monitoring' },
];

/** Dense single-line row for a script. Same density model as /blueprints. */
function ScriptRow({ script, onOpen, onDelete, onDuplicate }) {
  const isSystem = !!script.isSystem;
  const [ctx, setCtx] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!ctx) return;
    const down = (e) => {
      if (!menuRef.current?.contains(e.target)) setCtx(null);
    };
    const key = (e) => {
      if (e.key === 'Escape') setCtx(null);
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [ctx]);

  const focusMenuItem = (dir) => {
    const items = menuRef.current?.querySelectorAll(
      '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'
    );
    if (!items || items.length === 0) return;
    const arr = Array.from(items);
    const idx = arr.indexOf(document.activeElement);
    let next;
    if (dir === 'first') next = 0;
    else if (dir === 'last') next = arr.length - 1;
    else if (dir === 'down') next = idx < 0 ? 0 : (idx + 1) % arr.length;
    else next = idx <= 0 ? arr.length - 1 : idx - 1;
    arr[next]?.focus();
  };

  // Move focus into the menu when it opens so keyboard users can operate it
  // (the hand-rolled portal is otherwise unreachable once open).
  useEffect(() => {
    if (!ctx) return;
    const id = requestAnimationFrame(() => focusMenuItem('first'));
    return () => cancelAnimationFrame(id);
  }, [ctx]);

  const handleMenuKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusMenuItem('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusMenuItem('up');
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusMenuItem('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusMenuItem('last');
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const W = 200;
    const H = 100;
    let x = e.clientX;
    let y = e.clientY;
    if (x + W > window.innerWidth - 8) x = window.innerWidth - W - 8;
    if (y + H > window.innerHeight - 8) y = window.innerHeight - H - 8;
    setCtx({ x, y });
  };

  const oses = script.os || [];
  const tags = script.tags || [];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(script.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(script.id);
        }
      }}
      onContextMenu={handleContextMenu}
      className="group flex items-center gap-3 py-2 px-2 rounded-md hover:bg-[var(--harbor-state-hover)] transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      <div className={`shrink-0 h-6 w-6 rounded-md flex items-center justify-center ${
        isSystem ? 'bg-warning/10 text-warning' : 'bg-white/5 text-fg-muted'
      }`}>
        {isSystem ? <Lock size={12} /> : <FileCode size={14} />}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{script.name}</span>
          {isSystem ? (
            <span className="text-[10px] uppercase tracking-wide font-medium text-warning bg-warning/10 border border-warning/30 px-1.5 py-0.5 rounded shrink-0">
              System
            </span>
          ) : null}
          {script.category ? (
            <span className="text-fg-muted text-xs shrink-0">
              · {script.category.toLowerCase()}
            </span>
          ) : null}
        </div>
        {script.description ? (
          <span className="text-fg-muted text-xs truncate">
            {script.description}
          </span>
        ) : null}
      </div>

      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {oses.map((o) => (
          <OsBadge key={o} os={o} />
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-1 shrink-0 max-w-[220px] overflow-hidden">
        {tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-xs text-fg-muted bg-white/5 px-1.5 py-0.5 rounded truncate"
          >
            {t}
          </span>
        ))}
        {tags.length > 3 ? (
          <span className="text-xs text-fg-muted">+{tags.length - 3}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        {isSystem ? (
          <Tooltip content="Duplicate to edit">
            <span>
              <IconButton
                size="sm"
                variant="ghost"
                label="Duplicate script"
                icon={<Copy size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(script);
                }}
              />
            </span>
          </Tooltip>
        ) : (
          <>
            <IconButton
              size="sm"
              variant="ghost"
              label="Edit script"
              icon={<Pencil size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(script.id);
              }}
            />
            <IconButton
              size="sm"
              variant="ghost"
              label="Delete script"
              icon={<Trash2 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(script);
              }}
            />
          </>
        )}
      </div>

      {ctx && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={`Actions for ${script.name}`}
              onKeyDown={handleMenuKeyDown}
              style={{ position: 'fixed', left: ctx.x, top: ctx.y, zIndex: Z.CONTEXT_MENU, minWidth: 180 }}
              className="rounded-md bg-surface-2 border border-[var(--harbor-overlay-border)] shadow-harbor-lg p-1"
            >
              <MenuItem
                icon={<Pencil size={14} />}
                onClick={() => {
                  setCtx(null);
                  onOpen(script.id);
                }}
              >
                Open
              </MenuItem>
              <MenuItem
                icon={<Copy size={14} />}
                onClick={() => {
                  setCtx(null);
                  onDuplicate(script);
                }}
              >
                Duplicate
              </MenuItem>
              {isSystem ? null : (
                <MenuItem
                  icon={<Trash2 size={14} />}
                  danger
                  onClick={() => {
                    setCtx(null);
                    onDelete(script);
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default function ScriptsPage() {
  const router = useRouter();

  const { data, loading, error, refetch } = useScriptsQuery();
  const [deleteScript, { loading: deleting }] = useDeleteScriptMutation();

  const [search, setSearch] = useState('');
  const [osFilter, setOsFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  // Second confirmation state: the script has active schedules and the server
  // rejected the plain delete; the user must explicitly opt into force-delete.
  const [needsForce, setNeedsForce] = useState(false);

  const scripts = useMemo(() => data?.scripts || [], [data?.scripts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scripts.filter((s) => {
      if (q) {
        const hay =
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q));
        if (!hay) return false;
      }
      if (osFilter !== 'all') {
        const oses = (s.os || []).map((o) => String(o).toLowerCase());
        if (!oses.includes(osFilter)) return false;
      }
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      return true;
    });
  }, [scripts, search, osFilter, categoryFilter]);

  const stats = useMemo(() => {
    const hasOs = (s, os) =>
      (s.os || []).some((o) => String(o).toLowerCase() === os);
    return {
      total: scripts.length,
      windows: scripts.filter((s) => hasOs(s, 'windows')).length,
      linux: scripts.filter((s) => hasOs(s, 'linux')).length,
    };
  }, [scripts]);

  const helpConfig = useMemo(
    () => ({
      title: 'Scripts library',
      description: 'Automation scripts that can run on any desktop or be scheduled.',
      icon: <FileCode size={16} />,
      sections: [
        {
          id: 'create',
          title: 'Creating scripts',
          icon: <FileCode size={14} />,
          content: (
            <p>
              Click <strong>New Script</strong> to open the editor where you define
              metadata, inputs and the script body. Content is validated before saving.
            </p>
          ),
        },
        {
          id: 'filter',
          title: 'Filtering',
          icon: <Search size={14} />,
          content: (
            <p>
              Search by name / description / tags. The chip filters narrow by OS and
              category. Everything updates live as you type.
            </p>
          ),
        },
      ],
      quickTips: [
        'Click any row to open the editor',
        'Schedules cancel automatically when a script is deleted',
        'Tags help group related scripts across categories',
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Scripts', isCurrent: true },
      ],
      // Title intentionally omitted: the in-page PageHeader owns the <h1>
      // (with the count/filters row). Keeping it here too would render a
      // duplicate <h1> "Scripts" in the GlobalHeader.
      actions: [],
      helpConfig,
      helpTooltip: 'Scripts help',
    },
    []
  );

  const handleDuplicate = (script) => {
    // Open the new-script editor pre-filled from the source script.
    // The /scripts/new page reads `?from=<id>` to seed the form.
    router.push(`/scripts/new?from=${script.id}`);
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
    setNeedsForce(false);
  };

  // The server rejects a plain delete when the script still has active
  // schedules. Detect that so we can surface an explicit force-confirmation in
  // the same dialog instead of a native window.confirm — whether the failure
  // arrives as a thrown error or as a { success:false } envelope.
  const isScheduleConflict = (message) => /schedule/i.test(message || '');

  const handleDelete = async (force = false) => {
    if (!deleteTarget) return;
    try {
      const res = await deleteScript({ variables: { id: deleteTarget.id, force } });
      // deleteScript resolves HTTP 200 with a { success, message, error }
      // envelope and does NOT throw on a business-rule rejection; inspect it so
      // we never report a false success or skip the force-confirmation flow.
      const payload = res?.data?.deleteScript;
      if (!payload?.success) {
        const message = payload?.error || payload?.message || 'Delete failed';
        if (!force && isScheduleConflict(message)) {
          setNeedsForce(true);
          return;
        }
        toast.error(`Could not delete: ${message}`);
        return; // keep the dialog open on failure
      }
      toast.success(
        force
          ? `Deleted "${deleteTarget.name}" and cancelled its schedules`
          : `Deleted "${deleteTarget.name}"`
      );
      closeDeleteDialog();
      await refetch();
    } catch (err) {
      const message = err?.message || 'Delete failed';
      if (!force && isScheduleConflict(message)) {
        setNeedsForce(true);
        return;
      }
      toast.error(`Could not delete: ${message}`);
    }
  };

  const countText = stats.total === 0
    ? null
    : [
        `${stats.total} script${stats.total !== 1 ? 's' : ''}`,
        stats.windows > 0 ? `${stats.windows} Windows` : null,
        stats.linux > 0 ? `${stats.linux} Linux` : null,
      ].filter(Boolean).join(' · ');

  return (
    <Page size="xl" gap="lg">
      <PageHeader
        title="Scripts"
        count={countText}
        secondary={
          <IconButton
            size="sm"
            variant="ghost"
            label="Refresh"
            icon={<RefreshCw size={14} className={loading ? 'animate-spin' : undefined} />}
            onClick={() => refetch()}
            disabled={loading}
          />
        }
        primary={
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => router.push('/scripts/new')}
          >
            New Script
          </Button>
        }
        filters={
          <>
            <TextField
              icon={<Search size={14} />}
              placeholder="Search name, description, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter scripts"
            />
            <SegmentedControl
              items={OS_FILTER_OPTIONS}
              value={osFilter}
              onChange={setOsFilter}
              size="sm"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORY_FILTER_OPTIONS}
            />
          </>
        }
      />

      {error ? (
        <Alert
          tone="danger"
          title="Couldn't load scripts"
          actions={
            <Button size="sm" icon={<RefreshCw size={14} />} onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      ) : null}

      {/* Initial load only. Background refetches (Refresh / post-delete) keep the
          cached list mounted and surface progress via the header spin icon. */}
      {loading && scripts.length === 0 && !error ? (
        <ResponsiveStack direction="row" gap={2} align="center" justify="center">
          <Spinner />
          <span>Loading scripts…</span>
        </ResponsiveStack>
      ) : null}

      {/* Empty state must never appear on error or during a refetch that still
          has cached data — only when we truly have zero results. */}
      {!error && !(loading && scripts.length === 0) && filtered.length === 0 ? (
        <EmptyState
          icon={<FileCode size={18} />}
          title={scripts.length ? 'No matches' : 'No scripts yet'}
          description={
            scripts.length
              ? 'No scripts match the current search or filters.'
              : 'Create your first automation script to see it here.'
          }
          actions={
            scripts.length === 0 ? (
              <Button
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => router.push('/scripts/new')}
              >
                New Script
              </Button>
            ) : null
          }
        />
      ) : null}

      {filtered.length > 0 ? (
        <div className="flex flex-col divide-y divide-[var(--harbor-border-subtle)]">
          {filtered.map((s) => (
            <ScriptRow
              key={s.id}
              script={s}
              onOpen={(id) => router.push(`/scripts/${id}`)}
              onDelete={(script) => {
                setDeleteTarget(script);
                setNeedsForce(false);
              }}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : null}

      <Dialog
        open={!!deleteTarget}
        onClose={closeDeleteDialog}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>{needsForce ? 'Script has active schedules' : 'Delete script'}</span>
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {deleteTarget
            ? needsForce
              ? `"${deleteTarget.name}" still has active schedules. Delete it anyway and cancel them?`
              : `Remove "${deleteTarget.name}"? Any active schedules will be cancelled.`
            : ''}
        </DialogDescription>
        <DialogBody>
          {needsForce ? (
            <Alert tone="warning" title="This will cancel running schedules">
              Any schedules attached to this script will be cancelled and cannot be
              recovered. Execution history is kept.
            </Alert>
          ) : (
            <p>
              Existing execution history is kept. The script body and its schedules are
              removed for good.
            </p>
          )}
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="secondary" onClick={closeDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(needsForce)}
            loading={deleting}
            disabled={deleting}
          >
            {needsForce ? 'Delete anyway' : 'Delete'}
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>
  );
}
