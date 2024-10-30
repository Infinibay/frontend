"use client";
import UserPc from "@/components/dashboard/UserPc";
import {
  Button,
  Checkbox,
  Image,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { BsGrid } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "@/components/dashboard/Navigation";
import CreateVm from "@/components/dashboard/users/CreateVm";
import Link from "next/link";
import VMPC from "@/components/dashboard/VMPC";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const officeData = [
    {
      id: 1,
      name: "pc_1",
      color: "#FFEBE2",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Minimum",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 2,
      name: "pc_1",
      color: "#FFFFE2",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Medium",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: false,
      },
    },
    {
      id: 3,
      name: "pc_1",
      color: "#E2F6FF",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Maximum",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 4,
      name: "pc_1",
      color: "#FFEBE2",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Minimum",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 5,
      name: "pc_1",
      color: "#FFFFE2",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Medium",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 6,
      name: "pc_1",
      color: "#E2F6FF",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Maximum",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 7,
      name: "pc_1",
      color: "#F6F6F6",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Sales",
      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    {
      id: 8,
      name: "pc_1",
      color: "#F6F6F6",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Development",

      specifications: {
        Ram: 64,
        CPU: "32 Core",
        DISK: "2 TB",
        VRAM: "8 GB",
        border: true,
      },
    },
    // {
    //   id: 9,
    //   name: "pc_1",
    //   color: "#FFEBE2",
    //   imageSrc: "/images/welcome/virualMachine1.png",
    //   minimumText: "Minimum",

    //   specifications: {
    //     Ram: 64,
    //     CPU: "32 Core",
    //     DISK: "2 TB",
    //     VRAM: "8 GB",
    //     border: true,
    //   },
    // },
    // Add more objects as needed
  ];
  const [count, setCount] = useState(64);
  const [count2, setCount2] = useState(32);
  const [count3, setCount3] = useState(2);
  const [count4, setCount4] = useState(8);

  const handleIncreament = () => {
    setCount(count + 64);
  };
  const handleIncreament2 = () => {
    setCount2(count2 + 32);
  };
  const handleIncreament3 = () => {
    setCount3(count3 + 2);
  };
  const handleIncreament4 = () => {
    setCount4(count4 + 8);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 64);
    }
  };
  const handleDecrement2 = () => {
    if (count2 > 0) {
      setCount2(count2 - 32);
    }
  };
  const handleDecrement3 = () => {
    if (count3 > 0) {
      setCount3(count3 - 2);
    }
  };
  const handleDecrement4 = () => {
    if (count4 > 0) {
      setCount4(count4 - 8);
    }
  };

  const router = useRouter();

  const placements = ["right-end"];

  const [create, setCreate] = useState(false);
  const pathname = usePathname();

  const [selectedPc, setSelectedPc] = useState(null);
  const [pc, setPc] = useState(null);

  const [selectedBoxes, setSelectedBoxes] = useState([]);

  const toggleBox = (boxId) => {
    if (selectedBoxes.includes(boxId)) {
      setSelectedBoxes(selectedBoxes.filter((id) => id !== boxId));
    } else {
      setSelectedBoxes([...selectedBoxes, boxId]);
    }
  };
  return (
    <div className="flex flex-1 justify-between overflow-hidden  w-full">
      <div className="flex border border-b-0 flex-col justify-between flex-1">
        {/* <div className={`border-b ${pcDetails && "border-r"}  py-6`}>
          <div className="dashboard_container flex  items-center justify-between w-full ">
            <div className="flex items-center gap-4">
              <Button
                className="bg-white border border-sky-200 px-5 py-2 text-[15px] rounded-xl font-semibold text-web_lightBlue flex items-center justify-center bg-web_aquablue/10"
                // size="sm"
              >
                Devices{" "}
              </Button>
              <Button
                className="bg-transparent border border-web_borderGray px-5 py-2 text-[15px] rounded-xl font-medium text-web_placeHolder flex items-center justify-center"
                // size="sm"
              >
                Configuration{" "}
              </Button>
            </div>
            <BsGrid
              onClick={() => setGrid(!grid)}
              className={`w-10 cursor-pointer border h-10 p-[7px] rounded-xl border-web_aquablue/20 transitioncustom ${
                grid
                  ? "bg-web_aquablue/20 text-web_aquablue"
                  : "text-web_placeHolder bg-white"
              } `}
            />
          </div>
        </div> */}
        <div className={` ${pcDetails && "border-r"} pb-4  pt-6`}>
          <div className="dashboard_container flex  items-center justify-between w-full ">
            <div className="flex items-center gap-4">
              <Link href={"/dashboard/create-pc"}>
                <Button
                  startContent={
                    <FaPlus className="w-6 h-6 text-web_lightbrown" />
                  }
                  className="bg-web_lightbrown/10 border-2 border-dashed border-web_lightbrown px-5 py-2 4xl:py-8 4xl:text-[28px] text-[15px] rounded-xl font-medium text-web_dark flex items-center justify-center"
                  size="lg"
                >
                  Create PC
                </Button>
              </Link>
              <h1 className=" 4xl:text-3xl text-xl sm:text-2xl font-semibold  text-gray-800">
                Select Your{" "}
                <span className="font-bold text-web_dark">
                  Machine Virtual Size.
                </span>
              </h1>
            </div>
            <div></div>
          </div>
        </div>
        {/* {pathname !== "/dashboard/select-vm" && (
          <div className="dashboard_container flex items-center gap-6">
            <h1 className="text-lg sm:text-xl font-bold  text-gray-800">
              Computer{" "}
              <span className="font-semibold text-web_dark">Names</span>
            </h1>
            <hr className="flex-1" />
          </div>
        )} */}

        <div className="dashboard_container flex-1 py-6 relative">
          {/* <FormOne /> */}
          <h2 className="subheading font-semibold">Office</h2>
          <div className=" flex gap-10 flex-wrap mt-8 w-full">
            {officeData.slice(0, 3).map((pc) => (
              <div
                className={` 4xl:max-w-[300px] max-w-[240px] w-full cursor-pointer`}
                onClick={() => toggleBox(pc.id)}
                key={pc.id}
              >
                <VMPC
                  toggle={() => toggleBox(pc.id)}
                  selectedPc={selectedBoxes}
                  pc={pc}
                />
              </div>
            ))}
          </div>
          <h2 className="subheading mt-8 font-semibold">Design</h2>
          <div className=" flex gap-10 flex-wrap mt-8 w-full">
            {officeData.slice(3, 6).map((pc) => (
              <div
                className={` 4xl:max-w-[300px] max-w-[240px] w-full cursor-pointer`}
                onClick={() => toggleBox(pc.id)}
                key={pc.id}
              >
                <VMPC
                  toggle={() => toggleBox(pc.id)}
                  selectedPc={selectedBoxes}
                  pc={pc}
                />
              </div>
            ))}
          </div>
          <h2 className="subheading mt-8 font-semibold flex items-center gap-2">
            Custom
            <Image
              onClick={onOpen}
              alt="img"
              src="/images/plusIcon.png"
              className="cursor-pointer 4xl:w-16 4xl:h-16 w-10 h-10"
            />
          </h2>
          <div className=" flex gap-10 flex-wrap mt-8 pb-16 w-full">
            {officeData.slice(6, 9).map((pc) => (
              <div
                className={` 4xl:max-w-[300px] max-w-[240px] w-full cursor-pointer`}
                onClick={() => toggleBox(pc.id)}
                key={pc.id}
              >
                <VMPC
                  toggle={() => toggleBox(pc.id)}
                  selectedPc={selectedBoxes}
                  pc={pc}
                />
              </div>
            ))}
          </div>

          {/* Modal */}
          <div className="border-gray-500 flex justify-end mb-10">
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              classNames={{
                body: "bg-white rounded-3xl shadow-lg py-8",
                base: "flex bg-web_lightbrown shadow-md pb-12  rounded-3xl",
                header: "",
                footer: "!shadow-md ",
                closeButton: "hidden hover:bg-white/5 active:bg-white/10",
              }}
              className="lg:mx-14 mx-2  4xl:max-w-4xl  " // Set the maximum width and full width
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    {/* <ModalHeader className="flex flex-col gap-1"></ModalHeader> */}
                    <ModalBody>
                      <div className="flex justify-between">
                        <p className="font-bold lg:text-2xl text-lg 4xl:text-4xl  ">
                          Create{" "}
                          <span className="lg:text-xl text-medium lg:font-bold font-semibold 4xl:text-4xl">
                            {" "}
                            Template
                          </span>{" "}
                        </p>

                        <div className="order-last flex items-center justify-center">
                          <span>
                            {" "}
                            <Checkbox
                              radius="lg"
                              size="lg"
                              classNames={{
                                base: "border-transparent  ",
                                content: " px-5xl",
                              }}
                            ></Checkbox>
                          </span>{" "}
                          <p className="lg:text-base text-sm 4xl:text-3xl">
                            One-time template
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-xl border[#F6F6F6] border-[1px] py-2 px-2 rounded-lg 4xl:text-3xl">
                        Alien Ware
                      </p>
                      <div className="px-1 py-2 flex justify-around gap-2  ">
                        {/* col-1 */}
                        <div className="flex flex-col 4xl:space-y-7 ">
                          <p className="lg:text-lg 4xl:text-2xl sm:text-base  text-sm font-bold  lg:mt-1 sm:mt-2 mt-3  ">
                            Ram
                          </p>
                          <p className="lg:text-lg 4xl:text-2xl sm:text-base text-sm font-bold  lg:mt-3 sm:mt-3 mt-5 ">
                            CPU
                          </p>
                          <p className="lg:text-lg 4xl:text-2xl sm:text-base text-sm font-bold lg:mt-3 sm:mt-4 mt-4 ">
                            DISK
                          </p>
                          <p className="lg:text-lg 4xl:text-2xl sm:text-base text-sm font-bold  lg:mt-3 sm:mt-5 mt-6  ">
                            VRAM
                          </p>
                        </div>

                        {/* col-2 */}
                        <div className="flex flex-col ">
                          {/* btn-1 */}
                          <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleDecrement}
                            >
                              -
                            </button>
                            <div className="text-lg font-bold min-w-[100px] 4xl:text-2xl  text-center">
                              {count}
                            </div>
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleIncreament}
                            >
                              +
                            </button>
                          </div>

                          {/* btn-2 */}
                          <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleDecrement2}
                            >
                              -
                            </button>
                            <div className="text-lg 4xl:text-2xl font-bold min-w-[100px] text-center">
                              {count2}
                            </div>
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleIncreament2}
                            >
                              +
                            </button>
                          </div>
                          {/* btn-3 */}

                          <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleDecrement3}
                            >
                              -
                            </button>
                            <div className="text-lg font-bold min-w-[100px] 4xl:text-2xl  text-center">
                              {count3}
                            </div>
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleIncreament3}
                            >
                              +
                            </button>
                          </div>

                          {/* btn-4 */}
                          <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleDecrement4}
                            >
                              -
                            </button>
                            <div className="text-lg font-bold min-w-[100px] 4xl:text-2xl  text-center">
                              {count4}
                            </div>
                            <button
                              className="text-lg font-medium 4xl:text-4xl bg-[#F4FBFF] text-[#4B9AD0] px-3"
                              onClick={handleIncreament4}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* col-3 */}
                        <div className="flex flex-col 4xl:space-y-7">
                          <p className="lg:text-lg sm:text-base  4xl:text-2xl text-sm font-bold  lg:mt-1 sm:mt-2 mt-3  ">
                            GB
                          </p>
                          <p className="lg:text-lg sm:text-base 4xl:text-2xl  text-sm font-bold  lg:mt-3 sm:mt-3 mt-5 ">
                            CORE
                          </p>
                          <p className="lg:text-lg sm:text-base  4xl:text-2xl text-sm font-bold  lg:mt-3 sm:mt-4 mt-4 ">
                            TB
                          </p>
                          <p className="lg:text-lg sm:text-base 4xl:text-2xl  text-sm font-bold  lg:mt-3 sm:mt-5 mt-6  ">
                            GB
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mb-2 mx-2  rounded-b-[40px]">
                        <Button
                          color="black"
                          variant="light"
                          onPress={onClose}
                          className="mx-1 px-16 border-gray-300 border-2 4xl:text-2xl 4xl:py-7 "
                        >
                          Cancel
                        </Button>
                        <Button
                          onPress={onClose}
                          className="px-16 text-white bg-black 4xl:text-2xl 4xl:py-7"
                        >
                          Create
                        </Button>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="absolute bottom-6 4xl:bottom-20  left-0 w-[70%] mt-6 rounded-r-full rounded-l-full border-2 border-web_borderGray bg-web_lightwhite flex items-center flex-row justify-between">
            <Button
              className={`text-web_lightBlue uppercase font-semibold bg-transparent max-w-[150px] w-full 4xl:py-8 4xl:text-xl `}
            >
              previous
            </Button>
            <Button
              onClick={() => {
                setCreate(true);
                setTimeout(() => {
                  router.push("/dashboard/departments?type=sales");
                  // setCreate(false);
                }, 3000);
              }}
              className="btnGradientLightBlue max-w-fit ml-auto px-8 scale-[1.25] 4xl:py-7 4xl:text-xl "
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      {create && <CreateVm initialLoading={true} />}
    </div>
  );
};

export default Page;
