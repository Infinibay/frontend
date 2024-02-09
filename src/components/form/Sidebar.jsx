import React from "react";
// import Image from 'next/image'
import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className=" sticky left-0 top-0 bottom-0 h-[100vh] w-[20vw] xl:w-[18vw] hidden lg:flex flex-col formbarGradient items-center ">
      <div className=" absolute top-0 left-0 -z-1 h-[100vh] w-full">
        <Image
          width={1000}
          height={1000}
          src={"/images/form/formBg.png"}
          className="h-[100vh] w-full"
        />
      </div>
      {/* <div className="max-w-[200px] 4xl:max-w-[400px] border 4xl:max-h-full max-h-[200px] pt-[80px]">
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={"/images/form/logo.svg"}
          className="max-w-[200px] h-full"
        />
      </div> */}
      <Link href={"/"} className="pt-16 4xl:pt-28">
        <Image
          className="4xl:w-[350px]  w-[200px]  mx-auto"
          src="/images/sidebarLogo.png"
          width={1000}
          height={1000}
          alt="logo"
        />
      </Link>
    </div>
  );
}
