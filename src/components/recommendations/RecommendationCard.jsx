'use client';

/**
 * RecommendationCard Component
 *
 * Individual recommendation card with execute, snooze, and dismiss actions.
 */

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useDismissRecommendationMutation,
  useSnoozeRecommendationMutation,
} from '@/gql/hooks';
import { Play, Clock, X, ChevronDown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-blue-500',
};

const SNOOZE_OPTIONS = [
  { value: 'PT1H', label: '1 hora' },
  { value: 'PT4H', label: '4 horas' },
  { value: 'P1D', label: '24 horas' },
  { value: 'P7D', label: '7 dias' },
];

export function RecommendationCard({ recommendation, onActionComplete }) {
  const [executing, setExecuting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Get script name for display
  const scriptName =
    recommendation.script?.name ||
    recommendation.systemScript?.displayName ||
    'Script';

  // `executeRecommendation` mutation doesn't exist in the backend
  // schema yet — stub it out so the component compiles. When the
  // backend exposes it, replace this placeholder with the real
  // useExecuteRecommendationMutation hook.
  const executeRec = async () => {
    setExecutionResult('error');
    toast.info(`"${scriptName}" — execute from the VM Scripts tab`, {
      description: 'One-click remediation is not wired up yet.',
    });
    onActionComplete?.();
  };

  const [dismissRec] = useDismissRecommendationMutation({
    onCompleted: () => {
      toast.success('Recomendacion descartada');
      onActionComplete?.();
    },
    onError: (err) => toast.error(err.message),
  });

  const [snoozeRec] = useSnoozeRecommendationMutation({
    onCompleted: () => {
      toast.success('Recomendacion pospuesta');
      onActionComplete?.();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleExecuteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmExecute = async () => {
    setShowConfirmDialog(false);
    setExecuting(true);
    setExecutionResult(null);
    await executeRec();
    setExecuting(false);
  };

  const handleDismiss = () => {
    dismissRec({ variables: { id: recommendation.id } });
  };

  const handleSnooze = (duration) => {
    snoozeRec({ variables: { id: recommendation.id, duration } });
  };

  const timeAgo = formatDistanceToNow(new Date(recommendation.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <>
      <div className="px-4 py-3 hover:bg-muted/50 transition-colors">
        {/* Header with severity indicator */}
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
              SEVERITY_STYLES[recommendation.severity]
            )}
            aria-label={`Severidad: ${recommendation.severity}`}
          />

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{recommendation.title}</p>
            <p className="text-xs text-muted-foreground">
              {recommendation.machine?.name} &middot; {timeAgo}
            </p>
          </div>

          {/* Execution result indicator */}
          {executionResult === 'success' && (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
          {executionResult === 'error' && (
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2 ml-5">
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs max-w-[180px]"
            onClick={handleExecuteClick}
            disabled={executing || executionResult === 'success'}
          >
            {executing ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Play className="h-3 w-3 mr-1" />
            )}
            <span className="truncate">Ejecutar &ldquo;{scriptName}&rdquo;</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Posponer
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SNOOZE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleSnooze(opt.value)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-muted-foreground"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ejecutar &ldquo;{scriptName}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Se ejecutara este script en{' '}
              <strong>{recommendation.machine?.name}</strong>.
              {recommendation.description && (
                <span className="block mt-2 text-muted-foreground">
                  {recommendation.description}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExecute}>
              <Play className="h-4 w-4 mr-2" />
              Ejecutar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RecommendationCard;
