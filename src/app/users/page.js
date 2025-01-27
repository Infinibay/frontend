"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";

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

const UsersPage = () => {
  const { size } = useSizeContext();
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [users, setUsers] = useState(initialUsers);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    setToastProps({
      variant: "success",
      title: "User Deleted",
      description: "The user has been successfully deleted."
    });
    setShowToast(true);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedUsers.has(user.id.toString()));
    setUsers(updatedUsers);
    setSelectedUsers(new Set());
    setToastProps({
      variant: "success",
      title: "Users Deleted",
      description: "Selected users have been successfully deleted."
    });
    setShowToast(true);
  };

  const columns = [
    { key: "username", label: "Username" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" }
  ];

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
                <DropdownMenuItem>Department</DropdownMenuItem>
                <DropdownMenuItem>Role</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HeaderRight>
      </Header>

      <div className={cn("p-6", sizeVariants[size].spacing.container)}>
        <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border">
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
                        src={user.avatar || "/images/profileIcon.png"}
                        fallback={user.username[0]}
                      />
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              {userToDelete
                ? `Are you sure you want to delete ${userToDelete.username}?`
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
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete.id);
                } else {
                  handleDeleteSelected();
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Sheet */}
      <Sheet open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>Add a new user to the system.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Input
              label="Username"
              placeholder="Enter username"
            />
            <Input
              label="Full Name"
              placeholder="Enter full name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
            />
            {/* Add more fields as needed */}
          </div>
          <SheetFooter>
            <Button type="submit">Create User</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>Modify user information.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Input
              label="Username"
              defaultValue={editingUser?.username}
            />
            <Input
              label="Full Name"
              defaultValue={editingUser?.name}
            />
            <Input
              label="Email"
              type="email"
              defaultValue={editingUser?.email}
            />
            {/* Add more fields as needed */}
          </div>
          <SheetFooter>
            <Button type="submit">Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </ToastProvider>
  );
};

const initialUsers = [
  {
    id: 1,
    username: "john.doe",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    role: "Developer",
    avatar: "/images/profileIcon.png"
  },
  {
    id: 2,
    username: "jane.smith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Design",
    role: "Designer",
    avatar: "/images/profileIcon.png"
  },
  // Add more users as needed
];

export default UsersPage;
