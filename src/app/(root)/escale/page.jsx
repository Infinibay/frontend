"use client";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [visibleNumbers, setVisibleNumbers] = useState([]);

  useEffect(() => {
    const numbers = [1, 2, 2, 3, 4];
    let index = 0;

    const showNumbersSequentially = setInterval(() => {
      if (index < numbers.length) {
        setVisibleNumbers((prevNumbers) => [...prevNumbers, numbers[index]]);
        index++;
      } else {
        clearInterval(showNumbersSequentially);
        // After displaying all numbers, navigate to "/done"
        setTimeout(() => {
          router.push("/done");
        }, 1000); // Adjust the delay as needed
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(showNumbersSequentially);
  }, []); // Make sure to pass an empty dependency array to run this effect only once

  console.log(visibleNumbers);
  return (
    <div className="container mx-auto flex flex-col justify-center items-center mt-6 h-[100vh]">
      <div className="w-full  flex justify-center items-center mx-auto mt-12">
        <Image
          src="/images/logo_1.png"
          alt="table"
          width={2000}
          height={2000}
          className="logo"
        />
      </div>

      <h2 className="font-bold text-4xl mt-[120px] heading2">
        ESCALE <span className="font-medium">Nodes</span>
      </h2>
      <p className="mt-[50px] max-w-[1240px] para text-center mx-1">
        Lorem ipsum dolor sit amet consectetur. Tincidunt gravida vel quam massa
        eu. Tempor duis aenean felis quisque pulvinar libero. Elementum arcu
        nibh tincidunt condimentum. Ante sed amet accumsan pharetra viverra
        porttitor integer tempor ullamcorper. Mattelementum. Adipiscing viverra
        phasellus ipsum elementum consectetur non tortor. Metus vitae amet
        natoque integer lacus id pellentesque.
      </p>

      {/* <div className="flex flex-wrap mt-10 gap-3 mx-1">
        {visibleNumbers.map((number, index) => (
          <p
            key={index}
            className="py-4 px-6 border-web_lightBlue border-2 rounded-lg text-web_lightBlue font-medium text-lg"
          >
            {number}
          </p>
        ))}
      </div> */}
      <div className="flex flex-wrap mt-10 gap-3 mx-1">
        {visibleNumbers?.slice(0, 4).map((number, index) => (
          <p
            key={index}
            className="py-4 px-6 border-web_lightBlue bg-web_aquablue text-white border-2 rounded-lg  font-medium para"
          >
            {number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Page;
