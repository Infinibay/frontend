import React from "react";

export default function HeadingComp({ text1, text2, para }) {
  return (
    <div className="flex flex-col gap-6 w-[80%]">
      <h1 className="capitalize font-medium text-2xl 4xl:text-5xl sm:text-3xl lg:text-4xl">
        {text1}
        <span className="font-bold ml-3 ">{text2}</span>
        <span className="font-extrabold text-web_lightbrown ">.</span>
      </h1>

      <p className="4xl:text-[28px] font-medium mb-4 4xl:mb-6">{para}</p>
    </div>
  );
}
