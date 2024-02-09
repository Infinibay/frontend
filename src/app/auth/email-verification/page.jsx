"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import { Button, Image, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm();
  // handle form submit
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="auth_bg min-h-screen">
        {/* header */}

        <div className="container mx-auto px-2 flex flex-wrap xl:flex-nowrap justify-center lg:gap-20 gap-4 xl:pt-20 lg:pt-16 pt-12  items-center">
          <div className="lg:max-w-[650px] 4xl:max-w-[1300px]  lg:min-w-[750px] w-full  ">
            <Link href="/auth/forgot-password" className="px-9">
              <AuthHeader text={"Back"} />
            </Link>
            <Image
              src="/images/auth/forgotpassword.png"
              alt="forgetpassword"
              className="w-full lg:max-w-[600px] 4xl:max-w-[1600px] 4xl:mt-8 xl:block hidden"
            />
          </div>
          <div className="max-w-[600px]  4xl:max-w-[1200px] w-full ">
            <div className="flex justify-center flex-1 w-full border-[#DEDEDE]">
              <div className="border  border-web_lightgray flex-1  max-w-[550px] 4xl:max-w-[1000px] 4xl:h-[900px] h-full p-6 rounded-2xl custom_shadow bg-white">
                <Image
                  className="max-w-[280px] 4xl:max-w-[800px] 4xl:mt-10 "
                  alt="laptop-infinibay"
                  src="/images/logo_1.png"
                />
                <div className="py-4 4xl:mt-16 ">
                  <div className="flex gap-2 justify-between mb-2">
                    <h2 className="subheading">Check Your Email</h2>
                  </div>
                  <p className="text-[15px] 4xl:text-2xl  4xl:mt-4">
                    we have sent a password recovery instruction to your email.{" "}
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full">
                      <label
                        htmlFor="code"
                        className="relative 4xl:text-3xl block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                      >
                        <input
                          type="number"
                          id="code"
                          placeholder="Enter a code"
                          {...register("code", {
                            required: true,
                            maxLength: 10,
                          })}
                          aria-invalid={errors.code ? "true" : "false"}
                          className="peer border-none 4xl:p-6 4xl:text-3xl rounded-3xl sm:px-8 p-4 placeholder:text-black placeholder:font-normal focus:border-web_lightGrey focus:outline-none w-full"
                          onKeyDown={(e) => {
                            if (e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                        />
                        {/* <span
                          className="pointer-events-none absolute start-4 font-medium top-0 -translate-y-1/2 bg-white pl-4.5 text-xs text-gray-700 transition-all 
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-lg "
                        >
                          Enter a code
                        </span> */}
                      </label>
                      <div className="h-2 mt-2">
                        {errors.code?.type === "required" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-2xl"
                          >
                            Your code is required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-base text-sm  mt-4 pl-3  4xl:mb-10">
                      <p className="text-sm 4xl:text-2xl  4xl:mt-4">
                        {`Didn't receive the email? Check your spam filter or try`}{" "}
                      </p>
                      <Link
                        href="#"
                        className="text-[#1C77BF]  4xl:mt-10 text-sm 4xl:text-2xl sm:mt-0 font-semibold border-b-1 border-b-[#1C77BF]"
                      >
                        another email address.
                      </Link>
                    </div>
                    <Button
                      as={Link}
                      href="/auth/create-new-password"
                      type="submit"
                      className="mt-4 4xl:p-9 GradientBlue text-white w-full p-3 rounded-2xl 4xl:text-3xl"
                    >
                      Confirm
                    </Button>
                    <div className="mt-6 -mb-3 flex gap-3 justify-center">
                      <Link
                        href="#"
                        className="text-[#EC9430]  text-sm border-b-1 font-semibold border-b-web_lightbrown 4xl:text-2xl"
                      >
                        Resend
                      </Link>
                    </div>
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
