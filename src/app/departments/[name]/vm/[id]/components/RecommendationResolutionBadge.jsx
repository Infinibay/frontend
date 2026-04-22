import { Badge, ResponsiveStack } from '@infinibay/harbor';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { tone: 'neutral', icon: Loader2, label: 'Pending', spin: true },
  RUNNING: { tone: 'info', icon: Loader2, label: 'Running', spin: true },
  SUCCEEDED: { tone: 'success', icon: CheckCircle2, label: 'Done' },
  REQUIRES_REBOOT: { tone: 'warning', icon: AlertTriangle, label: 'Reboot required' },
  FAILED: { tone: 'danger', icon: XCircle, label: 'Failed' },
  CANCELLED: { tone: 'neutral', icon: XCircle, label: 'Cancelled' },
};

const RecommendationResolutionBadge = ({ resolution }) => {
  if (!resolution) return null;
  const config = STATUS_CONFIG[resolution.status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  const label = resolution.status === 'RUNNING' && resolution.progress > 0
    ? `${config.label} ${resolution.progress}%`
    : config.label;

  return (
    <ResponsiveStack direction="row" gap={2} align="center">
      <Badge tone={config.tone}>
        <ResponsiveStack direction="row" gap={1} align="center">
          <Icon size={12} className={config.spin ? 'animate-spin' : undefined} />
          <span>{label}</span>
        </ResponsiveStack>
      </Badge>
      {resolution.progressMessage ? (
        <span className="text-xs opacity-70">{resolution.progressMessage}</span>
      ) : null}
    </ResponsiveStack>
  );
};

export default RecommendationResolutionBadge;
