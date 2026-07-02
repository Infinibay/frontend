'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  TextField } from
'@infinibay/harbor';

import client from '@/apollo-client';
import { SCALE_POOL } from './pools-gql';

export function ScalePoolDialog({ pool, onClose, onScaled }) {
  const [target, setTarget] = useState(String(pool.currentSize));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const n = parseInt(target, 10);
    if (!Number.isFinite(n) || n < 0) return toast.error('Enter a non-negative integer');
    if (n > pool.sizeMax) return toast.error(`Cannot exceed Max (${pool.sizeMax})`);

    setSubmitting(true);
    try {
      const { data } = await client.mutate({
        mutation: SCALE_POOL,
        variables: { id: pool.id, targetSize: n }
      });
      const res = data?.scalePool;
      if (!res?.success) throw new Error(res?.error || 'scale failed');
      // Phrase the confirmation as an absolute target rather than a delta: the
      // captured `pool` snapshot is stale (the list repolls and the refill job
      // moves currentSize constantly), so a computed +/- could be misleading.
      toast.success(`Scaling to ${n} desktop${n !== 1 ? 's' : ''}`);
      onScaled();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? () => {} : onClose} size="sm">
      <DialogTitle>{`Scale “${pool.name}”`}</DialogTitle>
      <DialogDescription>
        Set the number of desktops to provision now. The background refill job still keeps at least Min warm.
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-fg-muted">
            Current: <span className="font-mono text-fg">{pool.currentSize}</span>
            {' · '}Range: <span className="font-mono text-fg">{pool.sizeMin}–{pool.sizeMax}</span>
          </div>
          <TextField
            label="Target size"
            type="number"
            min={0}
            max={pool.sizeMax}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoFocus />

        </div>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Apply</Button>
      </DialogButtons>
    </Dialog>);

}
