import { Button, Image } from "@nextui-org/react";
import React from "react";

const ConfigureVideo = () => {
  return (
    <div className="linesBg min-h-screen lg:w-full w-[94%] mx-auto lg:py-20 py-12 ">
      <div className="container mx-auto px-0">
        <div className="text-center max-w-[600px] 2xl:max-w-[1500px] mx-auto pb-10">
          <h3 className=" 5xl:text-5xl 2xl:text-4xl md:text-2xl text-xl font-bold capitalize">
            <span className="text-web_lightbrown font-medium ">Online</span>{" "}
            Tutorial Guides<span className="text-[#EC9430]">.</span>
          </h3>
          <h2 className="font-medium 2xl:text-6xl lg:text-4xl text-3xl pt-3">
            How To <span className="font-bold">Configure</span> Your{" "}
            <span className="font-bold">Virtual</span> Machine
            <span className="text-[#EC9430] font-bold">.</span>
          </h2>
        </div>
        <div className=" relative w-full rounded-3xl bg-black h-[80vh]">
          <div className=" flex justify-center items-center  w-full h-full max-w-[380px] md:max-w-[800px] 2xl:max-w-[1500px] overflow-hidden">
            <Image
              src="/images/videoLogo.png"
              alt="configure video"
              width={1500}
              height={1500}
              className="select-none max-w-[440px] md:max-w-[800px] 2xl:max-w-[1500px]"
            />
          </div>
          <div className="absolute  right-10 bottom-10 capitalize bg-transparent text-white sm:text-2xl text-xl flex items-center gap-5 max-w-[600px]">
            <span className="min-w-[120px] max-w-[400px]  text-2xl 2xl:text-5xl">
              play now
            </span>
            <Image
              src="/images/play.png"
              className="w-[60px] lg:w-[100px] object-contain"
              alt="play"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureVideo;
