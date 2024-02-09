import Header from "@/components/dashboard/Header";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="root_bg min-h-screen ">
        <div className="container mx-auto mt-10 mb-20">
          <Image
            src={"/images/logo_1.png"}
            alt="table"
            width={300}
            height={300}
            className="w-full max-w-[300px]"
          />
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="container sm:mx-auto px-2 flexboxReverse">
            {/* col 1 */}
            <div className="max-w-[600px]">
              <h2 className="font-extrabold lg:text-4xl text-3xl py-7">
                Welcome !
              </h2>
              <p className="font-semibold lg:text-xl text-medium">
                Virtual Desktop Setup{" "}
                <span className="font-extrabold">2 Steps</span> Away.
              </p>
              <p className="max-w-[750px] text-base">
                Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel
                quam massa eu. Tempor duis aenean felis quisque pulvinar libero.
                Elementum arcu nibh tincidunt condimentum. Ante sed amet
                accumsan pharetra viverra porttitor integer tempor ullamcorper.
                Mattis urna imperdiet eu lacus turpis risus sit enim. Ac risus
                vulputate est donec. Ut massa suspendisse arcu elementum.
                Adipiscing viverra phasellus ipsum elementum consectetur non
                tortor. Metus vitae amet natoque integer lacus id pellentesque.
              </p>
              <button className="group w-full btnTransparent rounded-full py-8  border-2 font-medium text-black my-10 whitespace-nowrap relative">
                <span className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={"/images/welcome/Vector.png"}
                    alt="table"
                    width={30}
                    height={30}
                    className="w-8 h-7 invert group-hover:invert-0"
                  />
                  <p className="text-[14px] sm:text-base text-center">
                    {" "}
                    Install
                  </p>
                </span>
              </button>{" "}
            </div>

            {/* col-2 */}
            <div className="max-w-[600px] min-w-[450px] w-full">
              <Image
                src={"/images/welcome/manuallScreen.png"}
                alt="table"
                width={1000}
                height={1000}
                className="w-full max-w-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
