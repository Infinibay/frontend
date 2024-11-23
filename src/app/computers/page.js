"use client";

// React and hooks
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";

// UI Components
import { UserPc } from "@/components/ui/user-pc";
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { PcDetails } from "@/components/ui/pc-details";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";

// Icons
import { BsGrid, BsPlusLg } from "react-icons/bs";

// Redux actions
import { 
  fetchVms, 
  selectMachine, 
  deselectMachine,
  playVm,
  pauseVm,
  stopVm
} from "@/state/slices/vms";

// Helper functions
const generateGroupedMachines = (byDepartment, machines) => {
  if (!byDepartment) return { All: machines };
  
  return machines.reduce((acc, machine) => {
    const department = machine.department || "Uncategorized";
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(machine);
    return acc;
  }, {});
};

const Page = () => {
  // Get current size context
  const { size } = useSizeContext();

  // UI State
  const [grid, setGrid] = useState(false);
  const [byDepartment, setByDepartment] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const machines = useSelector((state) => state.vms.items);
  const selectedPc = useSelector((state) => state.vms.selectedMachine);
  const loading = useSelector((state) => state.vms.loading);

  // Fetch machines on mount
  useEffect(() => {
    dispatch(fetchVms());
  }, [dispatch]);

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
    console.log("Selected machine:", machine);
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
      await dispatch(playVm({ id: selectedPc.id }));
    }
  };

  const handlePause = async () => {
    if (selectedPc) {
      await dispatch(pauseVm({ id: selectedPc.id }));
    }
  };

  const handleStop = async () => {
    if (selectedPc) {
      await dispatch(stopVm({ id: selectedPc.id }));
    }
  };

  return (
    <>
      <Header variant="glass" elevated>
        <HeaderLeft>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Computers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-gray-800">
            Computers
          </h1>
        </HeaderCenter>
        <HeaderRight>
          <Link href="/computers/new">
            <Button variant="success" className="gap-2">
              <BsPlusLg />
              New Computer
            </Button>
          </Link>
        </HeaderRight>
      </Header>
      <section id="computers" className={cn(sizeVariants[size].spacing.container)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {machines?.map((machine) => (
            <UserPc
              key={machine.id}
              name={machine.name}
              status={machine.status?.toLowerCase()}
              selected={selectedPc?.id === machine.id}
              onClick={() => handlePcSelect(machine)}
            />
          ))}
        </div>
      </section>

      {/* PC Details Sheet */}
      {selectedPc && (
        <PcDetails 
          open={detailsOpen} 
          onOpenChange={handleDetailsClose}
          machine={selectedPc}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          pc={{
            name: selectedPc.name,
            status: selectedPc.status,
          }}
        />
      )}
    </>
  );
};

export default Page;
