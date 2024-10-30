"use client";
import Navigation from "@/components/dashboard/Navigation";
import FormOne from "@/components/form/FormOne";
import HeadingComp from "@/components/form/HeadingComp";
import NextPrevButtons from "@/components/form/NextPrevButtons";
import XIcon from "@/components/general/XIcon";
import { step1Heading } from "@/data";
import { Button, Image, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <div className="4xl:pt-10">
      <div className="relative w-[96%]">
        <div onClick={() => router.back()} className="absolute top-0 right-0 ">
          <Image
            className="w-6 h-6 cursor-pointer "
            alt="cross-icon"
            src="/images/xicon.svg"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:gap-12 4xl:gap-16">
        <HeadingComp
          text1={step1Heading.text1}
          text2={step1Heading.text2}
          para={step1Heading.para}
        />
        {/* <XIcon /> */}
        <FormOne />
        {/* <Navigation nextUrl={"/user/select-machine"} /> */}
        <div className="w-[71%] !bg-white z-10 4xl:mt-64 mt-10 rounded-r-full rounded-l-full border-2 border-web_borderGray flex flex-row justify-between">
          <div className="w-full text-white">.</div>
          <Button
            as={Link}
            href={"/user/select-machine"}
            className="btnGradientLightBlue px-8 scale-[1.25] max-w-fit 4xl:max-w-[250px]  w-full ml-auto 4xl:rounded-3xl 4xl:py-[30px] 4xl:text-3xl 4xl:ml-2 "
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
