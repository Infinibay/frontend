"use client"
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

const Page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  const placements = ["right"];

  return (
    <div className="container   mx-auto px-3">
     
      <h1 className="lg:text-5xl text-3xl font-medium my-4">
        Select Your <span className="font-bold">Machine Virtual Size.</span>
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Tincidunt gravilementum arcu
        nibh tincidunt condimentum. Ante seementum consectetur non{" "}
      </p>

      <p className="subheading lg:my-10 my-5">Office</p>

      {/* office */}
      <div className="grid lg:grid-cols-3 gap-3 max-w-[800px]  ">
        {/* pc_1 */}
        <div className="border-gray-300 border-2 rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
            <Checkbox defaultSelected radius="full">Full</Checkbox>

            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6 ">
                      {/* col-1 */}
                      <div className="flex flex-col">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]" style={{ fontFamily: 'Oleo Script Swash Caps' }}>

                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
        {/* pc_2 */}
        <div className="border-[#52C24A] border-dashed border-2 rounded-3xl  shadow-lg">
          <div className="flex justify-between shadow-slate-600">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                color="success"
                  classNames={{
                  base: "border-transparent ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6  ">
                      {/* col-1 */}
                      <div className="flex flex-col ">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>

        {/* pc-3 */}
        <div className="border-gray-300 border-2 rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                classNames={{
                  base: "border-transparent ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6 ">
                      {/* col-1 */}
                      <div className="flex flex-col">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
      </div>

      {/* office end */}

      {/* Design start */}
      <p className="subheading lg:my-10 my-5 ">Design</p>

      {/* office */}
      <div className="grid lg:grid-cols-3 gap-3 max-w-[800px]  ">
        {/* pc_1 */}
        <div className="border-gray-300 border-2 rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                color="success"
                classNames={{
                  base: "border-transparent  ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6 ">
                      {/* col-1 */}
                      <div className="flex flex-col">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
        {/* pc_2 */}
        <div className="border-gray-300 border-2  rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                classNames={{
                  base: "border-transparent ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6  ">
                      {/* col-1 */}
                      <div className="flex flex-col ">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>

        {/* pc-3 */}
        <div className="border-gray-300 border-2 rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                classNames={{
                  base: "border-transparent ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6 ">
                      {/* col-1 */}
                      <div className="flex flex-col">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
      </div>
      {/* Design end */}

      {/* custum start */}

      <p className="subheading lg:my-10 my-5 flex  items-center">
        Custom{" "}
        <span className="ml-4 bg-[#EC9430]  rounded-full p-[2px]">
          <IoAddOutline color="white" onClick={onOpen} className="cursor-pointer"/>
        </span>
      </p>

      {/* office */}
      <div className="grid lg:grid-cols-3 gap-3 max-w-[800px] ">
        {/* pc_1 */}
        <div className="border-gray-300 border-2 rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                color="success"
                classNames={{
                  base: "border-transparent  ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6 ">
                      {/* col-1 */}
                      <div className="flex flex-col">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
        {/* pc_2 */}
        <div className="border-gray-300 border-2  rounded-3xl shadow-lg">
          <div className="flex justify-between ">
            <div className="order-first p-3">
              <Checkbox
                radius="full"
                size="lg"
                classNames={{
                  base: "border-transparent ",
                  content: " px-3xl",
                }}
              ></Checkbox>
            </div>
            <div className="p-3 ">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  placement={placement}
                  content={
                    <div className="px-1 py-2 flex flex-row gap-6  ">
                      {/* col-1 */}
                      <div className="flex flex-col ">
                        <p className="text-lg font-normal">Ram</p>
                        <p className="text-lg font-normal">CPU</p>
                        <p className="text-lg font-normal">DISK</p>
                        <p className="text-lg font-normal">VRAM</p>
                      </div>

                      {/* col-1 */}

                      <div className="flex flex-col">
                        <p className="text-lg font-medium">64</p>
                        <p className="text-lg font-medium">32 Core</p>
                        <p className="text-lg font-medium">2 TB</p>
                        <p className="text-lg font-medium">8 GB</p>
                      </div>
                    </div>
                  }
                  color="secondary"
                >
                  <p className="text-default-500 border-[2px] border-gray-300 rounded-full px-2 py-[0.5px]  ">
                    i
                  </p>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src={"/images/welcome/virualMachine1.png"}
              alt="table"
              width={100}
              height={100}
              className=" w-auto h-[100px] "
            />
          </div>
          <div className="flex justify-center my-4">
            <p className="bg-[#FFEBE2] px-7 py-1 rounded-md ">Minimum</p>
          </div>
        </div>
      </div>
      {/* custum end */}

      {/* modal */}
    
      <div className="border-gray-500 flex justify-end">
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    classNames={{
      body: "",
      base: "border-[#292f46] flex",
      header: "border-[#292f46]",
      footer: "border-[#292f46]",
      closeButton: "hover:bg-white/5 active:bg-white/10",
    }}
    className="lg:mx-14 mx-2  max-w-lg " // Set the maximum width and full width
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1"></ModalHeader>
          <ModalBody>
            <div className="flex justify-between ">
              <p className="font-bold lg:text-2xl text-lg  ">
                Create <span className="lg:text-xl text-medium lg:font-bold font-normal"> Template</span>{" "}
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
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-1 sm:mt-2 mt-3  ">Ram</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-3 mt-5 ">CPU</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-4 mt-4 ">DISK</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-5 mt-6  ">VRAM</p>
              </div>

              {/* col-2 */}
              <div className="flex flex-col ">
                <div class="flex items-center justify-between  border[#F6F6F6] border-[1px]  mb-3  min-w-[200px]  rounded-lg">
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3">-</span>
                  <div class="text-lg font-bold min-w-[100px] text-center">64</div>
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0]   px-3">+</span>
                </div>

                <div class="flex items-center justify-between  border[#F6F6F6] border-[1px]   mb-3  min-w-[200px]  rounded-lg">
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3">-</span>
                  <div class="text-lg font-bold min-w-[100px] text-center">2</div>
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0]   px-3">+</span>
                </div>
                <div class="flex items-center justify-between  border[#F6F6F6] border-[1px] mb-3   min-w-[200px]  rounded-lg">
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3">-</span>
                  <div class="text-lg font-bold min-w-[100px] text-center">8</div>
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0]   px-3">+</span>
                </div>
                <div class="flex items-center justify-between  border[#F6F6F6] border-[1px]  mb-3  min-w-[200px]  rounded-lg">
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0] px-3">-</span>
                  <div class="text-lg font-bold min-w-[100px] text-center">2</div>
                  <span class="text-lg font-medium bg-[#F4FBFF] text-[#4B9AD0]   px-3">+</span>
                </div>
              </div>

              {/* col-3 */}
              <div className="flex flex-col ">
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-1 sm:mt-2 mt-3  ">GB</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-3 mt-5 ">CORE</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-4 mt-4 ">TB</p>
                <p className="lg:text-lg sm:text-base text-sm font-normal  lg:mt-3 sm:mt-5 mt-6  ">GB</p>
              </div>
            </div>
          </ModalBody>
          <div className="flex justify-center mb-2 mx-2">
            <Button
              color="black"
              variant="light"
              onPress={onClose}
              className="mx-1 px-16 border-gray-300 border-2"
            >
              Cancel
            </Button>
            <Button onPress={onClose} className="px-16 text-white bg-black">
              Create
            </Button>
          </div>
        </>
      )}
    </ModalContent>
  </Modal>
</div>

    </div>
  );
};

export default Page;
