import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Personalized = () => {
  const data = [
    {
      img: "/images/personalized/personalizedIcon1.png",
      title: "Designer Users",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
    {
      img: "/images/personalized/personalizedIcon2.png",
      title: "Office/Basic Users",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
    {
      img: "/images/personalized/personalizedIcon3.png",
      title: "Go Beyond Storage",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
    {
      img: "/images/personalized/personalizedIcon4.png",
      title: "Multi-OS Users",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
    {
      img: "/images/personalized/personalizedIcon5.png",
      title: "Virtual Departments",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
    {
      img: "/images/personalized/personalizedIcon6.png",
      title: "OS Configuration",
      content:
        " Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam fames pretium nullam dictum lorem. Nunc diam vestibulum tristique ipsum dolor veneero.",
    },
  ];
  return (
    <div className="shadow-xl container mx-auto py-16 lg:px-16 lg:mb-40 px-5 relative">
      {/* heading */}
      <div className="mb-8 w-full">
        <h2 className="mainheading max-w-[500px] 4xl:max-w-[800px]  relative z-10">
          Personal
          <span className="relative">
            i
            <span className="absolute sm:right-[0px] right-[1px] lg:right-[0px] 4xl:right-[2px] lg:top-1 4xl:top-[12px] sm:top-[2px] top-[4px] bg-web_darkbrown rounded-full w-[10px] sm:w-[12px] lg:w-[14px] 4xl:w-[26px] h-[10px] sm:h-[12px] lg:h-[14px] 4xl:h-[26px] "></span>
          </span>
          zed <br />
          <span className="text-5xl">
            <span className="font-semibold"> To Your </span> Needs
          </span>
          <span className="text-web_darkbrown text-6xl">.</span>
        </h2>
        <Image
          src="/images/brownwave.png"
          width={500}
          height={500}
          alt="wave"
          className="md:block hidden w-full max-w-[500px] absolute right-0 top-10"
        />
      </div>

      {/* grid */}
      <div className="grid xl:grid-cols-3  lg:grid-cols-2 gap-4 sm:grid-cols-2 grid-cols-1 place-items-center">
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className="group persBox hover:GradientBlue h-full shadow-md flex flex-col justify-between items-start p-7 4xl:py-16 rounded-3xl"
            >
              <div className="flex flex-col justify-start items-start gap-2 ">
                <Image
                  src={item?.img}
                  alt="personalized Icon"
                  className="max-w-20 lg:max-w-32 4xl:w-40 min-h-[110px] 4xl:min-h-[140px] object-contain max-h-[100px]"
                  width={100}
                  height={100}
                />
                <h3 className="personalizeBoxHead my-4 group-hover:text-white">
                  {item?.title}
                </h3>
                <p className="group-hover:text-white pr-10 text-base lg:text-lg 2xl:text-xl 5xl:text-2xl line-clamp-3">
                  {item?.content}
                </p>
              </div>

              <Button
                as={Link}
                isBlock
                showAnchorIcon
                className="mt-8 text-web_dark text-base lg:text-lg 2xl:text-xl 5xl:text-2xl p-0 hover:after:!opacity-0 bg-transparent font-bold group-hover:text-white justify-between w-full"
                // href=""
                anchorIcon={
                  <span className="p-1 rounded-lg persicon">
                    <FaArrowRightLong className="text-3xl" />
                  </span>
                }
              >
                Learn More
              </Button>

              {/* <Link className="text-web_dark text-lg font-bold group-hover:text-white">
              
            </Link>
            <span className="bg-[#FFF9F2] p-2"></span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Personalized;
