'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  ResponsiveStack,
  Select,
} from '@infinibay/harbor';
import { MoveRight, Power, Server } from 'lucide-react';

// Cold migration requires the desktop to be powered off (mirrors the backend
// VMMigrationService gate and page.js canColdMigrateStatus).
const isColdMigratable = (status) =>
  ['off', 'powered_off', 'stopped', 'error'].includes((status || '').toLowerCase());

/**
 * Deliberate, confirm-gated dialog for the (rare, heavy) cold-migration action.
 * Replaces the always-on full-width "Node placement" card. Only mounted for
 * admins on multi-node clusters (see page.js). Shows current placement, a
 * headroom-annotated target picker, the local-storage disk-copy warning, and —
 * when the desktop is still running — an inline "stop first" affordance instead
 * of silently disabling everything.
 */
const NodePlacementDialog = ({
  open,
  onClose,
  vm,
  currentNodeName,
  targets = [],
  onMigrate,
  migrating = false,
  onStopVM,
  stopping = false,
}) => {
  const [targetNodeId, setTargetNodeId] = useState('');

  // Reset the selection whenever the dialog is (re)opened.
  useEffect(() => {
    if (!open) setTargetNodeId('');
  }, [open]);

  const stopped = isColdMigratable(vm?.status);

  const options = [
    {
      value: '',
      label: targets.length > 0 ? 'Select target node' : 'No eligible target nodes',
    },
    ...targets.map((n) => ({
      value: n.id,
      label: `${n.name} · ${n.availableCores ?? '?'}/${n.cores ?? '?'} cores free · ${n.availableRamGB ?? '?'} GB RAM free`,
    })),
  ];

  const handleConfirm = async () => {
    if (!targetNodeId || !stopped) return;
    await onMigrate?.(targetNodeId);
  };

  return (
    <Dialog open={open} onClose={migrating ? () => {} : onClose} size="md">
      <DialogTitle>Move desktop to another node</DialogTitle>
      <DialogDescription>
        {`Cold-migrate "${vm?.name || 'this desktop'}" to a different host node.`}
      </DialogDescription>
      <DialogBody>
        <ResponsiveStack direction="col" gap={3}>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Server size={14} />
            <span>Current node:</span>
            <Badge tone="neutral">{currentNodeName || 'Unassigned'}</Badge>
          </ResponsiveStack>

          {!stopped ? (
            <Alert
              tone="warning"
              icon={<Power size={14} />}
              title="The desktop must be stopped first"
              actions={
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Power size={14} />}
                  loading={stopping}
                  disabled={stopping}
                  onClick={onStopVM}
                >
                  {stopping ? 'Stopping…' : 'Stop desktop'}
                </Button>
              }
            >
              Migration copies the desktop&apos;s disk, so it can only run while the
              desktop is powered off.
            </Alert>
          ) : (
            <ResponsiveStack direction="col" gap={2}>
              <label className="text-sm text-fg-muted">Target node</label>
              <Select
                value={targetNodeId}
                onChange={setTargetNodeId}
                options={options}
                disabled={targets.length === 0 || migrating}
              />
              <span className="text-xs text-fg-muted">
                For local (non-shared) storage this copies the disk to the target
                node and may take several minutes.
              </span>
            </ResponsiveStack>
          )}
        </ResponsiveStack>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={migrating}>
          Cancel
        </Button>
        <Button
          variant="primary"
          icon={<MoveRight size={14} />}
          onClick={handleConfirm}
          loading={migrating}
          disabled={!stopped || !targetNodeId || migrating}
        >
          {migrating ? 'Moving…' : 'Move desktop'}
        </Button>
      </DialogButtons>
    </Dialog>
  );
};

export default NodePlacementDialog;
