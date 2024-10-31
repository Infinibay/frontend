"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import { BsGrid } from "react-icons/bs";

// Components
import UserPc from "@/components/dashboard/UserPc";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";

// Redux actions
import { fetchVms, selectMachine, deselectMachine } from "@/state/slices/vms";
import { fetchDepartmentByName } from "@/state/slices/departments";

const DepartmentPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [grid, setGrid] = useState(false);
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Separate selectors to avoid unnecessary re-renders
  const department = useSelector((state) =>
    state.departments.items.find(d => d.name.toLowerCase() === params.name.toLowerCase())
  );
  const machines = useSelector((state) =>
    state.vms.items.filter(vm => vm.department?.name?.toLowerCase() === params.name.toLowerCase())
  );
  const selectedPc = useSelector((state) => state.vms.selectedMachine);

  // Handle machine selection
  const handleMachineSelect = (machine) => {
    dispatch(selectMachine(machine));
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isOpen) {
          onClose();
        } else if (selectedPc) {
          dispatch(deselectMachine());
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, isOpen, selectedPc, onClose]);

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        {/* Header */}
        <div className="border-b py-6">
          <div className="dashboard_container flex items-center justify-between w-full">
            <h1 className="5xl:text-3xl text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Department: <span className="font-bold text-web_dark">{department.name}</span>
            </h1>
            <div className="flex items-center space-x-4">
              <BsGrid
                onClick={() => setGrid(!grid)}
                className={`
                  2xl:w-12 cursor-pointer border 2xl:h-12 h-10 w-10 p-[7px] 
                  rounded-xl border-web_aquablue/20 transitioncustom
                  ${grid
                    ? "bg-web_aquablue/20 text-web_aquablue"
                    : "text-web_placeHolder bg-white"
                  }
                `}
              />
            </div>
          </div>
        </div>

        {/* Machine Grid */}
        <div className="dashboard_container flex-1">
          <div className="flex gap-10 flex-wrap mt-8 w-full">
            {machines.map((machine) => (
              <div
                key={machine.id}
                onClick={() => handleMachineSelect(machine)}
                className="cursor-pointer"
              >
                <UserPc 
                  key={`${machine.id}-${selectedPc?.id === machine.id}`}
                  selectedPc={selectedPc} 
                  pc={machine} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel */}
      {selectedPc && <PcDetails onOpen={onOpen} />}
      
      {/* Modal */}
      <PcModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default DepartmentPage;