"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Alert,
} from "@infinibay/harbor";

const Page = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleSubmit, control } = useForm();

  const onSubmit = async (_data) => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      router.push("/auth/email-verification");
    } catch (_err) {
      setError("Couldn't send the recovery email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="mesh-bg">
        <div
          className="blob"
          style={{
            width: 520, height: 520, left: "-8%", top: "10%",
            background: "rgb(168 85 247 / 0.38)",
            animation: "mesh 20s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 480, height: 480, right: "-5%", bottom: "-5%",
            background: "rgb(56 189 248 / 0.35)",
            animation: "mesh 24s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
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
              <h1 className="text-2xl font-semibold text-fg">Forgot password?</h1>
              <p className="text-sm text-fg-muted">
                Enter the email you signed up with — we&apos;ll send a recovery code.
              </p>
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
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
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
                icon={<Send className="h-4 w-4" />}
                className="w-full"
              >
                {isLoading ? "Sending…" : "Send recovery code"}
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
        </div>
      </div>
    </div>
  );
};

export default Page;
