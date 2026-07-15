import { Button, Drawer, TextField } from '@infinibay/harbor';
import { Plus } from 'lucide-react';

// Role create / edit form, lifted out of the cramped bottom-of-column form into
// a right-side Drawer with room to breathe. `mode` drives which set of
// page-owned fields + handler it uses; the handlers return a boolean so the
// drawer closes only on success (a failed save keeps the user's input).
export const RoleFormDrawer = ({
  mode, // 'create' | 'edit' | null
  onClose,
  selectedRole,
  newRoleName,
  setNewRoleName,
  newRoleDescription,
  setNewRoleDescription,
  creatingRole,
  handleCreateRole,
  editName,
  setEditName,
  editDescription,
  setEditDescription,
  updatingRole,
  handleSaveRole
}) => {
  const isCreate = mode === 'create';

  const name = isCreate ? newRoleName : editName;
  const setName = isCreate ? setNewRoleName : setEditName;
  const description = isCreate ? newRoleDescription : editDescription;
  const setDescription = isCreate ? setNewRoleDescription : setEditDescription;
  const loading = isCreate ? creatingRole : updatingRole;

  const unchanged =
    !isCreate &&
    selectedRole &&
    name.trim() === selectedRole.name &&
    description.trim() === (selectedRole.description || '');
  const disabled = !name.trim() || unchanged;

  const submit = async () => {
    const ok = isCreate ? await handleCreateRole() : await handleSaveRole();
    if (ok) onClose();
  };

  return (
    <Drawer
      open={mode !== null}
      onClose={onClose}
      side="right"
      size={420}
      title={isCreate ? 'Create role' : `Edit role${selectedRole ? ` · ${selectedRole.name}` : ''}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={isCreate ? <Plus size={14} /> : undefined}
            loading={loading}
            disabled={disabled}
            onClick={submit}>
            {isCreate ? 'Create role' : 'Save changes'}
          </Button>
        </div>
      }>
      <div className="flex flex-col gap-4 p-1">
        <TextField
          label="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
        {isCreate ? (
          <p className="text-xs text-fg-muted">
            Create the role, then grant its permissions from the editor on the right.
          </p>
        ) : selectedRole?.isSystem ? (
          <p className="text-xs text-fg-muted">
            This is a system preset — you can rename it here; use “Reset to default” in the
            permissions panel to restore its seeded permissions.
          </p>
        ) : null}
      </div>
    </Drawer>
  );
};
