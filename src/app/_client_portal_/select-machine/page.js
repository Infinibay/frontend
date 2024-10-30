"use client";
import React, { useState } from "react";
import { Checkbox, Image, useDisclosure } from "@nextui-org/react";
import { Tooltip, Button } from "@nextui-org/react";
import { IoAddOutline } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Navigation from "@/components/dashboard/Navigation";
import XIcon from "@/components/general/XIcon";
import VMPC from "@/components/dashboard/VMPC";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [size, setSize] = React.useState("md");
  const [selectedBoxes, setSelectedBoxes] = useState([]);

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
  const designData = [
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
      color: "#FFEBE2",
      imageSrc: "/images/welcome/virualMachine1.png",
      minimumText: "Minimum",
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
    // Add more objects as needed
  ];

  const custum = [
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

    // Add more objects as needed
  ];

  // add products
  const [count, setCount] = useState(64);
  const [count2, setCount2] = useState(32);
  const [count3, setCount3] = useState(2);
  const [count4, setCount4] = useState(8);

  const router = useRouter();

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

  const placements = ["right-end"];
  const colors = ["primary"];

  const toggleBox = (boxId) => {
    if (selectedBoxes.includes(boxId)) {
      setSelectedBoxes(selectedBoxes.filter((id) => id !== boxId));
    } else {
      setSelectedBoxes([...selectedBoxes, boxId]);
    }
  };

  return (
    <div className="dashboard_container relative  mx-auto px-3 ">
      <XIcon />
      <h1 className="lg:text-5xl text-3xl font-medium my-4 4xl:my-6">
        Select Your <span className="font-bold">Machine Virtual Size.</span>
      </h1>
      <p className="4xl:text-[28px]">
        Lorem ipsum dolor sit amet consectetur. Tincidunt gravilementum arcu
        nibh tincidunt condimentum. Ante seementum consectetur non{" "}
      </p>

      <div className=" flex-1 4xl:pt-12 py-6 relative">
        {/* <FormOne /> */}
        <h2 className="subheading font-semibold">Office</h2>
        <div className=" flex gap-10 flex-wrap mt-8 w-full">
          {officeData.slice(0, 3).map((pc) => (
            <div
              className={`max-w-[240px] w-full cursor-pointer`}
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
              className={`max-w-[240px] w-full cursor-pointer`}
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
              className={`max-w-[240px] w-full cursor-pointer`}
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
      </div>

      {/* Design end */}

      {/* custum start */}

      {/* custum end */}

      {/* modal */}

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
      {/* <Navigation
        prevUrl="/user/create-virtual-desktop"
        nextUrl="/user/social-apps"
      /> */}
      <div className=" w-[70%] 4xl:mt-24 mt-2 rounded-r-full rounded-l-full border-2 border-web_borderGray bg-white flex items-center flex-row justify-between">
        <Button
          onClick={() => {
            router.push("/user/create-virtual-desktop");
          }}
          className={`text-web_lightBlue uppercase font-semibold bg-transparent max-w-[150px] w-full 4xl:py-8 4xl:text-xl `}
        >
          previous
        </Button>
        <Button
          onClick={() => {
            router.push("/user/social-apps");
          }}
          className="btnGradientLightBlue 4xl:!rounded-3xl max-w-fit ml-auto px-8 scale-[1.25] 4xl:py-7 4xl:text-xl "
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Page;
