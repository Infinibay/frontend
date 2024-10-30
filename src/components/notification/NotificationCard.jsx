"use client";
import { Image } from "@nextui-org/react";
import SideCard from "./SideCard";
import { useEffect, useState } from "react";
import TooltipComponent from "../tooltip/TooltipComponent";
// import SideCard2 from "./Sidecard2";

const data = [
  {
    id: 1,
    status: true,
    title: "PC -21 (Out Of Space)",
    description:
      "Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh nullam neque amet quam libero a. Nulla at augue penatibus in aliquet in quam imperdiet diam.",
    image: "/images/notification/eye.png",
    notifications: [
      {
        icon: "/images/notification/envelope.png",
        text: "Mail",
        alt: "Mail",
      },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
      { icon: "/images/notification/sms.png", text: "sms", alt: "SMS" },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
    ],
    sidecard: {
      id: 1,
      title: "Out Of Space",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      image: "/images/notification/carddetail.png",
      detailImage: "/images/notification/carddetail.png",
      additionalInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
      actionTitle: "What can I do?",
      actionDescription:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      additionalActionInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
    },
  },
  {
    id: 2,
    status: true,
    title: "Zack’s Pc (Out Of Space)",
    description:
      "Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh nullam neque amet quam libero a. Nulla at augue penatibus in aliquet in quam imperdiet diam.",
    image: "/images/notification/eye.png",
    notifications: [
      {
        icon: "/images/notification/envelope.png",
        text: "Mail",
        alt: "Mail",
      },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
      { icon: "/images/notification/sms.png", text: "SMS", alt: "SMS" },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
    ],
    sidecard: {
      id: 2,
      title: "Zack’s Pc ",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      image: "/images/notification/space.png",
      detailImage: "/images/notification/carddetail.png",
      additionalInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
      actionTitle: "Out Of Space?",
      actionDescription:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      additionalActionInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
    },
  },
];
const data2 = [
  {
    id: 3,
    title: "Disk Failure",
    description:
      "Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh nullam neque amet quam libero a. Nulla at augue penatibus in aliquet in quam imperdiet diam.",
    image: "/images/notification/warning2.png",
    notifications: [
      {
        icon: "/images/notification/envelope.png",
        text: "Mail",
        alt: "Mail",
      },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
      { icon: "/images/notification/sms.png", text: "SMS", alt: "SMS" },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
    ],
    sidecard: {
      id: 3,
      title: "Disk Failure",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      image: "/images/notification/carddetail.png",
      detailImage: "/images/notification/carddetail.png",
      additionalInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
      actionTitle: "Disk Issues?",
      actionDescription:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      additionalActionInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
    },
  },

  {
    id: 4,
    title: "PC-42 Is Running For 2 Weeks Kindly Shut It Down",
    description:
      "Lorem ipsum dolor sit amet consectetur. Amet nunc fringilla pulvinar sit malesuada leo pellentesque aliquam. Dignissim nibh nullam neque amet quam libero a. Nulla at augue penatibus in aliquet in quam imperdiet diam.",
    image: "/images/notification/warning1.png",
    notifications: [
      {
        icon: "/images/notification/envelope.png",
        text: "Mail",
        alt: "Mail",
      },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
      { icon: "/images/notification/sms.png", text: "SMS", alt: "SMS" },
      {
        icon: "/images/notification/tick.svg",
        text: "Verified",
        alt: "Verified",
      },
    ],
    sidecard: {
      id: 4,
      title: "Warning!",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      image: "/images/notification/space.png",
      detailImage: "/images/notification/carddetail.png",
      additionalInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
      actionTitle: "What can I do?",
      actionDescription:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc.",
      additionalActionInfo:
        "Lorem ipsum dolor sit amet consectetur. Tellus est nunc egestas at erat ultrices faucibus. Pellentesque molestie eget orci porta neque adipiscing vel nunc. Nulla pulvinar suspendisse sollicitudin ultricies.",
    },
  },
];

const images = [
  {
    icon: "/images/notification/envelope.png",
    text: "Mail",
    alt: "Mail",
  },
  { icon: "/images/notification/tick.svg", text: "Verified", alt: "Verified" },
  { icon: "/images/notification/sms.png", text: "SMS", alt: "SMS" },
  { icon: "/images/notification/tick.svg", text: "Verified", alt: "Verified" },
];

const NotificationCard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [sidecard, setSideCard] = useState(null);

  const handleCardClick = (id, item) => {
    setSideCard(item);
    setSelectedCard(id);
  };

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "auto";
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (selectedCard == null) {
          enableScroll();
        } else {
          disableScroll();
        }
      } else {
        enableScroll();
      }
    };

    // Initial check on mount
    handleResize();

    // Event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
      enableScroll(); // Ensure scrolling is enabled on cleanup
    };
  }, [selectedCard]);

  return (
    <>
      {selectedCard === null ? (
        <div className="mt-4 py-2 h-14">
          {/* <div className="flex-grow border-[#E4E4E4] my-3 mt-6 h-1"></div> */}
          <div className="flex px-6 justify-between ">
            <h1 className="4xl:text-4xl text-xl max-w-fit font-semibold">
              <span className="font-bold ">Notifi</span>cation{" "}
            </h1>
            <button className="bg-black text-white px-16 4xl:px-20 py-2 rounded-xl 4xl:text-4xl 4xl:p-4 ">
              Update
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div
        className={`flex scrollbar-hide   ${
          selectedCard === null ? "mt-8 overflow-x-hidden" : ""
        } `}
      >
        <div className="flex  bg-white h-1"></div>
        <div className="w-full px-6 ">
          {selectedCard !== null && (
            <h1 className=" 4xl:text-4xl text-xl max-w-fit font-semibold mt-4 py-2 h-14">
              <span className="font-bold  ">Notifi</span>cation{" "}
            </h1>
          )}
          <div className="bg-white border rounded-xl  border-[#F1F1F1]  hover:bg-web_lightgray/30 transition-all duration-300 ease-out py-5 ">
            {data.map((item, index) => (
              <div
                key={item.id}
                className=""
                onClick={() => handleCardClick(item.id, item)}
              >
                {item?.id == 1 && (
                  <div className="flex px-6 items-center  gap-12 mt-4">
                    <p className="font-bold 4xl:text-3xl text-sm">
                      Need your attention
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3   ">
                      {item.notifications.map((notification, index) => (
                        <TooltipComponent
                          key={index}
                          htmlTag={
                            <Image
                              src={notification.icon}
                              width={1000}
                              height={1000}
                              alt={notification.alt}
                              className="4xl:w-[35px] z-0 4xl:h-[35px]  w-[24px] h-[24px] rounded-none flex items-center justify-center object-contain"
                            />
                          }
                          param={notification.text}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className={`flex items-center  w-full  gap-8 ${
                    item?.id == 1 ? "" : item.id == 2 ? "" : ""
                  }  py-4 px-6    cursor-pointer`}
                >
                  <div className="bg-[#F2F2F2] rounded-xl  flex items-center justify-center min-w-32  px-2 min-h-[90px] 4xl:min-h-[140px] ">
                    <Image
                      src={item.image}
                      width={100}
                      height={100}
                      alt="test"
                      className={`p-4 ${
                        item?.id == 1
                          ? ""
                          : item.id == 2
                          ? ""
                          : " 4xl:w-32 4xl:h-32 w-24 h-24 object-contain rounded-none"
                      }`}
                      isZoomed
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex mb-2 justify-between items-center ">
                      <h1 className=" 4xl:text-4xl xl:text-xl  text-lg font-bold">
                        {item.id == 4 && (
                          <span className="text-red-500">Warning! </span>
                        )}
                        {item.title}
                      </h1>{" "}
                      <div className="flex flex-wrap justify-center items-center gap-5">
                        {item.notifications.map((notification, index) => (
                          <TooltipComponent
                            key={index}
                            htmlTag={
                              <Image
                                src={notification.icon}
                                width={1000}
                                height={1000}
                                alt={notification.alt}
                                className="z-100 4xl:w-[35px] 4xl:h-[35px] w-[24px] h-[24px] rounded-none flex items-center justify-center object-contain"
                              />
                            }
                            param={notification.text}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="4xl:text-[30px] 4xl:text-3xl xl:text-lg text-sm text-black ">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {data2.map((item, index) => (
              <div
                key={item.id}
                className="hover:bg-web_lightgray/30 transition-all duration-300 ease-out bg-white"
                onClick={() => handleCardClick(item.id, item)}
              >
                <div
                  className={`flex items-center  w-full  gap-8 ${
                    item?.id == 1
                      ? ""
                      : item.id == 2
                      ? "border-t shadow-sm rounded-xl"
                      : "shadow-sm border my-5 rounded-xl"
                  }  py-4 px-6    cursor-pointer`}
                >
                  <div className="bg-[#F2F2F2] rounded-xl  flex items-center justify-center min-w-32  px-2 min-h-[90px] 4xl:min-h-[140px] ">
                    <Image
                      src={item.image}
                      width={100}
                      height={100}
                      alt="test"
                      className={`p-4 ${
                        item?.id == 1
                          ? ""
                          : item.id == 2
                          ? ""
                          : "min-w-24 min-h-24 object-contain rounded-none"
                      }`}
                      isZoomed
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex mb-2 justify-between items-center ">
                      <h1 className=" 4xl:text-4xl xl:text-xl  text-lg font-bold ">
                        {item.id == 4 && (
                          <span className="text-red-500">Warning! </span>
                        )}
                        {item.title}
                      </h1>{" "}
                      <div className="flex min-w-[160px]  flex-wrap justify-center items-center gap-5">
                        {item.notifications.map((notification, index) => (
                          <TooltipComponent
                            key={index}
                            htmlTag={
                              <Image
                                src={notification.icon}
                                width={1000}
                                height={1000}
                                alt={notification.alt}
                                className="z-100 4xl:w-[35px] 4xl:h-[35px] w-[24px] h-[24px] rounded-none flex items-center justify-center object-contain"
                              />
                            }
                            param={notification.text}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="4xl:text-3xl xl:text-lg text-sm text-black ">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="-mt-11 4xl:mt-0">
              <div className="flex gap-16 items-center ">
                <div className="mt-10 justify-center items-center ">
                  <p className="font-bold 4xl:text-5xl xl:text-xl text-lg">
                    Info
                  </p>
                </div>
              </div>
              <div className="flex my-2 gap-2 justify-between   ">
                <div className="flex items-center gap-3">
                  <Image
                    src={"/images/notification/lorem.png"}
                    alt="notification"
                    width={1000}
                    height={1000}
                    className="4xl:w-[30px] 4xl:h-[30px] w-[18px] h-[18px] mt-[2px] "
                  />
                  <p className=" 4xl:text-3xl text-sm font-bold">lorem ipsum</p>
                </div>

                <div className="flex items-center gap-3"></div>

                <div className="flex gap-4 4xl:gap-6 4xl:mx-3 z-0">
                  {images.map((image, index) => (
                    <TooltipComponent
                      key={index}
                      htmlTag={
                        <Image
                          src={image.icon}
                          alt={image.alt}
                          width={1000}
                          height={1000}
                          className="4xl:w-[35px] 4xl:h-[35px] w-[24px] h-[24px] rounded-none"
                        />
                      }
                      param={image.text}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {selectedCard !== null && ( */}

        <div
          className={`transition-all bg-white  !duration-300 !ease-in-out
        ${
          selectedCard !== null
            ? "translate-x-0 transition-all "
            : "lg:translate-x-[800px] fixed min-h-[100vh] bg-white lg:min-h-fit top-16 bg-white p-4 transition-all right-0 lg:static translate-x-[500px] w-0"
        }
        `}
        >
          <SideCard sidecard={sidecard} onClose={() => setSelectedCard(null)} />
        </div>

        {/* )} */}
      </div>

      {/* Notification card bottom */}
    </>
  );
};

export default NotificationCard;
