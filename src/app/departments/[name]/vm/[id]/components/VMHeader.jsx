import React, { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Header, HeaderLeft, HeaderRight } from '@/components/ui/header';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Play, Square, RotateCcw, Network, Globe, Home, Copy, Check, Cpu, MemoryStick, HardDrive, Edit3, X, ChevronDown, User, UserX } from 'lucide-react';
import { useVMNetworkRealTime } from '@/components/vm/hooks/useVMNetworkRealTime';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-header');

/**
 * Header component for the VM detail page
 */
const VMHeader = ({
  vm,
  departmentName,
  onPowerAction,
  onRefresh,
  isAdmin = false,
  onHardwareUpdate,
  onNameUpdate,
  onUserUpdate,
  hardwareUpdateLoading = false,
  nameUpdateLoading = false,
  userUpdateLoading = false,
  users = [],
  usersLoading = false,
  usersError = null
}) => {
  if (!vm) {
    debug.warn('VMHeader rendered without VM data');
    return null;
  }

  debug.log('VMHeader rendered', { vmName: vm.name, status: vm.status });

  // State for inline editing
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'default'; // Green
      case 'stopped':
      case 'shutoff':
        return 'secondary'; // Gray
      case 'paused':
      case 'suspended':
        return 'outline'; // Yellow outline
      default:
        return 'destructive'; // Red
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'Running';
      case 'stopped':
      case 'shutoff':
        return 'Stopped';
      case 'paused':
        return 'Paused';
      case 'suspended':
        return 'Suspended';
      default:
        return status || 'Unknown';
    }
  };

  // Format creation date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format hardware values
  const formatRAM = (ramMB) => {
    if (!ramMB) return 'Not available';
    const ramGB = ramMB / 1024;
    return ramGB >= 1 ? `${ramGB.toFixed(ramGB % 1 === 0 ? 0 : 1)} GB` : `${ramMB} MB`;
  };

  const formatStorage = (storageGB) => {
    if (!storageGB) return 'Not available';
    return `${storageGB} GB`;
  };

  const formatCPU = (cores) => {
    if (!cores) return 'Not available';
    return `${cores} ${cores === 1 ? 'core' : 'cores'}`;
  };

  // Helper functions for inline editing
  const startEditing = (field, currentValue) => {
    if (!isAdmin || vm.status?.toLowerCase() === 'running') return;
    setEditingField(field);
    setEditValue(currentValue.toString());
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
    setUserSelectorOpen(false);
    setUserSearchQuery('');
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;

    if (editingField === 'name') {
      if (!onNameUpdate) return;
      onNameUpdate(editValue.trim());
    } else {
      if (!onHardwareUpdate) return;
      const value = parseInt(editValue, 10);
      if (isNaN(value) || value <= 0) return;

      if (editingField === 'ram') {
        onHardwareUpdate({ ramGB: value });
      } else if (editingField === 'cpu') {
        onHardwareUpdate({ cpuCores: value });
      }
    }

    cancelEditing();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Handle user selection
  const handleUserSelection = (userId) => {
    const finalUserId = userId === 'unassign' ? null : userId;
    onUserUpdate && onUserUpdate(finalUserId);
    setUserSelectorOpen(false);
    setUserSearchQuery('');
    cancelEditing();
  };

  // Filter users based on search query
  const filteredUsers = userSearchQuery.trim() === ''
    ? users
    : users.filter(user => {
        const searchLower = userSearchQuery.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower);
      });

  // Get current user display
  const getCurrentUserDisplay = () => {
    if (vm.user) {
      return {
        avatar: vm.user.avatar,
        initials: `${vm.user.firstName?.[0] || ''}${vm.user.lastName?.[0] || ''}`,
        name: `${vm.user.firstName || ''} ${vm.user.lastName || ''}`.trim(),
        hasUser: true
      };
    }
    return {
      avatar: null,
      initials: '?',
      name: 'Not assigned',
      hasUser: false
    };
  };

  const currentUserDisplay = getCurrentUserDisplay();

  // Debug users loading
  debug.log('Users data', { users, usersLoading, usersError, isAdmin });
  console.log('🔍 VMHeader Debug:', {
    usersCount: users.length,
    usersLoading,
    usersError,
    isAdmin,
    users: users.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email }))
  });

  if (usersLoading && isAdmin) {
    debug.log('Loading users...');
  }

  if (usersError && isAdmin) {
    debug.error('Users error:', usersError);
  }

  if (users.length > 0) {
    debug.log('Users loaded:', users.length);
  } else if (isAdmin && !usersLoading && !usersError) {
    debug.warn('No users loaded or available');
  }


  const isRunning = vm.status?.toLowerCase() === 'running';
  const isStopped = vm.status?.toLowerCase() === 'stopped' || vm.status?.toLowerCase() === 'shutoff';

  // Use VM's department name for consistent navigation
  const deptName = vm?.department?.name || departmentName;

  // Get hardware specs from VM data or fallback to template
  const ram = vm?.ramGB ? vm.ramGB * 1024 : vm?.template?.ram; // Convert GB to MB for display
  const cores = vm?.cpuCores || vm?.template?.cores;
  const storage = vm?.template?.storage; // Storage comes from template

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb navigation */}
      <Header className="glass-minimal border-border/20">
        <HeaderLeft>
          <Link href={`/departments/${encodeURIComponent(deptName)}`} className="mr-3">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/departments/${encodeURIComponent(deptName)}`}>
                  {deptName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{vm.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
      </Header>

      {/* VM Info and Controls Card */}
      <Card glass="minimal" elevation="2" className="border-border/20">
        <CardContent className="size-card-padding">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              {/* VM Name and Status */}
              <div className="flex items-center gap-3">
                {isAdmin && editingField === 'name' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEdit}
                      className="size-mainheading px-2 py-1 border border-border rounded bg-background"
                      autoFocus
                      maxLength={100}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-2 ${
                      isAdmin ? 'cursor-pointer hover:bg-accent/50 px-2 py-1 rounded' : ''
                    }`}
                    onClick={() => isAdmin && startEditing('name', vm.name)}
                    title={isAdmin ? 'Click to edit VM name' : undefined}
                  >
                    <h1 className="size-mainheading">{vm.name}</h1>
                    {isAdmin && nameUpdateLoading ? (
                      <div className="animate-spin h-4 w-4 border border-brand-dark-blue border-t-transparent rounded-full ml-1"></div>
                    ) : isAdmin ? (
                      <Edit3 className="h-4 w-4 ml-1 opacity-50" />
                    ) : null}
                  </div>
                )}
                <Badge variant={getStatusVariant(vm.status)} className="size-text">
                  {getStatusText(vm.status)}
                </Badge>
              </div>

              {/* VM Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 size-gap size-text">
                <div className="space-y-1">
                  <span className="text-muted-foreground">User:</span>
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <Popover open={userSelectorOpen} onOpenChange={setUserSelectorOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`h-auto p-2 justify-start gap-2 ${
                              userUpdateLoading ? 'pointer-events-none' : 'hover:bg-accent/50'
                            }`}
                            disabled={userUpdateLoading || usersLoading}
                          >
                            {currentUserDisplay.hasUser ? (
                              <>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={currentUserDisplay.avatar}
                                    alt={currentUserDisplay.name}
                                  />
                                  <AvatarFallback>
                                    {currentUserDisplay.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{currentUserDisplay.name}</span>
                              </>
                            ) : (
                              <>
                                <User className="h-6 w-6 text-muted-foreground" />
                                <span className="font-medium text-muted-foreground">{currentUserDisplay.name}</span>
                              </>
                            )}
                            {userUpdateLoading ? (
                              <div className="animate-spin h-3 w-3 border border-brand-dark-blue border-t-transparent rounded-full ml-1"></div>
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search users..."
                              value={userSearchQuery}
                              onValueChange={setUserSearchQuery}
                            />
                            <CommandList>
                              {usersLoading ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  Loading users...
                                </div>
                              ) : users.length === 0 ? (
                                <CommandEmpty>No users available.</CommandEmpty>
                              ) : filteredUsers.length === 0 ? (
                                <CommandEmpty>No users found.</CommandEmpty>
                              ) : (
                                <CommandGroup>
                                  {/* Unassign option */}
                                  <CommandItem
                                    onSelect={() => handleUserSelection('unassign')}
                                    className="cursor-pointer hover:bg-accent"
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <div className="flex items-center justify-center h-4 w-4">
                                        <UserX className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <span className="text-muted-foreground">Unassign user</span>
                                    </div>
                                  </CommandItem>

                                  {/* User options */}
                                  {filteredUsers.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={`${user.firstName} ${user.lastName} ${user.email}`}
                                      onSelect={() => handleUserSelection(user.id)}
                                      className="cursor-pointer hover:bg-accent !opacity-100"
                                      style={{ opacity: 1 }}
                                    >
                                      <div className="flex items-center gap-2 w-full">
                                        <Avatar className="h-4 w-4">
                                          <AvatarFallback className="text-xs">
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="font-medium text-foreground" style={{ opacity: 1 }}>
                                            {user.firstName} {user.lastName}
                                          </span>
                                          <span className="text-xs text-muted-foreground" style={{ opacity: 1 }}>
                                            {user.email}
                                          </span>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="flex items-center gap-2">
                        {currentUserDisplay.hasUser ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={currentUserDisplay.avatar}
                                alt={currentUserDisplay.name}
                              />
                              <AvatarFallback>
                                {currentUserDisplay.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{currentUserDisplay.name}</span>
                          </>
                        ) : (
                          <>
                            <User className="h-6 w-6 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">{currentUserDisplay.name}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">{formatDate(vm.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Template:</span>
                  <p className="font-medium">{vm.template?.name || 'Not available'}</p>
                </div>
              </div>

              {/* Hardware Summary */}
              <div className="flex items-center size-gap size-text">
                {/* CPU */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  <span>CPU: </span>
                  {isAdmin && !isRunning && editingField === 'cpu' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={saveEdit}
                        className="w-16 px-1 py-0 text-sm border border-border rounded bg-background"
                        min="1"
                        max="128"
                        autoFocus
                      />
                      <span className="text-xs">cores</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={cancelEditing}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1 ${
                        isAdmin && !isRunning ? 'cursor-pointer hover:bg-accent/50 px-1 py-0.5 rounded' : ''
                      }`}
                      onClick={() => isAdmin && !isRunning && startEditing('cpu', cores)}
                      title={isAdmin && !isRunning ? 'Click to edit' : isRunning ? 'Stop VM to edit' : undefined}
                    >
                      <span className="font-medium">{formatCPU(cores)}</span>
                      {isAdmin && !isRunning && hardwareUpdateLoading ? (
                        <div className="animate-spin h-3 w-3 border border-brand-dark-blue border-t-transparent rounded-full ml-1"></div>
                      ) : isAdmin && !isRunning ? (
                        <Edit3 className="h-3 w-3 ml-1 opacity-50" />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* RAM */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MemoryStick className="h-4 w-4" />
                  <span>RAM: </span>
                  {isAdmin && !isRunning && editingField === 'ram' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={saveEdit}
                        className="w-16 px-1 py-0 text-sm border border-border rounded bg-background"
                        min="1"
                        max="512"
                        autoFocus
                      />
                      <span className="text-xs">GB</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={cancelEditing}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1 ${
                        isAdmin && !isRunning ? 'cursor-pointer hover:bg-accent/50 px-1 py-0.5 rounded' : ''
                      }`}
                      onClick={() => isAdmin && !isRunning && startEditing('ram', Math.round(ram / 1024))}
                      title={isAdmin && !isRunning ? 'Click to edit' : isRunning ? 'Stop VM to edit' : undefined}
                    >
                      <span className="font-medium">{formatRAM(ram)}</span>
                      {isAdmin && !isRunning && hardwareUpdateLoading ? (
                        <div className="animate-spin h-3 w-3 border border-brand-dark-blue border-t-transparent rounded-full ml-1"></div>
                      ) : isAdmin && !isRunning ? (
                        <Edit3 className="h-3 w-3 ml-1 opacity-50" />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Storage (read-only) */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="h-4 w-4" />
                  <span>Storage: {formatStorage(storage)}</span>
                </div>
              </div>

              {/* Network Information */}
              <NetworkInfoSection vm={vm} />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center size-gap">
              {/* Start button */}
              {isStopped && (
                <Button
                  onClick={() => {
                    debug.log('Starting VM', { vmId: vm.id });
                    onPowerAction('start');
                  }}
                  variant="default"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}

              {/* Stop button */}
              {isRunning && (
                <Button
                  onClick={() => {
                    debug.log('Stopping VM', { vmId: vm.id });
                    onPowerAction('stop');
                  }}
                  variant="destructive"
                  size="sm"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}

              {/* Restart button - disabled for now */}
              {/* {isRunning && (
                <Button
                  onClick={() => {
                    debug.log('Restarting VM', { vmId: vm.id });
                    onPowerAction('restart');
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Network Information Section Component
 * Displays IP addresses with connection status and copy functionality
 * Uses real-time network data as fallback when GraphQL doesn't provide IP fields
 */
const NetworkInfoSection = ({ vm }) => {
  const [copiedField, setCopiedField] = useState(null);

  // Get real-time network info as fallback
  const { networkInfo } = useVMNetworkRealTime(vm?.id);

  // Use real-time data as fallback for IP addresses
  const localIP = networkInfo?.localIP || vm?.localIP;
  const publicIP = networkInfo?.publicIP || vm?.publicIP;

  // Compute network status
  const hasAnyIP = Boolean(localIP || publicIP);

  const handleCopyIP = async (ip, field) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1000);
    } catch (error) {
      console.error('Failed to copy IP:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center size-gap size-text">
      {/* Connection Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${hasAnyIP ? 'bg-green-500' : 'bg-gray-300'}`}
          aria-label={hasAnyIP ? 'Connected' : 'Disconnected'}
        />
        <span className="size-xsmall text-muted-foreground">
          {hasAnyIP ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Local IP */}
      <div className="flex items-center gap-2 min-w-0">
        <Home className="size-icon text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">Local IP:</span>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="font-mono truncate" title={localIP || 'Not available'}>
            {localIP || 'Not available'}
          </Badge>
          {localIP && (
            <Button
              variant="ghost"
              size="sm"
              className="size-icon-button p-0"
              onClick={() => handleCopyIP(localIP, 'local')}
              title="Copy local IP"
              aria-label="Copy local IP"
            >
              {copiedField === 'local' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Public IP */}
      <div className="flex items-center gap-2 min-w-0">
        <Globe className="size-icon text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">Public IP:</span>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="font-mono truncate" title={publicIP || 'Not available'}>
            {publicIP || 'Not available'}
          </Badge>
          {publicIP && (
            <Button
              variant="ghost"
              size="sm"
              className="size-icon-button p-0"
              onClick={() => handleCopyIP(publicIP, 'public')}
              title="Copy public IP"
              aria-label="Copy public IP"
            >
              {copiedField === 'public' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VMHeader;
