"use client";
import Image from "next/image";
import React, { useState } from "react";

const UserPc = ({ pc, selectedPc }) => {
  const cssClass = "rounded-t-xl px-10 py-6 4xl:p-14 4xl:px-16 relative" + (selectedPc?.id === pc?.id ? " bg-web_aquablue/20" : " text-black");
  return (
    <div
      className={`flex 2xl:max-w-[280px] lg:max-w-[200px] sm:max-w-[150px] cursor-pointer  flex-col transitioncustom justify-center items-center w-full relative  rounded-2xl ${selectedPc === pc?.id
        ? "border border-dashed border-web_aquablue bg-web_lightBlue/20"
        : "bg-white border border-dashed border-transparent"
        }`}
    >
      <div className={cssClass}>
        <Image
          src="/images/smallScreenmointer.png"
          width={1000}
          height={1000}
          alt="images"
          className="w-full 4xl:max-w-[340px] max-w-[100px] rounded-none"
        />
      </div>
      <div className="rounded-b-xl  text-white 4xl:text-2xl  xl:text-base text-sm px-5 line-clamp-1 py-1.5 4xl:py-2 bg-web_dark w-full">
        {pc?.name}
      </div>
      <Image
        src="/images/avatar.png"
        width={1000}
        height={1000}
        alt="images"
        className="shadow-xl  4xl:h-20 4xl:w-20  h-12 w-12  absolute -bottom-1.5 -right-2 rounded-full"
      />
      {pc?.status == "running" && (
        <div className=" w-5 h-5 bg-web_green rounded-full absolute -top-2 -right-2"></div>
      )}
      {pc?.status == "building" && (
        <div className=" w-5 h-5 bg-warning rounded-full absolute -top-2 -right-2"></div>
      )}
    </div>
  );
};

export default UserPc;
