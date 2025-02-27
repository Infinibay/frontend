"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { 
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { 
  Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

const SecuritySection = dynamic(() => import('./components/SecuritySection.jsx'), { 
  ssr: false,
  loading: () => <div className="p-4">Loading security settings...</div>
});

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// UI Components
import { UserPc } from "@/components/ui/user-pc";
import { Button } from '@/components/ui/button';
import { PcDetails } from "@/components/ui/pc-details";

import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";

// Icons
import { 
  LayoutGrid, 
  List, 
  ChevronDown, 
  ChevronLeft, 
  Plus 
} from 'lucide-react';

// Redux actions
import { 
  fetchVms, 
  selectMachine, 
  deselectMachine,
  playVm,
  pauseVm,
  stopVm,
  deleteVm
} from "@/state/slices/vms";
import { 
  fetchDepartmentByName, 
  fetchDepartments, 
  createDepartment 
} from "@/state/slices/departments";

const DepartmentPage = () => {
  const params = useParams();
  const departmentName = params.name?.toLowerCase();
  const { size } = useSizeContext();
  const dispatch = useDispatch();
  const router = useRouter();
  
  // UI State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("computers");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedPc, setSelectedPc] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Redux state
  const departments = useSelector((state) => state.departments.items);
  const vms = useSelector((state) => state.vms.items);
  const selectedMachineFromRedux = useSelector((state) => state.vms.selectedMachine);
  const departmentsLoading = useSelector((state) => state.departments.loading);
  const vmsLoading = useSelector((state) => state.vms.loading);
  
  // Derived state
  const department = departments.find(d => d.name.toLowerCase() === departmentName);
  const machines = vms.filter(vm => vm.department?.name?.toLowerCase() === departmentName);
  
  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Fetch all departments if not already loaded
      if (departments.length === 0 && !departmentsLoading.fetch) {
        await dispatch(fetchDepartments());
      }
      
      // Fetch specific department data
      if (departmentName) {
        try {
          const result = await dispatch(fetchDepartmentByName(departmentName)).unwrap();
          // If the department wasn't found, we'll get null
          if (!result) {
            console.log(`Department ${departmentName} not found`);
          }
        } catch (error) {
          console.error(`Error fetching department ${departmentName}:`, error);
        }
      }
      
      // Fetch VMs if not already loaded
      if (vms.length === 0 && !vmsLoading.fetch) {
        await dispatch(fetchVms());
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [dispatch, departmentName, departments.length, vms.length, departmentsLoading.fetch, vmsLoading.fetch]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPc) {
        dispatch(deselectMachine());
        setDetailsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedPc]);

  // Handle PC selection
  const handlePcSelect = (machine) => {
    if (!machine) return;
    
    dispatch(selectMachine(machine));
    setDetailsOpen(true);
    setSelectedPc(machine);
  };

  // Handle details sheet close
  const handleDetailsClose = (open) => {
    setDetailsOpen(open);
    if (!open) {
      dispatch(deselectMachine());
      setSelectedPc(null);
    }
  };

  // Handle machine control actions
  const handlePlay = async (pc) => {
    const targetPc = pc || selectedPc;
    if (targetPc) {
      await dispatch(playVm({ id: targetPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handlePause = async (pc) => {
    const targetPc = pc || selectedPc;
    if (targetPc) {
      await dispatch(pauseVm({ id: targetPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handleStop = async (pc) => {
    const targetPc = pc || selectedPc;
    if (targetPc) {
      await dispatch(stopVm({ id: targetPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handleDelete = async (vmId) => {
    if (!vmId) {
      console.error("Cannot delete VM: No VM ID provided");
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the virtual machine: No VM ID provided."
      });
      setShowToast(true);
      return;
    }
    
    try {
      await dispatch(deleteVm({ id: vmId })).unwrap();
      dispatch(fetchVms());
      dispatch(deselectMachine());
      setDetailsOpen(false);
      setSelectedPc(null);
      setToastProps({
        variant: "success",
        title: "VM Deleted",
        description: "The virtual machine has been successfully deleted."
      });
      setShowToast(true);
    } catch (error) {
      console.error("Failed to delete VM:", error);
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the virtual machine. Please try again."
      });
      setShowToast(true);
    }
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "table" : "grid");
  };

  // Sort machines
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Get sorted machines
  const getSortedMachines = () => {
    if (!machines) return [];
    
    return [...machines].sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      } else if (sortBy === "username") {
        valueA = a.user?.name?.toLowerCase() || '';
        valueB = b.user?.name?.toLowerCase() || '';
      }
      
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedMachines = getSortedMachines();

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1 text-xs">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    const trimmedName = newDepartmentName.trim();
    
    if (!trimmedName) {
      setIsCreateDeptDialogOpen(false);
      return;
    }

    try {
      await dispatch(createDepartment({ name: trimmedName })).unwrap();
      dispatch(fetchDepartments());
      setToastProps({
        variant: "success",
        title: "Department Created",
        description: `Department "${trimmedName}" has been successfully created.`
      });
      setShowToast(true);
    } catch (error) {
      console.error("Failed to create department:", error);
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the department. Please try again."
      });
      setShowToast(true);
    }
    
    setNewDepartmentName("");
    setIsCreateDeptDialogOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If department not found
  if (departmentName && !department) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Department Not Found</h2>
          <p className="text-gray-600 mb-6">
            The department "{params.name}" could not be found.
          </p>
          <Button asChild>
            <Link href="/departments">View All Departments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/departments" className="mr-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{department?.name || 'Department'}</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="computers">Computers</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <Button 
                variant="default" 
                size="sm"
                className="ml-2"
                onClick={() => {
                  // Open create computer wizard in the department
                  router.push(`/departments/${departmentName}/new`);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Computer
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleViewMode}
                className="ml-2"
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <TabsContent value="computers" className="mt-0">
            {sortedMachines.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {sortedMachines.map((machine) => (
                      <UserPc
                        key={machine.id}
                        pc={machine}
                        onSelect={() => handlePcSelect(machine)}
                        onPlay={() => handlePlay(machine)}
                        onPause={() => handlePause(machine)}
                        onStop={() => handleStop(machine)}
                        onDelete={() => handleDelete(machine.vmId)}
                        size={size}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th 
                            className="px-4 py-2 text-left cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">
                              Name {renderSortIcon("name")}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-2 text-left cursor-pointer"
                            onClick={() => handleSort("username")}
                          >
                            <div className="flex items-center">
                              User {renderSortIcon("username")}
                            </div>
                          </th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMachines.map((machine) => (
                          <tr 
                            key={machine.id} 
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                          >
                            <td className="px-4 py-2">
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => handlePcSelect(machine)}
                              >
                                <span className="font-medium">{machine.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              {machine.user?.name || 'No user'}
                            </td>
                            <td className="px-4 py-2">
                              <span 
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs",
                                  machine.status === "running" && "bg-green-100 text-green-800",
                                  machine.status === "paused" && "bg-yellow-100 text-yellow-800",
                                  machine.status === "stopped" && "bg-red-100 text-red-800"
                                )}
                              >
                                {machine.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {machine.status !== "running" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePlay(machine)}
                                  >
                                    Start
                                  </Button>
                                )}
                                {machine.status === "running" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePause(machine)}
                                  >
                                    Pause
                                  </Button>
                                )}
                                {machine.status === "running" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleStop(machine)}
                                  >
                                    Stop
                                  </Button>
                                )}
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDelete(machine.vmId)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No computers found</h2>
                <p className="text-gray-500 mb-6">
                  There are no computers in this department yet.
                </p>
                <Button 
                  onClick={() => {
                    // Open create computer wizard in the department
                    router.push(`/departments/${departmentName}/new`);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Computer
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySection departmentId={department?.id} />
          </TabsContent>
        </Tabs>
      </div>

      <PcDetails
        open={detailsOpen}
        onOpenChange={handleDetailsClose}
        pc={selectedPc}
        onPlay={selectedPc ? () => handlePlay(selectedPc) : undefined}
        onPause={selectedPc ? () => handlePause(selectedPc) : undefined}
        onStop={selectedPc ? () => handleStop(selectedPc) : undefined}
        onDelete={selectedPc ? () => handleDelete(selectedPc.vmId) : undefined}
      />

      <Dialog open={isCreateDeptDialogOpen} onOpenChange={setIsCreateDeptDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateDepartment}>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Enter a name for the new department.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                autoFocus
                type="text"
                placeholder="Department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewDepartmentName("");
                  setIsCreateDeptDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {showToast && (
        <Toast
          variant={toastProps.variant}
          onOpenChange={(open) => !open && setShowToast(false)}
        >
          <ToastTitle>{toastProps.title}</ToastTitle>
          <ToastDescription>{toastProps.description}</ToastDescription>
        </Toast>
      )}
      
      <ToastViewport />
    </ToastProvider>
  );
};

export default DepartmentPage;