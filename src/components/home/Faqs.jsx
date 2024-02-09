"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem, Divider, Image } from "@nextui-org/react";
import { RxCaretDown } from "react-icons/rx";
import { FaBookBookmark } from "react-icons/fa6";

const Faqs = () => {
  const [accordionStates, setAccordionStates] = useState([false, false, false]);

  const handleAccordionToggle = (index) => {
    const newAccordionStates = [...accordionStates];
    newAccordionStates[index] = !newAccordionStates[index];
    setAccordionStates(newAccordionStates);
  };

  return (
    <div className="container mx-auto max-w-[88%] px-0">
      <div className="shadow-lg rounded-3xl">
        <div className="w-full xl:max-w-[80%] mx-auto py-10 sm:px-6 px-2 my-16 relative">
          <h2 className="heading2 !font-medium px-2">
            Do You Have <span className="font-bold">Any Question</span>
            <span className="text-web_lightbrown font-bold">?</span>
          </h2>
          <div className="sm:pt-10 pt-4 w-full">
            <Accordion variant="splitted" selectionMode="multiple">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <AccordionItem
                  key={index}
                  className={`!rounded-2xl border mt-4 !shadow-none`}
                  indicator={({ isOpen }) =>
                    isOpen ? (
                      <RxCaretDown className="bg-web_lightbrown !text-white !text-3xl 2xl:!text-5xl sm:w-7 sm:h-7 w-6 h-6 rounded-md rotate-90" />
                    ) : (
                      <RxCaretDown className="bg-[#D8EEFF] text-web_darkBlue !text-3xl 2xl:!text-5xl sm:w-7 sm:h-7 w-6 h-6 rounded-md" />
                    )
                  }
                  aria-label={`Accordion ${index + 1}`}
                  title={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`}
                  classNames={{
                    trigger: "bg-transparent !text-white",
                    title: accordionStates[index]
                      ? "!text-white font-semibold sm:text-xl text-sm para"
                      : "text-black para font-semibold sm:text-xl text-sm",
                    base: accordionStates[index]
                      ? "!bg-web_lightBlue !text-white py-3 px-8 shadow-none"
                      : "text-white py-1 !bg-transparent px-8 shadow-none",
                  }}
                  onClick={() => handleAccordionToggle(index)}
                >
                  <Divider className="my-4 bg-white border-white pr-20" />

                  <div
                    className={`${
                      accordionStates[index] ? "text-white" : "text-black"
                    } py-3 para `}
                  >
                    {/* Your accordion content here */}
                    Lorem ipsum dolor sit amet consectetur. Tincidunt aliquam
                    fames pretium nullam dictum lorem. Nunc diam vestibulum
                    tristique ipsum dolor veneero.Lorem ipsum dolor sit amet m
                    nullam dictum lorem. Nunc diam vestibulum tristique ipsum
                    dolor veneero.
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="hidden xl:block lg:absolute lg:-bottom-2 lg:-right-64">
              <Image
                src="/images/woman.png"
                alt="feature1"
                width={1000}
                height={1000}
                className="max-w-[200px] 2xl:max-w-[300px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
