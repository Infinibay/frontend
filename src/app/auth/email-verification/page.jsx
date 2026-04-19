"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, MailCheck, KeyRound } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Alert,
} from "@infinibay/harbor";

const Page = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const { handleSubmit, control } = useForm();

  const onSubmit = async (_data) => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      router.push("/auth/create-new-password");
    } catch (_err) {
      setError("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="mesh-bg">
        <div
          className="blob"
          style={{
            width: 520, height: 520, left: "-8%", top: "10%",
            background: "rgb(56 189 248 / 0.4)",
            animation: "mesh 20s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 480, height: 480, right: "-5%", bottom: "-5%",
            background: "rgb(244 114 182 / 0.3)",
            animation: "mesh 24s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <Card variant="glass" className="p-8 spotlight-soft">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-accent-2/15 p-4 text-accent-2">
                <MailCheck className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold text-fg">Check your email</h1>
              <p className="text-sm text-fg-muted">
                We sent a recovery code to your inbox. Enter it below to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="code"
                control={control}
                defaultValue=""
                rules={{
                  required: "Code is required",
                  maxLength: { value: 10, message: "Max 10 characters" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Recovery code"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    icon={<KeyRound className="h-4 w-4" />}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              {error && <Alert tone="danger">{error}</Alert>}

              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying…" : "Confirm"}
              </Button>
            </form>

            <div className="text-center pt-6 mt-6 border-t border-white/8 text-sm text-fg-muted">
              Didn&apos;t receive the email?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={resending}
                className="font-medium text-accent-2 hover:text-accent-2/80 transition-colors disabled:opacity-50"
              >
                {resending ? "Resending…" : "Resend"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
