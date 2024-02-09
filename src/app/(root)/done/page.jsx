"use client";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  }, []);

  return (
    <div className="root_bg min-h-screen w-full">
      <div className="container  mx-auto flex flex-col justify-center items-center h-[100vh] ">
        <div className="w-full  flex justify-center items-center mx-auto mt-12">
        <Image src="/images/logo_1.png" alt="table" width={1000} height={1000} className="logo" />
        </div>
        <h2 className="heading2 font-medium  mt-[120px]">
          Success<span className="text-black font-bold">fully Done </span><span className="text-[#EC9430]">!</span>
        </h2>
        <p className="text-center mt-[50px] max-w-[1240px] para">
          Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel quam
          massa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum
          arcu nibh tincidunt condimentum. Ante sed amet accumsan pharetra
          viverra porttitor integer tempor ullamcorper. Mattelementum.
          Adipiscing viverra phasellus ipsum elementum consectetur non tortor.
          Metus vitae amet natoque integer lacus id pellentesque.
        </p>
        <Image
          src="/images/welcome/correct.png"
          alt="table"
          width={300}
          height={300}
          className="mt-[70px] md:h-[232px] h-[220px] md:w-[296px]  w-[225px] "
        />
      </div>
    </div>
  );
};

export default Page;
