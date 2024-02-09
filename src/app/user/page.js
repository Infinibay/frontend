import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import React from "react";

const page = () => {
  return (
    <div>
      <WelcomeScreen customUrl="/user/create-virtual-desktop" />
    </div>
  );
};

export default page;
