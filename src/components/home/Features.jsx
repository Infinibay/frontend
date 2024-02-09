import { Button, Image } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const Features = () => {
  return (
    <div className="container mx-auto px-0">
      <div className=" mx-auto">
        <div className="flex md:flex-row flex-col gap-6 max-w-[85%] 4xl:max-w-[70%] 4xl:py-24 mx-auto  py-16">
          <h2 className="mainheading relative z-10 flex-1">
            <span className="font-semibold">Offering</span> Features
            <span className="text-web_darkbrown text-5xl">.</span>
          </h2>
          <p className=" para flex-1">
            Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames
            pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum
            dolor veneero.
          </p>
        </div>

        <div className="relative space-y-10 py-10 my-10 rounded-3xl shadow-lg bg-white mx-auto lg:px-3 sm:px-6 px-4">
          {/* first grid */}
          <div className="flexbox !items-start">
            {/* image */}
            <div className="w-full max-w-[800px] 4xl:max-w-[1400px] -translate-y-20 -translate-x-3">
              <Image
                src="/shade.svg"
                alt="feature1"
                width={1000}
                height={1000}
                className="w-full object-contain"
              />
            </div>
          </div>

          <div className="flexbox -translate-y-28 max-w-[85%] mx-auto !items-start">
            {/* image */}
            <div className="w-full lg:w-[40%]">
              <Image
                src="/images/feature1.png"
                alt="feature1"
                width={1000}
                height={1000}
                className="w-full"
              />
            </div>
            {/* content */}
            <div className="w-full lg:w-[60%] mr-auto text-left">
              <h2 className="heading2 font-semibold leading-8">
                Manage Your <span className="font-bold">Data</span>
                <span className="text-web_lightbrown text-5xl">.</span>
              </h2>
              <p className="py-7 leading-7 para">
                Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames
                pretium nullam dictum lorem. Nunc diam vestibulum tristique
                ipsum dolor veneero.Lorem ipsum dolor sit amet m nullam dictum
                lorem. Nunc diam vestibulum tristique ipsum dolor veneero.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">Data Management</span>{" "}
                </li>
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">Data Protection</span>{" "}
                </li>
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">Data Acceleration</span>{" "}
                </li>
              </ul>
            </div>
          </div>

          {/* second grid */}
          <div className="flexboxReverse max-w-[85%] mx-auto !items-start">
            {/* content */}
            <div className="w-full lg:w-[60%] lg:pt-10 mr-auto text-left">
              <h2 className="heading2 font-semibold leading-5">
                Specialize Your <span className="font-bold">System</span>
                <span className="text-web_lightbrown text-5xl">.</span>
              </h2>
              <p className="py-7 leading-7 para">
                Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames
                pretium nullam dictum lorem. Nunc diam vestibulum tristique
                ipsum dolor veneero.Lorem ipsum dolor sit amet m nullam dictum
                lorem. Nunc diam vestibulum tristique ipsum dolor veneero.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl  rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">Multi-Systems</span>{" "}
                </li>
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl  rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">Systems Utilities</span>{" "}
                </li>
                <li className="flex items-center gap-5 justify-start">
                  <span>
                    <IoShieldCheckmarkSharp className="text-web_lightbrown text-3xl 2xl:text-5xl  rounded-full p-[6px] bg-[#FFF9F2]" />{" "}
                  </span>{" "}
                  <span className="font-semibold para">
                    Hardware Management
                  </span>{" "}
                </li>
              </ul>
            </div>
            {/* image */}
            <div className=" w-full lg:w-[40%]">
              <Image
                src="/images/feature1.png"
                alt="feature1"
                className="w-full"
                width={1000}
                height={1000}
              />
            </div>
          </div>

          {/* third grid */}
          <div className="flexbox max-w-[85%] mx-auto !items-start">
            <div className="w-full lg:w-[40%]">
              <Image
                src="/images/feature3.png"
                alt="feature1"
                className="w-full"
                width={1000}
                height={1000}
              />
            </div>
            <div className="w-full lg:w-[60%] lg:pt-10 mr-auto text-left">
              <h2 className="heading2 font-semibold leading-5">
                Optimized User <span className="font-bold">Experience</span>
                <span className="text-web_lightbrown text-5xl">.</span>
              </h2>
              <p className="py-7 leading-7 para">
                Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames
                pretium nullam dictum lorem. Nunc diam vestibulum tristique
                ipsum dolor veneero.Lorem ipsum dolor sit amet m nullam dictum
                lorem. Nunc diam vestibulum tristique ipsum dolor veneero.
              </p>
              <Link href={"/auth/sign-up"}>
                <Button className="sm:w-[70%] w-full rounded-2xl py-6 4xl:rounded-3xl btnTransparent bg-web_aquablue text-[#1C77BF] font-semibold para  mt-5 4xl:py-10">
                  {" "}
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
