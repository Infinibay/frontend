import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const Steps = () => {
  return (
    <div className="container mx-auto px-0">
      <div className="shadow-xl relative mb-10 mt-60 2xl:border-b-[58px]  border-b-[38px] border-b-web_lightbrown mx-auto rounded-3xl">
        <div className="h-full wave2 lg:py-0 py-10 bg-web_lightBlue px-4 md:px-0 4xl:py-20 rounded-t-3xl flex justify-center lg:gap-10 lg:flex-nowrap flex-wrap ">
          <div className="max-w-[550px] 2xl:max-w-[800px] 4xl:max-w-[1200px] w-full h-full">
            <Image
              src="/images/steps.png"
              alt="steps"
              width={1050}
              height={1050}
              className="max-w-[550px] 2xl:max-w-[750px] 4xl:max-w-[1600px] lg:absolute 2xl:bottom-[-3.7rem] xl:-bottom-[2.7rem] lg:-bottom-[2.6rem] lg:block hidden"
            />
            <Image
              src="/images/steps2.png"
              alt="steps"
              width={400}
              height={400}
              className="max-w-[550px]  w-full 2xl:max-w-[800px] lg:absolute 2xl:bottom-[-3.7rem] xl:-bottom-[2.7rem] lg:-bottom-[2.6rem] lg:hidden block"
            />
          </div>
          {/* content */}
          <div className="max-w-[620px] py-14">
            <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl font-semibold 4xl:font-bold text-white">
              Set up Your Virtual Desktop In just <br />{" "}
              <span className="md:text-5xl text-3xl 4xl:text-6xl">2 Steps</span>
            </h3>
            <ul className="mt-8 space-y-5">
              <li className="flex gap-2 justify-start items-center">
                <span className="w-10">
                  <Image
                    src="/images/connect.png"
                    className="w-full"
                    width={20}
                    height={20}
                    alt="connect"
                  />
                </span>
                <span className="text-xl 2xl:text-2xl 4xl:text-3xl w-full font-semibold 4xl:font-bold text-white">
                  Connect an USB to your system.
                </span>
              </li>
              <li className="flex gap-2 justify-start items-center">
                <span className="w-10">
                  <Image
                    src="/images/connect.png"
                    className="w-full"
                    width={20}
                    height={20}
                    alt="connect"
                  />
                </span>
                <span className="text-xl 2xl:text-2xl 4xl:text-3xl w-full font-semibold 4xl:font-bold text-white">
                  Make a OS Installed Burned Portal USB.
                </span>
              </li>
            </ul>
            <Link href={"/dashboard/create-pc"} className="">
              <Button
                className="lg:absolute -bottom-[114px] xl:-bottom-16 xl:right-60 4xl:right-[940px] 4xl:rounded-2xl 4xl:text-3xl 4xl:p-12 4xl:!px-16  lg:right-32 bg-web_dark text-white xl:py-10 py-8 max-w-[400px] 4xl:max-w-[440px] w-full lg:text-2xl sm:text-xl text-lg sm:font-semibold"
                startContent={
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                    >
                      <path
                        d="M19 23.7503V3.16699M19 3.16699L23.75 8.70866M19 3.16699L14.25 8.70866"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.666 34.8341H25.3327C29.8103 34.8341 32.0508 34.8341 33.4409 33.4439C34.8327 32.0506 34.8327 29.8133 34.8327 25.3341V23.7507C34.8327 19.2731 34.8327 17.0342 33.4409 15.6425C32.2249 14.4265 30.3598 14.2729 26.916 14.2539M11.0827 14.2539C7.63893 14.2729 5.77377 14.4265 4.55777 15.6425C3.16602 17.0342 3.16602 19.2731 3.16602 23.7507V25.3341C3.16602 29.8133 3.16602 32.0522 4.55777 33.4439C5.03277 33.9189 5.60593 34.2308 6.33268 34.4367"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                }
              >
                Download & Install
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
