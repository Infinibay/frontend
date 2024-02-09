"use client";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const XIcon = () => {
  const router = useRouter();
  return (
    <div onClick={() => router.back()} className="absolute top-0 right-0 ">
      <Image
        className="w-6 h-6 cursor-pointer "
        alt="cross-icon"
        src="/images/xicon.svg"
      />
    </div>
  );
};

export default XIcon;
