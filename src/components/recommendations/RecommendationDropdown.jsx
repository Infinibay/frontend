'use client';

/**
 * RecommendationDropdown Component
 *
 * Dropdown showing list of pending recommendations with batch actions.
 */

import {
  useGlobalPendingRecommendationsQuery,
  useDismissAllRecommendationsMutation,
  useSnoozeAllRecommendationsMutation,
} from '@/gql/hooks';
import { RecommendationCard } from './RecommendationCard';
import {
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  MenuSeparator,
  ResponsiveStack,
  ScrollArea,
  Spinner,
  Z,
} from '@infinibay/harbor';
import { CheckCircle2, MoreHorizontal, X, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const SNOOZE_OPTIONS = [
  { value: 'PT1H', label: '1 hour' },
  { value: 'PT4H', label: '4 hours' },
  { value: 'P1D', label: '24 hours' },
];

export function RecommendationDropdown({ onClose, onActionComplete }) {
  const { data, loading, error, refetch } = useGlobalPendingRecommendationsQuery({
    pollInterval: 30000,
    // Keep polling errors from wiping the last good list; surface via `error`.
    notifyOnNetworkStatusChange: true,
  });

  const [dismissAll, { loading: dismissingAll }] = useDismissAllRecommendationsMutation();
  const [snoozeAll, { loading: snoozingAll }] = useSnoozeAllRecommendationsMutation();

  // Schema-correct field is `globalPendingRecommendations` (GlobalRecommendationType[]).
  const recommendations = data?.globalPendingRecommendations ?? [];

  const sorted = [...recommendations].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99)
  );

  const handleDismissAll = async () => {
    if (dismissingAll) return;
    try {
      const res = await dismissAll();
      const result = res.data?.dismissAllRecommendations;
      if (!result?.success) {
        toast.error(result?.error || 'Failed to dismiss recommendations');
        return;
      }
      toast.success('All recommendations dismissed');
      onActionComplete?.();
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Failed to dismiss recommendations');
    }
  };

  const handleSnoozeAll = async (duration) => {
    if (snoozingAll) return;
    try {
      const res = await snoozeAll({ variables: { duration } });
      const result = res.data?.snoozeAllRecommendations;
      if (!result?.success) {
        toast.error(result?.error || 'Failed to snooze recommendations');
        return;
      }
      toast.success('All recommendations snoozed');
      onActionComplete?.();
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Failed to snooze recommendations');
    }
  };

  const wrapperStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: 8,
    width: 'min(384px, calc(100vw - 16px))',
    maxHeight: '70vh',
    zIndex: Z.POPOVER,
  };

  // Distinguish "no data" from "load failed": only trust the empty state when
  // the query has not errored.
  const hasError = Boolean(error) && recommendations.length === 0;
  const isLoading = loading && recommendations.length === 0;

  let subtitle;
  if (hasError) {
    subtitle = 'Unable to load recommendations';
  } else if (recommendations.length === 0) {
    subtitle = 'No pending recommendations';
  } else {
    subtitle = `${recommendations.length} pending`;
  }

  return (
    <div style={wrapperStyle} role="dialog" aria-label="Recommendations">
      <Card variant="default">
        <ResponsiveStack direction="col" gap={0}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--harbor-border-subtle)' }}>
            <ResponsiveStack direction="row" gap={2} align="center" justify="between">
              <ResponsiveStack direction="col" gap={0}>
                <strong>Recommendations</strong>
                <span style={{ fontSize: 13, color: 'rgb(var(--harbor-text-muted))' }}>
                  {subtitle}
                </span>
              </ResponsiveStack>

              {recommendations.length > 1 && (
                <Menu
                  align="end"
                  trigger={
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon={<MoreHorizontal size={16} />}
                      label="Batch actions"
                    />
                  }
                >
                  <MenuItem
                    icon={<X size={14} />}
                    onClick={handleDismissAll}
                    disabled={dismissingAll}
                  >
                    Dismiss all
                  </MenuItem>
                  <MenuSeparator />
                  {SNOOZE_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      icon={<Clock size={14} />}
                      onClick={() => handleSnoozeAll(opt.value)}
                      disabled={snoozingAll}
                    >
                      {`Snooze all for ${opt.label}`}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </ResponsiveStack>
          </div>

          <ScrollArea style={{ maxHeight: '50vh' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spinner />
              </div>
            ) : hasError ? (
              <div
                style={{
                  padding: '32px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  textAlign: 'center',
                }}
              >
                <AlertTriangle size={36} color="rgb(var(--harbor-danger))" />
                <span style={{ fontSize: 13, color: 'rgb(var(--harbor-text))' }}>
                  Couldn&apos;t load recommendations
                </span>
                <span style={{ fontSize: 12, color: 'rgb(var(--harbor-text-muted))' }}>
                  {error?.message || 'Please try again.'}
                </span>
                <Button size="sm" variant="secondary" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : recommendations.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  color: 'rgb(var(--harbor-text-muted))',
                }}
              >
                <CheckCircle2 size={40} />
                <span style={{ fontSize: 13 }}>All clear</span>
              </div>
            ) : (
              <ResponsiveStack direction="col" gap={0}>
                {sorted.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onActionComplete={() => {
                      onActionComplete?.();
                      refetch();
                    }}
                  />
                ))}
              </ResponsiveStack>
            )}
          </ScrollArea>
        </ResponsiveStack>
      </Card>
    </div>
  );
}

export default RecommendationDropdown;
