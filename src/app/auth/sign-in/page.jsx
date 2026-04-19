"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, Shield, User, Mail, Lock } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Checkbox,
  Alert,
  SegmentedControl,
} from "@infinibay/harbor";

import { loginUser, fetchCurrentUser } from "@/state/slices/auth";

const Page = () => {
  const {
    handleSubmit,
    control,
  } = useForm();
  const [hidePass, setHidePass] = useState(true);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      await dispatch(fetchCurrentUser()).unwrap();
      router.push("/computers");
    } catch (err) {
      if (
        err.status === 401 ||
        err.status === 403 ||
        err.message?.includes("401") ||
        err.message?.includes("403")
      ) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Ambient mesh background — pure Harbor chrome */}
      <div className="mesh-bg">
        <div
          className="blob"
          style={{
            width: 560,
            height: 560,
            left: "-10%",
            top: "10%",
            background: "rgb(168 85 247 / 0.45)",
            animation: "mesh 18s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 520,
            height: 520,
            right: "-8%",
            bottom: "-10%",
            background: "rgb(56 189 248 / 0.4)",
            animation: "mesh 22s ease-in-out infinite reverse",
          }}
        />
        <div
          className="blob"
          style={{
            width: 380,
            height: 380,
            left: "40%",
            top: "40%",
            background: "rgb(244 114 182 / 0.35)",
            animation: "breathe 9s ease-in-out infinite",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Brand / hero side */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <Image
              alt="Infinibay logo"
              src="/images/logo.png"
              width={88}
              height={88}
              className="drop-shadow-[0_0_32px_rgba(168,85,247,0.35)]"
              priority
            />
            <div className="space-y-2 text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-fg">
                Infinibay
              </h1>
              <p className="text-lg text-fg-muted max-w-md mx-auto">
                Virtualization management for people who want VMs to just work.
              </p>
            </div>
            <Image
              alt=""
              aria-hidden="true"
              src="/images/auth/vdi-hero.svg"
              width={480}
              height={320}
              className="w-full max-w-md h-auto opacity-80"
            />
          </div>

          {/* Login card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Mobile brand */}
              <div className="lg:hidden flex justify-center mb-8">
                <Image
                  alt="Infinibay logo"
                  src="/images/logo.png"
                  width={64}
                  height={64}
                  priority
                />
              </div>

              <Card variant="glass" className="p-8 spotlight-soft">
                <div className="space-y-2 text-center mb-6">
                  <h2 className="text-2xl font-semibold text-fg">Welcome back</h2>
                  <p className="text-sm text-fg-muted">
                    Sign in to access your virtual machines.
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <SegmentedControl
                    items={[
                      {
                        value: "user",
                        label: (
                          <span className="inline-flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            User
                          </span>
                        ),
                      },
                      {
                        value: "admin",
                        label: (
                          <span className="inline-flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            Admin
                          </span>
                        ),
                      },
                    ]}
                    value={role}
                    onChange={setRole}
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      <TextField
                        label="Email address"
                        type="email"
                        placeholder="admin@infinibay.com"
                        icon={<Mail className="h-4 w-4" />}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Password is required",
                      maxLength: {
                        value: 20,
                        message: "Password must be less than 20 characters",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Password"
                        type={hidePass ? "password" : "text"}
                        placeholder="Enter your password"
                        icon={<Lock className="h-4 w-4" />}
                        suffix={
                          <button
                            type="button"
                            onClick={() => setHidePass((s) => !s)}
                            className="text-fg-muted hover:text-fg transition-colors"
                            aria-label={hidePass ? "Show password" : "Hide password"}
                          >
                            {hidePass ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Controller
                      name="rememberme"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          label="Remember me"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />

                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-accent-2 hover:text-accent-2/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <Alert tone="danger">{error}</Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                    icon={<LogIn className="h-4 w-4" />}
                    className="w-full"
                  >
                    {isLoading ? "Signing in…" : "Sign in"}
                  </Button>
                </form>

                <div className="text-center pt-6 mt-6 border-t border-white/8">
                  <p className="text-sm text-fg-muted">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/sign-up"
                      className="font-medium text-accent-2 hover:text-accent-2/80 transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </Card>

              <p className="text-center text-xs text-fg-subtle mt-6">
                By signing in you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
