"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

const Page = () => {
  const [hidePass, setHidePass] = useState(false);
  const [hidePass1, setHidePass1] = useState(false);
  const handleeyeIcon = () => {
    setHidePass(!hidePass);
  };
  const handleeyeIcon1 = () => {
    setHidePass1(!hidePass1);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    setValue,
  } = useForm();
  // handle form submit
  const onSubmit = async (data, event) => {
    event.preventDefault();
  };
  return (
    <>
      <div className="auth_bg min-h-screen mt-16 px-10">
        {/* header */}
        <div className="flex group container mt-16 mx-auto cursor-pointer items-center  gap-4">
          <Link href="/">
            <AuthHeader text={"Return Home"} className="" />
          </Link>
        </div>
        <div
          className="container mx-auto px-2 flex flex-wrap lg:flex-nowrap justify-center lg:gap-10 gap-4 xl:pt-20 lg:pt-16 pt-12 
          items-center"
        >
          {/* image */}
          <div className=" 4xl:max-w-[1300px] lg:max-w-[650px] lg:min-w-[750px] w-full px-16 xl:block hidden ">
            <div className="4xl:max-w-[1300px] w-full xl:max-w-[700px] lg:max-w-[600px] ">
              <Image
                width={900}
                height={900}
                src="/images/auth/forgotpassword.png"
                alt="forgetpassword"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* form */}
          <div className=" flex-1 lg:max-w-[550px] 4xl:max-w-[1500px]  w-full px-5">
            <div className="flex justify-center flex-1 mx-auto">
              <div className="border border-[#DEDEDE] 5xl:max-w-[1200px] 4xl:max-w-[1000px] 2xl:max-w-[700px] 4xl:h-[1000px] 4xl:py-[100px] flex-1  max-w-[600px] sm:px-6 px-4 py-6 rounded-2xl custom_shadow bg-white">
                <Image
                  className="max-w-[280px] 4xl:mt-7 4xl:max-w-[400px]"
                  width={300}
                  height={300}
                  alt="laptop-infinibay"
                  src="/images/logo_1.png"
                />
                <div className="py-4 4xl:mt-5">
                  <div className="flex gap-2 justify-between mb-2 4xl:mt-5">
                    <h2 className="4xl:text-4xl xl:text-2xl font-bold lg:text-xl xs:text-lg">
                      Create a New Password
                    </h2>
                  </div>
                  <p className="text-sm 4xl:text-2xl">
                    Your new password will be different from the existing &
                    previous ones.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full 4xl:mt-16">
                      <label
                        htmlFor="password"
                        className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                      >
                        <input
                          type={!hidePass ? "password" : "text"}
                          id="password"
                          {...register("password", {
                            required: true,
                            maxLength: 20,
                          })}
                          aria-invalid={errors.password ? "true" : "false"}
                          className="peer 4xl:text-3xl 4xl:p-6 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder="**********"
                        />
                        <span className="pointer-events-none absolute start-4 4xl:text-3xl text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Password
                        </span>
                        <span
                          className="absolute right-3 top-5"
                          onClick={handleeyeIcon}
                        >
                          {hidePass ? (
                            <IoEye className="4xl:text-3xl" />
                          ) : (
                            <FaRegEyeSlash className="4xl:text-2xl" />
                          )}
                        </span>
                      </label>
                      <div className="h-2 mt-2">
                        {errors.password?.type === "required" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold"
                          >
                            Your password is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full 4xl:mt-10">
                      <label
                        htmlFor="confirmpass"
                        className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                      >
                        <input
                          type={!hidePass1 ? "password" : "text"}
                          id="confirmpass"
                          {...register("confirmpass", {
                            required: true,
                            maxLength: 20,
                          })}
                          aria-invalid={errors.confirmpass ? "true" : "false"}
                          placeholder="**********"
                          className="peer border-none 4xl:p-6 4xl:text-3xl rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] placeholder:my-9 focus:border-web_lightGrey focus:outline-none w-full placeholder-px-4 placeholder-py-2"
                        />

                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Confirm Password
                        </span>
                        <span
                          className="absolute right-3 top-5 "
                          onClick={handleeyeIcon1}
                        >
                          {hidePass1 ? (
                            <IoEye className="4xl:text-2xl" />
                          ) : (
                            <FaRegEyeSlash className="4xl:text-3xl" />
                          )}
                        </span>
                      </label>
                      <div className="h-2 mt-2">
                        {watch("confirmpass") !== watch("password") &&
                        getValues("confirmpass") ? (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-xl"
                          >
                            password not match
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex justify-between items-center sm:flex-nowrap flex-wrap  mt-4 4xl:mt-10 pl-3">
                      <div className="gap-x-3 flex sm:text-end sm:text-base text-sm text-center">
                        <lable className="4xl:text-2xl font-medium">
                          Both passwords must match.
                        </lable>
                      </div>
                      <FaCheckCircle className="text-web_green text-lg 4xl:text-2xl" />
                    </div>
                    <Button
                      as={Link}
                      href="/auth/sign-in"
                      type="submit"
                      className="mt-4 4xl:mt-10 4xl:p-10 4xl:text-2xl  GradientBlue text-white w-full p-3 rounded-2xl"
                    >
                      Confirm
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
