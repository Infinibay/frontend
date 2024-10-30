"use client";

// React and hooks
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// UI Components
import { Switch, useDisclosure } from "@nextui-org/react";
import UserPc from "@/components/dashboard/UserPc";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";

// Icons
import { BsGrid } from "react-icons/bs";

// Redux actions
import { fetchVms, selectMachine } from "@/state/slices/vms";

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
  // UI State
  const [grid, setGrid] = useState(false);
  const [byDepartment, setByDepartment] = useState(false);
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  // Redux
  const dispatch = useDispatch();
  const groupedMachines = useSelector((state) => 
    generateGroupedMachines(byDepartment, state.vms.items)
  );
  const selectedPc = useSelector((state) => state.vms.selectedMachine);

  // Fetch VMs on component mount
  React.useEffect(() => {
    dispatch(fetchVms());
  }, [dispatch]);

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        {/* Header */}
        <div className="border-b py-6">
          <div className="dashboard_container flex items-center justify-between w-full">
            <h1 className="5xl:text-3xl text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Computer <span className="font-bold text-web_dark">Names</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Switch
                checked={byDepartment}
                onChange={() => setByDepartment(!byDepartment)}
              />
              <span>{byDepartment ? "By Department" : "All"}</span>
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
          {Object.entries(groupedMachines).map(([department, departmentMachines]) => (
            <div key={department}>
              <h2 className="font-bold mt-8 text-xl 4xl:text-3xl">
                {department}
              </h2>
              <div className="flex gap-10 flex-wrap mt-8 w-full">
                {departmentMachines.map((machine) => (
                  <div
                    key={machine.id}
                    onClick={() => dispatch(selectMachine(machine))}
                  >
                    <UserPc selectedPc={selectedPc} pc={machine} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      {selectedPc && (
        <PcDetails onOpen={onOpen} />
      )}
      
      {/* Modal */}
      <PcModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Page;
