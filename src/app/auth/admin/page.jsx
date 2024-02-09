"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import NextImage from "next/image";
import Image from "next/image";
import { usePathname } from "next/navigation";
const Page = () => {
  const [hidePass, setHidePass] = useState(false);
  const handleeyeIcon = () => {
    setHidePass(!hidePass);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    control,
    setValue,
  } = useForm();
  // handle form submit
  const onSubmit = (data) => {
    console.log(data);
  };
  const pathname =usePathname();
  // console.log(pathname)
  return (
    <div className="auth_bg min-h-screen">
      {/* header */}
      <Link href="/">
      <div className="container mt-10">
        <AuthHeader text={"Return Home"} />
        </div>
      </Link>

      <div className=" flex items-center gap-12 container pt-8">
        <div className={`flex-1 hidden lg:block  ${ pathname === "/auth/admin" ? "4xl:max-w-[1500px]" : "max-w-[1000px]" }`}>
          <Image alt="laptop-infinibay" src="/images/auth/authPc.png" width={1000} height={1000} className="w-full h-wull"/>
        </div>
        <div className="flex justify-center flex-1">
          <div className="border border-web_lightgray flex-1  max-w-[550px] 
           4xl:max-w-[850px] 4xl:h-[850px] p-6
           rounded-2xl custom_shadow bg-white">
        
            <Image
              className="max-w-[280px] 4xl:max-w-[780px] 4xl:my-10"
              alt="laptop-infinibay" width={400} height={400}
              src="/images/logo_1.png"
            />
            <div className="py-4 4xl:my-8">
              <div className="flex gap-2 justify-between mb-2">
                <h2 className="subheading 4xl:text-5xl ">Welcome</h2>
                <div className="flex sm:gap-7 gap-2 ">
                  <Link href="/auth/sign-in">
                    <button
                      className={`
                    hover:text-white hover:bg-web_aquaBtnblue
                     border border-web_lightGrey text-center 
                   sm:w-[100px] 4xl:w-[150px] px-4 py-2 rounded-lg  text-web_darkgray`}
                    >
                      User
                    </button>
                  </Link>
                  <Link href="">
                    <button
                      className={` bg-web_lightbrown 
                        sm:w-[100px] 4xl:w-[150px] px-4 rounded-lg py-2 text-white`}
                    >
                      Admin
                    </button>
                  </Link>
                </div>
              </div>
              <p className="4xl:text-2xl">Create your account to continue Installation </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full 4xl:mt-10">
                  <label
                    htmlFor="Email"
                    className="relative block rounded-3xl border shadow-sm pl-4 mt-7"
                  >
                    <input
                      type="text"
                      id="Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      aria-invalid={errors.email ? "true" : "false"}
                      className="peer border-none rounded-3xl  bg-white px-8 p-4 4xl:p-6 
                      placeholder-transparent focus:border-web_lightGrey focus:outline-none w-full 4xl:text-3xl"
                      placeholder="Infinibayuzzi@gmail.com"
                    />
                    <span
                      className="pointer-events-none absolute start-4 font-medium top-0 
                      -translate-y-1/2 bg-white pl-4.5 text-xs text-gray-700 transition-all 4xl:text-3xl
                peer-placeholder-shown:top-1/2 4xl:peer-placeholder-shown:text-lg peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-lg"
                    >
                      Email
                    </span>
                  </label>
                  <div className="h-2 mt-2">
                    {errors.email?.type === "required" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold"
                      >
                        Your email is required
                      </p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold"
                      >
                        Enter a valid email address
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full 4xl:mt-10">
                  <label
                    htmlFor="Pass"
                    className="relative block rounded-3xl border shadow-sm pl-4 sm:mt-7 mt-4"
                  >
                    <input
                      type={!hidePass ? "password" : "text"}
                      id="pass"
                      {...register("password", {
                        required: true,
                        maxLength: 20,
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      className="peer border-none rounded-3xl 4xl:text-3xl  bg-white px-8 p-4 4xl:p-6 placeholder-transparent focus:border-web_lightGrey focus:outline-none w-full"
                      placeholder="Infinibayuzzi@gmail.com"
                    />
                    <span
                      className="pointer-events-none absolute start-4 font-medium top-0 -translate-y-1/2
                       bg-white pl-4.5 text-xs text-gray-700 transition-all 
                  peer-placeholder-shown:top-1/2 4xl:peer-placeholder-shown:text-lg peer-placeholder-shown:text-sm peer-focus:top-0
                   peer-focus:text-lg 4xl:text-3xl"
                    >
                      Password
                    </span>
                    <span
                      className="absolute right-3 top-5"
                      onClick={handleeyeIcon}
                    >
                      {hidePass ? <IoEye className="4xl:text-lg"/> : <FaRegEyeSlash className="4xl:text-3xl" />}
                    </span>
                  </label>
                  <div className="h-2 mt-2">
                    {errors.password?.type === "required" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold 4xl:text-xl"
                      >
                        Your password is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between sm:text-base text-sm items-center mt-4 pl-3 4xl:mt-10">
                  <div className="gap-x-3 flex">
                    <label className="4xl:text-lg">
                      <Controller
                        name="rememberme"
                        control={control}
                        // Set the default value
                        render={({ field }) => (
                          <input type="checkbox" {...field} />
                        )}
                      />{" "}
                      remember me
                    </label>
                    {errors.rememberme && <span>This field is required</span>}
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-black font-medium  4xl:text-lg"
                  >
                    Forgot password
                  </Link>
                </div>
                <button
                  type="submit"
                  className="mt-4 GradientBlue text-white w-full p-3 4xl:p-5 4xl:text-xl rounded-lg"
                >
                  Login
                </button>
                <div className="mt-6 -mb-3 flex gap-3 justify-center">
                  <p className="text-sm text-center 4xl:text-lg">
                    Don&apos;t have an account?
                  </p>
                  <Link
                    href="/auth/sign-up"
                    className="text-web_lightbrown text-sm 4xl:text-lg"
                  >
                    Sign up now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
