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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Loader2, CheckCircle2, MoreHorizontal, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const SNOOZE_OPTIONS = [
  { value: 'PT1H', label: '1 hora' },
  { value: 'PT4H', label: '4 horas' },
  { value: 'P1D', label: '24 horas' },
];

export function RecommendationDropdown({ onClose, onActionComplete }) {
  const { data, loading, refetch } = useGlobalPendingRecommendationsQuery({
    pollInterval: 30000, // Poll for updates
  });

  // Batch mutations
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

  // Sort by severity
  const sorted = [...recommendations].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  const handleDismissAll = () => {
    dismissAll();
  };

  const handleSnoozeAll = (duration) => {
    snoozeAll({ variables: { duration } });
  };

  return (
    <div
      className={cn(
        'absolute right-0 top-full mt-2 z-50',
        'w-96 max-h-[70vh]',
        'bg-popover border border-border rounded-lg shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-200'
      )}
    >
      {/* Header with batch actions */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Recomendaciones pendientes</h3>
          <p className="text-sm text-muted-foreground">
            {recommendations.length === 0
              ? 'No hay recomendaciones'
              : `${recommendations.length} pendiente${recommendations.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Batch actions menu */}
        {recommendations.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDismissAll}
                disabled={dismissingAll}
              >
                <X className="h-4 w-4 mr-2" />
                Descartar todas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {SNOOZE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleSnoozeAll(opt.value)}
                  disabled={snoozingAll}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Posponer todas {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="max-h-[50vh]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mb-2" />
            <p className="text-sm">Todo en orden</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
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
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default RecommendationDropdown;
