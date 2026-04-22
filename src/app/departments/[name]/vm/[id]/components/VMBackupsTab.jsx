import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  EmptyState,
  LoadingOverlay,
  NumberField,
  Page,
  Progress,
  ResponsiveStack,
  Switch,
  Textarea,
  TextField,
  Tooltip,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  Check,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  Layers,
  Moon,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Repeat,
  RotateCcw,
  Shield,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  useBackupsQuery,
  useBackupSchedulesQuery,
  useCreateBackupMutation,
  useRestoreBackupMutation,
  useDeleteBackupMutation,
  useCreateBackupScheduleMutation,
  useUpdateBackupScheduleMutation,
  useDeleteBackupScheduleMutation,
} from '@/gql/hooks';

// User-facing presets that bundle backup type + compression into a single
// intent-based choice. Power-users can still pick raw values via a future
// "advanced" toggle if needed.
const MANUAL_PRESETS = [
  {
    id: 'snapshot',
    icon: Zap,
    accent: 'sky',
    title: 'Quick snapshot',
    subtitle: 'Instant checkpoint, takes seconds',
    type: 'SNAPSHOT',
    compression: 'NONE',
    pros: [
      'Ready in seconds',
      'Barely uses space',
    ],
    cons: [
      'Lives on the same disk — useless if the disk dies',
      'Best for short-term rollback only',
    ],
  },
  {
    id: 'full',
    icon: HardDrive,
    accent: 'purple',
    title: 'Full backup',
    subtitle: 'Complete independent copy',
    recommended: true,
    type: 'FULL',
    compression: 'QCOW2',
    pros: [
      'Standalone — restore anywhere',
      'Balanced size and speed',
    ],
    cons: [
      'Takes a few minutes per disk',
    ],
  },
  {
    id: 'archive',
    icon: Archive,
    accent: 'neutral',
    title: 'Archive',
    subtitle: 'Smallest file, for long-term storage',
    type: 'FULL',
    compression: 'GZIP',
    pros: [
      'Smallest file on disk',
      'Good for cold storage',
    ],
    cons: [
      'Slowest to create and restore',
    ],
  },
];

const SCHEDULE_PRESETS = [
  {
    id: 'snapshots',
    icon: Repeat,
    accent: 'sky',
    title: 'Frequent snapshots',
    subtitle: 'Many small checkpoints per day',
    type: 'SNAPSHOT',
    compression: 'NONE',
    pros: [
      'Almost zero storage cost',
      'Great for "oops" recovery',
    ],
    cons: [
      'Tied to the original disk',
      'Not a real disaster-recovery backup',
    ],
  },
  {
    id: 'nightly',
    icon: Moon,
    accent: 'purple',
    title: 'Full nightly',
    subtitle: 'One complete backup per run',
    recommended: true,
    type: 'FULL',
    compression: 'QCOW2',
    pros: [
      'Independent copy each time',
      'Simple — every backup stands alone',
    ],
    cons: [
      'Uses the most space',
      'Each run takes minutes',
    ],
  },
  {
    id: 'chain',
    icon: Layers,
    accent: 'amber',
    title: 'Smart chain',
    subtitle: 'Incremental — only stores what changed',
    type: 'INCREMENTAL',
    compression: 'QCOW2',
    pros: [
      'Tiny per-run footprint',
      'Fast to create',
    ],
    cons: [
      'Restore depends on the chain — if one piece is lost, the rest are useless',
      'Needs an existing FULL backup as the base',
    ],
  },
];

const ACCENT_BG = {
  sky: 'rgba(56,189,248,0.10)',
  purple: 'rgba(168,85,247,0.12)',
  amber: 'rgba(245,158,11,0.10)',
  neutral: 'rgba(255,255,255,0.05)',
};
const ACCENT_BORDER = {
  sky: 'rgba(56,189,248,0.35)',
  purple: 'rgba(168,85,247,0.45)',
  amber: 'rgba(245,158,11,0.35)',
  neutral: 'rgba(255,255,255,0.15)',
};
const ACCENT_TEXT = {
  sky: 'rgb(125,211,252)',
  purple: 'rgb(216,180,254)',
  amber: 'rgb(252,211,77)',
  neutral: 'rgba(255,255,255,0.85)',
};

const STATUS_TONE = {
  PENDING: 'neutral',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  FAILED: 'danger',
  CANCELLED: 'neutral',
};

const formatBytes = (bytes) => {
  const n = Number(bytes ?? 0);
  if (!n) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
};

const formatDuration = (ms) => {
  if (!ms) return '—';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs ? `${m}m ${rs}s` : `${m}m`;
};

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '—';
  }
};

const hasActiveBackup = (backups) =>
  backups.some((b) => b.status === 'IN_PROGRESS' || b.status === 'PENDING');

const emptyCreateForm = {
  presetId: 'full',
  description: '',
};

const emptyScheduleForm = {
  id: null,
  presetId: 'nightly',
  cronExpression: '0 2 * * *',
  retentionCount: 7,
  label: '',
  enabled: true,
};

// Map an existing schedule's raw type+compression back to its closest preset.
const matchPreset = (presets, type, compression) => {
  const exact = presets.find(
    (p) => p.type === type && p.compression === compression,
  );
  if (exact) return exact.id;
  const byType = presets.find((p) => p.type === type);
  return byType?.id ?? presets.find((p) => p.recommended)?.id ?? presets[0].id;
};

function BackupPresetPicker({ presets, value, onChange }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 10,
      }}
    >
      {presets.map((preset) => {
        const Icon = preset.icon;
        const selected = value === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            style={{
              textAlign: 'left',
              padding: 12,
              borderRadius: 12,
              cursor: 'pointer',
              background: selected
                ? ACCENT_BG[preset.accent]
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${
                selected
                  ? ACCENT_BORDER[preset.accent]
                  : 'rgba(255,255,255,0.08)'
              }`,
              boxShadow: selected
                ? `0 0 0 2px ${ACCENT_BORDER[preset.accent]} inset`
                : 'none',
              color: 'inherit',
              transition: 'background 120ms, border-color 120ms',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Icon size={16} color={ACCENT_TEXT[preset.accent]} />
              <span style={{ fontWeight: 600 }}>{preset.title}</span>
              {preset.recommended ? (
                <Badge tone="info">Recommended</Badge>
              ) : null}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              {preset.subtitle}
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                fontSize: 11.5,
              }}
            >
              {preset.pros.map((p) => (
                <li
                  key={`pro-${p}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                  }}
                >
                  <Check
                    size={11}
                    color="rgb(134,239,172)"
                    style={{ marginTop: 3, flexShrink: 0 }}
                  />
                  <span>{p}</span>
                </li>
              ))}
              {preset.cons.map((c) => (
                <li
                  key={`con-${c}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    opacity: 0.75,
                  }}
                >
                  <X
                    size={11}
                    color="rgb(252,165,165)"
                    style={{ marginTop: 3, flexShrink: 0 }}
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}

const VMBackupsTab = ({ vmId, vmStatus }) => {
  const vmIsRunning = vmStatus === 'running';
  const backupBlockedReason = vmIsRunning
    ? 'Stop the VM before creating a backup. Disk is locked while the VM runs.'
    : null;
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const [restoreTarget, setRestoreTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [scheduleDialog, setScheduleDialog] = useState({
    open: false,
    mode: 'create',
    form: emptyScheduleForm,
  });
  const [deleteScheduleTarget, setDeleteScheduleTarget] = useState(null);

  const backupsQ = useBackupsQuery({
    variables: { vmId },
    skip: !vmId,
    notifyOnNetworkStatusChange: true,
    pollInterval: 0,
  });
  const schedulesQ = useBackupSchedulesQuery({
    variables: { vmId },
    skip: !vmId,
  });

  const backups = backupsQ.data?.backups?.backups ?? [];
  const schedules = schedulesQ.data?.backupSchedules?.schedules ?? [];

  const showProgress = hasActiveBackup(backups);

  useEffect(() => {
    if (showProgress) backupsQ.startPolling?.(3000);
    else backupsQ.stopPolling?.();
    return () => backupsQ.stopPolling?.();
  }, [showProgress, backupsQ]);

  const [createBackup, createBackupState] = useCreateBackupMutation();
  const [restoreBackup, restoreBackupState] = useRestoreBackupMutation();
  const [deleteBackup, deleteBackupState] = useDeleteBackupMutation();
  const [createSchedule, createScheduleState] =
    useCreateBackupScheduleMutation();
  const [updateSchedule, updateScheduleState] =
    useUpdateBackupScheduleMutation();
  const [deleteSchedule, deleteScheduleState] =
    useDeleteBackupScheduleMutation();

  const onCreateBackup = async () => {
    try {
      const preset =
        MANUAL_PRESETS.find((p) => p.id === createForm.presetId) ||
        MANUAL_PRESETS.find((p) => p.recommended);
      const res = await createBackup({
        variables: {
          input: {
            vmId,
            type: preset.type,
            compression: preset.compression,
            description: createForm.description || undefined,
            diskPaths: [],
          },
        },
      });
      const r = res.data?.createBackup;
      if (r?.success) {
        toast({
          title: 'Backup started',
          description: 'Progress will appear in the list below.',
        });
        setCreateOpen(false);
        setCreateForm(emptyCreateForm);
        backupsQ.refetch();
      } else {
        toast({
          title: 'Could not start backup',
          description: r?.error || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Backup failed',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const onConfirmRestore = async () => {
    if (!restoreTarget) return;
    try {
      const res = await restoreBackup({
        variables: {
          input: {
            vmId,
            backupId: restoreTarget.backupId,
            diskPaths: [],
            overwriteExisting: true,
          },
        },
      });
      const r = res.data?.restoreBackup;
      if (r?.success) {
        toast({
          title: 'Restore started',
          description: 'The VM is being restored from backup.',
        });
      } else {
        toast({
          title: 'Restore failed',
          description: r?.error || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Restore failed',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setRestoreTarget(null);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteBackup({
        variables: {
          input: { vmId, backupId: deleteTarget.id },
        },
      });
      const r = res.data?.deleteBackup;
      if (r?.success) {
        toast({ title: 'Backup deleted' });
        backupsQ.refetch();
      } else {
        toast({
          title: 'Delete failed',
          description: r?.message || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreateSchedule = () =>
    setScheduleDialog({
      open: true,
      mode: 'create',
      form: emptyScheduleForm,
    });

  const openEditSchedule = (s) =>
    setScheduleDialog({
      open: true,
      mode: 'edit',
      form: {
        id: s.id,
        presetId: matchPreset(SCHEDULE_PRESETS, s.type, s.compression),
        cronExpression: s.cronExpression,
        retentionCount: s.retentionCount,
        label: s.label || '',
        enabled: s.enabled,
      },
    });

  const onSaveSchedule = async () => {
    const f = scheduleDialog.form;
    const preset =
      SCHEDULE_PRESETS.find((p) => p.id === f.presetId) ||
      SCHEDULE_PRESETS.find((p) => p.recommended);
    try {
      if (scheduleDialog.mode === 'create') {
        await createSchedule({
          variables: {
            input: {
              vmId,
              type: preset.type,
              compression: preset.compression,
              cronExpression: f.cronExpression,
              retentionCount: f.retentionCount,
              label: f.label || undefined,
              enabled: f.enabled,
            },
          },
        });
        toast({ title: 'Schedule created' });
      } else {
        await updateSchedule({
          variables: {
            id: f.id,
            input: {
              type: preset.type,
              compression: preset.compression,
              cronExpression: f.cronExpression,
              retentionCount: f.retentionCount,
              label: f.label || undefined,
              enabled: f.enabled,
            },
          },
        });
        toast({ title: 'Schedule updated' });
      }
      setScheduleDialog({ open: false, mode: 'create', form: emptyScheduleForm });
      schedulesQ.refetch();
    } catch (err) {
      toast({
        title: 'Could not save schedule',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const onConfirmDeleteSchedule = async () => {
    if (!deleteScheduleTarget) return;
    try {
      const res = await deleteSchedule({
        variables: { id: deleteScheduleTarget.id },
      });
      if (res.data?.deleteBackupSchedule?.success) {
        toast({ title: 'Schedule deleted' });
        schedulesQ.refetch();
      }
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setDeleteScheduleTarget(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'type',
        label: 'Type',
        width: 140,
        render: (row) => (
          <Badge tone="neutral" icon={<Archive size={12} />}>
            {row.type}
          </Badge>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: 220,
        render: (row) => {
          if (row.status === 'IN_PROGRESS' || row.status === 'PENDING') {
            const pct = row.progressPercent ?? 0;
            return (
              <div style={{ minWidth: 180 }}>
                <Progress value={pct} tone="sky" shimmer showValue />
              </div>
            );
          }
          return (
            <Badge
              tone={STATUS_TONE[row.status] || 'neutral'}
              icon={
                row.status === 'COMPLETED' ? (
                  <CheckCircle size={12} />
                ) : row.status === 'FAILED' ? (
                  <AlertTriangle size={12} />
                ) : undefined
              }
            >
              {row.status.replace('_', ' ').toLowerCase()}
            </Badge>
          );
        },
      },
      {
        key: 'totalSize',
        label: 'Size',
        width: 120,
        align: 'right',
        sortable: true,
        render: (row) => formatBytes(row.totalSize),
      },
      {
        key: 'durationMs',
        label: 'Duration',
        width: 110,
        align: 'right',
        render: (row) => formatDuration(row.durationMs),
      },
      {
        key: 'description',
        label: 'Description',
        render: (row) => (
          <span style={{ opacity: row.description ? 1 : 0.5 }}>
            {row.description || '—'}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created',
        width: 180,
        sortable: true,
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: 'actions',
        label: '',
        width: 200,
        align: 'right',
        render: (row) => (
          <ResponsiveStack direction="row" gap={1} justify="end">
            <Button
              size="sm"
              variant="secondary"
              icon={<RotateCcw size={12} />}
              disabled={row.status !== 'COMPLETED'}
              onClick={() => setRestoreTarget(row)}
            >
              Restore
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 size={12} />}
              disabled={row.status === 'IN_PROGRESS'}
              onClick={() => setDeleteTarget(row)}
            />
          </ResponsiveStack>
        ),
      },
    ],
    [],
  );

  const isInitialLoading =
    backupsQ.loading && !backupsQ.data && !backupsQ.error;

  if (isInitialLoading) {
    return (
      <Page>
        <Card variant="default" spotlight={false} glow={false}>
          <LoadingOverlay label="Loading backups…" />
        </Card>
      </Page>
    );
  }

  if (backupsQ.error) {
    return (
      <Page>
        <Alert
          tone="danger"
          icon={<AlertTriangle size={14} />}
          title="Could not load backups"
          actions={
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              onClick={() => backupsQ.refetch()}
            >
              Retry
            </Button>
          }
        >
          {backupsQ.error.message}
        </Alert>
      </Page>
    );
  }

  return (
    <Page>
      <Card
        variant="default"
        spotlight={false}
        glow={false}
        leadingIcon={<Database size={18} />}
        leadingIconTone="sky"
        title={
          <ResponsiveStack direction="row" gap={2} align="center" wrap>
            <span>Backups</span>
            {showProgress ? (
              <Badge tone="info" pulse icon={<RefreshCw size={12} />}>
                Backup in progress
              </Badge>
            ) : null}
          </ResponsiveStack>
        }
        description={
          <ResponsiveStack direction="row" gap={3} wrap align="center">
            <span>{backups.length} backup{backups.length === 1 ? '' : 's'}</span>
            {backups.length > 0 ? (
              <span style={{ opacity: 0.7 }}>
                total size{' '}
                {formatBytes(
                  backups.reduce((acc, b) => acc + Number(b.totalSize || 0), 0),
                )}
              </span>
            ) : null}
          </ResponsiveStack>
        }
        footer={
          <ResponsiveStack direction="row" gap={2} wrap>
            <Tooltip content={backupBlockedReason || undefined} disabled={!backupBlockedReason}>
              <span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => setCreateOpen(true)}
                  disabled={showProgress || vmIsRunning}
                >
                  Create backup
                </Button>
              </span>
            </Tooltip>
            <Button
              size="sm"
              variant="secondary"
              icon={<RefreshCw size={14} />}
              onClick={() => {
                backupsQ.refetch();
                schedulesQ.refetch();
              }}
              loading={backupsQ.loading}
            >
              Refresh
            </Button>
          </ResponsiveStack>
        }
      />

      {backups.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<HardDrive size={18} />}
          title="No backups yet"
          description="Create your first backup to protect this VM against data loss."
          action={
            <Tooltip content={backupBlockedReason || undefined} disabled={!backupBlockedReason}>
              <span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => setCreateOpen(true)}
                  disabled={vmIsRunning}
                >
                  Create backup
                </Button>
              </span>
            </Tooltip>
          }
        />
      ) : (
        <Card variant="default" spotlight={false} glow={false}>
          <DataTable
            rows={backups}
            columns={columns}
            rowKey={(row) => row.id}
            dense
          />
        </Card>
      )}

      <Card
        variant="default"
        spotlight={false}
        glow={false}
        leadingIcon={<CalendarClock size={18} />}
        leadingIconTone="purple"
        title="Scheduled backups"
        description={
          schedules.length === 0
            ? 'Automate backups with a cron schedule.'
            : `${schedules.length} schedule${schedules.length === 1 ? '' : 's'}`
        }
        footer={
          <Button
            size="sm"
            variant="secondary"
            icon={<Plus size={14} />}
            onClick={openCreateSchedule}
          >
            New schedule
          </Button>
        }
      >
        {schedules.length === 0 ? null : (
          <ResponsiveStack direction="col" gap={2}>
            {schedules.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Badge tone={s.enabled ? 'success' : 'neutral'}>
                  {s.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge tone="neutral" icon={<Archive size={12} />}>
                  {s.type}
                </Badge>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {s.cronExpression}
                </span>
                {s.label ? (
                  <span style={{ opacity: 0.8 }}>{s.label}</span>
                ) : null}
                <span style={{ opacity: 0.6, fontSize: 12 }}>
                  keep last {s.retentionCount}
                </span>
                {s.nextRunAt ? (
                  <span style={{ opacity: 0.6, fontSize: 12 }}>
                    <Clock size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
                    next {formatDate(s.nextRunAt)}
                  </span>
                ) : null}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Pencil size={12} />}
                    onClick={() => openEditSchedule(s)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={12} />}
                    onClick={() => setDeleteScheduleTarget(s)}
                  />
                </div>
              </div>
            ))}
          </ResponsiveStack>
        )}
      </Card>

      {/* Create backup dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="md"
        title="Create backup"
        description="A new backup will be created from the VM's current disks."
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Play size={14} />}
              onClick={onCreateBackup}
              loading={createBackupState.loading}
            >
              Start backup
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          <BackupPresetPicker
            presets={MANUAL_PRESETS}
            value={createForm.presetId}
            onChange={(id) => setCreateForm((f) => ({ ...f, presetId: id }))}
          />
          <Textarea
            label="Description (optional)"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="e.g. before upgrading Postgres to 17"
            maxChars={200}
          />
        </ResponsiveStack>
      </Dialog>

      {/* Restore confirm */}
      <Dialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        size="md"
        title="Restore from backup"
        description={
          restoreTarget
            ? `Restore this VM to the state of backup ${restoreTarget.backupId}? Current disks will be overwritten.`
            : ''
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setRestoreTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<RotateCcw size={14} />}
              onClick={onConfirmRestore}
              loading={restoreBackupState.loading}
            >
              Restore now
            </Button>
          </ResponsiveStack>
        }
      >
        {restoreTarget ? (
          <Alert tone="warning" icon={<Shield size={14} />} title="Irreversible action">
            The VM should be stopped before restoring. Any changes made after the
            backup ({formatDate(restoreTarget.createdAt)}) will be lost.
          </Alert>
        ) : null}
      </Dialog>

      {/* Delete backup confirm */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title="Delete backup"
        description={
          deleteTarget
            ? `Delete backup from ${formatDate(deleteTarget.createdAt)}? The files on disk will be removed.`
            : ''
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={onConfirmDelete}
              loading={deleteBackupState.loading}
            >
              Delete
            </Button>
          </ResponsiveStack>
        }
      />

      {/* Schedule create/edit */}
      <Dialog
        open={scheduleDialog.open}
        onClose={() =>
          setScheduleDialog({ open: false, mode: 'create', form: emptyScheduleForm })
        }
        size="md"
        title={
          scheduleDialog.mode === 'create' ? 'New backup schedule' : 'Edit schedule'
        }
        description="Backups will run automatically on the given cron expression."
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() =>
                setScheduleDialog({
                  open: false,
                  mode: 'create',
                  form: emptyScheduleForm,
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onSaveSchedule}
              loading={
                createScheduleState.loading || updateScheduleState.loading
              }
            >
              {scheduleDialog.mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          <TextField
            label="Label (optional)"
            value={scheduleDialog.form.label}
            onChange={(e) =>
              setScheduleDialog((d) => ({
                ...d,
                form: { ...d.form, label: e.target.value },
              }))
            }
            placeholder="e.g. nightly"
          />
          <BackupPresetPicker
            presets={SCHEDULE_PRESETS}
            value={scheduleDialog.form.presetId}
            onChange={(id) =>
              setScheduleDialog((d) => ({
                ...d,
                form: { ...d.form, presetId: id },
              }))
            }
          />
          <TextField
            label="Cron expression"
            value={scheduleDialog.form.cronExpression}
            onChange={(e) =>
              setScheduleDialog((d) => ({
                ...d,
                form: { ...d.form, cronExpression: e.target.value },
              }))
            }
            placeholder="0 2 * * *"
            hint="Minute Hour Day Month Weekday — e.g. `0 2 * * *` = daily at 02:00"
          />
          <NumberField
            label="Retention (keep last N)"
            value={scheduleDialog.form.retentionCount}
            min={1}
            max={365}
            onChange={(v) =>
              setScheduleDialog((d) => ({
                ...d,
                form: { ...d.form, retentionCount: v },
              }))
            }
          />
          <Switch
            label="Enabled"
            description="If off, the schedule won't fire."
            checked={scheduleDialog.form.enabled}
            onChange={(e) =>
              setScheduleDialog((d) => ({
                ...d,
                form: { ...d.form, enabled: e.target.checked },
              }))
            }
          />
        </ResponsiveStack>
      </Dialog>

      {/* Delete schedule confirm */}
      <Dialog
        open={!!deleteScheduleTarget}
        onClose={() => setDeleteScheduleTarget(null)}
        size="sm"
        title="Delete schedule"
        description={
          deleteScheduleTarget
            ? `Delete schedule "${deleteScheduleTarget.label || deleteScheduleTarget.cronExpression}"? Existing backups are kept.`
            : ''
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => setDeleteScheduleTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={onConfirmDeleteSchedule}
              loading={deleteScheduleState.loading}
            >
              Delete
            </Button>
          </ResponsiveStack>
        }
      />
    </Page>
  );
};

export default VMBackupsTab;
