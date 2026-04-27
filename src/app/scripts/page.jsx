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
  Calendar,
} from 'lucide-react';
import {
  Page,
  Button,
  IconButton,
  Alert,
  EmptyState,
  Spinner,
  SearchField,
  SegmentedControl,
  Select,
  ResponsiveStack,
  Tooltip,
  Dialog,
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
  const scheduleCount = script.scheduleCount || 0;

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
      className="group flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      <div className={`shrink-0 h-6 w-6 rounded-md flex items-center justify-center ${
        isSystem ? 'bg-amber-500/10 text-amber-200' : 'bg-white/5 text-fg-muted'
      }`}>
        {isSystem ? <Lock size={12} /> : <FileCode size={14} />}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{script.name}</span>
          {isSystem ? (
            <span className="text-[10px] uppercase tracking-wide font-medium text-amber-200/90 bg-amber-500/10 border border-amber-400/20 px-1.5 py-0.5 rounded shrink-0">
              System
            </span>
          ) : null}
          {script.category ? (
            <span className="text-fg-muted text-xs shrink-0">
              · {script.category.toLowerCase()}
            </span>
          ) : null}
          {scheduleCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs text-fg-muted shrink-0">
              <Calendar size={11} />
              {scheduleCount}
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
          <span className="text-xs text-fg-subtle">+{tags.length - 3}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
              style={{ position: 'fixed', left: ctx.x, top: ctx.y, zIndex: 9999, minWidth: 180 }}
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
            >
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded-md hover:bg-white/5"
                onClick={() => {
                  setCtx(null);
                  onOpen(script.id);
                }}
              >
                <Pencil size={14} /> Open
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded-md hover:bg-white/5"
                onClick={() => {
                  setCtx(null);
                  onDuplicate(script);
                }}
              >
                <Copy size={14} /> Duplicate
              </button>
              {isSystem ? null : (
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded-md text-danger-fg hover:bg-danger-fg/10"
                  onClick={() => {
                    setCtx(null);
                    onDelete(script);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
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

  const scripts = data?.scripts || [];

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
      scheduled: scripts.filter((s) => (s.scheduleCount || 0) > 0).length,
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
      title: 'Scripts',
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteScript({ variables: { id: deleteTarget.id, force: false } });
      toast.success(`Deleted "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await refetch();
    } catch (err) {
      if (/schedule/i.test(err.message || '')) {
        const confirmForce = window.confirm(
          `"${deleteTarget.name}" has active schedules. Delete anyway and cancel them?`
        );
        if (confirmForce) {
          try {
            await deleteScript({
              variables: { id: deleteTarget.id, force: true },
            });
            toast.success('Script deleted and schedules cancelled');
            setDeleteTarget(null);
            await refetch();
          } catch (e2) {
            toast.error(`Could not delete: ${e2.message}`);
          }
          return;
        }
      }
      toast.error(`Could not delete: ${err.message}`);
    }
  };

  const countText = stats.total === 0
    ? null
    : [
        `${stats.total} script${stats.total !== 1 ? 's' : ''}`,
        stats.windows > 0 ? `${stats.windows} Windows` : null,
        stats.linux > 0 ? `${stats.linux} Linux` : null,
        stats.scheduled > 0 ? `${stats.scheduled} scheduled` : null,
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
            icon={<RefreshCw size={14} />}
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
            <SearchField
              placeholder="Search name, description, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

      {loading && scripts.length === 0 ? (
        <ResponsiveStack direction="row" gap={2} align="center" justify="center">
          <Spinner />
          <span>Loading scripts…</span>
        </ResponsiveStack>
      ) : null}

      {!loading && filtered.length === 0 ? (
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

      {!loading && filtered.length > 0 ? (
        <div className="flex flex-col divide-y divide-white/5">
          {filtered.map((s) => (
            <ScriptRow
              key={s.id}
              script={s}
              onOpen={(id) => router.push(`/scripts/${id}`)}
              onDelete={setDeleteTarget}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : null}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>Delete script</span>
          </ResponsiveStack>
        }
        description={
          deleteTarget
            ? `Remove "${deleteTarget.name}"? Any active schedules will be cancelled.`
            : ''
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              Delete
            </Button>
          </ResponsiveStack>
        }
      >
        <p>
          Existing execution history is kept. The script body and its schedules are
          removed for good.
        </p>
      </Dialog>
    </Page>
  );
}
