"use client";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { set } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/escale");
    }, 4000);
  }, []);
  return (
    <div className="container mx-auto flex flex-col justify-center items-center mt-6 h-[100vh]">
      <div className="w-full  flex justify-center items-center mx-auto mt-12">
        <Image
          src="/images/logo_1.png"
          alt="table"
          width={2000}
          height={2000}
          className="logo"
        />
      </div>
      <h2 className="font-bold text-4xl mt-[120px] heading2">
        Installing <span className="text-web_lightBlue">. . . . </span>
      </h2>
      <p className="text-center mt-[50px] max-w-[1240px] para">
        {`        Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel quam massa
        eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcu
        nibh tincidunt condimentum. Ante sed amet accumsan pharetra viverra
        porttitor integer tempor ullamcorper. Mattelementum. Adipiscing viverra
        phasellus ipsum elementum consectetur non tortor. Metus vitae amet
        natoque integer lacus id pellentesque.`}
      </p>
      <Image
        src="/images/welcome/loader.png"
        alt="table"
        width={350}
        height={350}
        className="mt-[70px] animate-spin 4xl:max-w-[350px]"
      />
    </div>
  );
};

export default Page;
