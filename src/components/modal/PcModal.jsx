"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { RxCross2 } from "react-icons/rx";

const PcModal = ({ isOpen, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div className="">
      <Modal
        placement={"center"}
        className="w-full "
        size={"full"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          handleClose();
        }}
      >
        <ModalContent className="bg-black/0 shadow-none ">
          {(onClose) => (
            <div className="flex items-center justify-center max-h-[900px] my-auto lg:max-w-[1200px] 4xl:max-w-[2000px] w-full mx-auto relative ">
              <div
                onClick={handleClose}
                className="border py-2 rounded-xl text-white absolute z-40 right-1 cursor-pointer top-[42px] 4xl:top-[-140px] px-3"
              >
                <RxCross2 className="w-5 h-5 4xl:w-10 4xl:h-10" />
              </div>
              <ModalBody className="p-8 bg-black/0 shadow-none mx-auto max-w-[1000px] 4xl:max-w-[1800px] ">
                <Image
                  className="lg:!w-[1000px] lg:h-[1000px] object-contain  4xl:!w-[2200px] "
                  alt="img"
                  src="/images/modalPc.png"
                />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PcModal;
