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
  Tooltip,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { BiEditAlt, BiUpload } from "react-icons/bi";
import { useState, useRef } from "react";

const EditVm = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // You can perform additional actions with the selected file if needed
  };

  const handleBiUploadClick = () => {
    fileInputRef.current.click();
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
    // console.log(fileName); // You can replace this with your state update logic
  };

  return (
    <div className="max-w-[50px]">
      <Tooltip
        content={
          <div className="max-w-[320px]  whitespace-nowrap  -left-2  bottom-9   px-2 py-1 rounded-md">
            <p className=" font-normal text-xs 4xl:text-3xl text-black">
              Edit User
            </p>
          </div>
        }
      >

        <Button
          onPress={onOpen}
          className="justify-start !w-10 h-10 p-0 !max-w-[20px] bg-transparent !outline-none !ring-transparent text-web_lightbrown 4xl:text-4xl text-lg cursor-pointer active:opacity-50"
        >
          <BiEditAlt />
        </Button>
                      </Tooltip>

      <Modal
        size="5xl"
        classNames={{
          wrapper: "w-full h-full",
          base: "w-full h-full",
          body: "4xl:py-10 py-6",
          backdrop: "bg-web_darkBlue/20 backdrop-opacity-40",
          base: "border-[#292f46] bg-white 4xl:max-w-[1500px]  max-w-[800px] w-full text-black",
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
              <ModalHeader className="flex flex-col gap-1 4xl:text-3xl sm:text-xl text-lg font-bold capitalize">
                Edit User Information
              </ModalHeader>
              <ModalBody>
                <div className="flexbox my-2 w-full h-full">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-2",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Kristin"
                  />
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-2",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Watson"
                  />
                </div>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-2",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="Username"
                    labelPlacement="outside"
                    placeholder="Kristy"
                  />
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-2",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Kwatson002gmail.com"
                  />
                </div>
                <div className="flexbox my-2">
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
                    label="VMs Access Granted "
                    placeholder="VMs Access"
                    className=" 4xl:text-2xl  w-full text-black font-semibold "
                    classNames={{
                      label:
                        "text-black font-semibold 4xl:text-2xl 4xl:pb-3 para",

                      base: "bg-transparent",
                      mainWrapper: "bg-transparent !h-full 4xl:text-2xl para",
                      innerWrapper: "h-full",
                      trigger:
                        "bg-transparent rounded-xl !h-full shadow-lg 4xl:py-6 ",
                    }}
                  >
                    <SelectItem key="Yes" value="Yes">
                      <p className="4xl:text-2xl">Yes</p>
                    </SelectItem>
                    <SelectItem key="No" value="No">
                      <p className="4xl:text-2xl">No</p>
                    </SelectItem>
                  </Select> */}
                  <div className=" w-full  text-black font-semibold ">
                    <label htmlFor="" className="text-sm 4xl:text-2xl">
                      VMs Access Granted
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
                </div>
                <div className="flexbox items-end my-2">
                  <Input
                    classNames={{
                      base: "",
                      label: "text-black font-semibold 4xl:text-2xl 4xl:pb-2",
                      innerWrapper: "bg-transparent !h-full",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border 4xl:text-2xl !h-full 4xl:py-5",
                      input: ["para "],
                    }}
                    key="outside"
                    type="number"
                    label="VMs No."
                    labelPlacement="outside"
                    placeholder="PC -245"
                  />
                  <Button
                    className="w-full max-w-[355px] bg-web_lightBlue text-white font-medium text-center 4xl:p-9 4xl:text-2xl "
                    color="danger"
                    onPress={onClose}
                  >
                    Update User Information
                  </Button>
                </div>
              </ModalBody>
              {/* <ModalFooter>
                <Button
                  className="w-full bg-web_lightbrown text-white font-medium text-center "
                  color="danger"
                  onPress={onClose}
                >
                  Create VMs
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditVm;
