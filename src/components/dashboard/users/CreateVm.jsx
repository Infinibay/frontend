"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { BiUpload } from "react-icons/bi";
import { useState, useRef } from "react";

const CreateVm = ({ initialLoading }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(initialLoading || false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRe2f = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // You can perform additional actions with the selected file if needed
  };

  const handleBiUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleCreateVMs = () => {
    setIsLoading(true);

    // Simulate a loading delay of 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Add your logic for creating VMs here
  };

  const [fileName, setFileName] = useState("user.png");
  const fileInputRef2 = useRef(null);

  const handleDivClick = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };

  const handleFileChange = (e) => {
    const fileName = e.target.files[0].name;
    // Assuming you have state to hold the file name, update it here
    // setFileName(fileName);
    setFileName(fileName);
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        className="bg-web_lightBlue text-white font-medium rounded-2xl 4xl:text-3xl 4xl:!py-7 "
      >
        Create a New VMS
      </Button>
      {/* Loading screen */}
      {isLoading && (
        <div className="fixed top-0 left-0 z-[50] bg-black/80 w-screen h-screen overflow-hidden flex justify-center items-center  ">
          <div className="mainheading p-6 text-white rounded-lg 4xl:text-2xl 4xl:!py-7">
            {/* Rotating loading image */}
            <Image
              className="animate-spin mx-auto mb-5"
              src="/images/loader.png"
              width={300}
              height={600}
              alt="loading..."
            />
            Creating <span className="text-web_lightbrown">Pc...</span>
          </div>
        </div>
      )}

      <Modal
        classNames={{
          body: "py-6",
          backdrop: "bg-web_darkBlue/20 backdrop-opacity-40",
          base: "border-[#292f46] bg-white 4xl:max-w-[1500px] lg:!translate-y-0 translate-y-40 max-w-[800px] w-full text-black",
          header: " text-black",
          footer: "",
          closeButton:
            "hover:text-web_lightbrown active:bg-web_darkbrown text-black !font-bold text-xl",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 4xl:text-4xl  sm:text-xl text-lg font-bold capitalize">
                Enter User Information
              </ModalHeader>
              <ModalBody>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Enter your first name"
                  />
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="Username"
                    labelPlacement="outside"
                    placeholder="Enter your username"
                  />
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",

                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para"],
                    }}
                    key="outside"
                    type="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flexbox my-2">
                  {/* <Input
                    classNames={{
                      label: "text-black font-semibold 4xl:text-2xl 4xl:py-2",
                      inputWrapper:
                        "bg-transparent border-web_lightgray border w-full shadow-lg  4xl:text-2xl !h-full 4xl:py-5",
                    }}
                    key="outside"
                    // type="file"
                    label="Display Picture"
                    labelPlacement="outside"
                    placeholder="Enter your username"
                    endContent={
                    }
                  /> */}
                  <div className=" w-full  text-black font-semibold ">
                    <label htmlFor="" className="text-sm 4xl:text-2xl">
                      Display Picture
                    </label>
                    <div
                      name=""
                      onClick={handleDivClick}
                      id=""
                      className="flex justify-between items-center w-full font-semibold outline-none bg-white 4xl:text-2xl p-2.5 border text-gray-500 rounded-xl shadow-xl "
                    >
                      <p className="w-full 4xl:text-3xl 4xl:py-[12px] ">
                        {fileName}
                      </p>
                      <input
                        ref={fileInputRef2}
                        onChange={handleFileChange}
                        type="file"
                        name=""
                        hidden
                        id=""
                      />
                      <BiUpload className="text-2xl text-web_lightbrown pointer-events-none flex-shrink-0" />
                    </div>
                  </div>

                  {/* <Select
                    labelPlacement="outside"
                    label="Select Operation System"
                    placeholder="Select Operation System"
                    color="#000"
                    defaultSelectedKeys={["cat"]}
                    className=" w-full  text-black font-semibold "
                    classNames={{
                      base: "bg-transparent",
                      mainWrapper: "bg-transparent",
                      trigger: "bg-transparent rounded-xl shadow-lg  4xl:py-8 ",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:py-2",
                    }}
                  >
                    <SelectItem key="Window11" value="Window 11">
                      <p className="4xl:text-2xl"> Window 11</p>
                    </SelectItem>
                    <SelectItem key="Window10" value="Window 10">
                      <p className="4xl:text-2xl">Window 10</p>
                    </SelectItem>
                  </Select> */}
                  <div className=" w-full  text-black font-semibold ">
                    <label htmlFor="" className="text-sm 4xl:text-2xl">
                      Select Operation System
                    </label>
                    <select
                      name=""
                      id=""
                      className=" w-full font-semibold outline-none bg-white 4xl:text-2xl p-2.5 border text-gray-500 rounded-xl shadow-xl  4xl:py-[24px]"
                    >
                      <option value="Window 11">Window 11</option>
                      <option value="Window 11">Window 10</option>
                    </select>
                  </div>
                </div>

                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para"],
                    }}
                    key="outside"
                    type="number"
                    label="VMs No."
                    labelPlacement="outside"
                    placeholder="PC -245"
                  />
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-3",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="number"
                    label="License Key"
                    labelPlacement="outside"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                  />
                </div>

                {/* vms no */}
                <div className="flexbox my-2">
                  <div className=" w-full  text-black font-semibold ">
                    <label htmlFor="" className="text-sm 4xl:text-2xl">
                      Select Operation System
                    </label>
                    <select
                      name=""
                      id=""
                      className=" w-full font-semibold outline-none bg-white 4xl:text-2xl p-2.5 border text-gray-500 rounded-xl shadow-xl  4xl:py-[24px]"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className=" w-full  text-black font-semibold ">
                    <label htmlFor="" className="text-sm 4xl:text-2xl">
                      Select Operation System
                    </label>
                    <select
                      name=""
                      id=""
                      className=" w-full font-semibold outline-none bg-white 4xl:text-2xl p-2.5 border text-gray-500 rounded-xl shadow-xl  4xl:py-[24px]"
                    >
                      <option value="Window 11">Window 11</option>
                      <option value="Window 11">Window 10</option>
                    </select>
                  </div>

                  {/* <Select
                    labelPlacement="outside"
                    label="VMs Access Granted"
                    placeholder="Yes"
                    className=" w-full text-black font-semibold "
                    classNames={{
                      base: "bg-transparent",
                      mainWrapper: "bg-transparent",
                      trigger: "bg-transparent rounded-xl shadow-lg",
                    }}
                  >
                    <SelectItem key="Window11" value="Window 11">
                      Window 11
                    </SelectItem>
                    <SelectItem key="Window10" value="Window 10">
                      Window 10
                    </SelectItem>
                  </Select> */}
                  {/* <Select
                    labelPlacement="outside"
                    label="Select Virtual Machine Size"
                    placeholder="Maximum - Design"
                    className=" w-full text-black font-semibold "
                    classNames={{
                      base: "bg-transparent",
                      mainWrapper: "bg-transparent",
                      trigger: "bg-transparent rounded-xl shadow-lg",
                      placeholder: "text-black",
                    }}
                  >
                    <SelectItem key="Window11" value="Window 11">
                      Window 11
                    </SelectItem>
                    <SelectItem key="Window10" value="Window 10">
                      Window 10
                    </SelectItem>
                  </Select> */}
                </div>

                <div className="flexbox my-2">
                  <div className="w-full">
                    <label
                      className=" 4xl:text-2xl text-sm font-semibold text-black"
                      htmlFor=""
                    >
                      Install Recommended Applications
                      <span className="text-[#EC9430]">{"*"}</span>
                    </label>
                    <div className="flexbox h-12 4xl:h-20 w-full p-2 rounded-xl shadow-lg border border-web_lightgray">
                      <Switch
                        classNames={{
                          base: cn(
                            "inline-flex  flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                            "justify-between cursor-pointer rounded-xl gap-2 p-2",
                            "bg-transparent"
                          ),
                          wrapper:
                            "p-0 4xl:translate-x-28  4xl:h-10 h-6  overflow-visible 4xl:w-[92px] w-[70px] !bg-transparent border",
                          label: " !bg-transparent 4xl:text-2xl",
                          thumb: cn(
                            "w-6 h-6 border-2 shadow-lg",
                            //selected
                            "group-data-[selected=true]:ml-11 w-6 4xl:w-10 h-6 4xl:h-10 group-data-[selected=true]:bg-web_green bg-red-500",
                            // pressed
                            "group-data-[pressed=true]:w-10",
                            "group-data-[selected]:group-data-[pressed]:ml-9"
                          ),
                        }}
                        defaultSelected
                        size="lg"
                        color="success"
                        startContent={<span className="4xl:text-2xl">Yes</span>}
                        endContent={<span className="4xl:text-2xl">No</span>}
                      >
                        slack
                      </Switch>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      className="4xl:text-2xl text-sm font-semibold text-black"
                      htmlFor=""
                    >
                      Install Recommended Applications{" "}
                      <span className="text-[#EC9430]">{"*"}</span>
                    </label>
                    <div className="flexbox h-12 4xl:h-20 p-2 rounded-xl shadow-lg w-full border border-web_lightgray">
                      <Switch
                        classNames={{
                          base: cn(
                            "inline-flex  flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                            "justify-between cursor-pointer rounded-xl gap-2 p-2 4xl:text-2xl",
                            "bg-transparent"
                          ),
                          wrapper:
                            "p-0 4xl:translate-x-28  4xl:h-10 h-6  overflow-visible 4xl:w-[92px] w-[70px] !bg-transparent border",
                          label: " !bg-transparent 4xl:text-2xl",
                          thumb: cn(
                            "w-6 h-6 border-2 shadow-lg",
                            //selected
                            "group-data-[selected=true]:ml-11 w-6 4xl:w-10 h-6 4xl:h-10 group-data-[selected=true]:bg-web_green bg-red-500",
                            // pressed
                            "group-data-[pressed=true]:w-10",
                            "group-data-[selected]:group-data-[pressed]:ml-9"
                          ),
                        }}
                        defaultSelected
                        size="lg"
                        color="success"
                        startContent={<span className="4xl:text-2xl">Yes</span>}
                        endContent={<span className="4xl:text-2xl">No</span>}
                      >
                        Adobe Acrobat
                      </Switch>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="w-full bg-web_lightbrown 4xl:text-3xl 4xl:h-16 text-white font-medium text-center"
                  color="danger"
                  onPress={() => {
                    handleCreateVMs();
                    onClose();
                  }}
                >
                  Create VMs
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateVm;
