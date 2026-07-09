'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  DataTable,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  OTPInput,
  ResponsiveStack,
  StatusDot
} from '@infinibay/harbor';
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';

import {
  usePendingNodesQuery,
  useApproveNodeMutation,
  useRejectNodeMutation
} from '@/gql/hooks';
import { usePermissions } from '@/hooks/usePermissions';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

/** Group a 6-digit code as "123 456" for readability; pass anything else through. */
function formatPairingCode(code) {
  if (typeof code === 'string' && /^\d{6}$/.test(code)) {
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }
  return code || '------';
}

function shortFingerprint(fp) {
  if (!fp) return '—';
  return fp.length > 16 ? `${fp.slice(0, 16)}…` : fp;
}

function formatRequestedAt(value) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
}

/**
 * Nodes awaiting SAS approval (multi-node onboarding, Phase 2).
 *
 * The "double verification" surface: each pending node shows the 6-digit pairing
 * code the master computed. The admin compares it against the code printed on the
 * node's own terminal — a MITM that swapped the node key or the CA produces a
 * different code on one side, so a mismatch is caught here. Approving signs the
 * node's client certificate on its next poll.
 *
 * Renders nothing unless there are pending nodes AND the viewer can see them, so
 * it stays out of the way in the common (no pending) case. Write actions are
 * additionally gated by `node:edit` (the server is the real boundary; this only
 * avoids offering actions that would FORBID).
 */
export function PendingNodesSection() {
  const { can } = usePermissions();
  const canView = can('node:view');
  const canEdit = can('node:edit');

  const { data, error, refetch } = usePendingNodesQuery({
    fetchPolicy: 'cache-and-network',
    skip: !canView
  });
  // No polling: the backend emits 'nodes' events when a node requests to join
  // or is approved/rejected, so refetch the pending list on those instead of
  // every 15s. Skip the subscription when the viewer can't see nodes anyway.
  useRealtimeRefetch('nodes', refetch, { minIntervalMs: 3000, skip: !canView });
  const pending = useMemo(() => data?.pendingNodes || [], [data?.pendingNodes]);

  const [approveNode, { loading: approving }] = useApproveNodeMutation();
  const [rejectNode, { loading: rejecting }] = useRejectNodeMutation();

  // The node currently in the approve modal, plus the code the admin reads off
  // the node terminal and re-types (the strongest, server-cross-checked form).
  const [approveTarget, setApproveTarget] = useState(null);
  const [typedCode, setTypedCode] = useState('');
  // The node queued for rejection — rejection is destructive (the host must
  // re-run the join flow), so it is gated behind an explicit confirm dialog.
  const [rejectTarget, setRejectTarget] = useState(null);

  const closeModal = () => {
    setApproveTarget(null);
    setTypedCode('');
  };

  const handleApprove = () => {
    if (!approveTarget || typedCode.length !== 6 || approving) return;
    approveNode({
      variables: { id: approveTarget.id, pairingCode: typedCode },
      onCompleted: () => {
        toast.success(`Node "${approveTarget.name}" approved — its certificate will be issued on the next poll.`);
        closeModal();
        refetch();
      },
      onError: (err) => {
        // A mismatch here means the typed code does not match the master's — the
        // node may be talking to a MITM. Surface it, keep the modal open.
        toast.error(err.message || 'Approval failed');
      }
    });
  };

  const confirmReject = () => {
    if (!rejectTarget || rejecting) return;
    const node = rejectTarget;
    rejectNode({
      variables: { id: node.id },
      onCompleted: () => {
        toast.success(`Node "${node.name}" rejected.`);
        setRejectTarget(null);
        refetch();
      },
      // Keep the confirm dialog open on failure so the admin sees it did not go through.
      onError: (err) => toast.error(err.message || 'Reject failed')
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Node',
        cell: ({ row }) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status="degraded" size={8} />
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.name}</span>
              <span className="text-xs text-fg-subtle">
                {row.role}{row.address ? ` · ${row.address}` : ''}
              </span>
            </ResponsiveStack>
          </ResponsiveStack>
        )
      },
      {
        id: 'fingerprint',
        header: 'Key fingerprint',
        width: 200,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-fg-muted">{shortFingerprint(row.fingerprint)}</span>
        )
      },
      {
        id: 'pairingCode',
        header: 'Pairing code',
        width: 150,
        cell: ({ row }) => (
          <span className="font-mono text-sm tracking-widest text-fg">{formatPairingCode(row.pairingCode)}</span>
        )
      },
      {
        id: 'requestedAt',
        header: 'Requested',
        width: 180,
        cell: ({ row }) => <span className="text-xs text-fg-muted">{formatRequestedAt(row.createdAt)}</span>
      },
      {
        id: 'actions',
        header: '',
        width: 190,
        align: 'end',
        cell: ({ row }) => (
          <ButtonGroup>
            <Button
              size="sm"
              variant="secondary"
              disabled={!canEdit || rejecting}
              onClick={() => setRejectTarget(row)}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!canEdit}
              onClick={() => {
                setTypedCode('');
                setApproveTarget(row);
              }}
            >
              Approve…
            </Button>
          </ButtonGroup>
        )
      }
    ],
     
    [canEdit, rejecting]
  );

  if (!canView) return null;

  // A failing/forbidden poll must be visible — never silently indistinguishable
  // from "no pending nodes". Surface a compact, dismissable/retryable warning.
  if (error && pending.length === 0) {
    return (
      <section className="rounded-md border border-warning/30 bg-warning/5 p-4">
        <ResponsiveStack direction="row" gap={2} align="center" justify="between">
          <ResponsiveStack direction="row" gap={2} align="center">
            <ShieldQuestion size={16} className="text-warning" />
            <span className="text-sm font-medium">Couldn&apos;t check for pending nodes</span>
          </ResponsiveStack>
          <Button size="sm" variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </ResponsiveStack>
      </section>
    );
  }

  // Keep the section mounted while the approve dialog is open even if the poll
  // empties the list (approved/expired elsewhere), so the dialog doesn't vanish
  // mid-typing; otherwise stay out of the way when there's nothing pending.
  if (pending.length === 0 && !approveTarget) return null;

  return (
    <section className="rounded-md border border-warning/30 bg-warning/5 p-4">
      <ResponsiveStack direction="col" gap={3}>
        <ResponsiveStack direction="row" gap={2} align="center" justify="between">
          <ResponsiveStack direction="row" gap={2} align="center">
            <ShieldQuestion size={16} className="text-warning" />
            <span className="text-sm font-medium">Nodes awaiting approval</span>
            <Badge tone="warning">{pending.length}</Badge>
          </ResponsiveStack>
        </ResponsiveStack>
        <span className="text-xs text-fg-muted">
          Compare each node&apos;s pairing code with the one shown on that node&apos;s own terminal before
          approving. A code that does not match means the connection may be tampered with — reject it.
        </span>

        <DataTable
          rows={pending}
          columns={columns}
          rowId={(row) => row.id}
          defaultDensity="compact"
        />
      </ResponsiveStack>

      <Dialog open={!!approveTarget} onClose={closeModal} size="sm">
        <DialogTitle>{approveTarget ? `Approve "${approveTarget.name}"?` : 'Approve node'}</DialogTitle>
        <DialogDescription>
          On the node&apos;s terminal you will see a 6-digit pairing code. Confirm it matches the code
          below, then type it to approve.
        </DialogDescription>
        <DialogBody>
          <ResponsiveStack direction="col" gap={4} align="center">
            <ResponsiveStack direction="col" gap={1} align="center">
              <span className="text-xs uppercase tracking-wide text-fg-subtle">Code shown for this node</span>
              <span className="font-mono text-2xl tracking-widest text-fg">
                {approveTarget ? formatPairingCode(approveTarget.pairingCode) : '------'}
              </span>
            </ResponsiveStack>
            <ResponsiveStack direction="col" gap={2} align="center">
              <span className="text-xs text-fg-muted">Type the code from the node&apos;s terminal</span>
              <OTPInput
                length={6}
                value={typedCode}
                onChange={setTypedCode}
                onComplete={() => handleApprove()}
              />
            </ResponsiveStack>
            {approveTarget?.fingerprint ? (
              <span className="font-mono text-[11px] text-fg-subtle">
                key {shortFingerprint(approveTarget.fingerprint)}
              </span>
            ) : null}
          </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="between">
          <Button
            variant="secondary"
            onClick={() => {
              const node = approveTarget;
              closeModal();
              if (node) setRejectTarget(node);
            }}
            disabled={rejecting}
          >
            Reject instead
          </Button>
          <ButtonGroup>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<ShieldCheck size={14} />}
              disabled={typedCode.length !== 6 || approving}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </ButtonGroup>
        </DialogButtons>
      </Dialog>

      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} size="sm">
        <DialogTitle>{rejectTarget ? `Reject "${rejectTarget.name}"?` : 'Reject node'}</DialogTitle>
        <DialogDescription>
          The join request will be discarded. The host will need to re-run the join flow to try again.
        </DialogDescription>
        <DialogButtons align="end">
          <ButtonGroup>
            <Button variant="secondary" onClick={() => setRejectTarget(null)} disabled={rejecting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={rejecting}>
              Reject node
            </Button>
          </ButtonGroup>
        </DialogButtons>
      </Dialog>
    </section>
  );
}

export default PendingNodesSection;
