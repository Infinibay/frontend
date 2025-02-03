"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  selectUsers, 
  selectUsersLoading, 
  selectUsersError 
} from "@/state/slices/users";

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
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
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import { Toast, ToastProvider, ToastTitle, ToastDescription, ToastViewport } from "@/components/ui/toast";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { size } = useSizeContext();
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const users = useSelector(selectUsers);
  const loading = useSelector((state) => state.users.loading?.fetch);
  const error = useSelector(selectUsersError);
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

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsCreateUserOpen(false);
      setToastProps({
        variant: "success",
        title: "User Created",
        description: "The user has been successfully created."
      });
      setShowToast(true);
      dispatch(fetchUsers());
    } catch (error) {
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to create user."
      });
      setShowToast(true);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await dispatch(updateUser({ id: editingUser.id, input: userData })).unwrap();
      setIsEditUserOpen(false);
      setToastProps({
        variant: "success",
        title: "User Updated",
        description: "The user has been successfully updated."
      });
      setShowToast(true);
      dispatch(fetchUsers());
    } catch (error) {
      setToastProps({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to update user."
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

  if (error.fetch) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">
          {error.fetch}
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

      <Header variant="glass" elevated>
        <HeaderLeft>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-gray-800">
            Users Management
          </h1>
        </HeaderCenter>
        <HeaderRight>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsCreateUserOpen(true)}
              variant="primary"
              className="gap-2"
            >
              Add User
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <BiSortAlt2 className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Role</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HeaderRight>
      </Header>

      <div className={cn("p-6", sizeVariants[size].spacing.container)}>
        <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={`${user.firstName[0]}${user.lastName[0]}`}
                        />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingUser(user);
                                  setIsEditUserOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit User</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <RiDeleteBin5Line className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete User</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        {selectedUsers.size > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Selected ({selectedUsers.size})
            </Button>
          </div>
        )}
      </div>

      {/* Create User Sheet */}
      <Sheet open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create User</SheetTitle>
            <SheetDescription>
              Add a new user to the system
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                className="col-span-3"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                className="col-span-3"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passwordConfirmation" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                className="col-span-3"
                value={newUser.passwordConfirmation}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  passwordConfirmation: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser(prev => ({
                  ...prev,
                  role: value
                }))}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={() => {
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
            }}>
              Create User
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Make changes to the user's information
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                defaultValue={editingUser?.firstName}
                className="col-span-3"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    firstName: e.target.value
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                defaultValue={editingUser?.lastName}
                className="col-span-3"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    lastName: e.target.value
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    password: e.target.value
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passwordConfirmation" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                className="col-span-3"
                onChange={(e) => {
                  setEditingUser(prev => ({
                    ...prev,
                    passwordConfirmation: e.target.value
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                defaultValue={editingUser?.role}
                className="col-span-3"
                onValueChange={(value) => {
                  setEditingUser(prev => ({
                    ...prev,
                    role: value
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={() => {
              const userData = {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                role: editingUser.role,
                ...(editingUser.password && editingUser.passwordConfirmation && {
                  password: editingUser.password,
                  passwordConfirmation: editingUser.passwordConfirmation
                })
              };
              handleUpdateUser(userData);
            }}>
              Update User
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              {userToDelete
                ? `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`
                : `Are you sure you want to delete ${selectedUsers.size} selected users?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
