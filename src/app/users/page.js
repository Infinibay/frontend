"use client";

import React, { useMemo, useState } from "react";
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
  Lock,
} from "lucide-react";
import {
  Page,
  Card,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Select,
  FormField,
  Avatar,
  Alert,
  Dialog,
  Drawer,
  DataTable,
  EmptyState,
  Spinner,
  Stat,
  RoleBadge,
  PasswordStrength,
  ResponsiveStack,
  ResponsiveGrid,
} from "@infinibay/harbor";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/state/slices/users";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";
import { createDebugger } from "@/utils/debug";
import { toast } from "sonner";

const debug = createDebugger("frontend:pages:users");

const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];
const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  role: "USER",
};

/** User create/edit form shared between both drawer modes. */
function UserFormFields({ form, setForm, mode }) {
  const [hideA, setHideA] = useState(true);
  const [hideB, setHideB] = useState(true);

  const update = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ResponsiveStack direction="col" gap={4}>
      <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
        <TextField
          label="First name"
          value={form.firstName}
          onChange={update("firstName")}
        />
        <TextField
          label="Last name"
          value={form.lastName}
          onChange={update("lastName")}
        />
      </ResponsiveGrid>

      {mode === "create" && (
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
        />
      )}

      <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
        <TextField
          label={mode === "create" ? "Password" : "New password (optional)"}
          type={hideA ? "password" : "text"}
          icon={<Lock size={16} />}
          suffix={
            <IconButton
              size="sm"
              variant="ghost"
              label={hideA ? "Show password" : "Hide password"}
              icon={hideA ? <EyeOff size={16} /> : <Eye size={16} />}
              onClick={() => setHideA((s) => !s)}
            />
          }
          value={form.password || ""}
          onChange={update("password")}
        />
        <TextField
          label="Confirm password"
          type={hideB ? "password" : "text"}
          icon={<Lock size={16} />}
          suffix={
            <IconButton
              size="sm"
              variant="ghost"
              label={hideB ? "Show password" : "Hide password"}
              icon={hideB ? <EyeOff size={16} /> : <Eye size={16} />}
              onClick={() => setHideB((s) => !s)}
            />
          }
          value={form.passwordConfirmation || ""}
          onChange={update("passwordConfirmation")}
        />
      </ResponsiveGrid>

      {form.password ? (
        <PasswordStrength value={form.password} />
      ) : null}

      <FormField label="Role">
        <Select
          value={form.role}
          onChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
          options={ROLE_OPTIONS}
        />
      </FormField>
    </ResponsiveStack>
  );
}

export default function UsersPage() {
  const dispatch = useDispatch();

  const {
    data: users,
    isLoading,
    error,
    refresh,
  } = useEnsureData("users", fetchUsers, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 3 * 60 * 1000,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState([]);

  const [drawerMode, setDrawerMode] = useState(null); // 'create' | 'edit' | null
  const [drawerForm, setDrawerForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setDrawerForm(EMPTY_FORM);
    setEditingId(null);
    setDrawerMode("create");
  };

  const openEdit = (user) => {
    setDrawerForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      passwordConfirmation: "",
      role: user.role || "USER",
    });
    setEditingId(user.id);
    setDrawerMode("edit");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setEditingId(null);
    setDrawerForm(EMPTY_FORM);
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
        u.lastName?.toLowerCase().includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const list = users || [];
    return {
      total: list.length,
      admins: list.filter((u) => u.role === "ADMIN").length,
      users: list.filter((u) => u.role === "USER").length,
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
          content: (
            <p>
              Click <strong>Add user</strong> to open a drawer with first
              name, last name, email, password and role.
            </p>
          ),
        },
        {
          id: "roles",
          title: "Roles",
          icon: <Shield size={16} />,
          content: (
            <p>
              <strong>Admin</strong> can manage all resources and users.{" "}
              <strong>User</strong> can only operate the VMs assigned to them.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click a row to open the edit drawer",
        "Search filters by name and email",
        "Select rows to delete in bulk",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Users", isCurrent: true },
      ],
      title: "Users",
      actions: [],
      helpConfig,
      helpTooltip: "Users help",
    },
    []
  );

  // ---- Mutations --------------------------------------------------

  const handleSave = async () => {
    const form = drawerForm;
    if (!form.firstName || !form.lastName || !form.role) {
      toast.error("First name, last name and role are required");
      return;
    }

    if (drawerMode === "create") {
      if (!form.email || !form.password || !form.passwordConfirmation) {
        toast.error("Email and password fields are required");
        return;
      }
      if (form.password !== form.passwordConfirmation) {
        toast.error("Passwords do not match");
        return;
      }
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

    // edit
    if (form.password || form.passwordConfirmation) {
      if (form.password !== form.passwordConfirmation) {
        toast.error("Passwords do not match");
        return;
      }
    }
    const input = {
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
      ...(form.password && form.passwordConfirmation
        ? {
            password: form.password,
            passwordConfirmation: form.passwordConfirmation,
          }
        : {}),
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
    } catch (e) {
      toast.error(e.message || "Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ---- Columns ----------------------------------------------------

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "User",
        sortable: true,
        render: (row) => (
          <ResponsiveStack direction="row" gap={3} align="center">
            <Avatar
              name={`${row.firstName || ""} ${row.lastName || ""}`.trim() || row.email}
              size="sm"
            />
            <ResponsiveStack direction="col" gap={0}>
              <span>
                {`${row.firstName || ""} ${row.lastName || ""}`.trim() || "—"}
              </span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>{row.email}</span>
            </ResponsiveStack>
          </ResponsiveStack>
        ),
      },
      {
        key: "role",
        label: "Role",
        width: 120,
        sortable: true,
        render: (row) =>
          row.role === "ADMIN" ? (
            <RoleBadge role="admin" />
          ) : (
            <RoleBadge role="viewer" label="User" />
          ),
      },
      {
        key: "actions",
        label: "",
        width: 120,
        align: "right",
        render: (row) => (
          <ResponsiveStack
            direction="row"
            gap={1}
            justify="end"
            align="center"
          >
            <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                size="sm"
                variant="ghost"
                label="Edit user"
                icon={<Pencil size={14} />}
                onClick={() => openEdit(row)}
              />
            </span>
            <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                size="sm"
                variant="ghost"
                label="Delete user"
                icon={<Trash2 size={14} />}
                onClick={() => setDeleteTarget(row)}
              />
            </span>
          </ResponsiveStack>
        ),
      },
    ],
    []
  );

  debug.info("Users page:", {
    count: users?.length || 0,
    filteredCount: filtered.length,
    selected: selected.length,
  });

  return (
    <Page size="xl" gap="lg">
      {/* Hero / actions strip */}
      <Card variant="default">
        <ResponsiveStack
          direction={{ base: "col", lg: "row" }}
          gap={4}
          justify="between"
          align={{ base: "stretch", lg: "center" }}
        >
          <ResponsiveStack direction="col" gap={1}>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Users</h1>
            <p style={{ opacity: 0.7, margin: 0 }}>
              Manage sign-in accounts and permissions.
            </p>
          </ResponsiveStack>
          <ButtonGroup>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={<UserPlus size={16} />}
              onClick={openCreate}
            >
              Add user
            </Button>
          </ButtonGroup>
        </ResponsiveStack>

        <ResponsiveGrid columns={{ base: 1, sm: 3 }} gap={3}>
          <Stat label="Total users" value={stats.total} />
          <Stat
            label="Admins"
            value={stats.admins}
            icon={<Shield size={14} />}
          />
          <Stat label="Users" value={stats.users} />
        </ResponsiveGrid>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load users"
          actions={
            <Button
              size="sm"
              onClick={refresh}
              icon={<RefreshCw size={16} />}
            >
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      {/* Search + filters + bulk actions */}
      <Card variant="default">
        <ResponsiveStack
          direction={{ base: "col", md: "row" }}
          gap={3}
          align={{ base: "stretch", md: "center" }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <TextField
              placeholder="Search users by name or email…"
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: "0 0 220px", minWidth: 0 }}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_FILTER_OPTIONS}
            />
          </div>
          {selected.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => setDeleteTarget("bulk")}
            >
              Delete {selected.length}
            </Button>
          )}
        </ResponsiveStack>
      </Card>

      {/* Users table */}
      {isLoading && !users?.length ? (
        <Card variant="default">
          <ResponsiveStack
            direction="row"
            gap={3}
            align="center"
            justify="center"
          >
            <Spinner />
            <span>Loading users…</span>
          </ResponsiveStack>
        </Card>
      ) : filtered.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={<UsersIcon size={40} />}
            title={users?.length ? "No matches" : "No users yet"}
            description={
              users?.length
                ? "No users match the current search or filter."
                : "Create the first user to get started."
            }
            actions={
              <Button
                size="sm"
                icon={<UserPlus size={16} />}
                onClick={openCreate}
              >
                Add user
              </Button>
            }
          />
        </Card>
      ) : (
        <Card variant="default">
          <DataTable
            rows={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            selectable
            selected={selected}
            onSelectionChange={setSelected}
            onRowClick={openEdit}
          />
        </Card>
      )}

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
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={saving}>
              {drawerMode === "create" ? "Create user" : "Save changes"}
            </Button>
          </ResponsiveStack>
        }
      >
        <UserFormFields
          form={drawerForm}
          setForm={setDrawerForm}
          mode={drawerMode || "create"}
        />
      </Drawer>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <Trash2 size={16} />
            <span>
              Delete{" "}
              {deleteTarget === "bulk" ? `${selected.length} users` : "user"}
            </span>
          </ResponsiveStack>
        }
        description={
          deleteTarget && deleteTarget !== "bulk"
            ? `Remove ${deleteTarget.firstName || ""} ${deleteTarget.lastName || ""} (${deleteTarget.email})?`
            : "Remove all selected users?"
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </ResponsiveStack>
        }
      >
        <p style={{ margin: 0, opacity: 0.7 }}>
          This cannot be undone. The account will no longer be able to sign in
          and any VMs they own will be orphaned unless reassigned first.
        </p>
      </Dialog>
    </Page>
  );
}
