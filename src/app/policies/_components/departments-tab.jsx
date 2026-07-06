import {
  Alert,
  Button,
  Combobox,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Select } from
'@infinibay/harbor';
import { Plus, RefreshCw, Users } from 'lucide-react';

import { SectionCard } from './section-card';

// Department members management (the "Departments" tab body). State stays owned
// by the page and arrives as props.
export const DepartmentsTab = ({
  selectedDept,
  setSelectedDept,
  departments,
  deptError,
  reloadDepartments,
  newUserId,
  setNewUserId,
  assignableUsers,
  userNameById,
  newDeptRole,
  setNewDeptRole,
  savingMember,
  addMember,
  membersLoading,
  membersError,
  reloadMembers,
  members,
  memberColumns
}) => {
  return (
    <SectionCard icon={<Users size={16} className="text-fg-muted" />} title="Department members">
      {deptError ? (
        <Alert
          tone="danger"
          title="Couldn't load departments"
          actions={
            reloadDepartments ? (
              <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={reloadDepartments}>
                Retry
              </Button>
            ) : null
          }>
          {deptError} Department-scoped roles can't be managed until this loads.
        </Alert>
      ) : null}

      <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
        <div className="w-full lg:w-72">
          <Select
            label="Department"
            value={selectedDept}
            onChange={setSelectedDept}
            options={
            departments.length ?
            departments.map((d) => ({ value: d.id, label: d.name })) :
            [{ value: '', label: '— no departments —' }]
            } />
        </div>
        <div className="flex-1 min-w-0">
          <Combobox
            label="Add user"
            placeholder="Search users…"
            value={newUserId}
            onChange={setNewUserId}
            options={assignableUsers.map((u) => ({
              value: u.id,
              label: `${userNameById.get(u.id)} · ${u.email}`
            }))} />
        </div>
        <div className="w-full lg:w-40">
          <Select
            label="Role"
            value={newDeptRole}
            onChange={setNewDeptRole}
            options={[
            { value: 'MEMBER', label: 'Member' },
            { value: 'MANAGER', label: 'Manager' }]
            } />
        </div>
        <Button
          variant="primary"
          icon={<Plus size={14} />}
          loading={savingMember}
          disabled={!selectedDept || !newUserId}
          onClick={addMember}>
          Add
        </Button>
      </ResponsiveStack>

      {membersError ? (
        <Alert
          tone="danger"
          title="Couldn't load department members"
          actions={
            reloadMembers ? (
              <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={reloadMembers}>
                Retry
              </Button>
            ) : null
          }>
          {membersError}
        </Alert>
      ) : membersLoading && !members.length ? (
        <span className="text-fg-muted text-sm">Loading members…</span>
      ) : members.length ? (
        <DataTable rows={members} columns={memberColumns} rowId={(r) => r.id} defaultDensity="compact" />
      ) : (
        <EmptyState
          icon={<Users size={18} />}
          title="No department members"
          description="Add a user above to grant them scoped access to this department (Manager can operate it; Member can view it)." />
      )}
    </SectionCard>
  );
};
