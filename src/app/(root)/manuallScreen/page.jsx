import { Avatar, AvatarIcon } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="root_bg h-[100vh] ">
      <div className="container mx-auto !pt-20 mb-20">
        <Image
          src={"/images/logo_1.png"}
          alt="table"
          width={600}
          height={600}
          className="w-full max-w-[300px] 2xl:max-w-[400px]"
        />
      </div>

      <div className="w-full flex justify-center items-center h-[80%]">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-1">
          {/* col 1 */}
          <div className="t">
            <h2 className="font-extrabold lg:text-4xl text-3xl py-7 heading2">
              Welcome !
            </h2>
            <p className="font-semibold text-medium para">
              Virtual Desktop Setup{" "}
              <span className="font-extrabold">2 Steps</span> Away.
            </p>
            <p className="max-w-[850px] 2xl:max-w-[95%] text-base para">
              Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel quam
              massa eu. Tempor duis aenean felis quisque pulvinar libero.
              Elementum arcu nibh tincidunt condimentum. Ante sed amet accumsan
              pharetra viverra porttitor integer tempor ullamcorper. Mattis urna
              imperdiet eu lacus turpis risus sit enim. Ac risus vulputate est
              donec. Ut massa suspendisse arcu elementum. Adipiscing viverra
              phasellus ipsum elementum consectetur non tortor. Metus vitae amet
              natoque integer lacus id pellentesque.
            </p>
            <button className="group w-full 5xl:w-[60%] btnTransparent rounded-full py-8  border-2 font-medium text-black my-10 whitespace-nowrap relative">
              <span className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Image
                  src={"/images/welcome/Vector.png"}
                  alt="table"
                  width={30}
                  height={30}
                  className="w-8 h-7 invert group-hover:invert-0"
                />
                <p className=" text-center para"> Install</p>
              </span>
            </button>{" "}
          </div>

          {/* col-2 */}
          <div className="relative min-w-[450px] w-full order-first lg:order-last ">
            <Image
              src={"/images/welcome/manuallScreen.png"}
              alt="table"
              width={2000}
              height={2000}
              className="w-full  object-top lg:absolute -top-28"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
