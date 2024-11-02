import Image from "next/image";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const OSSwitch = ({ onChange, defaultValue }) => {
  const [selectedOS, setSelectedOS] = useState(defaultValue || "windows");

  const handleRadioChange = (os) => {
    setSelectedOS(os);
    if (onChange) {
      onChange(os);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center col-span-1 border-t border-l-0 sm:border-l sm:border-t-0 border-web_borderGray">
      <div className="" onClick={() => handleRadioChange("windows")}>
        <div className="flex flex-row gap-2 items-center cursor-pointer">
          {selectedOS === "windows" && <FaCheckCircle className="text-web_green" />}
          <label htmlFor="window" className="font-bold 4xl:text-2xl cursor-pointer">
            Windows
          </label>
        </div>
        <div className={`flex justify-center items-center max-w-[100px] 4xl:max-w-[140px] border-x-8 border-t-4 border-b-[30px] rounded-2xl ${selectedOS === "windows" ? "border-web_green" : "border-web_borderGray"}`}>
          <Image
            width={1000}
            height={1000}
            src="/images/windowsIcon.png"
            alt="Windows Icon"
            className="w-full 4xl:w-28 h-full object-contain rounded-xl bg-white p-4"
          />
        </div>
      </div>
      <div onClick={() => handleRadioChange("linux")}>
        <div className={`flex justify-center items-center max-w-[100px] 4xl:max-w-[140px] border-x-8 border-b-4 border-t-[30px] rounded-2xl ${selectedOS === "linux" ? "border-web_green" : "border-web_borderGray"}`}>
          <Image
            width={1000}
            height={1000}
            src="/images/linuxIcon.png"
            alt="Linux Icon"
            className="h-full w-20 4xl:w-28 object-contain rounded-xl bg-white p-4"
          />
        </div>
        <div className="justify-center flex flex-row gap-2 items-center cursor-pointer">
          {selectedOS === "linux" && <FaCheckCircle className="text-web_green" />}
          <label htmlFor="linux" className="font-bold 4xl:text-2xl cursor-pointer">
            Linux
          </label>
        </div>
      </div>
    </div>
  );
};

export default OSSwitch;