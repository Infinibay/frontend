import React from "react";
import { FiSearch } from "react-icons/fi";
import { Button, Input, User } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

const HeadingComp2 = () => {
  return (
    <div className="flex justify-between xl:gap-32 lg:gap-20 md:gap-5">
      <div className="">
        <h2 className="text-3xl  4xl:text-4xl max-w-[830px]">
          Select{" "}
          <span className="text-3xl  4xl:text-4xl font-bold">
            Apps to Configure OS
          </span>
          <span className="text-web_lightbrown text-3xl font-extrabold">.</span>
        </h2>
      </div>
      {/* <div className="relative w-[300px] gap-8">
        <div className="absolute inset-y-0 flex items-center ml-1  pointer-events-none px-4">
          <FiSearch className="text-gray" />
        </div>

        <input
          type="text"
          placeholder="Search an application"
          className="text-gray bg-white px-14 py-2 border border-gray rounded w-full outline-none"
        />
      </div> */}
      <div className="flex items-center max-w-full lg:max-w-[450px] bg-[#F1F1F1] border-[1px] border-[#F1F1F1] rounded-2xl p-2  4xl:p-3 lg:mr-28">
        <FaSearch
          size={20}
          className="text-gray-500"
          style={{ color: "#000000" }}
        />
        <input
          type="text"
          placeholder="Search an application"
          className="outline-none border-none px-2 4xl:p-2 4xl:!text-2xl  bg-[#F1F1F1] w-full  lg:w-[400px]"
        />
      </div>
    </div>
  );
};

export default HeadingComp2;
