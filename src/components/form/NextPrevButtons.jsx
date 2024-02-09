"use client";
import React, { useState } from "react";
import Button from "./CustomButton";
import { useRouter } from "next/navigation";

export default function NextPrevButtons({
  Prev,
  Next,
  disalbedPrev,
  disabledNext,
  nextRoute,
  prevRoute,
}) {
  const router = useRouter();
  const [prev, setPrev] = useState(Prev);
  const [next, setNext] = useState(Next);
  return (
    <div className="w-[70%] rounded-r-full rounded-l-full  4xl:py-3 border-2 border-web_borderGray flex flex-row justify-between  ">
      <Button
        name={"Prev"}
        handleClick={() => {
          setPrev(true);
          setNext(false);
          router.push(prevRoute ?? "/");
        }}
        selectedPrev={prev}
        disabled={disalbedPrev}
      />
      <Button
        name={"Next"}
        handleClick={() => {
          setNext(true);
          setPrev(false);
          router.push(nextRoute ?? "/");
        }}
        selectedPrev={next}
        disabled={disabledNext}
      />
    </div>
  );
}
