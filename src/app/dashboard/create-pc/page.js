"use client";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { BsGrid } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import FormOne from "@/components/form/FormOne";
import Header from "@/components/dashboard/Header";
import Link from "next/link";

const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);

  const router = useRouter();

  return (
    <>
      {/* <Header /> */}

      <div className="flex  justify-between overflow-hidden  w-full">
        <div className="flex flex-1 border border-b-0 flex-col justify-between">
          {/* <div className={``}>
            <div className="dashboard_container flex  items-center justify-between w-full "> */}
          {/* <div className="flex items-center gap-4"> */}
          {/* <Button
                className="bg-white border border-sky-200 px-5 py-2 text-[15px] rounded-xl font-semibold text-web_lightBlue flex items-center justify-center bg-web_aquablue/10"
                // size="sm"
              >
                Devices{" "}
              </Button>
              <Button
                className="bg-transparent border border-web_borderGray px-5 py-2 text-[15px] rounded-xl font-medium text-web_placeHolder flex items-center justify-center"
                // size="sm"
              >
                Configurationnnn{" "}
              </Button> */}
          {/* </div> */}
          {/* <BsGrid
                onClick={() => setGrid(!grid)}
                className={`w-10 cursor-pointer border h-10 p-[7px] rounded-xl border-web_aquablue/20 transitioncustom ${
                  grid
                    ? "bg-web_aquablue/20 text-web_aquablue"
                    : "text-web_placeHolder bg-white"
                } `}
              /> */}
          {/* </div>
          </div> */}
          <div className={` ${pcDetails && "border-r"} pt-6 4xl:pt-12`}>
            <div className="dashboard_container flex  items-center justify-between w-full ">
              <div className="flex  items-center gap-4">
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
              </div>
              <div></div>
            </div>
          </div>
          <div className="dashboard_container flex items-center gap-6 xl:mt-0 my-4 4xl:mt-8">
            <h1 className="4xl:text-3xl pt-4 text-lg sm:text-xl font-bold  text-gray-800">
              Computer{" "}
              <span className="font-semibold text-web_dark">Names</span>
            </h1>
            <hr className="flex-1" />
          </div>
          <div className="dashboard_container pb-12 4xl:py-52 4xl:-translate-y-40">
            <FormOne />
            <div className="w-[71%] mt-20 4xl:mt-48 rounded-r-full rounded-l-full border-2 border-web_borderGray flex flex-row justify-between  ">
              <div></div>
              <Button
                onClick={() => router.push("/dashboard/select-vm")}
                className="btnGradientLightBlue max-w-fit ml-auto px-8 scale-[1.25] 4xl:rounded-3xl 4xl:py-7 4xl:text-xl "
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
