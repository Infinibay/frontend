"use client";

import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { Users as UsersIcon, UserPlus, Shield, Key, Search } from 'lucide-react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} from "@/state/slices/users";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from '@/hooks/usePageHeader';
import { createDebugger } from "@/utils/debug";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSizeContext } from "@/components/ui/size-provider";
import { Toast, ToastProvider, ToastTitle, ToastDescription, ToastViewport } from "@/components/ui/toast";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const debug = createDebugger('frontend:pages:users');

const UsersPage = () => {
  const dispatch = useDispatch();
  const { size } = useSizeContext();
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'USER'
  });

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Users Management Help",
    description: "Learn how to manage user accounts and permissions",
    icon: <UsersIcon className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing-users",
        title: "Managing Users",
        icon: <UserPlus className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating Users</p>
              <p>Click "Add User" button and fill in required fields: first name, last name, email, password, and role.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Editing Users</p>
              <p>Click "Edit" button in user row to modify name, password, or role.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Deleting Users</p>
              <p>Click delete icon to remove users. Confirmation is required before deletion.</p>
            </div>
          </div>
        ),
      },
      {
        id: "user-roles",
        title: "User Roles",
        icon: <Shield className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Admin Role</p>
              <p>Full system access. Can manage all resources, users, and settings.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">User Role</p>
              <p>Limited access. Can only manage assigned VMs and view own resources.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Role Assignment</p>
              <p>Set role during user creation or change via edit dialog.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Permissions</p>
              <p>Roles determine what actions users can perform in the system.</p>
            </div>
          </div>
        ),
      },
      {
        id: "user-profiles",
        title: "User Profiles",
        icon: <Key className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Profile Information</p>
              <p>Users have first name, last name, email, and optional avatar.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Avatar Management</p>
              <p>Avatars can be updated from the user's profile page.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Password Changes</p>
              <p>Admins can reset passwords via edit dialog. Users can change their own passwords.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Email Addresses</p>
              <p>Used for login and system notifications.</p>
            </div>
          </div>
        ),
      },
      {
        id: "search-filter",
        title: "Search and Filtering",
        icon: <Search className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Search Users</p>
              <p>Filter by name or email in real-time using the search box.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Role Filter</p>
              <p>Use dropdown to show only Admins or Users.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Sorting</p>
              <p>Click "Sort by" dropdown to organize users by name or role.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">User Table</p>
              <p>Shows avatar, name, email, role badge, and action buttons.</p>
            </div>
          </div>
        ),
      },
    ],
    quickTips: [
      "Admin users have full system access, assign this role carefully",
      "Users can update their own avatars from their profile page",
      "Use search to quickly find users by name or email",
      "Password confirmation is required when creating or updating passwords",
    ],
  }), []);

  // Use optimized data loading for users
  const {
    data: users,
    isLoading: loading,
    error,
    refresh: refreshUsers
  } = useEnsureData('users', fetchUsers, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 3 * 60 * 1000, // 3 minutes
  });

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Users', isCurrent: true }
    ],
    title: 'Users',
    actions: [
      {
        id: 'refresh',
        label: '',
        icon: 'RefreshCw',
        variant: 'outline',
        size: 'sm',
        onClick: refreshUsers,
        loading: loading,
        disabled: loading,
        tooltip: loading ? 'Refreshing...' : error ? 'Retry loading users' : 'Refresh users',
        className: error ? 'border-destructive text-destructive hover:bg-destructive/10' : ''
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Users help'
  }, [loading, error]);

  debug.info('Users page state:', {
    usersCount: users?.length || 0,
    loading,
    hasError: !!error,
    selectedCount: selectedUsers.size
  });

  const handleCreateUser = async (userData) => {
    debug.info('Creating user:', userData.email);
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsCreateUserOpen(false);
      setToastProps({
        variant: "success",
        title: "User Created",
        description: "The user has been successfully created."
      });
      setShowToast(true);
      debug.info('User created successfully:', userData.email);
      debug.info('List will update automatically via real-time events');
    } catch (error) {
      debug.error('Failed to create user:', error);
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to create user."
      });
      setShowToast(true);
    }
  };

  const handleUpdateUser = async (userData) => {
    debug.info('Updating user:', editingUser.id);
    try {
      await dispatch(updateUser({ id: editingUser.id, input: userData })).unwrap();
      setIsEditUserOpen(false);
      setToastProps({
        variant: "success",
        title: "User Updated",
        description: "The user has been successfully updated."
      });
      setShowToast(true);
      debug.info('User updated successfully:', editingUser.id);
      debug.info('List will update automatically via real-time events');
    } catch (error) {
      debug.error('Failed to update user:', error);
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to update user."
      });
      setShowToast(true);
    }
  };

  const handleAvatarUpdate = async (avatarPath) => {
    console.log('🎯 handleAvatarUpdate called with:', { avatarPath, editingUserId: editingUser?.id });

    if (!editingUser?.id) {
      console.error('❌ No editing user ID available');
      setToastProps({
        variant: "error",
        title: "Error",
        description: "No user selected for update."
      });
      setShowToast(true);
      return;
    }

    try {
      console.log('🔄 Dispatching updateUser with avatar only...', {
        userId: editingUser.id,
        avatarPath,
        userRole: editingUser.role,
        fullEditingUser: editingUser
      });

      // Send ONLY the avatar field, no other user data
      const avatarOnlyInput = { avatar: avatarPath };
      console.log('📤 Final input being sent:', { id: editingUser.id, input: avatarOnlyInput });

      await dispatch(updateUser({ id: editingUser.id, input: avatarOnlyInput })).unwrap();
      console.log('✅ Avatar update successful');

      // Update local state
      setEditingUser(prev => ({
        ...prev,
        avatar: avatarPath
      }));

      // Show subtle success feedback
      setToastProps({
        variant: "success",
        title: "Avatar Updated",
        description: "Your profile picture has been updated."
      });
      setShowToast(true);

      // List will update automatically via real-time events
      debug.info('Avatar updated, list will update via real-time events');
    } catch (error) {
      console.error('❌ Avatar update failed:', error);
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to update avatar."
      });
      setShowToast(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      setIsDeleteDialogOpen(false);
      setToastProps({
        variant: "success",
        title: "User Deleted",
        description: "The user has been successfully deleted."
      });
      setShowToast(true);
    } catch (error) {
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to delete user."
      });
      setShowToast(true);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedUsers).map(userId =>
        dispatch(deleteUser(userId)).unwrap()
      );
      await Promise.all(deletePromises);
      setSelectedUsers(new Set());
      setToastProps({
        variant: "success",
        title: "Users Deleted",
        description: "Selected users have been successfully deleted."
      });
      setShowToast(true);
    } catch (error) {
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to delete users."
      });
      setShowToast(true);
    }
  };

  const columns = [
    { key: "username", label: "Username" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" }
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">
          {error.message || 'Failed to load users'}
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      {showToast && (
        <Toast variant={toastProps.variant} onOpenChange={setShowToast}>
          <ToastTitle>{toastProps.title}</ToastTitle>
          <ToastDescription>{toastProps.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport />


      <div className="size-container mt-6">
        {/* User Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsCreateUserOpen(true)}
              className="size-button gap-2"
            >
              Add User
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="size-button gap-2">
                  <BiSortAlt2 className="size-icon" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-medium">
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Role</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="size-container">
        {/* Search and Filters */}
        <div className="size-padding">
          <div className="glass-medium size-card-padding radius-fluent-md elevation-2">
            <div className="flex flex-wrap items-center size-gap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Input
                    placeholder="Search users by name, email..."
                    className="size-input"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[150px] size-input">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="glass-medium">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="size-padding">
          {loading ? (
            <div className="glass-medium size-card-padding radius-fluent-lg elevation-2 flex items-center justify-center">
              <div className="flex items-center size-gap">
                <Spinner size="lg" />
                <span className="size-text text-glass-text-secondary">Loading users...</span>
              </div>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="glass-medium size-card-padding radius-fluent-lg elevation-2 text-center">
              <div className="size-gap flex flex-col items-center">
                <div className="size-avatar bg-muted rounded-full flex items-center justify-center">
                  <Avatar className="size-icon" />
                </div>
                <div>
                  <h3 className="size-heading text-glass-text-primary">No Users Found</h3>
                  <p className="size-text text-glass-text-secondary">Get started by adding your first user to the system.</p>
                </div>
                <Button onClick={() => setIsCreateUserOpen(true)} className="size-button">
                  Add User
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-medium radius-fluent-lg elevation-2 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-glass-text-primary/10">
                    <TableHead className="size-text text-glass-text-primary font-semibold size-padding">User</TableHead>
                    <TableHead className="size-text text-glass-text-primary font-semibold">Name</TableHead>
                    <TableHead className="size-text text-glass-text-primary font-semibold">Email</TableHead>
                    <TableHead className="size-text text-glass-text-primary font-semibold">Role</TableHead>
                    <TableHead className="size-text text-glass-text-primary font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-glass-text-primary/10 hover:bg-glass-text-primary/5">
                      <TableCell className="size-padding">
                        <div className="flex items-center size-gap">
                          <Avatar
                            className="size-avatar"
                            email={user.email}
                            fallback={`${user.firstName} ${user.lastName}`}
                          />
                          <div>
                            <div className="size-text font-medium text-glass-text-primary">{user.email}</div>
                            <div className="size-small text-glass-text-secondary">@{user.email.split('@')[0]}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="size-text text-glass-text-primary">
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="size-text text-glass-text-secondary">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "size-badge inline-flex items-center rounded-full font-medium",
                          user.role === 'ADMIN'
                            ? "bg-brand-celeste-100 text-brand-celeste-800 border border-brand-celeste-200"
                            : "bg-muted text-muted-foreground border border-border"
                        )}>
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-3 text-glass-text-secondary hover:text-glass-text-primary hover:bg-glass-text-primary/10"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setIsEditUserOpen(true);
                                  }}
                                >
                                  <span className="text-sm">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="glass-strong">
                                <p>Edit User</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <RiDeleteBin5Line className="w-6 h-6" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="glass-strong">
                                <p>Delete User</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {selectedUsers.size > 0 && (
          <div className="size-padding">
            <div className="glass-subtle size-card-padding radius-fluent-md elevation-1">
              <div className="flex items-center justify-between">
                <span className="size-text text-glass-text-primary">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="size-button"
                >
                  Delete Selected ({selectedUsers.size})
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={(open) => {
        setIsCreateUserOpen(open);
        if (open) {
          // Reset form when opening
          setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            role: 'USER'
          });
        }
      }}>
        <DialogContent className="glass-strong z-1000 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="size-heading text-glass-text-primary">Create User</DialogTitle>
            <DialogDescription className="size-text text-glass-text-secondary">
              Add a new user to the system. User can set their avatar from their profile later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid size-gap size-padding">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="size-text text-glass-text-primary">
                First Name
              </Label>
              <Input
                id="firstName"
                className="size-input"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="size-text text-glass-text-primary">
                Last Name
              </Label>
              <Input
                id="lastName"
                className="size-input"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="size-text text-glass-text-primary">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="size-input"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="size-text text-glass-text-primary">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="size-input"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation" className="size-text text-glass-text-primary">
                Confirm Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                className="size-input"
                value={newUser.passwordConfirmation}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  passwordConfirmation: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="size-text text-glass-text-primary">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser(prev => ({
                  ...prev,
                  role: value
                }))}
              >
                <SelectTrigger className="size-input">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="glass-medium">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="size-gap">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateUserOpen(false);
                setNewUser({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  passwordConfirmation: '',
                  role: 'USER'
                });
              }}
              className="size-button"
            >
              Cancel
            </Button>
            <Button
              className="size-button"
              onClick={() => {
                if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.passwordConfirmation) {
                  setToastProps({
                    variant: "error",
                    title: "Validation Error",
                    description: "Please fill in all required fields."
                  });
                  setShowToast(true);
                  return;
                }

                if (newUser.password !== newUser.passwordConfirmation) {
                  setToastProps({
                    variant: "error",
                    title: "Validation Error",
                    description: "Passwords do not match."
                  });
                  setShowToast(true);
                  return;
                }

                handleCreateUser(newUser);
                setNewUser({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  passwordConfirmation: '',
                  role: 'USER'
                });
              }}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserOpen}
        onOpenChange={(open) => {
          setIsEditUserOpen(open);
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="glass-strong z-1000 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="size-heading text-glass-text-primary">Edit User</DialogTitle>
            <DialogDescription className="size-text text-glass-text-secondary">
              Make changes to the user's information
            </DialogDescription>
          </DialogHeader>
          <div className="grid size-gap size-padding">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="size-text text-glass-text-primary">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editingUser?.firstName ?? ""}
                className="size-input"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    firstName: e.target.value
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="size-text text-glass-text-primary">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editingUser?.lastName ?? ""}
                className="size-input"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    lastName: e.target.value
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="size-text text-glass-text-primary">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                className="size-input"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    password: e.target.value
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation" className="size-text text-glass-text-primary">
                Confirm Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                className="size-input"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    passwordConfirmation: e.target.value
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="size-text text-glass-text-primary">
                Role
              </Label>
              <Select
                value={editingUser?.role ?? "USER"}
                onValueChange={(value) => {
                  setEditingUser(prev => ({
                    ...prev,
                    role: value
                  }));
                }}
              >
                <SelectTrigger className="size-input">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="glass-medium">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="size-text text-glass-text-primary">
                Avatar
              </Label>
              <div className="glass-subtle size-card-padding radius-fluent-md">
                <p className="size-text text-glass-text-secondary">
                  Avatar can be updated from the user's profile page.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="size-button" onClick={() => {
              if ((editingUser?.password || editingUser?.passwordConfirmation) &&
                  (!editingUser?.password || !editingUser?.passwordConfirmation)) {
                setToastProps({ variant: "error", title: "Validation Error", description: "Please fill out both password fields." });
                setShowToast(true);
                return;
              }
              if (editingUser?.password && editingUser?.passwordConfirmation && editingUser.password !== editingUser.passwordConfirmation) {
                setToastProps({ variant: "error", title: "Validation Error", description: "Passwords do not match." });
                setShowToast(true);
                return;
              }
              const userData = {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                role: editingUser.role,
                // Avatar can be updated from the user's profile page
                ...(editingUser.password && editingUser.passwordConfirmation && {
                  password: editingUser.password,
                  passwordConfirmation: editingUser.passwordConfirmation
                })
              };
              handleUpdateUser(userData);
            }}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle className="size-heading text-glass-text-primary">Delete Confirmation</DialogTitle>
            <DialogDescription className="size-text text-glass-text-secondary">
              {userToDelete
                ? `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`
                : `Are you sure you want to delete ${selectedUsers.size} selected users?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="size-gap">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="size-button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                userToDelete
                  ? handleDeleteUser(userToDelete.id)
                  : handleDeleteSelected()
              }
              className="size-button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ToastProvider>
  );
};

export default UsersPage;
