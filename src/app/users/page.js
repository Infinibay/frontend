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
  Card,
  Button,
  ButtonGroup,
  TextField,
  Select,
  Avatar,
  Badge,
  Alert,
  Dialog,
  Drawer,
  DataTable,
  EmptyState,
  Spinner,
  Stat,
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
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
      </div>

      {mode === "create" && (
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={mode === "create" ? "Password" : "New password (optional)"}
          type={hideA ? "password" : "text"}
          icon={<Lock className="h-4 w-4" />}
          suffix={
            <button
              type="button"
              onClick={() => setHideA((s) => !s)}
              className="text-fg-muted hover:text-fg"
            >
              {hideA ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={form.password || ""}
          onChange={update("password")}
        />
        <TextField
          label="Confirm password"
          type={hideB ? "password" : "text"}
          icon={<Lock className="h-4 w-4" />}
          suffix={
            <button
              type="button"
              onClick={() => setHideB((s) => !s)}
              className="text-fg-muted hover:text-fg"
            >
              {hideB ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={form.passwordConfirmation || ""}
          onChange={update("passwordConfirmation")}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg">Role</label>
        <Select
          value={form.role}
          onChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
          options={ROLE_OPTIONS}
        />
      </div>
    </div>
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
      icon: <UsersIcon className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "creating",
          title: "Creating users",
          icon: <UserPlus className="h-4 w-4" />,
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
          icon: <Shield className="h-4 w-4" />,
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
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              name={`${row.firstName || ""} ${row.lastName || ""}`.trim() || row.email}
              size="sm"
            />
            <div className="min-w-0">
              <div className="text-sm font-medium text-fg truncate">
                {`${row.firstName || ""} ${row.lastName || ""}`.trim() || "—"}
              </div>
              <div className="text-xs text-fg-muted truncate">{row.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        label: "Role",
        width: 110,
        sortable: true,
        render: (row) =>
          row.role === "ADMIN" ? (
            <Badge tone="purple">Admin</Badge>
          ) : (
            <Badge tone="neutral">User</Badge>
          ),
      },
      {
        key: "actions",
        label: "",
        width: 120,
        align: "right",
        render: (row) => (
          <div
            className="flex items-center gap-1 justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="ghost"
              icon={<Pencil className="h-3.5 w-3.5" />}
              onClick={() => openEdit(row)}
              aria-label="Edit"
            >
              {""}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => setDeleteTarget(row)}
              aria-label="Delete"
            >
              {""}
            </Button>
          </div>
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
    <div className="space-y-6">
      {/* Hero / actions strip */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-fg flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-accent-2" />
              Users
            </h1>
            <p className="text-sm text-fg-muted mt-1">
              Manage sign-in accounts and permissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />}
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={<UserPlus className="h-4 w-4" />}
              onClick={openCreate}
            >
              Add user
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat label="Total users" value={stats.total} />
          <Stat label="Admins" value={stats.admins} icon={<Shield className="h-3.5 w-3.5" />} />
          <Stat label="Users" value={stats.users} />
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load users"
          actions={
            <Button size="sm" onClick={refresh} icon={<RefreshCw className="h-4 w-4" />}>
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      {/* Search + filters + bulk actions */}
      <Card variant="default" className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="md:w-80">
            <TextField
              placeholder="Search users by name or email…"
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:w-56">
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_FILTER_OPTIONS}
            />
          </div>

          <div className="md:ml-auto flex items-center gap-2">
            {selected.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => setDeleteTarget("bulk")}
              >
                Delete {selected.length}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Users table */}
      {isLoading && !users?.length ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading users…
        </div>
      ) : filtered.length === 0 ? (
        <Card variant="default" className="p-0">
          <EmptyState
            icon={<UsersIcon className="h-10 w-10 text-fg-subtle" />}
            title={users?.length ? "No matches" : "No users yet"}
            description={
              users?.length
                ? "No users match the current search or filter."
                : "Create the first user to get started."
            }
            actions={
              <Button
                size="sm"
                icon={<UserPlus className="h-4 w-4" />}
                onClick={openCreate}
              >
                Add user
              </Button>
            }
          />
        </Card>
      ) : (
        <Card variant="default" className="p-2">
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
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={closeDrawer} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={saving}>
              {drawerMode === "create" ? "Create user" : "Save changes"}
            </Button>
          </ButtonGroup>
        }
      >
        <UserFormFields form={drawerForm} setForm={setDrawerForm} mode={drawerMode || "create"} />
      </Drawer>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <Trash2 className="h-4 w-4" />
            Delete {deleteTarget === "bulk" ? `${selected.length} users` : "user"}
          </span>
        }
        description={
          deleteTarget && deleteTarget !== "bulk"
            ? `Remove ${deleteTarget.firstName || ""} ${deleteTarget.lastName || ""} (${deleteTarget.email})?`
            : "Remove all selected users?"
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          This cannot be undone. The account will no longer be able to sign in
          and any VMs they own will be orphaned unless reassigned first.
        </p>
      </Dialog>
    </div>
  );
}
