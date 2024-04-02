"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button, Checkbox, Image } from "@nextui-org/react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import AuthHeader from "@/components/auth/AuthHeader";
import { API } from "@/api";
import { notify } from "@/utils/notify";
import { useStateContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { SaveUser } = useStateContext();

  const [loadingApiResponse, setLoadingApiResponse] = useState(false);
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
    control,
    setValue,
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setLoadingApiResponse(true);

    delete data.confirmpass;
    delete data.checkbox;

    try {
      const res = await API.signUp(data);
      if (!res.data?.accessToken || !res.data?.user) throw new Error("something went wrong");
      Cookies.set("token", res.data.accessToken);
      SaveUser(res.data.user);
      notify("success", res?.message || "Signed up successfully");
      router.push("/user");
    } catch (error) {
      console.error("signUp error", error);
      notify("error", error?.error ?? error?.message);
    } finally {
      setLoadingApiResponse(false);
    }
  };

  return (
    <>
      <div className="auth_bg min-h-screen">
        <div className="container pb-4 lg:pb-0  mx-auto px-2 grid xl:grid-cols-2 grid-cols-1 place-items-center">
          <div className="4xl:max-w-[1000px] max-w-[590px] lg:mx-0 mx-auto lg:max-w-[500px] xl:max-w-[550px] w-full xl:-translate-y-10 ">
            {/* <div className="max-w-[500px] lg:mx-0 mx-auto lg:max-w-[500px] xl:max-w-[550px] 4xl:max-w-[1600px] 4xl:max-w-[1920px] w-full -translate-y-10"> */}
            <div className=" pb-6 lg:pb-4 lg:pt-0 pt-6">
              <Link href="/">
                <AuthHeader text={"Return Home"} />
              </Link>
            </div>

            <Image
              src="/images/auth/signup.png"
              alt="forgetpassword"
              className="w-full 4xl:max-w-[1000px] xl:block hidden"
            />
          </div>
          <div className="4xl:max-w-[1600px] lg:max-w-[800px] w-full h-[95%] xl:h-screen">
            <div className="w-full flex flex-col justify-center h-full ">
              {/* form */}
              <div className="w-full 4xl:max-w-[1000px] max-w-[600px] sm:p-6 4xl:p-10 p-4 rounded-3xl my-auto custom_shadow bg-white/30  mx-auto">
                <Image className="w-full pt-10" alt="" src="/images/logo_1.png " />
                <div className="py-4 ">
                  <div className="flex gap-2 justify-between mb-2 4xl:mt-12">
                    <h2 className="lg:text-4xl 4xl:text-6xl text-4xl 4xl:mb-5 font-bold ">
                      Welcome!
                    </h2>
                  </div>
                  <p className="4xl:text-3xl 4xl:mb-5 4xl:mt-6">
                    Create your account to continue Installation{" "}
                  </p>
                  <form className="mt-10 space-y-7 4xl:my-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full 4xl:pb-12 4xl:pt-12">
                      <label
                        htmlFor="name"
                        className="relative block rounded-3xl 4xl:text-3xl border shadow-sm peer-placeholder-shown"
                      >
                        <input
                          htmlFor="text"
                          id="name"
                          {...register("name", { required: true })}
                          aria-invalid={errors.name ? "true" : "false"}
                          className="peer 4xl:text-3xl 4xl:p-6 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder=""
                          autoComplete="name"
                        />
                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Name
                        </span>
                      </label>
                      {errors.name?.type === "required" && (
                        <p role="alert" className="text-red-600 text-[13px] font-bold 4xl:text-xl">
                          Your name is required
                        </p>
                      )}
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="Email"
                        className="relative 4xl:text-3xl block rounded-3xl border shadow-sm peer-placeholder-shown "
                      >
                        <input
                          htmlFor="text"
                          id="Email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: "Enter a valid email address",
                            },
                          })}
                          className="peer 4xl:text-3xl 4xl:p-6 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder=""
                          autoComplete="email"
                        />
                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Email Address
                        </span>
                      </label>
                      <div className="h-2 mt-2">
                        {errors.email?.type === "required" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-xl"
                          >
                            Your email is required
                          </p>
                        )}
                        {errors.email?.type === "pattern" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-xl"
                          >
                            Enter a valid email address
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full 4xl:pt-12">
                      <label
                        htmlFor="phone"
                        className="relative block rounded-3xl border shadow-sm peer-placeholder-shown "
                      >
                        <input
                          htmlFor="text"
                          id="phone"
                          {...register("phone", {
                            required: true,
                            maxLength: 10,
                          })}
                          aria-invalid={errors.phone ? "true" : "false"}
                          onKeyDown={(e) => {
                            if (e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                          className="peer 4xl:p-6 border-none 4xl:text-3xl rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder=""
                          autoComplete="tel"
                        />
                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Phone No
                        </span>
                      </label>
                      <div className="h-2 mt-2">
                        {errors.phone?.type === "required" && (
                          <p
                            role="alert"
                            className="text-red-600 text-[13px] font-bold 4xl:text-xl"
                          >
                            Your phone is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full 4xl:pt-12">
                      <label
                        htmlFor="pass"
                        className="relative 4xl:text-3xl block rounded-3xl border shadow-sm peer-placeholder-shown "
                      >
                        <input
                          type={!hidePass ? "password" : "text"}
                          id="pass"
                          {...register("password", {
                            required: true,
                            maxLength: 20,
                          })}
                          aria-invalid={errors.password ? "true" : "false"}
                          className="peer 4xl:text-3xl 4xl:p-6 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder=""
                        />
                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Password
                        </span>
                        <span className="absolute right-3 top-5" onClick={handleeyeIcon}>
                          {hidePass ? <IoEye /> : <FaRegEyeSlash />}
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
                    <div className="w-full 4xl:pt-12">
                      <label
                        htmlFor="confirmpass"
                        className="relative 4xl:text-3xl block rounded-3xl border shadow-sm peer-placeholder-shown "
                      >
                        <input
                          type={!hidePass1 ? "password" : "text"}
                          id="confirmpass"
                          {...register("confirmpass", {
                            required: true,
                            maxLength: 20,
                          })}
                          aria-invalid={errors.confirmpass ? "true" : "false"}
                          className="peer 4xl:p-6 border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                          placeholder=""
                        />
                        <span className="pointer-events-none 4xl:text-3xl absolute start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                          Confirm Password!
                        </span>
                        <span className="absolute right-3 top-5" onClick={handleeyeIcon1}>
                          {hidePass1 ? <IoEye /> : <FaRegEyeSlash />}
                        </span>
                      </label>
                      {watch("confirmpass") !== watch("password") && getValues("confirmpass") ? (
                        <p role="alert" className="text-red-600 text-[13px] font-bold 4xl:text-xl">
                          password not match
                        </p>
                      ) : null}
                    </div>

                    <div className="flex justify-between items-center sm:flex-nowrap flex-wrap  mt-4 pl-3 4xl:pt-12">
                      <div className="gap-x-3 flex sm:text-end ">
                        <Controller
                          name="checkbox"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => <Checkbox {...field} />}
                          style="4xl:h-10 4xl:w-10"
                        />
                        <p className="sm:text-base text-sm 4xl:text-3xl ">
                          I accept all terms & Conditions
                        </p>
                      </div>

                      <Link
                        href="/auth/forgot-password"
                        className="text-black  mt-3 sm:mt-0 font-medium 4xl:text-3xl"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      // as={Link}
                      // href="/auth/sign-in"
                      type="submit"
                      className="sm:mt-4 GradientBlue text-white w-full p-3 rounded-2xl 4xl:text-3xl 4xl:p-10 4xl:pt-12"
                      isLoading={loadingApiResponse}
                    >
                      Register
                    </Button>
                    <div className="sm:mt-6 -mb-3 flex sm:gap-3 gap-2 justify-center 4xl:mt-12">
                      <p className="text-sm text-center 4xl:text-3xl">Already have an account?</p>
                      <Link
                        href="/auth/sign-in"
                        className="text-web_lightbrown underline font-medium text-sm 4xl:text-2xl"
                      >
                        Sign in now
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
