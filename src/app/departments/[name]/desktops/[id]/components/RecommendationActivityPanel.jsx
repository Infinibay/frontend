import { useState } from 'react';
import { Badge, Button, Card, ResponsiveStack } from '@infinibay/harbor';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react';
import {
  useResolutionHistoryForMachineQuery,
  useCancelResolutionMutation,
} from '@/gql/hooks';
import useRemediationEvents from '@/hooks/useRemediationEvents';
import { toast } from '@/hooks/use-toast';

const STATUS_CONFIG = {
  PENDING: { tone: 'neutral', icon: Loader2, label: 'Pending', spin: true },
  RUNNING: { tone: 'info', icon: Loader2, label: 'Running', spin: true },
  SUCCEEDED: { tone: 'success', icon: CheckCircle2, label: 'Done' },
  REQUIRES_REBOOT: { tone: 'warning', icon: AlertTriangle, label: 'Reboot required' },
  FAILED: { tone: 'danger', icon: XCircle, label: 'Failed' },
  CANCELLED: { tone: 'neutral', icon: XCircle, label: 'Cancelled' },
};

const ACTIVE_STATUSES = new Set(['PENDING', 'RUNNING']);

const ACTION_LABELS = {
  install_updates: 'Install updates',
  install_security_updates: 'Install security updates',
  reboot: 'Reboot',
  schedule_reboot: 'Schedule reboot',
};

function actionLabel(actionKey) {
  if (ACTION_LABELS[actionKey]) return ACTION_LABELS[actionKey];
  if (!actionKey) return 'Action';
  return actionKey
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function timeLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

/**
 * Build a human-readable log blob from a resolution's persisted result/error.
 * Handles both the OS-update shape ({ stdout, stderr, reboot_required }) and the
 * app-update shape ({ succeeded, failed, logs: [{ package, success, stdout, stderr }] }).
 */
function buildLogText(resolution) {
  const parts = [];
  if (resolution.error) parts.push(`ERROR: ${resolution.error}`);
  const r = resolution.result || {};
  if (typeof r.stdout === 'string' && r.stdout.trim()) parts.push(r.stdout.trim());
  if (typeof r.stderr === 'string' && r.stderr.trim())
    parts.push(`[stderr]\n${r.stderr.trim()}`);
  if (Array.isArray(r.logs)) {
    r.logs.forEach((l) => {
      parts.push(`# ${l.package} — ${l.success ? 'ok' : 'failed'}`);
      if (l.stdout && l.stdout.trim()) parts.push(l.stdout.trim());
      if (l.stderr && l.stderr.trim()) parts.push(`[stderr] ${l.stderr.trim()}`);
    });
  }
  if (Array.isArray(r.failed) && r.failed.length > 0) {
    parts.push('Failed packages:');
    r.failed.forEach((f) => parts.push(`- ${f.package}: ${f.error}`));
  }
  return parts.join('\n\n').trim();
}

const ActivityRow = ({ resolution, onCancel, cancelling }) => {
  const [open, setOpen] = useState(false);
  const config = STATUS_CONFIG[resolution.status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  const active = ACTIVE_STATUSES.has(resolution.status);
  const statusLabel =
    resolution.status === 'RUNNING' && resolution.progress > 0
      ? `${config.label} ${resolution.progress}%`
      : config.label;
  const logText = buildLogText(resolution);

  return (
    <div className="flex flex-col gap-1 rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-fg">
            {actionLabel(resolution.actionKey)}
          </div>
          <div className="text-xs text-fg-muted">
            {timeLabel(resolution.createdAt)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge tone={config.tone}>
            <ResponsiveStack direction="row" gap={1} align="center">
              <Icon size={12} className={config.spin ? 'animate-spin' : undefined} />
              <span>{statusLabel}</span>
            </ResponsiveStack>
          </Badge>
          {logText ? (
            <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)}>
              {open ? 'Hide logs' : 'Logs'}
            </Button>
          ) : null}
          {active ? (
            <Button
              size="sm"
              variant="ghost"
              icon={<XCircle size={12} />}
              disabled={cancelling}
              loading={cancelling}
              onClick={() => onCancel?.(resolution.id)}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </div>

      {active && resolution.progressMessage ? (
        <div className="text-xs text-fg-muted">{resolution.progressMessage}</div>
      ) : null}

      {resolution.status === 'FAILED' && resolution.error ? (
        <div className="text-xs text-[color:var(--harbor-status-danger-fg,#dc2626)]">
          {resolution.error}
        </div>
      ) : null}

      {open && logText ? (
        <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap rounded-[var(--harbor-target-radius)] bg-[var(--harbor-surface-panel-muted)] p-2 text-xs text-fg-muted">
          {logText}
        </pre>
      ) : null}
    </div>
  );
};

/**
 * Persistent view of recent recommendation actions for a VM. Because it queries
 * the backend on mount (and refetches on remediation socket events), a page
 * refresh no longer loses track of what's running / whether it failed and why —
 * the per-action toast/badge in RecommendationActions is transient, this is durable.
 */
const RecommendationActivityPanel = ({ vmId }) => {
  const { data, refetch } = useResolutionHistoryForMachineQuery({
    variables: { machineId: vmId, limit: 15 },
    skip: !vmId,
    fetchPolicy: 'cache-and-network',
  });

  // Refetch on remediation lifecycle events instead of polling. Progress isn't
  // streamed over the socket, so a run shows start → terminal (no interim %).
  useRemediationEvents(vmId, () => {
    if (vmId) refetch();
  });

  const [cancelResolution, { loading: cancelling }] = useCancelResolutionMutation();
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelResolution({ variables: { id } });
      // The CANCELLED lifecycle event refetches; this is just immediate feedback.
      toast({
        title: 'Cancelling…',
        description: 'Requested cancellation of the running action.',
        variant: 'info',
      });
    } catch (err) {
      toast({
        title: 'Could not cancel',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const items = data?.resolutionHistoryForMachine || [];
  if (items.length === 0) return null;

  return (
    <Card
      variant="default"
      spotlight={false}
      glow={false}
      leadingIcon={<Activity size={18} />}
      leadingIconTone="sky"
      title="Recent actions"
      description="What was triggered on this desktop, whether it succeeded or failed, and the guest output."
    >
      <ResponsiveStack direction="col" gap={2}>
        {items.map((r) => (
          <ActivityRow
            key={r.id}
            resolution={r}
            onCancel={handleCancel}
            cancelling={cancelling && cancellingId === r.id}
          />
        ))}
      </ResponsiveStack>
    </Card>
  );
};

export default RecommendationActivityPanel;
