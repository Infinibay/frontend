import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
  cn,
  Button,
} from "@nextui-org/react";
import { FaPause, FaPlay, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Box3 from "./Box3";
import { Tooltip } from "@nextui-org/react";
import TooltipComponent from "../tooltip/TooltipComponent";

const Box2 = () => {
  // slider start

  //slider end

  const [size, setSize] = React.useState("4xl");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState(true);
  const [isSelected, setIsSelected] = React.useState(false);
  const [pause, setPause] = useState(null);
  const [heading, setheading] = useState(false);
  // console.log(selectedNode, "selected....");
  const [slectBox, setSelectBox] = useState(null);
  const [slectBox2, setSelectBox2] = useState(null);

  const handleLeftNodeClick = (node, index) => {
    // Toggle the selectedNode state
    setSelectedNode((prevSelectedNode) =>
      prevSelectedNode === node ? null : node
    );
    setheading(true);
    setSelectBox(index);
  };

  const handleLeftNodeClick2 = (node, index) => {
    // Toggle the selectedNode state
    setSelectedNode((prevSelectedNode) =>
      prevSelectedNode === node ? null : node
    );
    setheading(true);
    setSelectBox(index);
  };
  const placements = ["right-end"];

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };
  const nodesData = [
    {
      imageUrl: "/images/welcome/nodePc.png",
      title: "Nodes-1",
    },
    {
      imageUrl: "/images/welcome/nodePc.png",
      title: "Nodes-2",
    },
    {
      imageUrl: "/images/welcome/nodePc.png",
      title: "Nodes-3",
    },
    // Add more data as needed
  ];
  const cardData = [
    {
      id: 1,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 3,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 4,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "4 TB",
    },
    {
      id: 5,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "4 TB",
    },

    // Add more card data as needed
  ];
  const videoData = [
    {
      id: 1,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/videocard.png",
      storageAmount: "Nvidia 4080",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.svg",
      storageImage: "/images/welcome/videocard.png",
      storageAmount: "Nvidia 4080",
    },

    // Add more card data as needed
  ];
  const [selectedStates, setSelectedStates] = useState(
    Array(cardData.length).fill(false)
  );
  const [selectedStates2, setSelectedStates2] = useState(
    Array(cardData.length).fill(false)
  );

  const handleSwitchChange = (index) => {
    onOpen();
    // console.log("switch chnage", index);
    const updatedStates = [...selectedStates];
    updatedStates[index] = !updatedStates[index];
    setSelectedStates(updatedStates);
    console.log(selectedStates, "test");
  };
  const [pauseStates, setPauseStates] = useState([1, 2, 3].fill(false));

  const handlePause = (index) => {
    // Create a copy of the pauseStates array to avoid mutating state directly
    const newPauseStates = [...pauseStates];

    // Toggle the pause state for the clicked node
    newPauseStates[index] = !newPauseStates[index];

    // Update the state
    setPauseStates(newPauseStates);
  };

  return (
    <div>
      <div className="flex flex-row gap-2 ">
        {/* Nodes Pc left */}
        <div className="flex flex-col pt-2 lg:flex-[.30] flex-[0.22] rounded-xl  lg:!max-w-[600px] w-full !max-w-[250px]">
          {/* search */}
          <div className="flex items-center rounded-xl shadow-sm border  rounded-4xl p-4">
          <FaSearch
  className="text-gray-500  4xl:text-3xl text-xl"
  style={{ color: "#1C77BF" }}
/>

            <input
              type="text"
              placeholder="Search "
              className=" mx-5 outline-none border-none  4xl:py-3 bg-[#FAFAFA] placeholder:4xl:text-3xl 4xl:mt-2 
              "
            />
          </div>
          <div className="rounded-xl mt-3  shadow-sm border border-[#F1F1F1] h-full">
            {nodesData.map((node, index) => (
              <div
                key={index}
                className={`flex  flex-row max-w-full border-2 border-transparent  my-5 lg:gap-7 gap-4  mx-2 rounded-xl 
                  ${
                    index === slectBox
                      ? " border-[#2484C6]  border-2 bg-[#dae8f1] "
                      : ""
                  } hover:border-[#2484C6]  hover:border-2 hover:bg-[#dae8f1] mx-2 p-4  cursor-pointer`}
                onClick={() => handleLeftNodeClick(node, index)}
              >
                <Image
                  src={node.imageUrl}
                  width={1000}
                  height={1000}
                  alt={`Node-${index + 1}`}
                  className="4xl:w-32 xl:w-20 w-16  h-full flex items-center justify-center object-contain  rounded-none"
                />
                <div className="flex flex-col justify-center items-start">
                  <h1 className=" 4xl:text-3xl text-lg font-bold mb-2">
                    {node.title}
                  </h1>{" "}
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <TooltipComponent
                      htmlTag={
                        <p className="mr-2 line-clamp-1 text-sm  text-black font-medium">
                          {" "}
                          <FaPause
                            color="green"
                            className="text-xl 4xl:text-xl" // Adjust the sizes based on your preference
                          />
                        </p>
                      }
                      param={"pause"}
                    />

                    <TooltipComponent
                      htmlTag={
                        <p className="mr-2 line-clamp-1 text-sm  text-black font-medium">
                          {" "}
                          <FaPlay color="red" className="text-xl 4xl:text-xl" />
                        </p>
                      }
                      param={"play"}
                    />

                    <TooltipComponent
                      htmlTag={
                        selectedNode && (
                          <Image
                            src={"/images/welcome/heartVerified.svg"}
                            color="black"
                            alt="table"
                            width={100}
                            height={100}
                            className="w-[30px] mt-1  4xl:w-[32px] 4x:mt-1  rounded-none bg-none"
                          />
                        )
                      }
                      param={"verified"}
                    />

                    {selectedStates2 && <div className="bg-black  "> </div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nodes Pc right */}
        {selectedNode && (
          <>
            <div className="flex flex-col py-2 shadow-sm lg:flex-[.70] 4xl:flex-[.9] flex-[0.78] rounded-xl border-[#F1F1F1] border-[1px] ">
              <div className="lg:px-7 p-4 py-2 gap-2">
                <div className="flex  justify-start items-center gap-2 mb-5">
                  <h1 className="font-semibold flex text-xl lg:text-4xl  4xl:mb-5">
                    {selectedNode?.title}
                  </h1>
                  {heading && (
                    <Image
                      src={"/images/welcome/heartVerified.svg"}
                      alt="table"
                      width={1000}
                      height={1000}
                      className="w-8 h-7 rounded-none mx-3 4xl:mb-5  "
                    />
                  )}
                </div>
                <h1 className=" 4xl:text-3xl lg:text-xl text-base font-bold ">
                  Disks
                </h1>

                <div className="flex">
                  <p className="font-semibold 4xl:text-3xl text-base 4xl:mt-2">
                    Running under Mixed mode
                  </p>

                  <div className="mx-2">
                    {placements.map((placement, index) => (
                      <Tooltip
                        key={index}
                        placement={"right-end"}
                        // content="right-end"
                        // offset={50}
                        color="warning"
                        content={
                          <div className="px-1 py-2 flex flex-row gap-6 text-white max-w-[130px] ">
                            {/* col-1 */}

                            <p className="4xl:text-xl text-sm ">
                              this Pop-up will show the current mode of node
                            </p>
                          </div>
                        }
                      >
                        <p
                          className="border-[2px] border-[#EC9430] rounded-full px-[8px] font-semibold text-[#EC9430] mx-1 text-sm 4xl:mt-2   cursor-pointer"
                          style={{ fontFamily: "Oleo Script Swash Caps" }}
                        >
                          i
                        </p>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <p className=" 4xl:text-3xl lg:text-sm text-xs  my-1 lg:my-2  pb-5">
                  Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
                  pulvinar sit malesuada leo pellentesque aliquam. Dignissim
                  nibh nullam neque amet quam libero a. Nulla at augue penatibus
                  in aliquet in quam imperdiet diam.
                </p>

                <div className="grid 2xl:grid-cols-7 xl:grid-cols-5  grid-cols-3 gap-5 my-2 ">
                  {cardData?.map((card, index) => (
                    <div key={card.id} className="flex flex-col">
                      <div className="bg-[#f3f3f3] border-[#e7e7e7] border-[2px] rounded-xl py-4 relative flex flex-col items-center justify-center">
                        {/* Image with Heart Icon */}
                        <div className="absolute -top-3 -right-3 rounded-4xl p-1">
                          {/* Wrap the heart icon inside the TooltipComponent */}
                          <TooltipComponent
                            htmlTag={
                              <Image
                                src={card?.imageUrl}
                                alt="table"
                                width={1000}
                                height={1000}
                                className="4xl:w-12 4xl:h-10 w-8 h-7 group-hover:invert-0 rounded-none"
                              />
                            }
                            param="Heart Verified"
                          />
                        </div>

                        {/* Cloud Storage Image and Text */}
                        <div className="flex flex-col justify-center items-center">
                          <Image
                            src={card?.storageImage}
                            alt="table"
                            width={1000}
                            height={1000}
                            className="4xl:w-32 w-20 h-full rounded-none"
                          />
                          <p className="font-semibold 4xl:text-2xl lg:text-medium text-base text-center my-3">
                            {card.storageAmount}
                          </p>
                        </div>
                      </div>

                      {/* Switch */}
                      <div className="flex justify-start items-center flex-col gap-2 my-2">
                        <Switch
                          isSelected={selectedStates[index]}
                          onValueChange={() => handleSwitchChange(index)}
                          classNames={{
                            base: cn(
                              "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                              "justify-between cursor-pointer rounded-xl gap-2 p-2",
                              "bg-transparent"
                            ),
                            wrapper:
                              "p-0 h-6 overflow-visible lg:w-[70px] w-[60px] !bg-transparent border",
                            label: " !bg-transparent",
                            thumb: cn(
                              "lg:w-6 lg:h-6 w-4 h-4 border-2 shadow-lg",
                              //selected
                              "group-data-[selected=true]:ml-11 lg:w-6 lg:h-6 w-4 h-4  group-data-[selected=true]:bg-web_green bg-red-500",
                              // pressed
                              "group-data-[pressed=true]:w-10",
                              "group-data-[selected]:group-data-[pressed]:ml-11"
                            ),
                          }}
                          defaultSelected
                          size="sm"
                          color="success"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* GPU */}
                <h1 className="4xl:text-4xl lg:text-xl text-lg font-semibold">
                  GPUs
                </h1>
                <p className=" 4xl:text-3xl   lg:text-sm text-xs my-1 lg:my-2">
                  Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
                  pulvinar sit malesuada leo pellentesque aliquam. Dignissim
                  nibh nullam neque amet quam libero a. Nulla at augue penatibus
                  in aliquet in quam imperdiet diam.
                </p>

                <Box3 />

                {/* Video Card */}
                <div className="grid 2xl:grid-cols-7 xl:grid-cols-5  grid-cols-2 gap-5 ">
                  {videoData?.map((card, index) => (
                    <div key={card.id} className="flex justify-center flex-col">
                      <div className="bg-[#FBFBFB] shadow-lg rounded-xl py-4 relative flex flex-col items-center justify-center">
                        <div className="absolute -top-3 -right-3 rounded-4xl p-1">
                        <TooltipComponent
                            htmlTag={
                              <Image
                                src={card?.imageUrl}
                                alt="table"
                                width={1000}
                                height={1000}
                                className="4xl:w-12 4xl:h-10 w-8 h-7 group-hover:invert-0 rounded-none"
                              />
                            }
                            param="Heart Verified"
                          />
                        </div>

                        <div className="flex flex-col justify-center items-center">
                          <Image
                            src={card.storageImage}
                            alt="table"
                            width={10000}
                            height={10000}
                            className="4xl:w-32 w-20 h-full"
                          />
                          <p className="lg:font-semibold font-medium 4xl:text-2xl lg:text-medium  text-center lg:mx-1 mx-[3px] lg:my-3 my-1 whitespace-nowrap tracking-tighter">
                            {card.storageAmount}
                          </p>
                        </div>
                      </div>

                      {/* {/ Switch /} */}
                      <div className="flex justify-start items-center flex-col gap-2 my-2">
                        <Switch
                          isSelected={selectedStates[index]}
                          onValueChange={() => handleSwitchChange(index)}
                          classNames={{
                            base: cn(
                              "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                              "justify-between cursor-pointer rounded-xl gap-2 p-2",
                              "bg-transparent"
                            ),
                            wrapper:
                              "p-0 h-6 overflow-visible lg:w-[70px] w-[60px] !bg-transparent border",
                            label: " !bg-transparent",
                            thumb: cn(
                              "lg:w-6 lg:h-6 w-4 h-4  border-2 shadow-lg",
                              //selected
                              "group-data-[selected=true]:ml-11 lg:w-6 lg:h-6 w-4 h-4  group-data-[selected=true]:bg-web_green bg-red-500",
                              // pressed
                              "group-data-[pressed=true]:w-10",
                              "group-data-[selected]:group-data-[pressed]:ml-11"
                            ),
                          }}
                          defaultSelected
                          size="sm"
                          color="success"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* end */}
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        size={size}
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton={true}
      >
        <ModalContent className="bg-[#E33F3F] p-3 py-2  4xl:p-8 4xl:min-w-[950px] ">
          {(onClose) => (
            <>
              <ModalBody className="w-full">
                <div className="flex flex-row ">
                  <div className="flex sm:flex-[.30]">
                    <Image
                      src={"/images/welcome/warning.png"}
                      width={1000}
                      height={1000} alt="logo"
                      className="w-auto h-[90%] flex items-center justify-center object-contain"
                    />
                  </div>

                  <div className="flex sm:flex-[.70] flex-col mx-4 text-white">
                    <h1 className="lg:text-4xl text-2xl font-semibold text-start pb-3">
                      Warning
                    </h1>

                    <p className="4xl:text-3xl ">
                      We are notifying you The System Is Doing Something and
                      needs to finish first to Enable or Disable back again.
                    </p>
                    {/* <p className="text-base">
                      If the system is updating, neither the admin nor the users
                      can use the system until the system finishes the update.
                    </p> */}

                    <Button
                      color="black"
                      variant="light"
                      onPress={() => {
                        onClose();
                      }}
                      className="  bg-white text-black font-semibold my-8 4xl:max-w-32 max-w-28 xl:text-lg"
                    >
                      {"Proceed"}
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Box2;
