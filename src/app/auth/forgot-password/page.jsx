"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import { Button, Image, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const Page = () => {
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
  return (
    <>
      <div className="auth_bg min-h-screen">
        {/* header */}

        <div className="container mx-auto px-2 flex flex-wrap xl:flex-nowrap justify-center lg:gap-20 gap-4 xl:pt-20 lg:pt-16 pt-12  items-center">
          <div className="lg:max-w-[650px] 4xl:max-w-[1300px]  lg:min-w-[750px] w-full  ">
            <Link href="/auth/sign-in " className=" container  px-2 mx-auto">
              <AuthHeader text={"Back"} />
            </Link>
            <Image
              src="/images/auth/forgotpassword.png"
              alt="forgetpassword"
              className="w-full lg:max-w-[600px] 4xl:max-w-[1600px] 4xl:mt-8 xl:block hidden"
            />
          </div>
          <div className="max-w-[600px] 4xl:max-w-[1200px]   h-full  w-full">
            <div className="flex justify-center flex-1 4xl:max-w-[1200px] h-full w-full border-[#DEDEDE]">
              <div className="border border-web_lightgray flex-1  max-w-[550px] 4xl:max-w-[1100px] 4xl:h-[900px] h-full p-6 rounded-2xl custom_shadow bg-white">
                <Image
                  className="max-w-[280px] 4xl:max-w-[800px] 4xl:mt-10 "
                  alt="laptop-infinibay"
                  src="/images/logo_1.png"
                />
                <div className="py-4 4xl:mt-16 ">
                  <div className="flex gap-2 justify-between mb-2 4xl:mb-6">
                    <h2 className="subheading">Forgot Password?</h2>
                  </div>
                  <p className="text-sm 4xl:text-2xl 4xl:mt-12">
                    kindly provide the registered email to change the passcode.{" "}
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full 4xl:mt-12">
                      <label
                        for="Email"
                        class="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                      >
                        <input
                          htmlFor="text"
                          id="Email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: "Enter a valid email address",
                            },
                          })}
                          class="peer  4xl:text-3xl 4xl:p-7 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder="Infinibayuzzi@gmail.com"
                        />
                        <span class="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all">
                          Enter your Email
                        </span>
                      </label>
                      <div className="h-2 mt-2">
                        {errors.email?.type === "required" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-2xl"
                          >
                            Your email is required
                          </p>
                        )}
                        {errors.email?.type === "pattern" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-2xl"
                          >
                            Enter a valid email address
                          </p>
                        )}
                      </div>
                    </div>

                    {/*  <div className="flex justify-between items-center sm:flex-nowrap flex-wrap  mt-4 pl-3">
                      <div className="gap-x-3 flex sm:text-end text-center">
                        <label>
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
                        {errors.rememberme && (
                          <span>This field is required</span>
                        )}
                      </div>

                      <Link
                        href="/auth/forgot-password"
                        className="text-black  mt-3 sm:mt-0 font-medium"
                      >
                        Forgot password
                      </Link> 
                  </div> */}
                    <Button
                      as={Link}
                      href="/auth/email-verification"
                      // type="submit"
                      className="mt-4 GradientBlue  text-white w-full p-3 rounded-2xl 4xl:text-3xl 4xl:mt-12 4xl:p-10"
                    >
                      Submit
                    </Button>
                    <div className="mt-6 -mb-3 flex gap-3 justify-center 4xl:mt-12">
                      <p className="text-sm text-center 4xl:text-3xl">
                        {`Don't have an account?`}
                      </p>
                      <Link
                        href="/auth/sign-up"
                        className="text-web_lightbrown text-sm font-semibold border-web_lightbrown border-b-1 4xl:text-2xl"
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
      </div>
    </>
  );
};

export default Page;
