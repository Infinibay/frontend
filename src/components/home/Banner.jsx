import { Image, Link } from "@nextui-org/react";
import React from "react";

const Banner = () => {
  return (
    <div className="bannerBg bgCover w-full xl:min-h-[80vh]">
      <div className="container mx-auto wavebanner shadow-xl rounded-3xl bgCover !bg-top bg-white">
        <div className="flexboxReverse w-[95%] mx-auto py-20  xl:h-[60vh]">
          <div className="max-w-[600px] 4xl:max-w-[40%] w-full">
            <h3 className="subheading mb-6 text-xl 4xl:text-4xl ">
              <span className="font-extrabold">All-In-One </span> Dashboard For
            </h3>
            <h2 className="mainheading">
              V
              <span className="relative">
                i
                <span className="absolute sm:right-[0px] right-[1px] lg:right-[0px] 4xl:right-[2px] lg:top-1 4xl:top-[12px] sm:top-[2px] top-[4px] bg-web_darkbrown rounded-full w-[10px] sm:w-[12px] lg:w-[14px] 4xl:w-[26px] h-[10px] sm:h-[12px] lg:h-[14px] 4xl:h-[26px] "></span>
              </span>
              rtual Desktop{" "}
              <span className="font-normal 4xl:font-medium 4xl:block">
                Management
              </span>
            </h2>
            <Link
              href="/auth/sign-in"
              className="!text-white cursor-pointer 4xl:max-w-[840px]   btnGradientDarkBlue  justify-center mt-6 text-base lg:text-lg 2xl:text-2xl 4xl:text-3xl 4xl:py-6"
            >
              Get Started
            </Link>
          </div>
          <div className="max-w-[800px] lg:max-w-[50%] 4xl:max-w-[65%] relative w-full h-full">
            <Image
              className="lg:absolute 2xl:top-28 xl:top-20 4xl:top-[400px] object-contain w-full"
              src="/images/laptop.png"
              width={2000}
              alt="laptop"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
