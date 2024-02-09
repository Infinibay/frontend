"use client";
import React, { lazy, useState } from "react";
import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  Switch,
  cn,
  useDisclosure,
} from "@nextui-org/react";
const Graph = dynamic(() => import("@/components/graph/Graph"), {
  ssr: false,
});

import { FiEdit3 } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PiSquaresFour } from "react-icons/pi";
import { PiUploadSimpleBold } from "react-icons/pi";
import dynamic from "next/dynamic";
import Header from "@/components/dashboard/Header";

const Page = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inpDisabled, setInpDisabled] = useState(true);
  const [grid, setGrid] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleEditButtonClick = () => {
    setInpDisabled((prevInpDisabled) => !prevInpDisabled);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {/* <Header /> */}
      <div className="grid px-4 grid-cols-6  lg:grid-cols-12 gap-2 mt-2">
        <div className="col-span-8 ">
          <h3 className="4xl:text-4xl lg:text-3xl pt-5 text-2xl font-medium lg:pl-10 pl-5">
            <b>Your</b> Profile
          </h3>
          <Divider className="my-5 bg-web_borderGray " />
          <div className="dashboard_container">
            <div
              className="flex border-2 max-w-[900px]  xl:max-w-[1100px] 4xl:max-w-[1200px]  w-full 
          gap-3 xl:gap-0 xxl:gap-10 items-center lg:justify-between justify-center  4xl:pr-16 pr-5  userPfp rounded-full lg:pb-0 lg:pb-0"
            >
              <div className="flex flex-nowrap gap-1 xl:gap-5 items-center w-full">
                <div className="max-w-[150px] xxl:max-w-[120px] w-full relative">
                  <Image
                    src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                    width={120}
                    height={120}
                    alt="profile"
                    className=" w-full bg-transparent shadow-lg  lg:w-full"
                    isZoomed
                  />
                  <Button
                    onPress={onOpen}
                    isIconOnly
                    aria-label="Like"
                    className="bg-web_dark rounded-[50px] absolute left-16 -top-2 z-10"
                  >
                    <PiUploadSimpleBold className="text-xl text-web_lightbrown" />
                  </Button>
                </div>
                <div className="xl:min-w-[190px] xxl:min-w-[220px]">
                  <h4 className="font-semibold lg:text-xl xl:text-2xl xxl:text-3xl flex xl:gap-3 xxl:gap-5 items-center">
                    <span className="4xl:text-[36px] text-[18px] ">
                      IFB uzzi**
                    </span>
                    <Image
                      src="/images/us_icon.svg"
                      alt="country"
                      width={30}
                      height={30}
                      className="rounded-none min-w-[20px]"
                    />
                  </h4>
                  <p className="4xl:text-[26px] 4xl:mt-2 xl:text-[14px]  font-medium">
                    Workspace Manager
                  </p>
                </div>
              </div>
              <Modal
                size=""
                classNames={{
                  body: "py-6",
                  backdrop: "bg-web_aquablue/20 backdrop-opacity-40",
                  base: "border-[#292f46] max-w-[300px] bg-gradient-to-b from-[#2484C6] to-[#2072AB] text-white text-center grid place-items-center",
                  closeButton:
                    "hover:bg-white/5 active:bg-white/10 text-white hover:text-web_lightblue",
                }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              >
                <ModalContent className=" 4xl:max-w-[750px] w-full 4xl:p-4">
                  {(onClose) => (
                    <>
                      <ModalBody className=" max-w-[300px] flex flex-col justify-center items-center w-full ">
                        <div className="4xl:min-w-[150px] 4xl:min-h-[120px] min-w-[100px] mx-auto shadow-xl flex bg-transparent justify-center rounded-full userPfp">
                          <Image
                            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                            width={120}
                            height={120}
                            alt="profile"
                            className="rounded-full h-full w-full mx-auto"
                            isZoomed
                          />
                        </div>
                        <div className="mt-4">
                          <Button className="border-white/20 border rounded-xl py-12 bg-transparent flex gap-4 flex-col text-white font-light">
                            <Image
                              src="/images/upload.svg"
                              className="w-6 h-9"
                              width={45}
                              height={45}
                              alt="upload profile picture"
                            />
                            <p className="4xl:text-2xl">Upload Photo</p>
                          </Button>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <div
                className="max-w-[330px] 4xl:max-w-[550px] 4xl:py-6 flex-nowrap w-full flex lg:justify-normal
             justify-center gap-2 xl:gap-3 xxl:gap-5 items-center"
              >
                <button
                  className="bg-transparent px-4 4xl:rounded-3xl rounded-2xl  justify-center 4xl:px-8 bg-white 4xl:py-4 py-2 4xl:text-3xl flex items-center gap-2 font-medium 4xl:font-semibold border"
                  onClick={handleEditButtonClick}
                >
                  {<FiEdit3 className="4xl:w-6 4xl:h-6 w-5 h-5  " />}
                  {"Edit"}
                </button>
                <div className="bg-white border pl-3 4xl:px-6 4xl:p-2 p-1 rounded-2xl 4xl:rounded-3xl flex items-center justify-between">
                  <Switch
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                        "justify-between cursor-pointer rounded-lg gap-2",
                        "bg-transparent"
                      ),
                      wrapper:
                        "p-0 h-8 overflow-visible w-[72px] 4xl:w-36 4xl:h-12 !bg-transparent border",
                      label: " !bg-transparent",
                      thumb: cn(
                        "w-8 h-8 4xl:w-24  border-2 shadow-lg 4xl:h-12",
                        //selected
                        "group-data-[selected=true]:ml-11 4xl:group-data-[selected=true]:ml-20 4xl:w-12 w-6 h-6 group-data-[selected=true]:bg-web_green bg-web_grayblack",
                        // pressed
                        "group-data-[pressed=true]:w-14",
                        "group-data-[selected]:group-data-[pressed]:ml-7"
                      ),
                    }}
                    defaultSelected
                    // size="sm"
                    color="success"
                    startContent={
                      <div>
                        <p className="text-medium 4xl:text-xl">off</p>
                      </div>
                    }
                    endContent={
                      <div>
                        <p className="text-medium 4xl:text-xl ">on</p>
                      </div>
                    }
                  >
                    <p className=" text-web_dark  4xl:text-3xl font-medium 4xl:font-semibold 4xl:py-2.5">
                      Notification
                    </p>
                  </Switch>
                </div>
              </div>
            </div>
            <form className="pt-6">
              <div className="w-full max-w-[550px] 4xl:max-w-[1100px] ">
                <label
                  htmlFor="Email"
                  className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                >
                  <input
                    type="text"
                    id="Email"
                    className={`peer border-none rounded-3xl px-8 4xl:py-6 p-4 4xl:text-2xl placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full 
                  ${
                    inpDisabled
                      ? "select-none cursor-not-allowed text-[#BABABA]"
                      : "text-black "
                  }
                  `}
                    placeholder="John Doe"
                    disabled={inpDisabled}
                  />
                  <span className="pointer-events-none absolute start-4 text-lg 4xl:text-3xl font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all">
                    Name
                  </span>
                </label>
              </div>
              <div className="w-full max-w-[550px] 4xl:max-w-[1100px] ">
                <label
                  htmlFor="Email"
                  className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                >
                  <input
                    type="text"
                    id="Email"
                    className={`peer border-none rounded-3xl px-8 4xl:py-6 p-4 4xl:text-3xl placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full 
                  ${
                    inpDisabled
                      ? "select-none cursor-not-allowed text-[#BABABA]"
                      : "text-black "
                  }
                  `}
                    placeholder="Infinibayuzzi@gmail.com"
                    disabled={inpDisabled}
                  />
                  <span className="pointer-events-none absolute start-4 text-lg 4xl:text-3xl font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all">
                    Email Address
                  </span>
                </label>
              </div>
              <div className="w-full max-w-[550px] 4xl:max-w-[1100px]">
                <label
                  htmlFor="Email"
                  className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                >
                  <input
                    type="number"
                    id="Email"
                    className={`peer border-none rounded-3xl px-8 4xl:py-6 p-4 4xl:text-3xl placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full 
                  ${
                    inpDisabled
                      ? "select-none cursor-not-allowed text-[#BABABA]"
                      : "text-black "
                  }
                  `}
                    placeholder="+1 422 242 2523"
                    disabled={inpDisabled}
                  />
                  <span className="pointer-events-none absolute start-4 text-lg 4xl:text-3xl font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all">
                    Phone No
                  </span>
                </label>
              </div>
              <div className="w-full max-w-[550px] 4xl:max-w-[1100px]">
                <label
                  htmlFor="Password"
                  className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`peer border-none rounded-3xl px-8 4xl:py-6 p-4 4xl:text-2xl placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full 
                  ${
                    inpDisabled
                      ? "select-none cursor-not-allowed text-[#BABABA]"
                      : "text-black "
                  }
                  `}
                    placeholder="*****************"
                    disabled={inpDisabled}
                  />
                  <span className="pointer-events-none absolute start-4 text-lg 4xl:text-3xl font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all">
                    Password
                  </span>

                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute end-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <FaEye className="text-[#C7C7C7] text-xl 4xl:text-4xl" />
                    ) : (
                      <FaEyeSlash className="text-[#C7C7C7] text-xl 4xl:text-4xl" />
                    )}
                  </button>
                </label>
              </div>
              {!inpDisabled && (
                <Button
                  size="xl"
                  className="w-full max-w-[550px] 4xl:h-20 4xl:max-w-[1100px]  rounded-full 4xl:!text-3xl 4xl:!font-semibold !py-6 4xl:!py-8 bg-[#EC9430] text-lg text-white font-normal my-10"
                >
                  {" "}
                  Update
                </Button>
              )}
            </form>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 h-full border-l-[#DFDFDF] border-spacing-2 border 4xl:p-8 p-5">
          <div className="justify-between gap-5 w-full my-4 flex">
            <h3 className=" 4xl:text-4xl  lg:text-2xl mr-auto text-xl w-fit  font-medium">
              Your <b>Current</b> System
            </h3>
            <div className="w-fit ml-auto" onClick={() => setGrid(!grid)}>
              <PiSquaresFour className="text-4xl 4xl:text-[48px] cursor-pointer hover:text-web_lightBlue hover:border-web_lightBlue text-web_placeHolder border  rounded-full p-1" />
            </div>
          </div>
          <div
            className={`flex items-center  flex-wrap  2xl:flex-nowrap select-none ${
              grid ? "justify-start" : " justify-center 2xl:justify-between"
            }`}
          >
            <Image
              className={`${!grid ? "block" : "hidden"} 4xl:min-w-[400px] `}
              src="/images/computer.svg"
              alt="computer"
              width={400}
              height={400}
              classNames="w-full w-[350px] 2xl:max-w-[350px]"
            />
            <div className="grid grid-cols-2 gap-5 max-w-[700px] mt-3 4xl:mx-0 mx-auto">
              <div
                className={`max-w-[200px]  w-full ${
                  grid ? "flex 4xl:min-w-[420px] gap-2 " : "4xl:min-w-[240px]"
                } `}
              >
                <Image
                  src={"/images/graph1.svg"}
                  width="auto"
                  height="auto"
                  className="rounded-none 4xl:min-w-[220px]"
                  alt="logo"
                ></Image>
                <div
                  className={`xl:max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-4xl text-lg font-semibold">CPU</h4>
                  <p className="font-medium 4xl:text-xl text-xs flex justify-between items-center gap-2">
                    <span>44%</span> <span>3.01 Ghz</span>
                  </p>
                </div>
              </div>
              <div
                className={`max-w-[200px] w-full ${
                  grid
                    ? "flex 4xl:min-w-[420px] gap-2 4xl:translate-x-20 "
                    : "4xl:min-w-[240px] "
                } `}
              >
                {/* <Graph
                  type={"area"}
                  data={[12, 22, 55, 88, 33, 11, 3, 7]}
                  colors={"#EC9430"}
                  categories={[12, 155, 22, 1, 22, 55, 33, 99, 88, 44, 66]}
                /> */}
                <Image
                  src={"/images/graph2.svg"}
                  width="auto"
                  className="rounded-none 4xl:min-w-[220px]"
                  height="auto"
                  alt="logo"
                ></Image>
                <div
                  className={`max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-4xl  text-lg font-semibold">
                    Memory
                  </h4>
                  <p className="font-medium 4xl:text-xl text-xs flex justify-between items-center gap-2">
                    <span>33.2/64.24GB</span> <span>(49%)</span>
                  </p>
                </div>
              </div>
              <div
                className={`max-w-[200px] w-full ${
                  grid ? "flex 4xl:min-w-[420px] gap-2  " : "4xl:min-w-[240px]"
                } `}
              >
                {" "}
                {/* <Graph
                  type={"area"}
                  data={[12, 22, 55, 88, 33, 11, 3, 7]}
                  colors={"#EC9430"}
                  categories={[12, 155, 22, 1, 22, 55, 33, 99, 88, 44, 66]}
                /> */}
                <Image
                  src={"/images/graph3.png"}
                  className="rounded-none 4xl:min-w-[220px]"
                  width="auto"
                  height="auto"
                  alt="logo"
                ></Image>
                <div
                  className={`max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-4xl  text-lg font-semibold">
                    Disk 0 (E:)
                  </h4>
                  <p className="font-medium 4xl:text-xl text-xs flex justify-between items-center gap-2">
                    HDD
                  </p>
                  <p className="font-medium  4xl:text-lg text-xs flex justify-between items-center gap-2">
                    0%
                  </p>
                </div>
              </div>
              <div
                className={`max-w-[200px] w-full ${
                  grid
                    ? "flex 4xl:min-w-[420px] gap-2 4xl:translate-x-20"
                    : "4xl:min-w-[240px] "
                } `}
              >
                {/* <Graph
                  type={"area"}
                  data={[12, 22, 55, 88, 33, 11, 3, 7]}
                  colors={"#EC9430"}
                  categories={[12, 155, 22, 1, 22, 55, 33, 99, 88, 44, 66]}
                /> */}
                <Image
                  src={"/images/graph4.svg"}
                  className="rounded-none 4xl:min-w-[220px]"
                  width="auto"
                  height="auto"
                  alt="logo"
                ></Image>
                <div
                  className={`max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-4xl  text-lg font-semibold">
                    Ethernet
                  </h4>
                  <p className="font-medium 4xl:text-xl text-xs flex justify-between items-center gap-2">
                    <span>S: 10</span> <span>R: 241 Kbps</span>
                  </p>
                </div>
              </div>
              <div
                className={`max-w-[200px]  w-full ${
                  grid ? "flex 4xl:min-w-[420px] gap-2 " : "4xl:min-w-[240px]"
                } `}
              >
                {/* <Graph
                  type={"area"}
                  data={[12, 22, 55, 88, 33, 11, 3, 7]}
                  colors={"#EC9430"}
                  categories={[12, 155, 22, 1, 22, 55, 33, 99, 88, 44, 66]}
                /> */}
                <Image
                  src={"/images/graph5.svg"}
                  className="rounded-none 4xl:min-w-[220px]"
                  width="auto"
                  height="auto"
                  alt="logo"
                ></Image>
                <div
                  className={`max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-4xl  text-lg font-semibold">GPU</h4>
                  <p className="font-medium 4xl:text-xl  text-xs flex justify-between items-center gap-2">
                    Nvidia 4060 (TM)
                  </p>
                  <p className="font-medium  4xl:text-xl  text-xs flex justify-between items-center gap-2">
                    <span>24%</span> <span>(39 C)</span>
                  </p>
                </div>
              </div>
              <div
                className={`  w-full ${
                  grid
                    ? "flex 4xl:min-w-[420px] gap-2 4xl:translate-x-20"
                    : "4xl:min-w-[240px] "
                } `}
              >
                <Image
                  src={"/images/graph6.svg"}
                  className="rounded-none 4xl:min-w-[220px]"
                  width="auto"
                  height="auto"
                  alt="logo"
                ></Image>
                <div
                  className={`max-w-[150px] w-full ${
                    grid ? "block" : "hidden"
                  }`}
                >
                  <h4 className="4xl:text-3xl  text-lg font-semibold">
                    Disk 1 (C:)
                  </h4>
                  <p>SSD</p>
                  <p className="font-medium 4xl:text-lg  text-xs flex justify-between items-center gap-2">
                    <span>31%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-8 4xl:space-y-3">
            <h4 className="4xl:text-4xl  text-2xl font-semibold pb-5">
              Specification
            </h4>
            <div className="space-y-6 pb-4">
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2  4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">
                  Computer Name
                </p>
                <p className="font-medium 4xl:text-3xl  text-sm">
                  uzziDesktop-K7Gl2Q
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">
                  Operating System
                </p>
                <p className="font-medium 4xl:text-3xl  text-sm">
                  Window 11 64 bit{" "}
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">Language</p>
                <p className="font-medium 4xl:text-3xl  text-sm">
                  English (Regional Setting){" "}
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">
                  System Model
                </p>
                <p className="font-medium 4xl:text-3xl  text-sm">
                  VMs Xeon Machines
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">BIOS</p>
                <p className="font-medium 4xl:text-3xl  text-sm">3019</p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">Processor</p>
                <p className="font-medium 4xl:text-3xl text-right text-sm">
                  Xeon E5141 i7-11425 @3.5 GHz (8 CPUs), 3.5GHZ
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">Memory</p>
                <p className="font-medium 4xl:text-3xl  text-sm">645252 RAM</p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2 4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">GPU</p>
                <p className="font-medium 4xl:text-3xl  text-sm">
                  Nvidia 4060 16 GB
                </p>
              </div>
              <div
                className="flex gap-5 justify-between items-center border rounded-3xl border-web_lightGrey 
             bg-[#FDFDFD] w-full py-2  4xl:py-7 px-4"
              >
                <p className="font-medium 4xl:text-3xl  text-sm">
                  Shared Memory
                </p>
                <p className="font-medium 4xl:text-3xl  text-sm">322521</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
