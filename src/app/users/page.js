"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  UserPlus,
  Shield,
  Users as UsersIcon,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Lock } from
"lucide-react";
import { RowContextMenu } from "@/components/common/RowContextMenu";
import {
  Page,
  Badge,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Select,
  FormField,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  Drawer,
  DataTable,
  EmptyState,
  Spinner,
  RoleBadge,
  PasswordStrength,
  ResponsiveStack,
  ResponsiveGrid } from
"@infinibay/harbor";
import { PageHeader } from "@/components/common/PageHeader";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser } from
"@/state/slices/users";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";
import { usePermissions } from "@/hooks/usePermissions";
import { createDebugger } from "@/utils/debug";
import { toast } from "sonner";

const debug = createDebugger("frontend:pages:users");

const ROLE_OPTIONS = [
{ value: "USER", label: "User" },
{ value: "ADMIN", label: "Admin" }];

const ROLE_FILTER_OPTIONS = [
{ value: "all", label: "All roles" },
{ value: "USER", label: "User" },
{ value: "ADMIN", label: "Admin" }];


// Same address shape the auth (sign-in/sign-up) forms validate against, so a
// typo is caught client-side instead of round-tripping to the GraphQL API.
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MIN_PASSWORD_LENGTH = 8;

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  role: "USER"
};

/** User create/edit form shared between both drawer modes. */
function UserFormFields({ form, setForm, mode, errors = {}, clearError, canEditRole = true }) {
  const [hideA, setHideA] = useState(true);
  const [hideB, setHideB] = useState(true);

  const update = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError?.(key);
  };

  const isCreate = mode === "create";

  // Live confirm-password feedback, mirroring the CreateMachine BasicInfoStep:
  // surface the match/mismatch as the user types rather than only on submit.
  const passwordMismatch =
    !!form.password &&
    !!form.passwordConfirmation &&
    form.password !== form.passwordConfirmation;
  const passwordsMatch =
    !!form.password &&
    !!form.passwordConfirmation &&
    form.password === form.passwordConfirmation;
  const confirmError =
    errors.passwordConfirmation ||
    (passwordMismatch ? "Passwords do not match" : undefined);

  return (
    <ResponsiveStack direction="col" gap={4}>
      <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
        <FormField label="First name" required>
          <TextField
            value={form.firstName}
            onChange={update("firstName")}
            error={errors.firstName} />

        </FormField>
        <FormField label="Last name" required>
          <TextField
            value={form.lastName}
            onChange={update("lastName")}
            error={errors.lastName} />

        </FormField>
      </ResponsiveGrid>

      {isCreate &&
      <FormField label="Email" required>
        <TextField
          type="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email} />

      </FormField>
      }

      <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
        <FormField
          label={isCreate ? "Password" : "New password"}
          required={isCreate}
          optional={!isCreate}>
          <TextField
            type={hideA ? "password" : "text"}
            icon={<Lock size={16} />}
            suffix={
            <IconButton
              size="sm"
              variant="ghost"
              label={hideA ? "Show password" : "Hide password"}
              icon={hideA ? <EyeOff size={16} /> : <Eye size={16} />}
              onClick={() => setHideA((s) => !s)} />

            }
            value={form.password || ""}
            onChange={update("password")}
            error={errors.password} />

        </FormField>
        <FormField label="Confirm password" required={isCreate}>
          <TextField
            type={hideB ? "password" : "text"}
            icon={<Lock size={16} />}
            suffix={
            <IconButton
              size="sm"
              variant="ghost"
              label={hideB ? "Show password" : "Hide password"}
              icon={hideB ? <EyeOff size={16} /> : <Eye size={16} />}
              onClick={() => setHideB((s) => !s)} />

            }
            value={form.passwordConfirmation || ""}
            onChange={update("passwordConfirmation")}
            valid={passwordsMatch && !confirmError ? true : undefined}
            error={confirmError} />

        </FormField>
      </ResponsiveGrid>

      {form.password ?
      <PasswordStrength value={form.password} /> :
      null}

      {passwordsMatch && !confirmError &&
      <Badge tone="success">Passwords match</Badge>
      }

      <FormField label="Role" required error={errors.role}>
        <Select
          value={form.role}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, role: v }));
            clearError?.("role");
          }}
          options={ROLE_OPTIONS}
          disabled={!canEditRole} />

      </FormField>
    </ResponsiveStack>);

}

export default function UsersPage() {
  const dispatch = useDispatch();
  const { can, isLoading: permsLoading } = usePermissions();

  // While permissions are still loading, stay optimistic (treat as allowed) so
  // write controls don't flicker disabled→enabled for users who actually can.
  const canCreate = permsLoading || can("user:create");
  const canEdit = permsLoading || can("user:edit");
  const canDelete = permsLoading || can("user:delete");
  const canEditRole = permsLoading || can("role:edit");

  const {
    data: users,
    isLoading,
    error,
    refresh
  } = useEnsureData("users", fetchUsers, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 3 * 60 * 1000
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState([]);

  const [drawerMode, setDrawerMode] = useState(null); // 'create' | 'edit' | null
  const [drawerForm, setDrawerForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const clearFormError = (field) =>
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const openCreate = () => {
    setDrawerForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setDrawerMode("create");
  };

  const openEdit = (user) => {
    setDrawerForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      passwordConfirmation: "",
      role: user.role || "USER"
    });
    setEditingId(user.id);
    setFormErrors({});
    setDrawerMode("edit");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setEditingId(null);
    setDrawerForm(EMPTY_FORM);
    setFormErrors({});
  };

  const filtered = useMemo(() => {
    const list = users || [];
    const q = search.trim().toLowerCase();
    return list.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.email?.toLowerCase().includes(q) ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q));

    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const list = users || [];
    return {
      total: list.length,
      admins: list.filter((u) => (u.role === "ADMIN" || u.role === "SUPER_ADMIN")).length,
      users: list.filter((u) => u.role === "USER").length
    };
  }, [users]);

  const helpConfig = useMemo(
    () => ({
      title: "Users",
      description: "Manage who can sign into Infinibay and what they can do.",
      icon: <UsersIcon size={20} />,
      sections: [
      {
        id: "creating",
        title: "Creating users",
        icon: <UserPlus size={16} />,
        content:
        <p>
              Click <strong>Add user</strong> to open a drawer with first
              name, last name, email, password and role.
            </p>

      },
      {
        id: "roles",
        title: "Roles",
        icon: <Shield size={16} />,
        content:
        <p>
              <strong>Admin</strong> can manage all resources and users.{" "}
              <strong>User</strong> can only operate the desktops assigned to them.
            </p>

      }],

      quickTips: [
      "Click a row to open the edit drawer",
      "Search filters by name and email",
      "Select rows to delete in bulk"]

    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Users", isCurrent: true }],

      title: "Users",
      actions: [],
      helpConfig,
      helpTooltip: "Users help"
    },
    []
  );

  // ---- Mutations --------------------------------------------------

  // Collect every field error at once so the operator sees all problems in one
  // pass, with inline field-level messages instead of a one-error-at-a-time toast.
  const validateForm = () => {
    const form = drawerForm;
    const e = {};
    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";
    if (!form.role) e.role = "Role is required";

    if (drawerMode === "create") {
      if (!form.email) e.email = "Email is required";
      else if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email address";

      if (!form.password) e.password = "Password is required";
      else if (form.password.length < MIN_PASSWORD_LENGTH)
        e.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;

      if (!form.passwordConfirmation)
        e.passwordConfirmation = "Please confirm your password";
      else if (form.password !== form.passwordConfirmation)
        e.passwordConfirmation = "Passwords do not match";
    } else if (form.password || form.passwordConfirmation) {
      // Edit mode: password is optional, but validate when the user is setting one.
      if (form.password.length < MIN_PASSWORD_LENGTH)
        e.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
      if (form.password !== form.passwordConfirmation)
        e.passwordConfirmation = "Passwords do not match";
    }
    return e;
  };

  const handleSave = async () => {
    const form = drawerForm;
    const validation = validateForm();
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    if (drawerMode === "create") {
      setSaving(true);
      try {
        await dispatch(createUser(form)).unwrap();
        toast.success("User created");
        closeDrawer();
      } catch (e) {
        toast.error(e.message || "Failed to create user");
      } finally {
        setSaving(false);
      }
      return;
    }

    // edit (password match / length already enforced by validateForm above)
    const input = {
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
      ...(form.password && form.passwordConfirmation ?
      {
        password: form.password,
        passwordConfirmation: form.passwordConfirmation
      } :
      {})
    };
    setSaving(true);
    try {
      await dispatch(updateUser({ id: editingId, input })).unwrap();
      toast.success("User updated");
      closeDrawer();
    } catch (e) {
      toast.error(e.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const isBulk = deleteTarget === "bulk";
    setDeleting(true);
    try {
      if (isBulk) {
        await Promise.all(
          selected.map((id) => dispatch(deleteUser(id)).unwrap())
        );
        toast.success("Users deleted");
        setSelected([]);
      } else {
        await dispatch(deleteUser(deleteTarget.id)).unwrap();
        toast.success("User deleted");
      }
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // ---- Columns ----------------------------------------------------

  const columns = useMemo(
    () => [
    {
      id: "name",
      header: "User",
      sortable: true,
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={3} align="center">
            <Avatar
          name={`${row.firstName || ""} ${row.lastName || ""}`.trim() || row.email}
          size="sm" />
        
            <ResponsiveStack direction="col" gap={0}>
              <span>
                {`${row.firstName || ""} ${row.lastName || ""}`.trim() || "—"}
              </span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>{row.email}</span>
            </ResponsiveStack>
          </ResponsiveStack>

    },
    {
      id: "role",
      header: "Role",
      width: 120,
      sortable: true,
      cell: ({ row }) =>
      (row.role === "ADMIN" || row.role === "SUPER_ADMIN") ?
      <RoleBadge role="admin" /> :

      <RoleBadge role="viewer" label="User" />

    },
    {
      id: "actions",
      header: "",
      width: 120,
      align: "right",
      cell: ({ row }) =>
      <ResponsiveStack
        direction="row"
        gap={1}
        justify="end"
        align="center">
        
            <span onClick={(e) => e.stopPropagation()}>
              <Tooltip content={canEdit ? "Edit user" : "You don't have permission to edit users"}>
                <IconButton
              size="sm"
              variant="ghost"
              label="Edit user"
              icon={<Pencil size={14} />}
              disabled={!canEdit}
              onClick={() => openEdit(row)} />

              </Tooltip>
            </span>
            <span onClick={(e) => e.stopPropagation()}>
              <Tooltip content={canDelete ? "Delete user" : "You don't have permission to delete users"}>
                <IconButton
              size="sm"
              variant="ghost"
              label="Delete user"
              icon={<Trash2 size={14} />}
              disabled={!canDelete}
              onClick={() => setDeleteTarget(row)} />

              </Tooltip>
            </span>
          </ResponsiveStack>

    }],

    [canEdit, canDelete]
  );

  debug.info("Users page:", {
    count: users?.length || 0,
    filteredCount: filtered.length,
    selected: selected.length
  });

  const countText = stats.total === 0 ?
  null :
  [
  `${stats.total}`,
  stats.admins > 0 ? `${stats.admins} ${stats.admins === 1 ? "admin" : "admins"}` : null].
  filter(Boolean).join(" · ");

  return (
    <Page size="xl" gap="lg">
      <PageHeader
        title="Users"
        count={countText}
        secondary={
        <IconButton
          size="sm"
          variant="ghost"
          label="Refresh"
          icon={<RefreshCw size={14} />}
          onClick={refresh}
          disabled={isLoading} />

        }
        primary={
        <Tooltip content={canCreate ? "Create a new user" : "You don't have permission to create users"}>
            <Button
            size="sm"
            variant="primary"
            icon={<UserPlus size={14} />}
            disabled={!canCreate}
            onClick={openCreate}>

              New User
            </Button>
          </Tooltip>
        }
        filters={
        <>
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <TextField
              placeholder="Search users by name or email…"
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            
            </div>
            <div style={{ flex: "0 0 220px", minWidth: 0 }}>
              <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_FILTER_OPTIONS} />
            
            </div>
            {selected.length > 0 && canDelete &&
          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setDeleteTarget("bulk")}>

                Delete {selected.length}
              </Button>
          }
          </>
        } />
      

      {error &&
      <Alert
        tone="danger"
        title="Couldn't load users"
        actions={
        <Button size="sm" onClick={refresh} icon={<RefreshCw size={16} />}>
              Retry
            </Button>
        }>
        
          {String(error.message || error)}
        </Alert>
      }

      {isLoading && !users?.length ?
      <ResponsiveStack direction="row" gap={3} align="center" justify="center">
          <Spinner />
          <span>Loading users…</span>
        </ResponsiveStack> :
      filtered.length === 0 ?
      <EmptyState
        icon={<UsersIcon size={18} />}
        title={users?.length ? "No matches" : "No users yet"}
        description={
        users?.length ?
        "No users match the current search or filter." :
        "Create the first user to get started."
        }
        actions={
        <Tooltip content={canCreate ? "Create a new user" : "You don't have permission to create users"}>
            <Button
            size="sm"
            variant="primary"
            icon={<UserPlus size={14} />}
            disabled={!canCreate}
            onClick={openCreate}>

                New User
              </Button>
          </Tooltip>
        } /> :


      <RowContextMenu
        rows={filtered}
        labelFor={(r) => r.email || r.namespace || "User"}
        buildItems={(r) => [
        {
          label: "Edit",
          icon: <Pencil size={14} />,
          disabled: !canEdit,
          onSelect: () => openEdit(r)
        },
        { separator: true },
        {
          label: "Delete",
          icon: <Trash2 size={14} />,
          danger: true,
          disabled: !canDelete,
          onSelect: () => setDeleteTarget(r)
        }]
        }>
        
          <DataTable
          rows={filtered}
          columns={columns}
          rowId={(r) => r.id}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          onRowClick={canEdit ? openEdit : undefined}
          defaultDensity="compact" />
        
        </RowContextMenu>
      }

      {/* Create/Edit Drawer */}
      <Drawer
        open={drawerMode !== null}
        onClose={closeDrawer}
        side="right"
        size={440}
        title={drawerMode === "create" ? "Add user" : "Edit user"}
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
            variant="secondary"
            onClick={closeDrawer}
            disabled={saving}>
            
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={saving}>
              {drawerMode === "create" ? "Create user" : "Save changes"}
            </Button>
          </ResponsiveStack>
        }>
        
        <UserFormFields
          form={drawerForm}
          setForm={setDrawerForm}
          mode={drawerMode || "create"}
          errors={formErrors}
          clearError={clearFormError}
          canEditRole={canEditRole} />
        
      </Drawer>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        size="sm">
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Trash2 size={16} />
            <span>
              Delete{" "}
              {deleteTarget === "bulk" ? `${selected.length} users` : "user"}
            </span>
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {deleteTarget && deleteTarget !== "bulk" ?
        `Remove ${deleteTarget.firstName || ""} ${deleteTarget.lastName || ""} (${deleteTarget.email})?` :
        "Remove all selected users?"}
        </DialogDescription>
        <DialogBody>
          <p style={{ margin: 0, opacity: 0.7 }}>
            This cannot be undone. The account will no longer be able to sign in
            and any desktops they own will be orphaned unless reassigned first.
          </p>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}>
            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>);

}