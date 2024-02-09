import { Image } from "@nextui-org/react";
import React from "react";

const AuthHeader = ({text}) => {
  return (
    <div className="flex justify-start items-center gap-4">
      <Image
        alt="NextUI hero Image"
        src="/images/backArrow.png"
        className=" w-10  h-10 4xl:w-20 4xl:h-20"
      />
      <p className="font-medium text-[#949494] text-xl 4xl:text-3xl">{text }</p>
    </div>
  );
};

export default AuthHeader;
