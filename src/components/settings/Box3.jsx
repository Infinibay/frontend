import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
} from "@nextui-org/react";

const Box3 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("2xl");

  const sizes = ["xl"];
  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };
  return (
    <div>
      {/* checklist */}
      <div className="flex py-2 ">
        <div className="flex flex-col lg:flex-row max-w-full my-5 gap-8 shadow-sm py-4 px-4 bg-[#F2F2F2]  rounded-xl">
          <div className="flex justify-center items-center rounded-xl ">
            <Image
              src={"/images/welcome/gpuSetting.png"}
              width={1000}
              height={1000}
              alt="test"
              className="4xl:max-w-52 w-44 h-full  mx-2 flex items-center justify-center object-contain rounded-none"
            />
          </div>
          <div className="space-y-2">
            <h1 className="4xl:text-4xl text-lg font-bold">
              Install a Compatible graphics card.
            </h1>{" "}
            <p className=" 4xl:text-3xl  lg:text-sm text-xs text-[#6F6F6F] ">
              Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla
              pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh
              nullam neque amet quam libero a. Nulla at augue penatibus in
              aliquet in quam imperdiet diam.
            </p>
            <p
              className="rounded-2xl bg-[#313131] 4xl:text-3xl text-sm w-32 4xl:w-44 text-center text-white 4xl:py-3  px-2 py-1 my-1 cursor-pointer "
              onClick={() => handleOpen(size)}
            >
              CheckList
            </p>
          </div>
        </div>
      </div>

      <Modal size={size} isOpen={isOpen} hideCloseButton={true}
      className="4xl:max-w-[1300px] max-w-[800px]">
        <ModalContent className="p-3 py-8  ">
          <>
            <ModalBody>
              <div className="flex justify-around  items-center">
                <h1 className="lg:text-4xl text-2xl font-bold">
                  List of{" "}
                  <span className="font-bold text-[#EC9430]">{`GPU'S`}</span>{" "}
                </h1>
                <Button
                  onPress={onClose}
                  className="mx-1 lg:px-16 4xl:text-3xl px-8 rounded-2xl lg:py-6 py-3 text-black bg-transparent border-2"
                >
                  Close
                </Button>
              </div>
              {/* cols */}
              <div className="grid grid-cols-2 justify-center border-2 rounded-4xl divide-x">
                {/* col-1 */}

                <div className="flex flex-col space-y-3  4xl:space-y-2 ">
                  <div className="bg-black p-3 rounded-tl-4xl">
                    <p className="text-2xl font-semibold  text-white ">
                      {" "}
                      {`GPU's`}
                    </p>
                  </div>

                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold   px-3">
                    {" "}
                    Nvidia 3080
                  </p>
                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold  px-3">
                    {" "}
                    Nvidia 3080
                  </p>
                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold  px-3">
                    {" "}
                    Nvidia 3080
                  </p>
                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold  px-3">
                    {" "}
                    Nvidia 3080
                  </p>
                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold  px-3">
                    {" "}
                    Nvidia 3080
                  </p>
                  <p className="text-xl 4xl:h-[80px] 4xl:text-2xl font-semibold  px-3 pb-3">
                    {" "}
                    Nvidia 3080
                  </p>
                </div>

                {/* col-2 */}
                <div className="space-y-4 ">
                  <div className="bg-black p-3 rounded-tr-4xl ">
                    <p className="text-2xl font-semibold  text-white  ">
                      {" "}
                      Website Links
                    </p>
                  </div>
                  <Link
                    href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/"
                  >
                    <p className="text-xs 4xl:text-xl 4xl:h-[90px] px-1 ">
                      https://www.nvidia.com/en-us/geforce/
                      graphics-cards/40-series/rtx-4080/
                    </p>
                  </Link>
                  <Link
                    href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/"
                  >
                    <p className="text-xs 4xl:text-xl 4xl:h-[90px] px-1">
                      https://www.nvidia.com/en-us/geforce/
                      graphics-cards/40-series/rtx-4080/
                    </p>
                  </Link>
                  <Link
                    href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/"
                  >
                    <p className="text-xs 4xl:text-xl 4xl:h-[90px] px-1">
                      https://www.nvidia.com/en-us/geforce/
                      graphics-cards/40-series/rtx-4080/
                    </p>
                  </Link>
                  <Link
                    href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/"
                  >
                    <p className="text-xs 4xl:text-xl 4xl:h-[90px] px-1">
                      https://www.nvidia.com/en-us/geforce/
                      graphics-cards/40-series/rtx-4080/
                    </p>
                  </Link>
                  <Link
                    href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/"
                  >
                    <p className="text-xs 4xl:text-xl 4xl:h-[90px] px-1 pb-3">
                      https://www.nvidia.com/en-us/geforce/
                      graphics-cards/40-series/rtx-4080/
                    </p>
                  </Link>
                </div>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Box3;
