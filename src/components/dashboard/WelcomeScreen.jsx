import { Avatar, AvatarIcon, Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const WelcomeScreen = ({ customUrl }) => {
  return (
    <div className="root_bg h-[100vh] w-full 4xl:mt-16 mb-10 4xl:mb-0 relative">
      <div className="container !pt-20 mb-20 lg:h-[20%]">
        <Image
          src={"/images/logo_1.png"}
          alt="table"
          width={300}
          height={300}
          className="w-full max-w-[300px] 2xl:max-w-[400px] "
        />
      </div>

      {/* gird */}
      <div className=" container 4xl:-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[80%] ">
        {/* content */}
        <div className="flex flex-col justify-between py-12 lg:py-0 w-full ">
          <div className="">
            <h2 className="font-extrabold heading2 4xl:text-[100px] xl:text-5xl">
              Welcome !
            </h2>
            <p className="font-medium heading2 mt-[30px] 4xl:mt-[130px]">
              Virtual Desktop Setup{" "}
              <span className="font-extrabold">2 Steps</span> Away.
            </p>
            <p className="para max-w-[600px] 4xl:max-w-[85%] 4xl:mt-[80px] 4xl:!text-[32px] mt-[20px]  4xl:!leading-[54px] ">
              {`Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel quam
             massa eu. Tempor duis aenean felis quisque pulvinar libero.
             Elementum arcu nibh tincidunt condimentum. Ante sed amet accumsan
             pharetra viverra porttitor integer tempor ullamcorper. Mattis urna
             imperdiet eu lacus turpis risus sit enim. Ac risus vulputate est
             donec. Ut massa suspendisse arcu elementum. Adipiscing viverra
             phasellus ipsum elementum consectetur non tortor. Metus vitae amet
             natoque integer lacus id pellentesque.`}
            </p>
            <Button
              as={Link}
              size="xl"
              startContent={
                <Image
                  src="/images/welcome/Vector.png"
                  width={40}
                  height={40}
                  alt="install"
                />
              }
              href={customUrl || "/installing"}
              className="w-[90%] 2xl:w-[60%] xl:!mt-10 4xl:!mt-[85px] 4xl:w-[80%] rounded-full !py-6 2xl:!py-8 4xl:h-[105px]  btnGradientLightBlue para text-white font-medium 4xl:!text-4xl mt-5"
            >
              {" "}
              Install
            </Button>
          </div>

          {/* image */}
        </div>
        <div className="order-first lg:order-last min-h-[400px]">
          <Image
            src={"/images/welcome/welcome_1.png"}
            alt="table"
            width={1000}
            height={1000}
            className="w-full 4xl:max-w-[1600px] xl:max-w-[840px] max-w-[600px] mx-auto object-cover absolute right-0 4xl:-right-[0px] top-[45%] translate-y-[-65%] xl:translate-y-[-35%] 4xl:translate-y-[-48%]"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
