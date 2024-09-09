"use client";
import UserPc from "@/components/dashboard/UserPc";
import { Button, useDisclosure, Switch } from "@nextui-org/react";
import React, { useState } from "react";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";
import { BsGrid } from "react-icons/bs";
import { useQuery } from "@apollo/client";
import { MACHINES_QUERY } from "@/graphql/queries";

const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);
  const [selectedPc, setSelectedPc] = useState(null);
  const [pc, setPc] = useState(null);
  const [byDepartment, setByDepartment] = useState(false);

  const { data, loading, error } = useQuery(MACHINES_QUERY);

  const [play, setPlay] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const machines = data?.machines || [];

  const groupedMachines = byDepartment
    ? machines.reduce((acc, machine) => {
      const department = machine.department || "Uncategorized";
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(machine);
      return acc;
    }, {})
    : { All: machines };

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        <div className={`border-b ${pcDetails && "border-r"} py-6`}>
          <div className="dashboard_container flex items-center justify-between w-full ">
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
                className={`2xl:w-12 cursor-pointer border 2xl:h-12 h-10 w-10 p-[7px] rounded-xl border-web_aquablue/20 transitioncustom ${grid
                    ? "bg-web_aquablue/20 text-web_aquablue"
                    : "text-web_placeHolder bg-white"
                  } `}
              />
            </div>
          </div>
        </div>
        <div className="dashboard_container flex-1 ">
          {Object.entries(groupedMachines).map(([department, departmentMachines]) => (
            <div key={department}>
              <h2 className="font-bold mt-8 text-xl 4xl:text-3xl">{department}</h2>
              <div className="flex gap-10 flex-wrap mt-8 w-full">
                {departmentMachines.map((machine) => (
                  <div
                    key={machine.id}
                    onClick={() => {
                      setPc(machine);
                      setSelectedPc(selectedPc === machine.id ? null : machine.id);
                    }}
                  >
                    <UserPc selectedPc={selectedPc} pc={machine} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPc === pc?.id && (
        <PcDetails
          onOpen={onOpen}
          pc={pc}
          play={play}
          setPlay={setPlay}
          addNew={addNew}
          setAddNew={setAddNew}
        />
      )}
      <PcModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Page;
