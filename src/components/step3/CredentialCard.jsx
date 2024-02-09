import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RequestForm from "./RequestForm";
const CredentialCard = ({ card, switchStates, setSwitchStates }) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <div
        className={` ${
          pathname === "/step-3"
            ? "w-[380px] 4xl:w-[480px] 4xl:h-[400px] h-[330px]"
            : "w-[285px] 4xl:w-[480px] 4xl:h-[400px] h-[250px]"
        }   my-2 px-2 border shadow-lg rounded-lg`}
      >
        <div className="mx-1 my-3 4xl:py-4">
          <div className="flex justify-between mx-3">
            <h2 className="text-lg 4xl:text-2xl font-semibold">
              <span className="font-bold">Login</span> Credential
            </h2>
            <p
              className="text-md cursor-pointer 4xl:text-2xl"
              onClick={() => setSwitchStates([])}
            >
              X
            </p>
          </div>

          <div className="flex mx-3 my-3 gap-4">
            <Image
              src={card.image}
              width={1000}
              height={1000}
              alt="test"
              className="w-[20px] h-[20px] flex items-center justify-center object-contain"
            />
            <p className="font-semibold 4xl:text-xl">{card.title}</p>
          </div>
          <div className="my-4 w-full gap-3 4xl:py-4">
            <input
              type="text"
              placeholder="User name "
              className={`w-full border border-gray-300 rounded-lg ${
                pathname === "/step-3"
                  ? "mt-2 py-3 px-2 4xl:p-3"
                  : "4xl:p-3 mt-2 px-2 py-1"
              }  placeholder-black font-medium 4xl:text-xl outline-none`}
            />
            <input
              type="text"
              placeholder="Password "
              className={`w-full border border-gray-300 rounded-lg ${
                pathname === "/step-3"
                  ? "mt-2 py-3 px-2 4xl:p-3"
                  : "4xl:p-3 mt-2 px-2 py-1"
              }  placeholder-black font-medium 4xl:text-xl outline-none`}
            />
          </div>
          <button
            className={`w-full ${
              pathname === "/step-3" ? "h-[40px]" : "h-[30px]"
            } 4xl:h-[50px] 4xl:text-2xl bg-[#3F3F3F] rounded-lg text-white font-semibold`}
            onClick={onOpen}
          >
            Login
          </button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 text-center 4xl:text-3xl">
                Installed succesfully{" "}
              </ModalHeader>
              <ModalBody className="">
                <Image
                  src={"/images/step3/modalImage.png"}
                  alt="test"
                  height={1000}
                  width={1000}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="text-white bg-black w-full 4xl:text-2xl"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;
