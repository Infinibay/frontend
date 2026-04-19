"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Lock, Check } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Alert,
} from "@infinibay/harbor";

const Page = () => {
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    watch,
    getValues,
  } = useForm();

  const onSubmit = async (_data) => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      router.push("/auth/sign-in");
    } catch (_err) {
      setError("Couldn't update the password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pass = watch("password");
  const confirm = watch("confirmpass");
  const match = !!pass && pass === confirm;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-10">
      <div className="mesh-bg">
        <div
          className="blob"
          style={{
            width: 540, height: 540, left: "-8%", top: "8%",
            background: "rgb(168 85 247 / 0.38)",
            animation: "mesh 20s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 480, height: 480, right: "-5%", bottom: "-5%",
            background: "rgb(52 211 153 / 0.28)",
            animation: "mesh 24s ease-in-out infinite reverse",
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
              <h1 className="text-2xl font-semibold text-fg">Create a new password</h1>
              <p className="text-sm text-fg-muted">
                Pick something different from your previous password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  maxLength: { value: 20, message: "Max 20 characters" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="New password"
                    type={hidePass ? "password" : "text"}
                    icon={<Lock className="h-4 w-4" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setHidePass((s) => !s)}
                        className="text-fg-muted hover:text-fg"
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
                    label="Confirm new password"
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

              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>Both passwords must match.</span>
                <Check
                  className={`h-4 w-4 ${match ? "text-success" : "text-fg-subtle"}`}
                />
              </div>

              {error && <Alert tone="danger">{error}</Alert>}

              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Updating…" : "Confirm"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
