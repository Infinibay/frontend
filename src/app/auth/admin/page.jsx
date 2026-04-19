"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Shield, LogIn } from "lucide-react";
import {
  Card,
  Button,
  TextField,
  Checkbox,
  Alert,
} from "@infinibay/harbor";

const Page = () => {
  const [hidePass, setHidePass] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm();

  const onSubmit = async (_data) => {
    // Placeholder: admin auth not wired to backend yet.
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
            width: 540, height: 540, left: "-8%", top: "8%",
            background: "rgb(244 63 94 / 0.25)",
            animation: "mesh 20s ease-in-out infinite",
          }}
        />
        <div
          className="blob"
          style={{
            width: 480, height: 480, right: "-5%", bottom: "-5%",
            background: "rgb(168 85 247 / 0.35)",
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/15 text-danger text-xs font-medium">
                <Shield className="h-3 w-3" />
                Administrator access
              </div>
              <h1 className="text-2xl font-semibold text-fg mt-2">Welcome back</h1>
              <p className="text-sm text-fg-muted">
                Sign in with your admin credentials.
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
                  maxLength: { value: 20, message: "Max 20 characters" },
                }}
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
                      >
                        {hidePass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

              {error && <Alert tone="danger">{error}</Alert>}

              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                icon={<LogIn className="h-4 w-4" />}
                className="w-full"
              >
                {isLoading ? "Signing in…" : "Sign in as admin"}
              </Button>
            </form>

            <div className="text-center pt-6 mt-6 border-t border-white/8 text-sm text-fg-muted">
              Not an admin?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-accent-2 hover:text-accent-2/80 transition-colors"
              >
                Sign in as user
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
