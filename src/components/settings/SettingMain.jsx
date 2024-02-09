"use client";

import React, { useState, useEffect } from "react";

import Box2 from "./Box2";
import Box1 from "./Box1";
import HeaderSetting from "../dashboard/HeaderSetting";

const SettingMain = () => {
  const sizes = ["3xl"];
  const placements = ["right-end"];
  const colors = ["primary"];

  return (
    <>
      <div className=" mx-auto lg:p-5 pt-5 !w-[95%] ">
        <Box1 />
        <Box2 />
      </div>
    </>
  );
};

export default SettingMain;
