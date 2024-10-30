"use client";
import UserPc from "@/components/dashboard/UserPc";
import {
  Button,
  Checkbox,
  Image,
  Link,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { BsGrid } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Navigation from "@/components/dashboard/Navigation";
import CreateVm from "@/components/dashboard/users/CreateVm";
import Main from "@/components/step3/Main";
import XIcon from "@/components/general/XIcon";

const Page = () => {
  const [grid, setGrid] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);

  const router = useRouter();

  const placements = ["right-end"];

  const [create, setCreate] = useState(false);

  return (
    <div className="flex flex-1 h-full justify-between overflow-hidden  w-full">
      <div className="flex  flex-col justify-between flex-1 ">
        <div className="dashboard_container flex-1 py-6 relative">
          <XIcon />
          {/*  */}
          <Main />
          <div className="lg:w-[72%] 4xl:w-[71%] w-[95%] mt-8 rounded-r-full rounded-l-full border-2 border-web_borderGray flex flex-row justify-between">
            <Button
              as={Link}
              href="/user/select-machine"
              className={`text-web_lightBlue uppercase font-semibold bg-transparent max-w-[150px] w-full 4xl:py-[30px] 4xl:text-2xl 4xl:px-5`}
            >
              previous
            </Button>
            <Button
              onClick={() => {
                setCreate(true);
                setTimeout(() => {
                  router.push("/user/dashboard");
                  // setCreate(false);
                }, 3000);
              }}
              className="btnGradientLightBlue px-8 scale-[1.25] max-w-fit 4xl:max-w-[250px]  w-full ml-auto 4xl:rounded-full 4xl:py-[30px] 4xl:text-3xl 4xl:ml-2 "
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      {create && <CreateVm initialLoading={true} />}
    </div>
  );
};

export default Page;
