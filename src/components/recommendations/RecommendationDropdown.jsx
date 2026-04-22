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
  Card,
  IconButton,
  Menu,
  MenuItem,
  MenuSeparator,
  ResponsiveStack,
  ScrollArea,
  Spinner,
} from '@infinibay/harbor';
import { CheckCircle2, MoreHorizontal, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const SNOOZE_OPTIONS = [
  { value: 'PT1H', label: '1 hora' },
  { value: 'PT4H', label: '4 horas' },
  { value: 'P1D', label: '24 horas' },
];

export function RecommendationDropdown({ onClose, onActionComplete }) {
  const { data, loading, refetch } = useGlobalPendingRecommendationsQuery({
    pollInterval: 30000,
  });

  const [dismissAll, { loading: dismissingAll }] = useDismissAllRecommendationsMutation({
    onCompleted: () => {
      toast.success('Todas las recomendaciones descartadas');
      onActionComplete?.();
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [snoozeAll, { loading: snoozingAll }] = useSnoozeAllRecommendationsMutation({
    onCompleted: () => {
      toast.success('Todas las recomendaciones pospuestas');
      onActionComplete?.();
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const recommendations = data?.recommendations ?? [];

  const sorted = [...recommendations].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  const handleDismissAll = () => dismissAll();
  const handleSnoozeAll = (duration) => snoozeAll({ variables: { duration } });

  const wrapperStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: 8,
    width: 384,
    maxHeight: '70vh',
    zIndex: 50,
  };

  return (
    <div style={wrapperStyle}>
      <Card variant="default" padding="none">
        <ResponsiveStack direction="col" gap={0}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <ResponsiveStack direction="row" gap={2} align="center" justify="between">
              <ResponsiveStack direction="col" gap={0}>
                <strong>Recomendaciones pendientes</strong>
                <span style={{ fontSize: 13, opacity: 0.65 }}>
                  {recommendations.length === 0
                    ? 'No hay recomendaciones'
                    : `${recommendations.length} pendiente${recommendations.length !== 1 ? 's' : ''}`}
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
                      aria-label="Batch actions"
                    />
                  }
                >
                  <MenuItem
                    icon={<X size={14} />}
                    onClick={handleDismissAll}
                    disabled={dismissingAll}
                  >
                    Descartar todas
                  </MenuItem>
                  <MenuSeparator />
                  {SNOOZE_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      icon={<Clock size={14} />}
                      onClick={() => handleSnoozeAll(opt.value)}
                      disabled={snoozingAll}
                    >
                      {`Posponer todas ${opt.label}`}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </ResponsiveStack>
          </div>

          <ScrollArea style={{ maxHeight: '50vh' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spinner />
              </div>
            ) : recommendations.length === 0 ? (
              <ResponsiveStack direction="col" gap={2} align="center" justify="center">
                <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.65 }}>
                  <CheckCircle2 size={40} />
                  <span style={{ fontSize: 13 }}>Todo en orden</span>
                </div>
              </ResponsiveStack>
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
