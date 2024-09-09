"use client";
import { Button, Input, Link, User, Switch } from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Searchparams } from "@/utils/search-params";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { usePathname } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { VscBellDot } from "react-icons/vsc";
import TooltipComponent from "../tooltip/TooltipComponent";
import { HiMenu } from "react-icons/hi";
import { useQuery } from '@apollo/client';
import { CURRENT_USER_QUERY } from '@/graphql/queries';

const Header = ({ setUserSidebar, byDepartment, setByDepartment }) => {
  const type = Searchparams("type");
  const pathname = usePathname();
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.currentUser;
  return (
    <div className="bg-white relative shadow-md">
      <div
        onClick={() => setUserSidebar((prev) => !prev)}
        className="px-5 lg:hidden absolute top-[32%] my-auto "
      >
        <HiMenu className="w-7 h-7" />
      </div>
      <div
        className={`container px-[22px]  4xl:px-0 flex justify-between items-center gap-5 4xl:py-10 2xl:py-8 ${pathname === "/dashboard/settings"
          ? " max-w-[95%]"
          : pathname === "/user/dashboard"
            ? " max-w-[94%]  !px-0"
            : pathname === "/dashboard/notification"
              ? " max-w-[100%] 4xl:max-w-[98%]"
              : pathname === "/dashboard/users"
                ? " max-w-[95%] 4xl:max-w-[96%]"
                : pathname === "/dashboard/select-vm"
                  ? " max-w-[95%] !px-0"
                  : pathname === "/dashboard/create-pc"
                    ? " max-w-[95%] !px-0"
                    : pathname.includes("/dashboard/departments")
                      ? " max-w-[94%] !px-0"
                      : pathname === "/dashboard/select-vm"
                        ? " max-w-[95%] !px-0 border-2"
                        : "max-w-[95%]"
          } mx-auto py-2 w-full `}
      >
        {type ? (
          <h2 className="font-bold text-xl translate-x-10 lg:translate-x-0 4xl:text-4xl">
            {capitalizeFirstLetter(type)}
          </h2>
        ) : pathname === "/dashboard/departments" && !type ? (
          <h2 className="font-bold text-xl translate-x-10 lg:translate-x-0 4xl:text-3xl">
            Default
          </h2>
        ) : pathname === "/dashboard/create-pc" ||
          pathname === "/dashboard/select-vm" ? (
          <h2 className="font-bold text-xl translate-x-10 lg:translate-x-0 4xl:text-3xl">
            Default
          </h2>
        ) : (
          <Link
            href="/dashboard/create-pc"
            className="border translate-x-10 lg:translate-x-0 4xl:p-4 2xl:p-2 p-1  rounded-xl "
          >
            <Button
              className=" bg-transparent font-medium 4xl:text-2xl p-3    2xl:text-xl md:text-lg text-base"
              startContent={
                <IoMdAdd className="text-web_lightbrown 4xl:text-2xl  lg:text-base 2xl:text-xl text-xl mr-1" />
              }
            >
              Add New Pc
            </Button>
          </Link>
        )}
        <div className="flex gap-3 w-full  4xl:max-w-[1000px] 2xl:max-w-[800px] max-w-[600px] items-center">
          <div
            className={` opacity-0 lg:opacity-100 flex-1 flex w-full border 4xl:p-4  p-2 rounded-2xl ${pathname == "/dashboard/settings" ? "opacity-0" : ""
              }`}
          >
            <IoSearch className="!text-black  pointer-events-none flex-shrink-0  4xl:w-12 4xl:h-12  2xl:w-10 w-8 h-8 px-2" />
            <input
              type="text"
              className="!w-full 4xl:text-2xl 2xl:text-xl focus:outline-none "
              placeholder="Search an application"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={byDepartment}
              onChange={() => setByDepartment(!byDepartment)}
            />
            <span className="4xl:text-xl 2xl:text-lg text-sm">
              {byDepartment ? "By Department" : "All"}
            </span>
          </div>

          <Link
            href="/dashboard/settings"
            className="border cursor-pointer hover:bg-web_green rounded-lg 4xl:p-4 p-2 group bg-transparent font-medium transition"
          >
            <Image
              src={"/images/welcome/headerLoader.png"}
              color="black"
              alt="table"
              width={100}
              height={100}
              className="4xl:w-11 4xl:h-11  2xl:w-7 2xl:h-7 w-6 h-6 text-web_green group-hover:text-white"
            />
          </Link>
          <Link
            href="/dashboard/notification"
            className="border cursor-pointer hover:bg-web_green rounded-lg 4xl:p-4 p-2 group bg-transparent font-medium transition"
          >
            <TooltipComponent
              htmlTag={
                <VscBellDot className="4xl:w-11 4xl:h-11 2xl:w-7 2xl:h-7 w-6 h-6 text-web_green group-hover:text-white" />
              }
              param={
                <div className="relative">
                  <p
                    className={`absolute bottom-2 4xl:bottom-5 4xl:pb-1 shadow-md transform -translate-x-1/2 bg-neutral-200 4xl:text-4xl text-black`}
                  >
                    Notification
                  </p>
                </div>
              }
            />
          </Link>
          <Link className="border rounded-2xl" href="/dashboard/profile">
            <Image
              src={"https://i.pravatar.cc/150?u=a04258114e29026702d"}
              width={1000}
              height={1000}
              alt=""
              className="4xl:w-20 4xl:h-20  mr-1 w-12 h-12 rounded-2xl"
            ></Image>

            <p className="4xl:text-2xl 2xl:text-lg px-2 md:text-lg font-medium text-sm text-black">
              {user.firstName} {user.lastName}
            </p>
            <MdKeyboardArrowRight className="4xl:w-10 4xl:h-10 w-5 text-green-500 h-5 mr-2 rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
