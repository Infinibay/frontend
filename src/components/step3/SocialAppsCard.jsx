"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomSwitch from "./CustomSwitch";
import RequestForm from "./RequestForm";
import CredentialCard from "./CredentialCard";
import { usePathname, useRouter } from "next/navigation";
const data = [
  {
    id: 1,
    title: "Steam",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/steam.png",
  },
  {
    id: 2,
    title: "Microsoft Office",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/microsoft.png",
  },
  {
    id: 3,
    title: "Slack",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/slack.png",
  },
  {
    id: 4,
    title: "Adobe Acrobat",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/adobe.png",
  },
  {
    id: 5,
    title: "Google",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/google.png",
  },
  {
    id: 6,
    title: "Snapchat",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt gravidaa eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcuet natoque",
    image: "/images/step3/snapchat.png",
  },
];

const SocialAppsCard = () => {
  const pathname = usePathname();
  const [switchStates, setSwitchStates] = useState(data.map(() => false));
  const [card, setCard] = useState("");
  // console.log(switchStates);

  // const toggleSwitch = (index) => {
  //   console.log(switchStates)
  //   const newSwitchStates = [...switchStates];
  //   console.log(newSwitchStates)
  //   newSwitchStates[index] = !newSwitchStates[index];
  //   setSwitchStates(newSwitchStates);
  // };
  const toggleSwitch = (index, cardData) => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);
    setCard(cardData);
    // Access cardData here
    // console.log("Clicked Card Data:", cardData);
  };

  return (
    <>
      <div className="flex  justify-between xl:gap-32 lg:gap-20 md:gap-5 w-full">
        <div className="w-full">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`flex w-full md:flex-row flex-col ${
                pathname === "/step-3"
                  ? "4xl:max-w-[985px]"
                  : "border max-w-[830px] 4xl:max-w-full"
              }   my-5 gap-8 shadow-xl py-4  4xl:py-8 px-4 rounded-xl`}
            >
              <Image
                src={item.image}
                width={1000}
                height={1000}
                alt="test"
                className="w-[70px] h-[70px] flex items-center justify-center object-contain"
              />
              <div>
                <h1 className="text-lg 4xl:text-3xl font-bold">{item.title}</h1>{" "}
                <p className="text-sm 4xl:text-2xl text-[#6F6F6F]">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <CustomSwitch
                  isOn={switchStates[index]}
                  toggleSwitch={() => toggleSwitch(index, item)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {switchStates?.some((state) => state) && (
            <RequestForm
              card={card}
              switchStates={switchStates}
              setSwitchStates={setSwitchStates}
              data={data}
            />
          )}
          {/* {switchStates === true ? <RequestForm card={card} switchStates={switchStates} setSwitchStates={setSwitchStates} /> : null} */}
        </div>
        {/* {switchStates.some((state) => state) ? <RequestForm /> : ""} */}

        {/* {switchStates ? : ""} */}
      </div>
    </>
  );
};

export default SocialAppsCard;
