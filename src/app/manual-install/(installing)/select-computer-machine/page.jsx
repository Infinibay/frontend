"use client";
import React, { useState } from "react";
import { Checkbox, Image, useDisclosure } from "@nextui-org/react";
import { Tooltip, Button ,cn} from "@nextui-org/react";
import { IoAddOutline } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Navigation from "@/components/dashboard/Navigation";
import TooltipComponent from "@/components/tooltip/TooltipComponent";

const Page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [size, setSize] = React.useState("sm");

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
      color: "#FFEBE2",
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
      color: "#FFEBE2",
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
      color: "#FFEBE2",
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

  return (
    <div className="container   mx-auto px-3">
      <h1 className="lg:text-5xl text-3xl font-medium my-4 4xl:text-7xl">
        Select Your <span className="font-bold">Machine Virtual Size.</span>
      </h1>
      <p className="4xl:text-3xl">
        Lorem ipsum dolor sit amet consectetur. Tincidunt gravilementum arcu
        nibh tincidunt condimentum. Ante seementum consectetur non{" "}
      </p>

      <p className="subheading lg:my-5 my-5 4xl:mt-20">Office</p>

      <div className="grid lg:grid-cols-3 gap-3 max-w-[800px] 4xl:max-w-[70%]  4xl:gap-7  4xl:h-[320px]">
        {officeData.map((pc) => (
          <div
            key={pc.id}
          
            className={`${
              pc.specifications.border
                ? " border-2 "
                : "border border-dashed border-[#52C24A]"
            } rounded-3xl shadow-lg` }
          >
            {/* className={`border-${pc.color ?  ' border-dashed ' : 'border-2' } rounded-3xl shadow-lg`} */}

            <div className="flex justify-between items-center">
              <div className="order-first p-3">
                <Checkbox
                  defaultSelected
                  radius="full"
                  color="success"
                  classNames={{
                    base: "w-[180px]",
                cn: "w-[180px]",
                    wrapper:
                    "p-0 h-6 overflow-visible 4xl:w-[50px] 4xl:h-[50px] h-[20px] w-[20px] !bg-transparent border",
                    content: " px-3xl",
                    icon: "text-white w-3xl ",
                    label:
                      "4xl:w-12 4xl:h-6 ",
                      //selected
                      
                    
                  }}
                ></Checkbox>
              </div>
              <div className="p-3">
                {placements.map((placement, index) => (
                  <Tooltip
                    key={index}
                    placement={"right-end"}
                    color="warning"
                    content={
                      <div className="px-1 py-2 flex flex-row gap-6 text-white max-w-[160px] ">
                        <div className="flex flex-col">
                          {Object.entries(pc.specifications).map(
                            ([key, value]) => (
                              <p
                                key={key}
                                className="lg:text-lg sm:text-base text-sm font-normal"
                              >
                                {key}
                              </p>
                            )
                          )}
                        </div>
                        <div className="flex flex-col">
                          {Object.entries(pc.specifications).map(
                            ([key, value]) => (
                              <p
                                key={key}
                                className="lg:text-lg sm:text-base text-sm font-medium"
                              >
                                {value}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    }
                  >
                    <p className="4xl:text-4xl  4xl:px-5 4xl:py-1 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px] hover:bg-[#EC9430] hover:text-white text-black cursor-pointer">
                      i
                    </p>
                  </Tooltip>
                ))}
              </div>
            </div>
       
            <div className="flex justify-center ">
              <Image
                src={pc.imageSrc}
                alt={pc.name}
                width={100}
                height={100}
                className=" max-w-[200px] h-[100px]   rounded-none "
              />
            </div>
            <div className="flex justify-center my-4">
              <p className={`bg-[${pc.color}] px-7 py-1 rounded-md 4xl:text-2xl `}>
                {pc.minimumText}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Design start */}
      <p className="subheading lg:my-5 my-5 4xl:mt-20">Design</p>

<div className="grid lg:grid-cols-3 gap-3 max-w-[800px] 4xl:max-w-[70%]  4xl:gap-7  4xl:h-[320px]">
  {designData.map((pc) => (
    <div
      key={pc.id}
    
      className={`${
        pc.specifications.border
          ? " border-2 "
          : "border border-dashed border-[#52C24A]"
      } rounded-3xl shadow-lg` }
    >
      {/* className={`border-${pc.color ?  ' border-dashed ' : 'border-2' } rounded-3xl shadow-lg`} */}

      <div className="flex justify-between items-center">
        <div className="order-first p-3">
          <Checkbox
            defaultSelected
            radius="full"
            color="success"
            classNames={{
              base: "w-[180px]",
          cn: "w-[180px]",
              wrapper:
              "p-0 h-6 overflow-visible 4xl:w-[50px] 4xl:h-[50px] h-[20px] w-[20px] !bg-transparent border",
              content: " px-3xl",
              icon: "text-white w-3xl ",
              label:
                "4xl:w-12 4xl:h-6 ",
                //selected
                
              
            }}
          ></Checkbox>
        </div>
        <div className="p-3">
          {placements.map((placement, index) => (
            <Tooltip
              key={index}
              placement={"right-end"}
              color="warning"
              content={
                <div className="px-1 py-2 flex flex-row gap-6 text-white max-w-[160px] ">
                  <div className="flex flex-col">
                    {Object.entries(pc.specifications).map(
                      ([key, value]) => (
                        <p
                          key={key}
                          className="lg:text-lg sm:text-base text-sm font-normal"
                        >
                          {key}
                        </p>
                      )
                    )}
                  </div>
                  <div className="flex flex-col">
                    {Object.entries(pc.specifications).map(
                      ([key, value]) => (
                        <p
                          key={key}
                          className="lg:text-lg sm:text-base text-sm font-medium"
                        >
                          {value}
                        </p>
                      )
                    )}
                  </div>
                </div>
              }
            >
              <p className="4xl:text-4xl  4xl:px-5 4xl:py-1 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px] hover:bg-[#EC9430] hover:text-white text-black cursor-pointer">
                i
              </p>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex justify-center ">
        <Image
          src={pc.imageSrc}
          alt={pc.name}
          width={100}
          height={100}
          className=" max-w-[200px] h-[100px]   rounded-none "
        />
      </div>
      <div className="flex justify-center my-4">
        <p className={`bg-[${pc.color}] px-7 py-1 rounded-md 4xl:text-2xl `}>
          {pc.minimumText}
        </p>
      </div>
    </div>
  ))}
</div>
      {/* Design end */}

      {/* custum start */}

      <p className="subheading lg:my-5 my-5 flex  items-center pt-8">
        Custom{" "}
        <span className="ml-4 bg-[#EC9430]  rounded-full p-[2px]">
          <IoAddOutline
            color="white"
            onClick={onOpen}
            className="cursor-pointer"
          />
        </span>
      </p>

      <div className="grid lg:grid-cols-3 gap-3 max-w-[800px] 4xl:max-w-[70%]  4xl:gap-7  4xl:h-[320px]">
  {custum.map((pc) => (
    <div
      key={pc.id}
    
      className={`${
        pc.specifications.border
          ? " border-2 "
          : "border border-dashed border-[#52C24A]"
      } rounded-3xl shadow-lg` }
    >
      {/* className={`border-${pc.color ?  ' border-dashed ' : 'border-2' } rounded-3xl shadow-lg`} */}

      <div className="flex justify-between items-center">
        <div className="order-first p-3">
          <Checkbox
            defaultSelected
            radius="full"
            color="success"
            classNames={{
              base: "w-[180px]",
          cn: "w-[180px]",
              wrapper:
              "p-0 h-6 overflow-visible 4xl:w-[50px] 4xl:h-[50px] h-[20px] w-[20px] !bg-transparent border",
              content: " px-3xl",
              icon: "text-white w-3xl ",
              label:
                "4xl:w-12 4xl:h-6 ",
                //selected
                
              
            }}
          ></Checkbox>
        </div>
        <div className="p-3">
          {placements.map((placement, index) => (
            <Tooltip
              key={index}
              placement={"right-end"}
              color="warning"
              content={
                <div className="px-1 py-2 flex flex-row gap-6 text-white max-w-[160px] ">
                  <div className="flex flex-col">
                    {Object.entries(pc.specifications).map(
                      ([key, value]) => (
                        <p
                          key={key}
                          className="lg:text-lg sm:text-base text-sm font-normal"
                        >
                          {key}
                        </p>
                      )
                    )}
                  </div>
                  <div className="flex flex-col">
                    {Object.entries(pc.specifications).map(
                      ([key, value]) => (
                        <p
                          key={key}
                          className="lg:text-lg sm:text-base text-sm font-medium"
                        >
                          {value}
                        </p>
                      )
                    )}
                  </div>
                </div>
              }
            >
              <p className="4xl:text-4xl  4xl:px-5 4xl:py-1 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px] hover:bg-[#EC9430] hover:text-white text-black cursor-pointer">
                i
              </p>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex justify-center ">
        <Image
          src={pc.imageSrc}
          alt={pc.name}
          width={100}
          height={100}
          className=" max-w-[200px] h-[100px]   rounded-none "
        />
      </div>
      <div className="flex justify-center my-4">
        <p className={`bg-[${pc.color}] px-7 py-1 rounded-md 4xl:text-2xl `}>
          {pc.minimumText}
        </p>
      </div>
    </div>
  ))}
</div>
      {/* custum end */}

      {/* modal */}

      <div className="border-gray-500 flex justify-end mb-10 ">
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          
          classNames={{
            body: "bg-white rounded-3xl shadow-lg py-8  ",
            base: "flex bg-web_lightbrown shadow-md pb-12  rounded-3xl",
            header: "",
            footer: "!shadow-md ",
            closeButton: "hidden hover:bg-white/5 active:bg-white/10",
          }}
          className="lg:mx-14 mx-2  max-w-lg " // Set the maximum width and full width
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex justify-between ">
                    <p className="font-bold lg:text-2xl text-lg  ">
                      Create{" "}
                      <span className="lg:text-xl text-medium lg:font-bold font-normal">
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
                            base: "border-transparent ",
                            content: " px-3xl",
                          }}
                        ></Checkbox>
                      </span>{" "}
                      <p className="lg:text-base text-sm">One-time template</p>
                    </div>
                  </div>

                  <p className="font-bold text-xl border[#F6F6F6] border-[1px] py-2 px-2 rounded-lg">
                    Alien Ware
                  </p>
                  <div className="px-1 py-2 flex justify-around gap-2  ">
                    {/* col-1 */}
                    <div className="flex flex-col ">
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-1 sm:mt-2 mt-3  ">
                        Ram
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-3 mt-5 ">
                        CPU
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-4 mt-4 ">
                        DISK
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-5 mt-6  ">
                        VRAM
                      </p>
                    </div>

                    {/* col-2 */}
                    <div className="flex flex-col ">
                      {/* btn-1 */}
                      <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                        <div className="text-lg font-bold min-w-[100px] text-center">
                          {count}
                        </div>
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleIncreament}
                        >
                          +
                        </button>
                      </div>

                      {/* btn-2 */}
                      <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleDecrement2}
                        >
                          -
                        </button>
                        <div className="text-lg font-bold min-w-[100px] text-center">
                          {count2}
                        </div>
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleIncreament2}
                        >
                          +
                        </button>
                      </div>
                      {/* btn-3 */}

                      <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleDecrement3}
                        >
                          -
                        </button>
                        <div className="text-lg font-bold min-w-[100px] text-center">
                          {count3}
                        </div>
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleIncreament3}
                        >
                          +
                        </button>
                      </div>

                      {/* btn-4 */}
                      <div className="flex items-center justify-between border[#F6F6F6] border-[1px] mb-3 min-w-[200px] rounded-lg">
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleDecrement4}
                        >
                          -
                        </button>
                        <div className="text-lg font-bold min-w-[100px] text-center">
                          {count4}
                        </div>
                        <button
                          className="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3"
                          onClick={handleIncreament4}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* col-3 */}
                    <div className="flex flex-col ">
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-1 sm:mt-2 mt-3  ">
                        GB
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-3 mt-5 ">
                        CORE
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-4 mt-4 ">
                        TB
                      </p>
                      <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-5 mt-6  ">
                        GB
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mb-2 mx-2 rounded-b-[40px]">
                    <Button
                      color="black"
                      variant="light"
                      onPress={onClose}
                      className="mx-1 px-16 border-gray-300 border-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={onClose}
                      className="px-16 text-white bg-black"
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
      <Navigation prevUrl="/manual-install/create-virtual-desktop" nextUrl="/manual-install/select-apps-to-configure" />
    </div>
  );
};

export default Page;
