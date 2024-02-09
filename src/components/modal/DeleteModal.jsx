"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
  Switch,
  Select,
} from "@nextui-org/react";
import { Input } from "postcss";
import { BiUpload } from "react-icons/bi";
import Image from "next/image";
const DeleteModal = ({
  isOpen,
  setCurrentId,
  onClose,
  currentId,
  size,
  handleDeleteSelected,
  handleSelectedDelete,
  deleteMultiple,
}) => {
  return (
    <div>
      <Modal size={size} isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent className="bg-red-500 p-3 py-8 4xl:min-w-[950px]">
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
                    <p className=" 2xl:text-xl  text-base 4xl:text-3xl">
                      Are you Sure do you want to delete this record?
                    </p>

                    <div className="flex mt-5  4xl:gap-4  rounded-b-[40px]">
                      <Button
                        color="black"
                        variant="light"
                        onClick={() => {
                          if (deleteMultiple) {
                            handleSelectedDelete();
                          } else {
                            handleDeleteSelected(currentId);
                          }
                          onClose();
                          setCurrentId(""); // Close the modal after deletion
                        }}
                        onclick
                        className="mx-1 lg:px-20 px-12 lg:py-6 4xl:py-7 py-3 4xl:text-3xl bg-black text-white  "
                      >
                        Yes
                      </Button>
                      <Button
                        onPress={onClose}
                        className="mx-1 lg:px-20 px-12 lg:py-6 py-3 4xl:py-7 4xl:text-3xl text-white bg-transparent border-2  "
                      >
                        No
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

export default DeleteModal;
