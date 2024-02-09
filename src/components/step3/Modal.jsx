import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Image from "next/image";


export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
       <ModalContent>
  {(onClose) => (
    <>
      <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
      <ModalBody>
        <div className="flex items-center justify-center">
          {/* Replace 'YourImagePath' with the path to your image */}
          <Image src="/images/step3/modalImage.png'" alt="Modal Image" className="w-full max-h-[200px] object-cover" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="Default" onPress={onClose} className="w-full">
          Close
        </Button>
      </ModalFooter>
    </>
  )}
</ModalContent>
      </Modal>
    </>
  );
}



