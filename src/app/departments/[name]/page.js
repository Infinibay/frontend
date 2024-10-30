"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Switch, useDisclosure } from "@nextui-org/react";
import { BsGrid } from "react-icons/bs";

// Components
import UserPc from "@/components/dashboard/UserPc";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";

// Redux actions
import { fetchVms, selectMachine } from "@/state/slices/vms";
import { fetchDepartmentByName } from "@/state/slices/departments";

const DepartmentPage = () => {
  // Hooks and state
  const params = useParams();
  const dispatch = useDispatch();
  const [grid, setGrid] = useState(false);
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux selectors
  const department = useSelector((state) => {
    return state.departments.items.find(d => d.name.toLowerCase() === params.name.toLowerCase());
  });
  const machines = useSelector((state) => {
    return state.vms.items.filter(vm => vm.department.name === params.name);
	});
  const selectedPc = useSelector((state) => state.vms.selectedMachine);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchVms()),
          dispatch(fetchDepartmentByName(params.name))
        ]);
        setIsLoading(false);
      } catch (err) {
				console.error(err);
        setError("Department not found");
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch, params.name]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">Department not found</div>
      </div>
    );
  }

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

        {/* Department Info */}
        <div className="dashboard_container mt-4">
          <div className="text-sm text-gray-600">
            <p>Internet Speed: {department.internetSpeed}</p>
            <p>IP Subnet: {department.ipSubnet}</p>
          </div>
        </div>

        {/* Machine Grid */}
        <div className="dashboard_container flex-1">
          <div className="flex gap-10 flex-wrap mt-8 w-full">
            {machines.map((machine) => (
              <div
                key={machine.id}
                onClick={() => dispatch(selectMachine(machine))}
              >
                <UserPc selectedPc={selectedPc} pc={machine} />
              </div>
            ))}
          </div>
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

export default DepartmentPage; 