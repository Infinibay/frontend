import React from "react";
import { Switch, cn } from "@nextui-org/react";

export default function CustomSwitch({ isOn, toggleSwitch }) {
  return (
    // <Switch
    //   defaultSelected={false}
    //   // checked={isOn}
    //   onChange={toggleSwitch}
    //   size="lg"
    //   color="success"
    //   thumbIcon={({ isSelected, className }) => (
    //     <div className={`${className} ${isSelected ? 'on' : 'off'}`}>
    //       {isSelected ? '<span className="bg-web_grayblack text-transparent select-none">.</span>' : '<span className="bg-web_green text-transparent select-none">.</span>'}
    //     </div>
    //   )}
    // >
    // </Switch>
    <Switch
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
          "justify-between cursor-pointer rounded-lg gap-2 p-2",
          "bg-transparent"
        ),
        wrapper:
          "p-0 h-10 overflow-visible w-[100px] 4xl:w-52 4xl:h-16 !bg-transparent border",
        label: " !bg-transparent",
        thumb: cn(
          "w-14 h-8 4xl:w-30  border-2 shadow-lg 4xl:h-16",
          //selected
          "group-data-[selected=true]:ml-11 4xl:group-data-[selected=true]:ml-20 4xl:w-32 w-14 h-10 group-data-[selected=true]:bg-web_green bg-web_grayblack",
          // pressed
          "group-data-[pressed=true]:w-14",
          "group-data-[selected]:group-data-[pressed]:ml-7"
        ),
      }}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <span className="text-white p-3">On</span>
        ) : (
          <span className="text-white p-3  ">Off</span>
        )
      }
      defaultSelected={false}
      size="lg"
      color="success"
      onChange={toggleSwitch}
      startContent={<div><p className="text-medium 4xl:text-xl 4xl:ml-4">off</p></div>}
      endContent={<div><p className="text-medium 4xl:text-xl 4xl:mr-4">on</p></div>}
    ></Switch>
  );
}
