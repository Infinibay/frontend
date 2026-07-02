'use client';

/**
 * RecommendationCard Component
 *
 * Individual recommendation card with snooze and dismiss actions.
 *
 * NOTE: one-click remediation ("run script") is intentionally not offered
 * here — the backend exposes no `executeRecommendation` mutation and the
 * global recommendation payload (GlobalRecommendationType) carries no script
 * reference. The suggested remediation is surfaced honestly as `actionText`;
 * users action it from the VM's Scripts tab.
 */

import { formatDistanceToNow } from 'date-fns';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ResponsiveStack,
} from '@infinibay/harbor';
import {
  useDismissRecommendationMutation,
  useSnoozeRecommendationMutation,
} from '@/gql/hooks';
import { Clock, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Map recommendation severity onto Harbor semantic color tokens. Mirrors the
// CRITICAL→danger / HIGH→warning / MEDIUM→info / LOW→success mapping used by
// severityTone() in src/app/notification/page.jsx.
const SEVERITY_COLORS = {
  CRITICAL: 'rgb(var(--harbor-danger))',
  HIGH: 'rgb(var(--harbor-warning))',
  MEDIUM: 'rgb(var(--harbor-info))',
  LOW: 'rgb(var(--harbor-success))',
};

const SNOOZE_OPTIONS = [
  { value: 'PT1H', label: '1 hour' },
  { value: 'PT4H', label: '4 hours' },
  { value: 'P1D', label: '24 hours' },
  { value: 'P7D', label: '7 days' },
];

export function RecommendationCard({ recommendation, onActionComplete }) {
  const [dismissRec, { loading: dismissing }] = useDismissRecommendationMutation();
  const [snoozeRec, { loading: snoozing }] = useSnoozeRecommendationMutation();

  const busy = dismissing || snoozing;

  const handleDismiss = async () => {
    if (busy) return;
    try {
      const res = await dismissRec({ variables: { id: recommendation.id } });
      const result = res.data?.dismissRecommendation;
      if (!result?.success) {
        toast.error(result?.error || 'Failed to dismiss recommendation');
        return;
      }
      toast.success('Recommendation dismissed');
      onActionComplete?.();
    } catch (err) {
      toast.error(err?.message || 'Failed to dismiss recommendation');
    }
  };

  const handleSnooze = async (duration) => {
    if (busy) return;
    try {
      const res = await snoozeRec({ variables: { id: recommendation.id, duration } });
      const result = res.data?.snoozeRecommendation;
      if (!result?.success) {
        toast.error(result?.error || 'Failed to snooze recommendation');
        return;
      }
      toast.success('Recommendation snoozed');
      onActionComplete?.();
    } catch (err) {
      toast.error(err?.message || 'Failed to snooze recommendation');
    }
  };

  // Guard against an invalid/missing timestamp so the whole dropdown doesn't
  // crash on a bad row.
  let timeAgo = '';
  const created = recommendation.createdAt ? new Date(recommendation.createdAt) : null;
  if (created && !Number.isNaN(created.getTime())) {
    timeAgo = formatDistanceToNow(created, { addSuffix: true });
  }

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: 9999,
    marginTop: 6,
    flexShrink: 0,
    background: SEVERITY_COLORS[recommendation.severity] || 'rgb(var(--harbor-text-muted))',
  };

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--harbor-border-subtle)' }}>
      <ResponsiveStack direction="row" gap={3} align="start">
        <span style={dotStyle} role="img" aria-label={`Severity: ${recommendation.severity}`} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: 'rgb(var(--harbor-text))' }}>
            {recommendation.text}
          </div>
          <div style={{ fontSize: 12, color: 'rgb(var(--harbor-text-muted))' }}>
            {[recommendation.machineName, timeAgo].filter(Boolean).join(' · ')}
          </div>
        </div>
      </ResponsiveStack>

      {recommendation.actionText ? (
        <div
          style={{
            marginTop: 6,
            marginLeft: 20,
            fontSize: 12,
            color: 'rgb(var(--harbor-text-muted))',
          }}
        >
          {recommendation.actionText}
        </div>
      ) : null}

      <div style={{ marginTop: 8, marginLeft: 20 }}>
        <ResponsiveStack direction="row" gap={2} align="center">
          <Menu
            align="start"
            trigger={
              <Button
                size="sm"
                variant="secondary"
                icon={<Clock size={12} />}
                disabled={busy}
                loading={snoozing}
              >
                <ResponsiveStack direction="row" gap={1} align="center">
                  <span>Snooze</span>
                  <ChevronDown size={12} />
                </ResponsiveStack>
              </Button>
            }
          >
            {SNOOZE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} onClick={() => handleSnooze(opt.value)} disabled={busy}>
                {opt.label}
              </MenuItem>
            ))}
          </Menu>

          <IconButton
            variant="ghost"
            size="sm"
            icon={<X size={12} />}
            onClick={handleDismiss}
            disabled={busy}
            label="Dismiss"
          />
        </ResponsiveStack>
      </div>
    </div>
  );
}

export default RecommendationCard;
