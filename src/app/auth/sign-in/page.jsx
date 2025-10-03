"use client";

// React & Next.js
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";

// Third-party libraries
import { Image } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, Shield, User } from "lucide-react";

// Internal imports (absolute imports)
import { loginUser, fetchCurrentUser } from "@/state/slices/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SizeProvider } from "@/components/ui/size-provider";
import { cn } from "@/lib/utils";

const Page = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [hidePass, setHidePass] = useState(true);
  const [role, setRole] = useState("user");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // handle form submit
  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SizeProvider defaultSize="md">
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background with gradient - adapts to theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background -z-10" />

        {/* Animated background orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-brand-celeste-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-dark-blue-600/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        {/* Main content grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

            {/* Left side - Branding and Hero */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center">
                  <Image
                    alt="Infinibay logo"
                    src="/images/logo_1.png"
                    className="h-20 w-auto drop-shadow-2xl"
                  />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Infinibay
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Enterprise Virtualization Management Platform
                  </p>
                </div>
              </div>

              {/* Hero image */}
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl" />
                <Image
                  alt="Infinibay platform"
                  src="/images/auth/authPc.png"
                  className="w-full h-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Mobile logo */}
                <div className="lg:hidden flex justify-center mb-8">
                  <Image
                    alt="Infinibay logo"
                    src="/images/logo_1.png"
                    className="h-16 w-auto"
                  />
                </div>

                {/* Glass card */}
                <div className="glass-strong backdrop-blur-xl rounded-2xl shadow-2xl border border-sidebar-border/20 p-8 space-y-8">
                  {/* Header */}
                  <div className="space-y-3 text-center">
                    <h2 className="text-3xl font-bold text-glass-text-primary">
                      Welcome Back
                    </h2>
                    <p className="text-glass-text-secondary">
                      Sign in to access your virtual machines
                    </p>
                  </div>

                  {/* Role selector */}
                  <div className="flex gap-3 p-1 bg-background/30 rounded-xl border border-sidebar-border/10">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                        role === "user"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-glass-text-secondary hover:text-glass-text-primary hover:bg-background/20"
                      )}
                    >
                      <User className="w-4 h-4" />
                      <span>User</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                        role === "admin"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-glass-text-secondary hover:text-glass-text-primary hover:bg-background/20"
                      )}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email input */}
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-glass-text-primary">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            placeholder="admin@infinibay.com"
                            error={fieldState.error?.message}
                            className={cn(
                              "h-12 bg-background/50 border-sidebar-border/30 text-foreground placeholder:text-muted-foreground",
                              "focus:border-primary focus:ring-2 focus:ring-primary/20",
                              fieldState.error && "border-destructive focus:border-destructive focus:ring-destructive/20"
                            )}
                            {...field}
                          />
                        </div>
                      )}
                    />

                    {/* Password input */}
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Password is required",
                        maxLength: {
                          value: 20,
                          message: "Password must be less than 20 characters"
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-glass-text-primary">
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              type={hidePass ? "password" : "text"}
                              placeholder="Enter your password"
                              error={fieldState.error?.message}
                              className={cn(
                                "h-12 bg-background/50 border-sidebar-border/30 text-foreground placeholder:text-muted-foreground pr-12",
                                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                                fieldState.error && "border-destructive focus:border-destructive focus:ring-destructive/20"
                              )}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setHidePass(!hidePass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                              aria-label={hidePass ? "Show password" : "Hide password"}
                            >
                              {hidePass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    />

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                      <Controller
                        name="rememberme"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-sidebar-border/30 text-primary focus:ring-2 focus:ring-primary/20 bg-background/50"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                            <span className="text-sm text-glass-text-secondary group-hover:text-glass-text-primary transition-colors">
                              Remember me
                            </span>
                          </label>
                        )}
                      />

                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-destructive text-sm font-medium text-center">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogIn className="w-5 h-5" />
                          <span>Sign In</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Sign up link */}
                  <div className="text-center pt-4 border-t border-sidebar-border/20">
                    <p className="text-sm text-glass-text-secondary">
                      Don&apos;t have an account?{' '}
                      <Link
                        href="/auth/sign-up"
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SizeProvider>
  );
};

export default Page;
