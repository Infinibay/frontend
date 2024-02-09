import FormOne from "@/components/form/FormOne";
import HeadingComp from "@/components/form/HeadingComp";
import NextPrevButtons from "@/components/form/NextPrevButtons";
import { step1Heading } from "@/data";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-6 lg:gap-12">
      <HeadingComp
        text1={step1Heading.text1}
        text2={step1Heading.text2}
        para={step1Heading.para}
      />
      {/* <p className='h-[70vh] overflow-y-auto border-2 border-blue-500'>step1</p> */}
      <FormOne />
      <NextPrevButtons
        Prev={false}
        Next={true}
        disalbedPrev={true}
        disabledNext={false}
      />
    </div>
  );
}
