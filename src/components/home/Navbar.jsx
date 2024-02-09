import { Button, Image, Link } from "@nextui-org/react";
import React from "react";

const Navbar = () => {
  return (
    <div className="container sm:py-8 py-4 px-2">
      <div className="container flexbox flex-nowrap w-full mx-auto bg-white shadow-xl rounded-3xl sm:py-5 py-2 sm:px-5 px-2 ">
        <div className="min-w-[130px] md:max-w-[240px] max-w-[200px] 2xl:max-w-[20%]">
          <Image
            src="/images/logo_1.png"
            width={1000}
            height={1000}
            alt="logo"
            className=""
          />
        </div>
        <div className="flexbox !flex-nowrap scale-75 sm:scale-100 sm:max-w-[300px] max-w-[140px] 2xl:max-w-[25%] 5xl:max-w-[20%] w-full items-stretch">
          <Button
            as={Link}
            href="/auth/sign-up"
            className="btnTransparent text-[#1C77BF] font-semibold max-w-[150px] 2xl:max-w-[300px] sm:text-base 2xl:text-xl 4xl:text-3xl 2xl:py-6 4xl:py-9
          cursor-pointer w-full justify-center"
          >
            Sign up
          </Button>
          <Button
            as={Link}
            href="/auth/sign-in"
            className="hover:!text-white btnGradientDarkBlue hover:!bg-transparent max-w-[150px] 2xl:max-w-[300px]  sm:text-base 2xl:text-xl 4xl:text-3xl 2xl:py-6 4xl:py-9 cursor-pointer w-full justify-center"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
