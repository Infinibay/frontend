import { Checkbox, Image, Tooltip } from "@nextui-org/react";
import React from "react";

const VMPC = ({ pc, selectedPc, toggle }) => {
  return (
    <div
      className={`${
        selectedPc?.includes(pc.id)
          ? "border border-dashed border-[#52C24A]"
          : " border-2"
      } rounded-3xl shadow-lg w-full 4xl:max-w-[300px]  max-w-[200px] `}
    >
      <div className="flex justify-between items-center">
        <div className="order-first p-3">
          <Checkbox
            onChange={toggle}
            radius="full"
            color="success"
            classNames={{
              base: "border-transparent",
              content: "px-3xl",
              icon: "text-white",
            }}
            size="lg"
            // isSelected={isSelected}
            isSelected={selectedPc?.includes(pc?.id)}
          />
        </div>
        <div className="p-3">
          <Tooltip
            placement={"right-end"}
            color="warning"
            content={
              <div className="px-1 py-2 flex flex-row gap-6 text-white max-w-[160px] ">
                <div className="flex flex-col">
                  {Object.entries(pc.specifications).map(([key, value]) => (
                    <p
                      key={key}
                      className="4xl:text-2xl lg:text-lg sm:text-base text-sm font-normal"
                    >
                      {key}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col">
                  {Object.entries(pc.specifications).map(([key, value]) => (
                    <p
                      key={key}
                      className="4xl:text-2xl lg:text-lg sm:text-base text-sm font-medium"
                    >
                      {value}
                    </p>
                  ))}
                </div>
              </div>
            }
          >
            <p className=" border-[2px] border-gray-300 rounded-full px-2 py-[0.5px] hover:bg-[#EC9430] hover:text-white text-black cursor-pointer">
              i
            </p>
          </Tooltip>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          src={pc.imageSrc}
          alt={pc.name}
          width={100}
          height={100}
          className=" w-auto 4xl:h-[100px] h-[70px] rounded-none "
        />
      </div>
      <div className="flex justify-center my-4">
        <p
          className={` ${
            pc.minimumText == "Minimum"
              ? "bg-[#FFEBE2]"
              : pc.minimumText == "Medium"
              ? "bg-[#FFFFE2]"
              : pc.minimumText == "Maximum"
              ? "bg-[#E2F6FF]"
              : "bg-[#F6F6F6]"
          } px-7 py-1 rounded-md text-sm 4xl:text-xl font-bold`}
        >
          {pc.minimumText}
        </p>
      </div>
    </div>
  );
};

export default VMPC;
