"use client";
import { Button, Input, Link, User } from "@nextui-org/react";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Searchparams } from "@/utils/search-params";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { usePathname } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiFillBell } from "react-icons/ai";

const HeaderSetting = () => {
  const type = Searchparams("type");
  const pathname = usePathname();

  return (
    <div className="bg-white shadow-md">
      <div className="dashboard_container flex justify-between items-center gap-5 py-4  w-full ">
        {type ? (
          <h2 className="font-bold text-xl">{capitalizeFirstLetter(type)}</h2>
        ) : pathname === "/dashboard/departments" && !type ? (
          <h2 className="font-bold text-xl">Default</h2>
        ) : (
          <Link href="/dashboard/create-pc">
            <Button
              className="border bg-transparent font-medium"
              startContent={<IoMdAdd className="text-web_lightbrown text-xl" />}
            >
              Add New Pc
            </Button>
          </Link>
        )}
        
        <div className="flex ">
          <Link
            href="/dashboard/notification"
            className="border cursor-pointer rounded-lg p-3 bg-transparent font-medium"
          >
            <AiFillBell  size={30} className="hover:text-orange-400" />
          </Link>
          <Button
            as={Link}
            href="/dashboard/profile"
            className="max-w-[173px] h-full items-center flex bg-transparent hover:bg-web_lightBlue/20 p-1 w-full userbox"
          >
            <User
              name="Jane Doe**"
              // description="Product Designer"
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
            <MdKeyboardArrowRight className="w-7 h-7" />
          </Button>
          </div>
      </div>
    </div>
  );
};

export default HeaderSetting;
