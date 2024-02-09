import Navigation from "@/components/dashboard/Navigation";
import HeadingComp2 from "@/components/form/HeadingComp2";
import NextPrevButtons from "@/components/form/NextPrevButtons";
import Main from "@/components/step3/Main";
import SocialAppsCard from "@/components/step3/SocialAppsCard";
import React from "react";

const Page = () => {
  return (
    <div>
      <Main />
      <Navigation prevUrl="/manual-install/select-computer-machine" nextUrl="/dashboard" />
    </div>
  );
};

export default Page;
