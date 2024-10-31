// React and Next.js imports
import React, { useState } from "react";
import Image from "next/image";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { playVm, stopVm, pauseVm } from "@/state/slices/vms";

// UI Component imports
import { Button, Checkbox } from "@nextui-org/react";
import TooltipComponent from "../tooltip/TooltipComponent";

// Icon imports
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { TiMediaStop } from "react-icons/ti";
import { FiEdit, FiSearch } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

const PcDetails = ({ onOpen, addNew }) => {
  // State and hooks
  const dispatch = useDispatch();
  const vm = useSelector((state) => state.vms.items.find((v) => v.id === state.vms.selectedMachine.id));
  const [status, _] = useState(vm.status);

  // VM Control handlers
  const handleVmControl = {
    play: async () => {
      try {
        dispatch(playVm({ id: vm.id }));
      } catch (error) {
        console.error("Error powering on:", error);
      }
    },

    pause: async () => {
      try {
        dispatch(pauseVm({ id: vm.id }));
      } catch (error) {
        console.error("Error suspending:", error);
      }
    },

    stop: async () => {
      try {
        dispatch(stopVm({ id: vm.id }));
      } catch (error) {
        console.error("Error powering off:", error);
      }
    }
  };

  // Control button components
  const ControlButtons = {
    Play: useSelector((state) => {
      const vm = state.vms.items.find((v) => v.id === state.vms.selectedMachine.id);
      return (
        <div onClick={handleVmControl.play} className="rounded-xl border max-w-fit p-2.5 4xl:p-3 cursor-pointer">
          <TooltipComponent
            htmlTag={
              <BsFillPlayFill
                className={`w-5 min-h-5 4xl:w-10 4xl:h-10 ${
                  vm.status !== "running" ? "text-web_green" : "text-web_placeHolder"
                }`}
              />
            }
            param="Play"
          />
        </div>
      );
    }),

    Pause: useSelector((state) => {
      const vm = state.vms.items.find((v) => v.id === state.vms.selectedMachine.id);
      return (
        <div
          onClick={handleVmControl.pause}
          className={`rounded-xl border max-w-fit p-2.5 4xl:p-3 cursor-pointer ${
            vm.status === "suspended" ? "bg-web_green/10 border-transparent" : "bg-white border-web_borderGray"
          }`}
        >
          <TooltipComponent
            htmlTag={
              <BsFillPauseFill
                className={`w-5 min-h-5 4xl:w-10 4xl:h-10 ${
                  vm.status === "running" ? "text-web_green" : "text-web_placeHolder"
                }`}
              />
            }
            param="Pause"
          />
        </div>
      );
    }),

    Stop: useSelector((state) => {
      const vm = state.vms.items.find((v) => v.id === state.vms.selectedMachine.id);
      return (
        <div
          onClick={handleVmControl.stop}
          className={`rounded-xl border max-w-fit p-2.5 4xl:p-3 cursor-pointer ${
            vm.status === "running"
              ? "bg-white border-web_borderGray"
              : "bg-red-50 border-transparent opacity-50 cursor-not-allowed"
          }`}
        >
          <TooltipComponent
            htmlTag={
              <TiMediaStop
                className={`w-5 min-h-5 4xl:w-10 4xl:h-10 ${
                  vm.status === "running" ? "text-red-500" : "text-web_placeHolder"
                }`}
              />
            }
            param="Stop"
          />
        </div>
      );
    })
  };

  // Status button component
  const StatusButton = vm?.status === "running" ? (
    <Button
      startContent={<div className="w-2 h-2 bg-web_green rounded-full"></div>}
      className="bg-white border border-web_green 4xl:px-6 4xl:py-5 py-2 4xl:text-[22px] text-[15px] rounded-xl font-medium text-web_green flex items-center justify-center"
      size="sm"
    >
      Online
    </Button>
  ) : (
    <Button
      className="bg-white border border-web_placeHolder 4xl:px-6 4xl:py-5 py-2 4xl:text-[22px] text-[15px] rounded-xl font-medium text-web_placeHolder flex items-center justify-center"
      size="sm"
    >
      Offline
    </Button>
  );

  return (
    <div className="2xl:max-w-[800px] xl:max-w-[400px] 4xl:max-w-[1000px] max-w-[400px] p-6 mx-auto flex-[.33]  transitioncustom">
      <div className="flex items-center justify-between">
        <p className="font-semibold 4xl:text-3xl lg:text-lg text-base">
          {vm?.name}
          {`'s`} <span className="font-bold">PC</span>{" "}
        </p>
        {StatusButton}
      </div>
      <div className="bg-white mt-4 rounded-2xl border">
        {vm.status == "running" ? (
          <Image
            width={1000}
            height={1000}
            alt="remote-pc" 
            src="/images/remotePc.png"
          />
        ) : (
          <Image
            width={1000}
            height={1000}
            alt="remote-pc"
            src="/images/remotePcOffline.png"
          />
        )}
        <div className="p-3 flex justify-between gap-2">
          <div className="flex gap-2 4xl:gap-5">
              {ControlButtons.Play}
              {ControlButtons.Pause}
              {ControlButtons.Stop}
            <div
              onClick={() => (status == "running" ? onOpen() : "")}
              className={`rounded-xl border  max-w-fit p-2.5 4xl:p-3  cursor-pointer bg-web_lightBlue/10 border-transparent`}
            >
              <TooltipComponent
                htmlTag={
                  <Image
                    className="w-5 h-5 min-w-5 min-h-5 4xl:w-10 4xl:h-10 rounded-none"
                    alt="icon-mdcast"
                    src="/images/mdcast.svg"
                    width={1000}
                    height={1000}
                  />
                }
                param="Full screen" // Replace with your tooltip content
              />
            </div>
          </div>
          <div className="flex gap-2 4xl:gap-5">
            <div
              className={`rounded-xl border  max-w-fit p-2.5 4xl:p-3  cursor-pointer bg-web_lightGrey/80 border-transparent`}
            >
              <TooltipComponent
                htmlTag={
                  <div>
                    <FiEdit className="w-5 min-h-5 4xl:w-10 4xl:h-10 text-web_darkgray" />
                  </div>
                }
                param={<p className="4xl:text-2xl  ">Edit</p>}
              />
            </div>
            <div
              className={`rounded-xl border  max-w-fit p-2.5 4xl:p-3  cursor-pointer bg-red-50 border-transparent`}
            >
              <TooltipComponent
                color="danger"
                content="ali Delete user"
                htmlTag={
                  <span
                    onClick={() => handleDeleteSelected(datas.id)}
                    className="4xl:text-3xl text-lg text-danger cursor-pointer -left-2 active:opacity-50"
                  >
                    <RiDeleteBin5Line className="w-5 min-h-5 4xl:w-10 4xl:h-10 " />
                  </span>
                }
                param={<p className="4xl:text-2xl 4xl:mr-8">Delete</p>}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-4 4xl:space-y-8 space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold 4xl:text-3xl md:text-lg  text-sm">
            Computer Name
          </p>
          <p className="font-medium 4xl:text-3xl md:text-lg text-sm">
            {vm?.name}
            {`'s PC`}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold 4xl:text-3xl md:text-lg  text-sm">User</p>
          <p className="font-medium 4xl:text-3xl md:text-lg text-sm">
            Alfred Johnson
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold 4xl:text-3xl md:text-lg  text-sm">
            Template Office{" "}
          </p>
          <p className="font-medium 4xl:text-3xl md:text-lg text-sm">Medium</p>
        </div>
      </div>
      <hr />
      <div className="flex 2xl:flex-row flex-col gap-2 2xl:items-center justify-between 4xl:py-6 py-3">
        <p className="font-semibold 4xl:text-3xl md:text-lg  text-sm ">
          Applications{" "}
        </p>
        <div className="flex item-center bg-white 4xl:rounded-3xl rounded-xl border border-web_borderGray px-3 py-2 4xl:px-4 4xl:py-4 gap-2">
          <FiSearch className="w-4 h-4 4xl:w-7 4xl:h-7 " />
          <input
            type="text"
            placeholder="Maya|"
            className="border-none outline-none leading-3 bg-transparent 4xl:text-2xl"
          />
        </div>
      </div>
      <div className="bg-white rounded-xl 4xl:p-4 p-3">
        <div className="max-w-fit relative gap-1.5 flex flex-col items-center">
          <div className="border  p-3 rounded-xl border-web_borderGray ">
            {!addNew ? (
              <Image
                onClick={() => setAddNew(true)}
                alt="add-new-icon"
                src="/images/addNew.png"
                width={1000}
                height={1000}
                className="rounded-none absolute z-40 -right-1 lg:-right-1 4xl:-right-1 4xl:w-8
                4xl:h-8 -top-2 w-6 h-6 cursor-pointer "
              />
            ) : (
              <Image
                onClick={() => setAddNew(false)}
                alt="add-new-icon"
                src="/images/loading.png"
                width={1000}
                height={1000}
                className="rounded-none absolute z-40 -right-1 lg:-right-1 4xl:-right-1 -top-2 w-6 4xl:w-8 h-6 4xl:h-8 cursor-pointer animate-spin"
              />
            )}
            <Image
              alt="maya-logo"
              src="/images/mayaLogo.png"
              width={1000}
              height={1000}
              className="rounded-none w-8 4xl:w-12 h-8 4xl:h-12 object-contain"
            />
            <Image
              alt="setting-icon"
              src="/images/setting.png"
              width={1000}
              height={1000}
              className="rounded-none absolute lg:-right-0 -right-0 4xl:right-0 4xl:w-7 4xl:bottom-9 4xl:h-7 w-5 min-h-5 bottom-8 lg:bottom-8 cursor-pointer"
            />
          </div>
          <p className="4xl:text-2xl 4xl:mt-2 lg:text-lg font-semibold">
            Maya 3d
          </p>
        </div>
      </div>
      {addNew && (
        <>
          <div className="flex justify-between items-center pt-4">
            <p className="font-semibold 5xl:text-2xl 2xl:text-xl md:text-lg  text-sm">
              {" "}
              <span className="font-bold"> Configure </span> Maya{" "}
            </p>
            <div className="flex gap-2 items-center">
              <p className="font-medium 5xl:text-2xl 2xl:text-xl md:text-lg text-sm">
                No-License
              </p>
              <Checkbox defaultSelected size="sm"></Checkbox>
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <p className="font-bold 5xl:text-2xl 2xl:text-xl md:text-lg text-sm">
              License
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border-web_aquablue border max-w-[70px] rounded-xl p-1 outline-none bg-transparent"
              />
              <input
                type="text"
                className="border-web_aquablue border max-w-[70px] rounded-xl p-1 outline-none bg-transparent"
              />
              <input
                type="text"
                className="border-web_aquablue border max-w-[70px] rounded-xl p-1 outline-none bg-transparent"
              />
              <input
                type="text"
                className="border-web_aquablue border max-w-[70px] rounded-xl p-1 outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="text-right">
            <Button className="btnGradientLightBlue max-w-fit font-semibold hover:text-2white">
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PcDetails;
