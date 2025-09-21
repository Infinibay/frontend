"use client";

// React & Next.js
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";

// Third-party libraries
import { Image } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

// Internal imports (absolute imports)
import auth from '@/utils/auth';
import { loginUser, fetchCurrentUser } from "@/state/slices/auth";
import { GlassModalCard, GlassCardContent } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SizeProvider } from "@/components/ui/size-provider";

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
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();


  // handle form submit
  const onSubmit = async (data) => {
    setError('');

    try {
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      await dispatch(fetchCurrentUser()).unwrap();
      router.push('/computers');
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.message?.includes('401') || err.message?.includes('403')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <SizeProvider defaultSize="md">
      <div className="auth-container min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-wallpaper-pattern opacity-20" />

        {/* Additional background elements for visual interest */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        {/* Main content */}
        <div className="flex min-h-screen items-center justify-center p-6 lg:p-8">
          {/* Hero image - responsive */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-2xl">
            <div className="relative">
              <Image
                alt="Infinibay virtualization platform"
                src="/images/auth/authPc.png"
                className="w-full h-auto max-w-lg xl:max-w-2xl transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent rounded-lg" />
            </div>
          </div>

          {/* Auth form container */}
          <div className="flex-1 flex items-center justify-center max-w-lg mx-auto">
            <GlassModalCard className="w-full max-w-md mx-auto glass-modal-card">
              <GlassCardContent className="space-y-6 p-8">
                {/* Logo */}
                <div className="flex justify-center">
                  <Image
                    alt="Infinibay logo"
                    src="/images/logo_1.png"
                    className="h-16 w-auto"
                  />
                </div>
                {/* Header section */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="mainheading text-foreground">Welcome!</h1>

                    {/* Role selection buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={role === "user" ? "primary" : "outline"}
                        size="sm"
                        glass="subtle"
                        onClick={() => setRole("user")}
                        className="min-w-[80px]"
                        aria-pressed={role === "user"}
                      >
                        User
                      </Button>
                      <Button
                        variant={role === "admin" ? "success" : "outline"}
                        size="sm"
                        glass="subtle"
                        onClick={() => setRole("admin")}
                        className="min-w-[80px]"
                        aria-pressed={role === "admin"}
                      >
                        Admin
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground subheading">
                    Sign in to continue your session
                  </p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email input */}
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Input
                          type="email"
                          label="Email"
                          placeholder="admin@infinibay.com"
                          floatingLabel={true}
                          glass={true}
                          error={fieldState.error?.message}
                          aria-invalid={fieldState.error ? "true" : "false"}
                          className="transition-all duration-300"
                          {...field}
                        />
                      </div>
                    )}
                  />
                  {/* Password input */}
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      maxLength: {
                        value: 20,
                        message: "Password must be less than 20 characters"
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2 relative">
                        <Input
                          type={!hidePass ? "password" : "text"}
                          label="Password"
                          placeholder="••••••••••"
                          floatingLabel={true}
                          glass={true}
                          error={fieldState.error?.message}
                          aria-invalid={fieldState.error ? "true" : "false"}
                          className="transition-all duration-300 pr-12"
                          {...field}
                        />

                        {/* Password visibility toggle */}
                        <button
                          type="button"
                          onClick={handleeyeIcon}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
                          aria-label={hidePass ? "Hide password" : "Show password"}
                        >
                          {hidePass ? <IoEye className="w-5 h-5" /> : <FaRegEyeSlash className="w-5 h-5" />}
                        </button>
                      </div>
                    )}
                  />

                  {/* Form options */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Controller
                        name="rememberme"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-all duration-200"
                            {...field}
                          />
                        )}
                      />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        Remember me
                      </span>
                    </label>

                    <Link
                      href="/auth/forgot-password"
                      className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    glass="subtle"
                    className="w-full transition-all duration-300 hover:shadow-elevation-3"
                  >
                    Sign In
                  </Button>

                  {/* Error message */}
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-destructive text-sm text-center font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Sign up link */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Don&apos;t have an account?
                      </span>
                      <Link
                        href="/auth/sign-up"
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </GlassCardContent>
            </GlassModalCard>
          </div>
        </div>
      </div>
    </SizeProvider>
  );
};

export default Page;
