import SettingMain from "@/components/settings/SettingMain";
import { SettingsHeader } from "@/app/settings/components/SettingsHeader";
import React from "react";

const page = () => {
  return (
    <div className="pb-4 lg:pb-0">
      <SettingsHeader />
      <SettingMain />
    </div>
  );
};

export default page;
