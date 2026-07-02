'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  ResponsiveStack } from
'@infinibay/harbor';
import { AlertCircle } from 'lucide-react';

// Delete confirmation. Kept as an always-mounted, `open`-controlled dialog
// (driven by whether a `pool` is selected) to match the page's original
// behaviour. The destructive action is supplied by the page via `onConfirm`.
export function DeletePoolDialog({ pool, onClose, onConfirm, loading = false }) {
  return (
    <Dialog open={!!pool} onClose={loading ? () => {} : onClose} size="sm">
      <DialogTitle>
        <ResponsiveStack direction="row" gap={2} align="center">
          <AlertCircle size={16} />
          Delete pool
        </ResponsiveStack>
      </DialogTitle>
      <DialogDescription>
        {pool
          ? `This archives all ${pool.currentSize} desktop${pool.currentSize !== 1 ? 's' : ''} in “${pool.name}” and removes the pool.`
          : 'This action cannot be undone.'}
      </DialogDescription>
      <DialogBody>
        <p className="text-sm text-fg-muted">
          Active sessions on these desktops will be terminated. This cannot be undone.
        </p>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} loading={loading}>
          Delete pool
        </Button>
      </DialogButtons>
    </Dialog>);

}
