"use client";
import UserPc from "@/components/dashboard/UserPc";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import PcModal from "@/components/modal/PcModal";
import PcDetails from "@/components/dashboard/PcDetails";
import { BsGrid } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import { Searchparams } from "@/utils/search-params";
import { IoChevronDownOutline } from "react-icons/io5";
import Header from "@/components/dashboard/Header";
import Link from "next/link";

const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);
  const [selectedPc, setSelectedPc] = useState(null);
  const [pc, setPc] = useState(null);
  const router = useRouter();

  const computersArry = [
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
  ];

  const type = Searchparams("type");
  const pathname = usePathname();

  const [computers, setComputers] = useState(computersArry);

  // useEffect(() => {
  //   if (pathname === "/dashboard/departments" && type) {
  //     setComputers([]);
  //   }
  // }, [type]);

  const [play, setPlay] = useState(false);

  const [addNew, setAddNew] = useState(false);

  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [configure, setConfigure] = useState(false);
  const { isOpen1, onOpen1, onOpenChange1 } = useDisclosure();
  return (
    <>
      {/* <Header /> */}
      <div className="flex flex-1 justify-between overflow-hidden  w-full">
        <div className="flex border border-b-0 flex-col justify-between flex-1">
          {type == "sales" && (
            <div className={`border-b ${pcDetails && "border-r"}  py-6`}>
              <div className="dashboard_container flex  items-center justify-between w-full ">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setConfigure(false)}
                    className={`bg-white border ${
                      configure
                        ? "border-web_borderGray text-web_placeHolder"
                        : " bg-web_aquablue/10 border-sky-200 text-web_lightBlue"
                    } px-5 py-2 4xl:py-7 4xl:px-4 4xl:text-[25px] text-[15px] rounded-xl font-semibold  flex items-center justify-center `}
                    // size="sm"
                  >
                    Devices{" "}
                  </Button>
                  <Button
                    onClick={() => setConfigure(true)}
                    className={`bg-transparent border px-5 py-2 4xl:py-7 4xl:px-4 4xl:text-[25px] text-[15px] rounded-xl font-medium  flex items-center justify-center
                  ${
                    !configure
                      ? "border-web_borderGray text-web_placeHolder"
                      : " bg-web_aquablue/10 border-sky-200 text-web_lightBlue"
                  }
                  `}
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
            </div>
          )}
          {!configure && (
            <>
              <div
                className={` ${pcDetails && "border-r"} 4xl:py-10 pb-4  pt-6`}
              >
                <div className="dashboard_container flex  items-center justify-between w-full ">
                  <div className="flex items-center gap-4">
                    <Link href={"/dashboard/create-pc"}>
                      <Button
                        onClick={() => router.push("/dashboard/create-pc")}
                        startContent={
                          <FaPlus className="w-6 h-6 text-web_lightbrown" />
                        }
                        className="bg-transparent border-2 border-dashed border-web_borderGray px-5 py-2 4xl:py-8 4xl:px-8 4xl:text-[28px] text-[15px] rounded-xl font-medium text-web_dark flex items-center justify-center 4xl:font-semibold "
                        size="lg"
                      >
                        Create PC
                      </Button>
                    </Link>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="dashboard_container flex items-center gap-6">
                <h1 className="4xl:text-3xl text-lg sm:text-xl font-bold  text-gray-800">
                  Computer{" "}
                  <span className="font-semibold text-web_dark">Names</span>
                </h1>
                <hr className="flex-1" />
              </div>
            </>
          )}
          {!configure ? (
            <>
              {pathname === "/dashboard/departments" && type ? (
                <div className="flex-1 flex pt-20 justify-center dashboard_container">
                  <Image
                    alt="no-found"
                    src="/images/notFound.png"
                    className="max-w-[400px]"
                  />
                </div>
              ) : (
                <div className="flex-1 ">
                  {grid ? (
                    <div className="dashboard_container flex-1 ">
                      <h2 className="font-bold mt-8">Design</h2>
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
                              <UserPc
                                selectedPc={selectedPc}
                                key={pc?.id}
                                pc={pc}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <h2 className="font-bold mt-8">Development</h2>
                      <div className=" flex  gap-10 flex-wrap mt-8 w-full">
                        {computers.slice(2, 3).map((pc) => {
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
              )}
            </>
          ) : (
            <div className="flex-1 dashboard_container py-10">
              <h2 className="font-bold 4xl:text-4xl text-2xl">Network</h2>
              <div className="py-6 flex flex-col gap-4">
                <div className="border 4xl:max-w-[900px] max-w-[500px] 4xl:py-3 pl-4 rounded-xl bg-white flex items-center ">
                  <p className="font-semibold flex-1 4xl:text-2xl">IP Range</p>
                  <p className="font-semibold text-center flex-1 border-l  4xl:text-2xl  text-gray-400">
                    172.86.768
                  </p>
                  <div className="flex-1 text-right opacity-0 cursor-default">
                    <Button
                      className="text-web_borderGray  flex-1 bg-web_dark max-w-fit"
                      size=""
                      endContent={
                        <IoChevronDownOutline className="text-web_borderGray w-5 h-5" />
                      }
                    >
                      MB
                    </Button>
                  </div>
                </div>
                <div className="border  4xl:max-w-[900px] max-w-[500px] 4xl:py-3  pl-4 rounded-xl bg-white flex items-center ">
                  <p className="font-semibold flex-1 4xl:text-2xl">
                    Bandwidth Limit
                  </p>
                  <p className="font-semibold text-center flex-1 4xl:text-2xl border-l text-gray-400">
                    300
                  </p>
                  <div className="flex-1 text-right">
                    <Button
                      className="text-web_borderGray flex-1 bg-web_dark max-w-[350px] 4xl:p-8 4xl:text-2xl"
                      size=""
                      endContent={
                        <IoChevronDownOutline className="text-web_borderGray w-8 h-5" />
                      }
                    >
                      MB
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="btnTransparent w-fit text-web_lightBlue font-semibold 4xl:text-2xl 4xl:p-8">
                Set Network
              </Button>
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
    </>
  );
};

export default Page;
