// import NextPrevButtons from "@/components/form/NextPrevButtons";
import React from "react";
import SocialAppsCard from "./SocialAppsCard";
import HeadingComp2 from "../form/HeadingComp2";

const Main = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-12">
      <HeadingComp2 />
      <div className="flex-grow border-t border-[#EDEDED]  h-1"></div>
      <div className="lg:h-[60vh] h-[70vh] overflow-y-auto flex">
        <div className="flex-7">
          <SocialAppsCard />
        </div>
      </div>
    </div>
  );
};

export default Main;
