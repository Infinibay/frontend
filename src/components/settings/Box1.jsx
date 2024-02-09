import { Button, Image, Switch, cn } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { FaPause, FaPlay, FaSearch } from "react-icons/fa";
import { FaGear, FaSheetPlastic, FaShuttleSpace } from "react-icons/fa6";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

const Box1 = () => {
  const [size, setSize] = React.useState("3xl");
  const [selectedNode, setSelectedNode] = useState(null);

  const [updateStatus, setUpdateStatus] = useState("available");
  const [timer, setTimer] = useState(5);

  const [video, setVideo] = useState(false);
  const handleLeftNodeClick = (node) => {
    // Toggle the selectedNode state
    setSelectedNode((prevSelectedNode) =>
      prevSelectedNode === node ? null : node
    );
  };
  const cardData = [
    {
      id: 1,
      imageUrl: "/images/welcome/heartVerified.png",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.png",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.png",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "12 TB",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.png",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "4 TB",
    },
    {
      id: 2,
      imageUrl: "/images/welcome/heartVerified.png",
      storageImage: "/images/welcome/cloudstorage.png",
      storageAmount: "4 TB",
    },

    // Add more card data as needed
  ];
  // switch
  // ... rest of your code

  // modal 2

  const handleUpdate = () => {
    setUpdateStatus("updating");
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setUpdateStatus("updated");
    }, timer * 1000);
  };
  const sizes = ["3xl"];
  const placements = ["right-end"];
  const colors = ["primary"];

  useEffect(() => {
    if (updateStatus === "updated") {
      const resetTimeout = setTimeout(() => {
        setUpdateStatus("available");
      }, 1000);

      return () => clearTimeout(resetTimeout);
    }
  }, [updateStatus]);

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  const [selectedStates, setSelectedStates] = useState(
    Array(cardData.length).fill(false)
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (selectedStates.some((state) => state)) {
      onOpen();
    } else {
      onClose();
    }
  }, [selectedStates, onOpen, onClose]);

  return (
    <div className=" mx-auto ">
      <p className="4xl:text-5xl lg:text-2xl text-xl font-semibold  border-[##E4E4E4] border-b-[1px] pb-5">
        Sett<span className="font-normal">ings</span>
      </p>

      {/* update available */}

      <div className="flex flex-col xl:flex-row max-w-full justify-between  my-5  gap-8 shadow-sm border p-6 4xl:p-10 rounded-xl  ">
        {/* text */}
        <div className="flex flex-row 4xl:gap-8 gap-4 max-w-full">
          <div className="flex justify-center h-24 xl:h-full items-center p-4 xl:p-8  bg-[#F2F2F2] rounded-xl ">
            <Image
              src={"/images/welcome/settingPc.png"}
              width={1000}
              height={1000}
              alt="test"
              className="4xl:w-56 w-auto  flex items-center justify-center object-contain rounded-none"
            />
          </div>
          <div>
            {selectedNode ? (
              <h1 className=" 4xl:text-2xl text-lg font-bold">
                Update Available
              </h1>
            ) : (
              <h1 className="  4xl:text-4xl text-lg font-bold">
                No Update Available
              </h1>
            )}

            <div className="4xl:max-w-[3400px] max-w-[980px]  ">
              <p className=" 4xl:text-3xl lg:text-sm text-xs 4xl:mt-8 mt-4 text-black">
                Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
                pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh
                nullam neque amet quam libero a. Nulla at augue penatibus in
                aliquet in quam imperdiet diam.
              </p>
              <p className="4xl:max-w-[3400px]   4xl:text-3xl lg:text-sm text-xs  text-black mt-4 xl:mt-6 ">
                Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
                pulvinar sit malesuada leo pellentesque aliquambero a. Nulla at
                augue{" "}
              </p>
            </div>
          </div>
        </div>

        {/* buttons */}
        <div className="flex flex-col xl:gap-12 gap-4  ">
          {updateStatus === "available" ? (
            <>
              <p className="rounded-xl py-2 px-3 4xl:text-2xl text-xs font-semibold w-fit whitespace-nowrap bg-[#EC94301A]">
                <span className="text-[#EC9430]">4 GB </span>Update Available
              </p>
              <Button
                className="btnGradientDarkBlue rounded-2xl 4xl:rounded-3xl 4xl:mt-8 py-5 px-5 4xl:text-2xl 4xl:py-8"
                onPress={() => handleOpen(size)}
              >
                Update
              </Button>
            </>
          ) : updateStatus === "updating" ? (
            <>
              <div className="flex flex-col justify-end gap-12">
                <div className="flex flex-row  items-center gap-2">
                  <p className="  4xl:text-2xl text-sm text-gray-600 whitespace-nowrap  mx-3 4xl:mx-6">
                    Estimated Time{" "}
                    <span className="text-[#52C24A] ">15 minutes</span>
                  </p>

                  <p className="rounded-xl   4xl:py-4 py-2 px-3 4xl:text-2xl  text-xs font-semibold   4xl:max-w-[320px] max-w-[180px]  whitespace-nowrap  bg-custom-blue">
                    <span className="text-[#2484C6] ">24 MB /4 GB </span>
                    Updating
                  </p>
                </div>
              </div>
              <div className="flex justify-end 4xl:mt-8">
                <Button className="border-dashed font-medium 4xl:font-semibold 4xl:text-xl border-[#52C24A] btnTransparent 4xl:max-w-64  max-w-40 rounded-3xl bg-transparent text-[#52C24A] py-6 px-5">
                  Updating...
                </Button>
              </div>
            </>
          ) : (
            <p className="rounded-xl 4xl:py-4   py-2 px-3 4xl:text-2xl  text-xs font-semibold text-green-500 whitespace-nowrap bg-[#52C24A1A]">
              Your System Is Up to Date
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row max-w-full my-5 4xl:my-8 gap-8 shadow-sm border p-6 4xl:p-10 rounded-xl">
        <div className="flex justify-center items-center w-44 xl:w-fit h-24 xl:h-full lg:p-4 p-[2px]  bg-[#F2F2F2] rounded-xl">
          <Image
            src={"/images/welcome/threeBlocks.png"}
            width={1000}
            height={1000}
            alt="test"
            className="4xl:w-32 w-auto h-full flex items-center justify-center object-contain rounded-none py-5"
          />
        </div>
        <div>
          <h1 className="4xl:text-4xl text-lg font-bold">Nodes</h1>

          <div className="max-w-[980px] 4xl:max-w-[2270px] ">
            <p className=" 4xl:text-3xl  lg:text-sm text-xs mt-2 4xl:mt-4   text-black">
              Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
              pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh
              nullam neque amet quam libero a. Nulla at augue penatibus in
              aliquet in quam imperdiet diam.
            </p>
          </div>
        </div>
      </div>

      <Modal
        size={size}
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton={true}
      >
        <ModalContent className="bg-[#52C24A] p-3 py-8 4xl:min-w-[950px]">
          {(onClose) => (
            <>
              <ModalBody className="w-full">
                <div className="flex flex-row ">
                  <div className="flex sm:flex-[.30]">
                    <Image
                      src={"/images/welcome/warning.png"}
                      width={1000}
                      height={1000}
                      alt="logo"
                      className="w-auto h-full flex items-center justify-center object-contain"
                    />
                  </div>

                  <div className="flex sm:flex-[.70] flex-col mx-4 text-white">
                    <h1 className="lg:text-4xl text-2xl font-semibold text-start pb-3">
                      Info
                    </h1>

                    <p className=" 2xl:text-xl 4xl:text-3xl   text-base">
                      All Nodes are going to be paused & because of that, all of
                      the VMs are going to be paused! To proceed with the
                      update.
                    </p>
                    <p className=" 2xl:text-xl  text-base 4xl:text-3xl">
                      If the system is updating, neither the admin nor the users
                      can use the system until the system finishes the update.
                    </p>

                    <div className="flex mt-5  4xl:gap-4  rounded-b-[40px]">
                      <Button
                        color="black"
                        variant="light"
                        onPress={() => {
                          handleUpdate();
                          onClose();
                        }}
                        className="mx-1 lg:px-20 px-12 lg:py-6 4xl:py-7 py-3 4xl:text-3xl bg-black text-white  "
                      >
                        {updateStatus === "updating"
                          ? "Updating..."
                          : "Proceed"}
                      </Button>
                      <Button
                        onPress={onClose}
                        className="mx-1 lg:px-20 px-12 lg:py-6 py-3 4xl:py-7 4xl:text-3xl text-white bg-transparent border-2  "
                      >
                        Close
                      </Button>
                    </div>
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

export default Box1;
