"use client";
import React, { useState } from "react";
import { osData } from "@/data";
import SelectOs from "./SelectOs";
import Image from "next/image";
import { IoCheckboxOutline } from "react-icons/io5";
import { Input } from "@nextui-org/react";

export default function FormOne() {
  const [selectedWindows, setSelectedWindows] = useState("");
  const [selectedLinux, setSelectedLinux] = useState("");

  const handleWindowsChange = (windowsType) => {
    setSelectedWindows(windowsType);
  };
  const handleLinuxChange = (linuxType) => {
    setSelectedLinux(linuxType);
  };
  const [deviceName, setDeviceName] = useState(false);
  const [selectedOS, setSelectedOS] = useState("windows");

  const handleRadioChange = (os) => {
    setSelectedOS(os);
  };
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-4 gap-4 md:place-content-center ">
      <div className="col-span-1 sm:col-span-3 w-[96%]">
        {/* input */}
        <div className="relative   bg-white rounded-2xl border border-web_borderGray mx-auto">
          <input
            placeholder="_"
            onChange={(e) => setDeviceName(e.target.value)}
            className="h-[80%] w-[90%] py-2 4xl:py-4 outline-none text-base 4xl:text-2xl   placeholder:text-web_placeHolder pl-4 pr-12 sm:pr-8 md:pr-14  ml-4 my-3"
          />
          <div className="absolute  top-1 translate-y-1/2 flex flex-row items-center gap-3  right-4  my-2">
            <p
              className={`capitalize text-xs 4xl:text-xl hidden md:block ${
                deviceName ? "text-web_green" : "text-web_placeHolder"
              }`}
            >
              {deviceName ? "Create Name" : "Name Created"}
            </p>
            <Image
              alt=""
              width={1000}
              height={1000}
              src={
                deviceName
                  ? "/images/form/greeenCloud.svg"
                  : "/images/form/redCloud.svg"
              }
              className="w-6 h-4 4xl:w-10 4xl:h-8"
            />
          </div>
        </div>
        <div
          className={`forWindows 4xl:my-16 w-full mt-10 grid place-items-center lg:grid-cols-2 grid-cols-1 gap-5 ${
            selectedOS === "windows" ? "grid" : "hidden"
          }`}
        >
          <div
            className={`border rounded-3xl shadow-sm p-10 4xl:px-16 4xl:py-24 w-full cursor-pointer
            ${
              selectedWindows === "Windows10"
                ? "border-web_green border-dashed"
                : ""
            }
            `}
            onClick={() => handleWindowsChange("Windows10")}
          >
            {/* Radio button with check icon */}
            <div
              className={`shadow-md h-8 w-8 4xl:h-10 4xl:w-10 border  rounded-full flex items-center justify-center ml-auto ${
                selectedWindows === "Windows10" ? "bg-green-500" : ""
              }`}
            >
              {selectedWindows === "Windows10" && (
                <svg
                  className="text-white h-4 w-4 4xl:h-6 4xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>

            <Image
              src="/images/windows10.png"
              alt="Windows 10"
              width={200}
              height={200}
              className="w-full max-w-[300px] 4xl:max-w-[400px] mx-auto"
            />
          </div>

          <div
            className={`border rounded-3xl shadow-sm p-10 4xl:p-16 4xl:py-24 w-full cursor-
            ${
              selectedWindows === "Windows11"
                ? "border-web_green border-dashed"
                : ""
            }
            `}
            onClick={() => handleWindowsChange("Windows11")}
          >
            {/* Radio button with check icon */}
            <div
              className={`shadow-md h-8 w-8 4xl:h-10 4xl:w-10 border rounded-full flex items-center justify-center ml-auto ${
                selectedWindows === "Windows11" ? "bg-green-500" : ""
              }`}
            >
              {selectedWindows === "Windows11" && (
                <svg
                  className="text-white h-4 w-4 4xl:h-6 4xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>

            <Image
              src="/images/windows11.png"
              alt="Windows 11"
              width={200}
              height={200}
              className="w-full max-w-[300px] 4xl:max-w-[400px] mx-auto"
            />
          </div>
        </div>
        <div
          className={`forLinux w-full 4xl:my-16 mt-10 grid place-items-center lg:grid-cols-2 grid-cols-1 gap-5 ${
            selectedOS === "linux" ? "grid" : "hidden"
          }`}
        >
          <div
            className={`border  rounded-3xl shadow-sm p-11 4xl:p-16 4xl:py-24 w-full cursor-pointer
            ${
              selectedLinux === "redhat" ? "border-web_green border-dashed" : ""
            }
            `}
            onClick={() => handleLinuxChange("redhat")}
          >
            <div
              className={`shadow-md h-8 w-8 4xl:h-10 4xl:w-10 border rounded-full flex items-center justify-center ml-auto ${
                selectedLinux === "redhat" ? "bg-green-500" : ""
              }`}
            >
              {selectedLinux === "redhat" && (
                <svg
                  className="text-white h-4 w-4 4xl:h-6 4xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>

            <Image
              src="/images/redhat.png"
              alt="Windows 10"
              width={200}
              height={200}
              className="w-full max-w-[300px]  mx-auto 4xl:max-w-[400px] "
            />
          </div>

          <div
            className={`border rounded-3xl shadow-sm p-10 4xl:p-16 4xl:py-24 w-full cursor-
            ${
              selectedLinux === "ubuntu" ? "border-web_green border-dashed" : ""
            }
            `}
            onClick={() => handleLinuxChange("ubuntu")}
          >
            <div
              className={`shadow-md h-8 w-8 4xl:h-10 4xl:w-10 border rounded-full flex items-center justify-center ml-auto ${
                selectedLinux === "ubuntu" ? "bg-green-500" : ""
              }`}
            >
              {selectedLinux === "ubuntu" && (
                <svg
                  className="text-white h-4 w-4 4xl:h-6 4xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>

            <Image
              src="/images/ubuntu.png"
              alt="Windows 11"
              width={200}
              height={200}
              className="w-full max-w-[300px] mx-auto 4xl:max-w-[400px] "
            />
          </div>
        </div>
        <div className="mt-10 4xl:mt:20">
          <div className="flexbox">
            <h3 className="4xl:mb:4 text-2xl 4xl:text-5xl font-bold">
              License
            </h3>
            <h3 className="text-2xl 4xl:text-3xl flex gap-2 font-bold text-[#484848] items-center">
              No-License{" "}
              <span>
                {" "}
                <IoCheckboxOutline className="text-3xl text-web_lightbrown" />{" "}
              </span>{" "}
            </h3>
          </div>
          <p className="4xl:text-[28px] font-medium mt-2 4xl:mt-6">
            Enter the window license key if you have a license windows purchased
          </p>
          <div className="flex gap-2 mt-5 4xl:mt-8 items-center flex-nowrap w-full">
            <Input
              type="text"
              classNames={{
                input: "4xl:text-[28px]",
                inputWrapper:
                  "shadow-md 4xl:p-10 4xl:py-12 border bg-transparent",
              }}
            />
            {" - "}
            <Input
              type="text"
              classNames={{
                input: "4xl:text-[28px]",
                inputWrapper:
                  "shadow-md border 4xl:p-10 4xl:py-12 bg-transparent",
              }}
            />
            {" - "}
            <Input
              type="text"
              classNames={{
                input: "4xl:text-[28px]",
                inputWrapper:
                  "shadow-md border 4xl:p-10 4xl:py-12 bg-transparent",
              }}
            />
            {" - "}
            <Input
              type="text"
              classNames={{
                input: "4xl:text-[28px]",
                inputWrapper:
                  "shadow-md border 4xl:p-10 4xl:py-12 bg-transparent",
              }}
            />
          </div>
        </div>
      </div>
      {/* <SelectOs data={osData} os={os} setOs={setOs} /> */}
      <div className="flex flex-col gap-4 justify-center items-center col-span-1 border-t border-l-0 sm:border-l sm:border-t-0 border-web_borderGray">
        <div className="" onClick={() => handleRadioChange("windows")}>
          <div className="flex flex-row gap-2">
            <input
              name="os"
              type="radio"
              id="window"
              checked={selectedOS === "windows"}
              onChange={() => handleRadioChange("windows")}
              className="accent-web_green"
            />
            <label
              htmlFor="window"
              className="font-bold 4xl:text-2xl  cursor-pointer"
            >
              Windows
            </label>
          </div>
          <div
            className={`flex justify-center items-center max-w-[100px] 4xl:max-w-[140px] border-x-8 border-t-4 border-b-[30px] rounded-2xl
            ${
              selectedOS === "windows"
                ? "border-web_green"
                : "border-web_borderGray"
            }
          `}
          >
            <Image
              width={1000}
              height={1000}
              src="/images/windowsIcon.png"
              alt="Windows Icon"
              className="w-full 4xl:w-28 h-full object-contain rounded-xl bg-white p-4"
            />
          </div>
        </div>
        <div onClick={() => handleRadioChange("linux")}>
          <div
            className={`flex justify-center items-center max-w-[100px]  4xl:max-w-[140px] border-x-8 border-b-4 border-t-[30px] rounded-2xl
            ${
              selectedOS === "linux"
                ? "border-web_green"
                : "border-web_borderGray"
            }
          `}
          >
            <Image
              width={1000}
              height={1000}
              src="/images/linuxIcon.png"
              alt="Linux Icon"
              onChange={() => handleRadioChange("linux")}
              className=" h-full w-20 4xl:w-28 object-contain rounded-xl bg-white p-4"
            />
          </div>
          <div className="justify-center flex flex-row gap-2">
            <input
              name="os"
              type="radio"
              id="linux"
              checked={selectedOS === "linux"}
              onChange={() => handleRadioChange("linux")}
              className="accent-web_green"
            />
            <label
              htmlFor="linux"
              className="font-bold 4xl:text-2xl cursor-pointer"
            >
              Linux
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
