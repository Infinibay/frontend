import { Avatar, AvatarIcon } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="root_bg h-[100vh] w-full mb-10">
      <div className="container mx-auto p-4 h-full">
        <div className="container mx-auto !pt-20 mb-20 lg:h-[20%]">
          <Image
            src={"/images/logo_1.png"}
            alt="table"
            width={300}
            height={300}
            className="w-full max-w-[300px] 2xl:max-w-[600px] "
          />
        </div>

        <div className="container grid  grid-cols-1 lg:grid-cols-2 gap-8 place-content-center place-items-center lg:h-[80%] ">
          {/* {/ col-1 /} */}

          <div className="w-full 5xl:place-self-start">
            <h2 className="font-extrabold heading2">Welcome !</h2>
            <p className="font-semibold heading2 mt-[30px]">
              User needs to connect an{" "}
              <span className="font-extrabold">USB</span>
            </p>
            <button
              className="group w-full  rounded-full py-8  border-2 font-medium text-black my-10 whitespace-nowrap relative "
              style={{ backgroundColor: "rgb(255, 0, 0, 0.1)" }}
            >
              <span className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Image
                  src={"/images/welcome/Vector.png"}
                  alt="table"
                  width={30}
                  height={30}
                  className="w-8 h-7 invert group-hover:invert-0"
                />
                <p className="para text-center"> Install</p>
              </span>
            </button>{" "}
          </div>

          {/* {/ col-2 /} */}
          <div className="h-full order-first lg:order-last">
            <Image
              src={"/images/welcome/usb.png"}
              alt="logo"
              height={1000}
              width={1000}
              className=" max-w-[400px] 3xl:max-w-[1000px]  h-full mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
