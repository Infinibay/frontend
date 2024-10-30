import React from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import Image from 'next/image';

const Checklist = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = () => {
    // Add your update logic here
    // Nothing
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[#E33F3F] p-3 py-8 ">
        <ModalBody>
          <div className="flex flex-row ">
            <div className="flex sm:flex-[.30]">
              {/* Add your image or content here */}
              <Image
                src="/images/welcome/warning.png"
                alt="Warning"
                className="w-auto h-full flex items-center justify-center object-contain"
              />
            </div>

            <div className="flex sm:flex-[.70] flex-col mx-4 text-white">
              <h1 className="lg:text-4xl text-2xl font-semibold text-start pb-3">
                Warning
              </h1>

              <p className="text-base">
                All Nodes are going to be paused & because of that, all of the
                VMs are going to be paused! To proceed with the update.
              </p>
              <p className="text-base">
                If the system is updating, neither the admin nor the users can
                use the system until the system finishes the update.
              </p>

              <div className="flex mt-5  mx-2 rounded-b-[40px]">
                <Button
                  color="black"
                  variant="light"
                  onPress={() => {
                    handleUpdate();
                    onClose();
                  }}
                  className="mx-1 lg:px-20 px-12 lg:py-6 py-3 bg-black text-white "
                >
                  Proceed
                </Button>
                <Button
                  onPress={onClose}
                  className="mx-1 lg:px-20 px-12 lg:py-6 py-3 text-white bg-transparent border-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Checklist;
