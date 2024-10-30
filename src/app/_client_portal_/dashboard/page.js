"use client";
import UserPc from "@/components/dashboard/UserPc";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";
import { BsGrid } from "react-icons/bs";

const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);
  const [selectedPc, setSelectedPc] = useState(null);
  const [pc, setPc] = useState(null);

  const computers = [
    {
      id: 1,
      name: "Alfred",
      online: true,
    },
    {
      id: 2,
      name: "Clara",
    },
    {
      id: 3,
      name: "Juliana",
    },
    {
      id: 4,
      name: "Nikky",
      online: true,
    },
    {
      id: 5,
      name: "Andrew",
    },
    {
      id: 6,
      name: "Andrew",
    },
    {
      id: 7,
      name: "Andrew",
      online: true,
    },
    {
      id: 8,
      name: "Andrew",
    },
    {
      id: 9,
      name: "Andrew",
    },
  ];

  const [play, setPlay] = useState(false);

  const [addNew, setAddNew] = useState(false);

  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-1 justify-between overflow-hidden  w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        <div className={`border-b ${pcDetails && "border-r"}  py-6`}>
          <div className="dashboard_container flex  items-center justify-between w-full ">
            <h1 className="text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Computer <span className="font-bold text-web_dark">Names</span>
            </h1>
            <BsGrid
              onClick={() => setGrid(!grid)}
              className={`w-10 cursor-pointer border h-10 p-[7px] rounded-xl border-web_aquablue/20 transitioncustom ${
                grid
                  ? "bg-web_aquablue/20 text-web_aquablue"
                  : "text-web_placeHolder bg-white"
              } `}
            />
          </div>
        </div>
        {grid ? (
          <div className="dashboard_container flex-1 ">
            <h2 className="font-bold mt-8 text-xl 4xl:text-3xl">Design</h2>
            <div className=" flex  gap-10 flex-wrap mt-8 w-full">
              {computers.slice(0, 2).map((pc) => {
                return (
                  <div
                    key={pc?.id}
                    onClick={() => {
                      setPc(pc);
                      selectedPc == pc.id
                        ? setSelectedPc("")
                        : setSelectedPc(pc?.id);
                    }}
                  >
                    <UserPc selectedPc={selectedPc} key={pc?.id} pc={pc} />
                  </div>
                );
              })}
            </div>

            <h2 className="font-bold mt-8 text-xl 4xl:text-3xl">Development</h2>
            <div className=" flex  gap-10 flex-wrap mt-8 w-full">
              {computers.slice(2, 5).map((pc) => {
                return (
                  <div
                    onClick={() => {
                      setPc(pc);
                      selectedPc == pc.id
                        ? setSelectedPc("")
                        : setSelectedPc(pc?.id);
                    }}
                    key={pc?.id}
                  >
                    <UserPc selectedPc={selectedPc} pc={pc} />
                  </div>
                );
              })}
            </div>

            <h2 className="font-bold mt-8 text-xl 4xl:text-3xl">Sales</h2>
            <div className=" flex  gap-10 flex-wrap mt-8 w-full">
              {computers.slice(7, 9).map((pc) => {
                return (
                  <div
                    onClick={() => {
                      setPc(pc);
                      selectedPc == pc.id
                        ? setSelectedPc("")
                        : setSelectedPc(pc?.id);
                    }}
                    key={pc?.id}
                  >
                    <UserPc selectedPc={selectedPc} pc={pc} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="dashboard_container flex-1 ">
            <div className=" flex  gap-10 flex-wrap mt-8 w-full">
              {computers.map((pc) => {
                return (
                  <div
                    onClick={() => {
                      setPc(pc);
                      selectedPc == pc.id
                        ? setSelectedPc("")
                        : setSelectedPc(pc?.id);
                    }}
                    key={pc?.id}
                  >
                    <UserPc selectedPc={selectedPc} pc={pc} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {selectedPc === pc?.id ? (
        <PcDetails
          onOpen={onOpen}
          pc={pc}
          play={play}
          setPlay={setPlay}
          addNew={addNew}
          setAddNew={setAddNew}
        />
      ) : (
        <></>
      )}
      <PcModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Page;
