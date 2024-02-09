import React from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { IoIosInformationCircle } from "react-icons/io";

const SideCard = ({ onClose, sidecard }) => {
  return (
    <>
      {!sidecard?.status ? (
        <div className="flex items-center  justify-center fixed absolute top-0 right-0  lg:relative h-[100vh]">
          <div className=" 4xl:w-[700px] w-[500px] h-full shadow-xl px-4 py-2 border-l-[#DFDFDF] rounded-l-xl p-4 bg-white">
            <div className="flex justify-between items-center gap-5">
              <div className="flex gap-5 items-center">
                <Image
                  src={sidecard?.image}
                  width={1000}
                  height={1000}
                  className="4xl:w-[55px] w-[45px]"
                  alt="test"
                />
                <p className="font-bold 4xl:text-3xl text-xl 4xl:py-2">
                  {sidecard?.sidecard?.title}
                </p>
              </div>

              <div
                className="rounded flex items-center justify-center"
                onClick={onClose}
              >
                <button className="border px-5 4xl:py-2 py-1 rounded-lg flex gap-1 items-center justify-center text-[#DADADA]">
                  <AiOutlineClose
                    size={14}
                    color="#DADADA"
                    className="flex items-center justify-center "
                  />
                  Close
                </button>
              </div>
            </div>

            <div className="my-4">
              <Image
                src={
                  sidecard && sidecard?.sidecard && sidecard?.sidecard?.image
                    ? sidecard?.sidecard?.image
                    : ""
                }
                width={400}
                height={220}
                className="w-full h-auto"
                alt="notification"
              />
            </div>

            <div className="4xl:text-4xl text-sm">
              <p className="4xl:text-2xl text-sm">
                {sidecard?.sidecard?.description}
              </p>
              <p className="4xl:text-2xl text-sm mt-4">
                {" "}
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                a erat ultrices faucibus.
              </p>
              <h2 className="4xl:4xl text-2xl  font-bold my-3">
                {sidecard?.sidecard?.actionTitle}
              </h2>
              <p className="4xl:text-2xl text-sm">
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                at erat ultrices faucibus. Pellentesque molestie eget orci porta
                neque adipiscing vel nunc.
              </p>
              <p className="4xl:text-2xl text-sm mt-4">
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                at erat ultrices faucibus.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex  top-0 items-center justify-center absolute right-0 lg:relative h-[100vh]">
          <div className="  p-4 4xl:w-[700px] w-[500px]  h-full shadow-xl px-8 py-2 border-l-[#DFDFDF] rounded-l-xl bg-white">
            <div className="flex justify-between items-center gap-5">
              <div className="flex gap-5 items-center">
                <Image
                  src={"/images/notification/disksmall.png"}
                  width={1000}
                  height={1000}
                  className="4xl:w-[55px] w-[45px]"
                  alt="test"
                />
                <p className="font-bold 4xl:text-3xl text-xl">Account Block</p>
              </div>

              <div
                className="rounded flex items-center justify-center"
                onClick={onClose}
              >
                <button className="border px-5 4xl:py-2 py-1 rounded-lg flex gap-1 items-center justify-center text-[#DADADA]">
                  <AiOutlineClose
                    size={14}
                    color="#DADADA"
                    className="flex items-center justify-center "
                  />
                  Close
                </button>
              </div>
            </div>

            <div className="my-4 border border-[#D4D4D4] rounded-xl ml-4">
              <div className="flex -translate-x-4 gap-6 py-5">
                <Image
                  src={"/images/notification/Rectangle.png"}
                  width={130}
                  height={130}
                  className="4xl:h-40 4xl:w-40 w-30 h-30 "
                  alt="notification"
                />
                <div className="">
                  <p className="font-bold mb-2.5 4xl:text-2xl">
                    Jimmy Anderson
                  </p>
                  <div className="flex mb-[2px] gap-2">
                    <Image
                      alt="icon"
                      width={100}
                      height={100}
                      className="object-contain max-w-4 "
                      src={"/images/info.svg"}
                    />
                    <p className=" 4xl:text-xl text-sm text-red">
                      Suspicious Acts Attempt
                    </p>
                  </div>
                  <div className="flex gap-2 mb-[2px]">
                    <Image
                      alt="icon"
                      width={100}
                      height={100}
                      className="object-contain max-w-4 "
                      src={"/images/info.svg"}
                    />
                    <p className=" 4xl:text-xl text-sm text-red">
                      Dynamic Ip Traces
                    </p>
                  </div>
                  <div className="flex gap-2 mb-[2px]">
                    <Image
                      alt="icon"
                      width={100}
                      height={100}
                      className="object-contain max-w-4 "
                      src={"/images/info.svg"}
                    />
                    <p className="4xl:text-xl text-sm text-red">
                      Dynamic Ip Traces
                    </p>
                  </div>
                </div>
              </div>

              {/* <Image
                src={
                  sidecard && sidecard?.sidecard && sidecard?.sidecard?.image
                    ? sidecard?.sidecard?.image
                    : ""
                }
                width={400}
                height={220}
                className="w-full h-auto"
                alt="notification"
              /> */}
            </div>

            <div className="4xl:text-3xl text-sm">
              <p className="4xl:text-2xl text-sm ">
                {sidecard?.sidecard?.description}
              </p>
              <p className="mt-4 4xl:text-2xl text-sm ">
                {" "}
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                a erat ultrices faucibus.
              </p>
              <h2 className="4xl:4xl text-2xl font-bold my-3">
                What I Need To Do
              </h2>
              <p className="4xl:text-2xl text-sm ">
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                at erat ultrices faucibus. Pellentesque molestie eget orci porta
                neque adipiscing vel nunc.
              </p>
              <p className="mt-4 4xl:text-2xl text-sm ">
                Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas
                at erat ultrices faucibus.
              </p>

              <div className="mt-8 space-x-3  ">
                <Button className="bg-black text-white  w-48 4xl:text-xl 4xl:w-fit !py-5">
                  Unblock Account
                </Button>
                <Button className="bg-red-600 text-white  4xl:text-xl 4xl:w-fit !py-5">
                  Block IP
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideCard;
