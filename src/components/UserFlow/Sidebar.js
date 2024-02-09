"use client";
import { Image } from "@nextui-org/react";
import React, { useState } from "react";
import { FaLaptop, FaRegRegistered } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdGridOn } from "react-icons/md";
import { CgAddR } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { RxCrossCircled } from "react-icons/rx";

const Sidebar = ({ userSideBar, setUserSidebar }) => {
  const [addNewDepart, setAddNewDepart] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [addMore, setAddMore] = useState(true);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/dashboard/departments?type=${inputVal}`);
    setAddNewDepart(false);
    // setInputVal("");
    setAddMore(false);
  };

  return (
    <div
      className={`sidebarGradient z-10 fixed h-full transition-all duration-500 w-full max-w-[300px] ${
        userSideBar ? "translate-x-0" : "translate-x-[-310px] "
      } 4xl:max-w-[500px] pt-20`}
    >
      <RxCrossCircled
        onClick={() => setUserSidebar((prev) => !prev)}
        className="w-8 h-8 lg:hidden -mt-12 float-right mr-6 text-white mb-12"
      />
      <Image
        className="max-w-[200px] 4xl:max-w-[300px] 4xl:ml-8  mx-auto"
        src="/images/sidebarLogo.png"
        width={300}
        height={300}
        alt="logo"
      />
      <ul className="pt-20 space-y-6 text-white font-medium text-lg pr-10">
        <li className="">
          <Link
            href={"/dashboard "}
            className="sidebarList 4xl:py-6 4xl:text-4xl"
          >
            <span>
              <FaLaptop className="text-2xl 4xl:text-4xl text-white" />
            </span>
            <span>My System</span>
          </Link>
        </li>
        <Link
          href={"/dashboard/settings"}
          className="sidebarList 4xl:py-6 4xl:text-4xl"
        >
          <span>
            <IoSettingsOutline className="text-2xl 4xl:text-4xl text-white" />
          </span>
          <span>Settings</span>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
