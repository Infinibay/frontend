'use client';

/**
 * RecommendationCard Component
 *
 * Individual recommendation card with execute, snooze, and dismiss actions.
 */

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Button,
  ButtonGroup,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  ResponsiveStack,
} from '@infinibay/harbor';
import {
  useDismissRecommendationMutation,
  useSnoozeRecommendationMutation,
} from '@/gql/hooks';
import {
  Play,
  Clock,
  X,
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const SEVERITY_COLORS = {
  CRITICAL: 'rgb(239, 68, 68)',
  HIGH: 'rgb(249, 115, 22)',
  MEDIUM: 'rgb(234, 179, 8)',
  LOW: 'rgb(59, 130, 246)',
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

  const scriptName =
    recommendation.script?.name ||
    recommendation.systemScript?.displayName ||
    'Script';

  // `executeRecommendation` mutation doesn't exist in the backend schema
  // yet — stub it out so the component compiles. Replace with the real
  // useExecuteRecommendationMutation hook when available.
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

  const handleExecuteClick = () => setShowConfirmDialog(true);

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

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: 9999,
    marginTop: 6,
    flexShrink: 0,
    background: SEVERITY_COLORS[recommendation.severity] || 'rgb(107, 114, 128)',
  };

  return (
    <>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ResponsiveStack direction="row" gap={3} align="start">
          <span style={dotStyle} aria-label={`Severidad: ${recommendation.severity}`} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {recommendation.title}
            </div>
            <div style={{ fontSize: 12, opacity: 0.65 }}>
              {recommendation.machine?.name} &middot; {timeAgo}
            </div>
          </div>

          {executionResult === 'success' && (
            <CheckCircle size={16} color="rgb(34, 197, 94)" />
          )}
          {executionResult === 'error' && (
            <XCircle size={16} color="rgb(239, 68, 68)" />
          )}
        </ResponsiveStack>

        <div style={{ marginTop: 8, marginLeft: 20 }}>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Button
              size="sm"
              variant="primary"
              icon={
                executing ? (
                  <Loader2 size={12} />
                ) : (
                  <Play size={12} />
                )
              }
              onClick={handleExecuteClick}
              disabled={executing || executionResult === 'success'}
            >
              {`Ejecutar "${scriptName}"`}
            </Button>

            <Menu
              align="start"
              trigger={
                <Button size="sm" variant="secondary" icon={<Clock size={12} />}>
                  <ResponsiveStack direction="row" gap={1} align="center">
                    <span>Posponer</span>
                    <ChevronDown size={12} />
                  </ResponsiveStack>
                </Button>
              }
            >
              {SNOOZE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} onClick={() => handleSnooze(opt.value)}>
                  {opt.label}
                </MenuItem>
              ))}
            </Menu>

            <IconButton
              variant="ghost"
              size="sm"
              icon={<X size={12} />}
              onClick={handleDismiss}
              aria-label="Descartar"
            />
          </ResponsiveStack>
        </div>
      </div>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        size="sm"
        title={`Ejecutar "${scriptName}"?`}
        description={
          <span>
            Se ejecutara este script en <strong>{recommendation.machine?.name}</strong>.
            {recommendation.description ? (
              <span style={{ display: 'block', marginTop: 8, opacity: 0.65 }}>
                {recommendation.description}
              </span>
            ) : null}
          </span>
        }
        footer={
          <ButtonGroup>
            <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              icon={<Play size={14} />}
              onClick={handleConfirmExecute}
            >
              Ejecutar
            </Button>
          </ButtonGroup>
        }
      />
    </>
  );
}

export default RecommendationCard;
