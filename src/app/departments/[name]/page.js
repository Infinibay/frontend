"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { 
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SecuritySection from './components/SecuritySection';

// UI Components
import { UserPc } from "@/components/ui/user-pc";
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header";
import { Button } from '@/components/ui/button';
import { PcDetails } from "@/components/ui/pc-details";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";

// Icons
import { BsPlusLg } from 'react-icons/bs';

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
import { fetchDepartmentByName } from "@/state/slices/departments";

const DepartmentPage = () => {
  const params = useParams();
  const { size } = useSizeContext();
  const dispatch = useDispatch();
  
  // UI State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("computers");

  // Redux selectors
  const department = useSelector((state) =>
    state.departments.items.find(d => d.name.toLowerCase() === params.name.toLowerCase())
  );
  const machines = useSelector((state) =>
    state.vms.items.filter(vm => vm.department?.name?.toLowerCase() === params.name.toLowerCase())
  );
  const selectedPc = useSelector((state) => state.vms.selectedMachine);
  const loading = useSelector((state) => state.vms.loading);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchVms());
    dispatch(fetchDepartmentByName(params.name));
  }, [dispatch, params.name]);

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
    dispatch(selectMachine(machine));
    setDetailsOpen(true);
  };

  // Handle details sheet close
  const handleDetailsClose = (open) => {
    setDetailsOpen(open);
    if (!open) {
      dispatch(deselectMachine());
    }
  };

  // Handle machine control actions
  const handlePlay = async () => {
    if (selectedPc) {
      await dispatch(playVm({ id: selectedPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handlePause = async () => {
    if (selectedPc) {
      await dispatch(pauseVm({ id: selectedPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handleStop = async () => {
    if (selectedPc) {
      await dispatch(stopVm({ id: selectedPc.vmId }));
      dispatch(fetchVms());
    }
  };

  const handleDelete = async (vmId) => {
    try {
      await dispatch(deleteVm({ id: vmId })).unwrap();
      dispatch(fetchVms());
      dispatch(deselectMachine());
      setDetailsOpen(false);
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

  return (
    <div className="flex flex-col h-full">
      <ToastProvider>
        {showToast && (
          <Toast variant={toastProps.variant} onOpenChange={setShowToast}>
            <ToastTitle>{toastProps.title}</ToastTitle>
            <ToastDescription>{toastProps.description}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>

      <Header className="border-b">
        <HeaderLeft>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{params.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-gray-800">
            {department?.name || params.name}
          </h1>
        </HeaderCenter>
        <HeaderRight>
          <Link href={`/departments/${params.name}/computers/create`}>
            <Button variant="success" className="gap-2">
              <BsPlusLg />
              New Computer
            </Button>
          </Link>
        </HeaderRight>
      </Header>

      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="computers">Computers</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <TabsContent value="computers" className="m-0 h-full">
              <section id="department-computers" className={cn(sizeVariants[size].spacing.container)}>
                <div className="flex flex-wrap gap-6">
                  {machines?.map((machine) => (
                    <div className="w-min" key={machine.id}>
                      <UserPc
                        name={machine.name}
                        status={machine.status?.toLowerCase()}
                        selected={selectedPc?.id === machine.id}
                        onClick={() => handlePcSelect(machine)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="security" className="m-0 h-full">
              <SecuritySection />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* PC Details Sheet */}
      {selectedPc && (
        <PcDetails 
          pc={selectedPc}
          open={detailsOpen} 
          onOpenChange={handleDetailsClose}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onDelete={handleDelete}
          size={size}
        />
      )}
    </div>
  );
};

export default DepartmentPage;