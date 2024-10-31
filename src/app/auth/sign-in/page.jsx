"use client";

// React & Next.js
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Third-party libraries
import { Button, Image } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

// Internal imports (absolute imports)
import auth from '@/utils/auth';
import { loginUser, fetchCurrentUser } from "@/state/slices/auth";

const Page = () => { 
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [hidePass, setHidePass] = useState(false);
  const handleeyeIcon = () => {
    setHidePass(!hidePass);
  };
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  // handle form submit
  const onSubmit = async (data) => {  
    setError('');

    try {
      console.log(email, password);
      dispatch(loginUser({ email, password }));
      dispatch(fetchCurrentUser());
      const success = auth.isLoggedIn();
      if (success) {
        router.push('/computers');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="auth_bg">
      {/* header */}
      <div className="flex group container mx-auto cursor-pointer items-center  gap-4 xl:pt-20 lg:pt-16 pt-12">

      </div>
      <div className=" flex items-start pt-8">
        {/* image */}
        <div className="flex-1 hidden xl:block w-full ">
          <Image
            alt="laptop-infinibay"
            src="/images/auth/authPc.png"
            className="4xl:max-w-[1800px] 4xl:h-[1200px] max-w-[800px] h-[620px]"
          />
        </div>

        {/* form */}
        <div className="flex justify-center xl:justify-start flex-1  items-center py-10">
          <div className="border border-[#DEDEDE] 5xl:max-w-[1200px] 4xl:max-w-[1000px] 2xl:max-w-[700px] 4xl:h-[1000px] 4xl:py-[100px] flex-1  max-w-[600px] sm:px-10 px-4 py-6 rounded-2xl custom_shadow bg-white ">
            <Image
              className="max-w-[280px] 4xl:max-w-[800px]"
              alt="laptop-infinibay"
              src="/images/logo_1.png"
            />
            <div className="py-4 4xl:mb-8 4xl:mt-8">
              <div className="flex gap-2  justify-between mb-2 4xl:mb-5 ">
                <h2 className="subheading leading-[50px]">Welcome!</h2>
                <div className="flex sm:gap-3 gap-2">
                  <Button
                    onClick={() => {
                      setRole("user");
                    }}
                    className={`
                    ${role === "user"
                        ? "bg-web_aquaBtnblue text-white"
                        : "bg-white text-web_lightBlue border"
                      }
                      sm:w-[100px] 4xl:w-[150px]  rounded-2xl py-2 4xl:text-3xl 4xl:p-8`}
                  >
                    User
                  </Button>
                  <Button
                    onClick={() => {
                      setRole("admin");
                    }}
                    className={`
                        ${role === "admin"
                        ? "bg-web_lightbrown text-white"
                        : "bg-white text-web_lightBlue border"
                      }
                        border border-web_lightGrey
                    sm:w-[100px]  4xl:w-[150px] rounded-2xl py-2  4xl:text-3xl 4xl:p-8 `}
                  >
                    Admin
                  </Button>
                </div>
              </div>
              <p className="text-sm 4xl:text-2xl 4xl:mb-12">
                Create your account to continue Installation{" "}
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full 4xl:mb-12 ">
                  <label
                    htmlFor="Email"
                    className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
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
                      className="peer 4xl:p-7 4xl:text-3xl border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] focus:border-web_lightGrey focus:outline-none w-full"
                      placeholder="Infinibayuzzi@gmail.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="pointer-events-none absolute 4xl:text-3xl start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                      Email
                    </span>
                  </label>
                  <div className="h-2 mt-2">
                    {errors.email?.type === "required" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold 4xl:text-3xl"
                      >
                        Your email is required
                      </p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold 4xl:text-3xl"
                      >
                        Enter a valid email address
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="Pass"
                    className="relative block rounded-3xl border shadow-sm mt-7 peer-placeholder-shown bg-web_lightwhite"
                  >
                    <input
                      type={!hidePass ? "password" : "text"}
                      id="pass"
                      {...register("password", {
                        required: true,
                        maxLength: 20,
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      className="peer 4xl:p-7 4xl:text-3xl border-none rounded-3xl sm:px-8 p-4 placeholder:text-[#BABABA] placeholder:pt-2 focus:border-web_lightGrey focus:outline-none w-full"
                      placeholder="**********"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="pointer-events-none absolute 4xl:text-3xl start-4 text-lg font-semibold top-0 -translate-y-1/2 pl-4.5 text-gray-700 transition-all ">
                      Password
                    </span>
                    <span
                      className="absolute right-3 top-5 4xl:text-3xl"
                      onClick={handleeyeIcon}
                    >
                      {hidePass ? <IoEye /> : <FaRegEyeSlash />}
                    </span>
                  </label>
                  <div className="h-2 mt-2">
                    {errors.password?.type === "required" && (
                      <p
                        role="alert"
                        className="text-red-600 text-[13px] font-bold 4xl:text-3xl"
                      >
                        Your password is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 4xl:mt-12">
                  <div className="gap-x-3 flex sm:text-end">
                    <label className="sm:text-base text-sm 4xl:text-2xl">
                      <Controller
                        name="rememberme"
                        control={control}
                        // Set the default value
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            className="4xl:text-3xl transform scale-125 mr-3"
                            {...field}
                          />
                        )}
                      />{" "}
                      Remember me
                    </label>
                    {errors.rememberme && <span>This field is required</span>}
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-black font-medium sm:text-base text-sm 4xl:text-2xl"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="mt-4 GradientBlue text-white w-full p-3 4xl:p-10 rounded-2xl 4xl:text-3xl 4xl:mb-8 4xl:mt-12"
                >
                  Login
                </Button>
                {error && (
                  <p className="text-red-600 text-center mt-2 4xl:text-xl">
                    {error}
                  </p>
                )}
                {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                <div className="mt-6 -mb-3 flex gap-3 justify-center">
                  <p className="text-sm text-center 4xl:text-2xl">
                    Don&apos;t have an account?
                  </p>
                  <Link
                    href="/auth/sign-up"
                    className="text-web_lightbrown text-sm 4xl:text-2xl"
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
