import { Button, Divider, Image, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footerBg py-10 bg-cover">
      <div className="container pt-28 flex gap-6 lg:flex-nowrap lg:flex-row flex-col flex-wrap justify-between items-start mx-auto px-4 pb-6 md:px-6 lg:px-12">
        {/* first */}
        <div className="lg:max-w-[30%] w-full">
          <Image
            src="/images/footerLogo.png"
            alt="logo"
            className="max-w-[200px] lg:max-w-[300px] 2xl:max-w-[600px] mb-2"
            width={380}
            height={380}
          />
          <p className="text-white text-sm leading-6 py-6 para">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className=" w-full max-w-[200px] lg:w-[40%] flex flex-row justify-between">
            <Link href={"/"}>
              <FaTwitter
                size={26}
                className="hover:text-web_lightbrown text-white"
              />
            </Link>

            <Link href={"/"}>
              <FaFacebookF
                size={26}
                className="hover:text-web_lightbrown text-white"
              />
            </Link>

            <Link href={"/"}>
              <FaInstagram
                size={26}
                className="hover:text-web_lightbrown text-white"
              />
            </Link>

            <Link href={"/"}>
              <FaLinkedin
                size={26}
                className="hover:text-web_lightbrown text-white"
              />
            </Link>
          </div>
        </div>

        {/* second */}
        <div className="lg:max-w-[20%] py-4 md:py-0 w-full text-white">
          <h3 className="capitalize text-xl lg:text-2xl font-bold 4xl:text-4xl">
            Links
          </h3>
          <ul className="lg:space-y-6 space-y-3 flex flex-col lg:mt-6 mt-4">
            <Link className="hover:text-web_lightbrown w-fit para" href="">
              Terms
            </Link>
            <Link className="hover:text-web_lightbrown w-fit para" href="">
              Privacy
            </Link>
            <Link className="hover:text-web_lightbrown w-fit para" href="">
              Cookies
            </Link>
          </ul>
        </div>

        {/* third */}
        <div className="lg:max-w-[20%] w-full text-white">
          <h3 className="capitalize text-xl lg:text-2xl   font-bold 4xl:text-4xl">
            Subscribe Us
          </h3>
          <form className="lg:mt-6 mt-4 space-y-5">
            <Input
              classNames={{
                input: [
                  "para",
                  "bg-transparent",
                  "placeholder:text-white/50 !text-white",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: ["!cursor-text !bg-[#292929]"],
              }}
              type="email"
              placeholder="Enter your email"
            />
            <Button className="uppercase bg-web_lightbrown font-medium tracking-wide w-full text-center text-white 4xl:h-[70px] h-[50px] para">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <Divider className="my-4 bg-white" />
      <div className="pt-6 flex items-center justify-between gap-2 flex-wrap px-4 container md:px-6 lg:px-12">
        <a href="https://internativelabs.com" target="_blank">
          <Image
            width={1000}
            height={1000}
            className="max-w-[180px] 4xl:max-w-[280px] rounded-none "
            alt="INL-logo"
            src="/inllogo.webp"
          />
        </a>
        <div className="text-center   text-white text-sm para">
          © 2023 Infinibay. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
