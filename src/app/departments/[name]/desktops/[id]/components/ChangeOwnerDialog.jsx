'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Combobox,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
} from '@infinibay/harbor';
import { toast } from 'sonner';
import { useUsersQuery, useUpdateMachineUserMutation } from '@/gql/hooks';

// Sentinel for the "no owner" choice — the backend's updateMachineUser accepts
// userId:null to unassign.
const UNASSIGN = '__unassign__';

/**
 * Small friendly picker to reassign (or clear) a desktop's owner. Backed by the
 * already-existing updateMachineUser mutation + users query — no new backend
 * work. The mutation returns the Machine with its user on the same id, so Apollo
 * cache normalisation refreshes the Owner row in place (the backend also emits
 * vms:update, which useVMDetail refetches on).
 */
const ChangeOwnerDialog = ({ open, onClose, vmId, currentUser }) => {
  const { data, loading } = useUsersQuery({
    variables: { pagination: { take: 500 } },
    skip: !open,
    fetchPolicy: 'cache-and-network',
  });
  const [updateMachineUser, { loading: saving }] = useUpdateMachineUserMutation();
  const [selected, setSelected] = useState('');

  // Seed the picker with the current owner (or Unassigned) each time it opens.
  useEffect(() => {
    if (open) setSelected(currentUser?.id || UNASSIGN);
  }, [open, currentUser?.id]);

  const options = useMemo(() => {
    const users = data?.users || [];
    return [
      { value: UNASSIGN, label: 'Unassigned (no owner)', keywords: ['none', 'unassign', 'remove'] },
      ...users.map((u) => ({
        value: u.id,
        label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        keywords: [u.email].filter(Boolean),
      })),
    ];
  }, [data]);

  const handleSave = async () => {
    const userId = selected === UNASSIGN ? null : selected;
    try {
      await updateMachineUser({ variables: { input: { id: vmId, userId } } });
      toast.success(userId ? 'Owner updated' : 'Owner removed');
      onClose();
    } catch (err) {
      toast.error('Could not change owner', {
        description: err?.message || 'The desktop owner could not be changed.',
      });
    }
  };

  return (
    <Dialog open={open} onClose={saving ? () => {} : onClose} size="sm">
      <DialogTitle>Change desktop owner</DialogTitle>
      <DialogDescription>
        Assign this desktop to a different user, or remove the current owner.
      </DialogDescription>
      <DialogBody>
        <Combobox
          label="Owner"
          value={selected}
          onChange={setSelected}
          options={options}
          placeholder={loading ? 'Loading users…' : 'Select or search…'}
          emptyText={loading ? 'Loading…' : 'No matches'}
        />
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving} disabled={saving}>
          Save
        </Button>
      </DialogButtons>
    </Dialog>
  );
};

export default ChangeOwnerDialog;
