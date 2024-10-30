import React, { useState } from "react";
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
import CredentialCard from "./CredentialCard"; // Import CredentialCard component
import { usePathname } from "next/navigation";

const RequestForm = ({ card, switchStates, setSwitchStates }) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showCredentialCard, setShowCredentialCard] = useState(false);

  const handleAccept = () => {
    setShowCredentialCard(true);
    onOpen();
  };

  // const handleCancel = () =>{
  //   setSwitchStates(!switchStates);
  //   onClose();
  // }

  return (
    <div>
      {showCredentialCard ? (
        <CredentialCard card={card}  switchStates={switchStates} setSwitchStates={setSwitchStates} />
      ) : (
        <div
          className={` ${
            pathname === "/step-3"
              ? "w-[380px] 4xl:w-[480px] 4xl:h-[400px] h-[330px]"
              : "w-[285px] 4xl:w-[480px] 4xl:h-[400px] h-[250px]"
          }   my-2 px-2 shadow-lg rounded-lg`}
        >
          <div className="mx-1 my-3">
            <div className="flex justify-between mx-3">
              <h2 className="text-lg font-semibold 4xl:text-3xl ">
                {card.title}
              </h2>
              <p
                onClick={() => setSwitchStates([])}
                className="text-md 4xl:text-xl cursor-pointer"
              >
                X
              </p>
            </div>
            <div className={`my-4 w-full gap-3 `}>
              <input
                type="text"
                placeholder="Organization"
                className={`w-full border 4xl:text-xl  border-gray-300 rounded-lg ${
                  pathname === "/step-3"
                    ? "mt-2 py-3 px-2 4xl:p-3"
                    : "mt-2 px-2 4xl:p-3 py-1"
                }  placeholder-black font-medium outline-none`}
              />
              <input
                type="text"
                placeholder="User name"
                className={`w-full border 4xl:text-xl  border-gray-300 rounded-lg ${
                  pathname === "/step-3"
                    ? "mt-3 py-3 px-2 4xl:p-3"
                    : "mt-2 px-2 4xl:p-3 py-1"
                }  placeholder-black font-medium outline-none`}
              />
              <input
                type="text"
                placeholder="Password"
                className={`w-full border 4xl:text-xl  border-gray-300 rounded-lg ${
                  pathname === "/step-3"
                    ? "mt-3 py-3 px-2 4xl:p-3"
                    : "mt-2 px-2 4xl:p-3 py-1"
                }  placeholder-black font-medium outline-none`}
              />
            </div>
            <button
              className={`w-full h-[30px] 4xl:h-[50px] 4xl:text-2xl bg-[#52C24A] rounded-lg ${
                pathname === "/step-3" ? "mt-3 h-[40px] text-md" : ""
              } text-white font-semibold`}
              onClick={handleAccept}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
