"use client";
import React, { useState } from "react";
import { Image } from "@nextui-org/react";

export default function SelectOs({ data, os, setOs }) {
  const [slected, setSelected] = useState();
  return (
    <div className="flex flex-col gap-4 justify-center items-center col-span-1  border-t border-l-0 md:border-l md:border-t-0 border-web_borderGray ">
      <div className=" flex flex-row gap-2">
        <input type="radio" id="window" className="accent-web_green" />
        <label htmlFor="window" className="font-bold cursor-pointer">
          Windows
        </label>
      </div>

      <div className=" flex flex-col gap-7">
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className={`flex justify-center items-center p-5 max-w-[100px] max-h-[100px] border-x-8 rounded-2xl ${
                index === 1
                  ? "border-t-[20px] border-b-8"
                  : " border-t-8 border-b-[20px]"
              } ${
                slected === index ? "border-web_green" : "border-web_lightgray"
              }`}
            >
              <Image
                width={1000}
                height={1000}
                src={item?.img}
                alt="log"
                className={`w-full h-full object-contain ${
                  slected === index ? "" : "grayscale"
                }`}
              />
            </div>
          );
        })}
      </div>
      {slected === 1 && <div>Linux</div>}
    </div>
  );
}
