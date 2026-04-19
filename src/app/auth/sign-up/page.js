"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, UserPlus } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Checkbox,
  Alert,
} from "@infinibay/harbor";

const Page = () => {
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
  } = useForm();

  const onSubmit = async (_data) => {
    // Placeholder: no backend wiring yet.
    setError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-10">
      <div className="mesh-bg">
        <div
          className="blob"
          style={{
            width: 560, height: 560, left: "-10%", top: "5%",
            background: "rgb(168 85 247 / 0.4)",
            animation: "mesh 18s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 520, height: 520, right: "-8%", bottom: "-10%",
            background: "rgb(56 189 248 / 0.35)",
            animation: "mesh 22s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return home
          </Link>

          <Card variant="glass" className="p-8 spotlight-soft">
            <div className="flex justify-center mb-6">
              <Image
                alt="Infinibay"
                src="/images/logo.png"
                width={56}
                height={56}
                priority
              />
            </div>

            <div className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold text-fg">Create your account</h1>
              <p className="text-sm text-fg-muted">
                Welcome — let&apos;s get you set up.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Name"
                    placeholder="Ada Lovelace"
                    icon={<User className="h-4 w-4" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

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
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: "Phone number is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Phone"
                    type="tel"
                    placeholder="+54 11 1234 5678"
                    icon={<Phone className="h-4 w-4" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required", maxLength: { value: 20, message: "Max 20 characters" } }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Password"
                    type={hidePass ? "password" : "text"}
                    icon={<Lock className="h-4 w-4" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setHidePass((s) => !s)}
                        className="text-fg-muted hover:text-fg"
                        aria-label={hidePass ? "Show" : "Hide"}
                      >
                        {hidePass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="confirmpass"
                control={control}
                defaultValue=""
                rules={{
                  required: "Please confirm the password",
                  validate: (v) => v === getValues("password") || "Passwords don't match",
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Confirm password"
                    type={hidePass2 ? "password" : "text"}
                    icon={<Lock className="h-4 w-4" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setHidePass2((s) => !s)}
                        className="text-fg-muted hover:text-fg"
                      >
                        {hidePass2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                rules={{ required: "You must accept the terms" }}
                render={({ field, fieldState }) => (
                  <div>
                    <Checkbox
                      label="I accept the Terms & Conditions"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-danger mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              {error && <Alert tone="danger">{error}</Alert>}

              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                icon={<UserPlus className="h-4 w-4" />}
                className="w-full"
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <div className="text-center pt-6 mt-6 border-t border-white/8">
              <p className="text-sm text-fg-muted">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="font-medium text-accent-2 hover:text-accent-2/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
