"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import {
  Page,
  Card,
  Button,
  IconButton,
  TextField,
  FormField,
  Checkbox,
  Alert,
  ResponsiveStack,
} from "@infinibay/harbor";

import { loginUser, fetchCurrentUser } from "@/state/slices/auth";

const pageShell = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1rem",
};

const brandRow = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "1.25rem",
};

const heading = {
  fontSize: "1.5rem",
  fontWeight: 600,
  textAlign: "center",
  margin: 0,
};

const subtle = {
  fontSize: "0.875rem",
  opacity: 0.7,
  textAlign: "center",
  margin: "0.25rem 0 0 0",
};

const rowBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const dividerFoot = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  marginTop: "1.25rem",
  paddingTop: "1.25rem",
  textAlign: "center",
  fontSize: "0.875rem",
  opacity: 0.7,
};

const fineprint = {
  textAlign: "center",
  fontSize: "0.75rem",
  opacity: 0.5,
  marginTop: "1rem",
};

const linkAccent = { color: "rgb(232,121,249)", fontWeight: 500 };

const Page_ = () => {
  const { handleSubmit, control } = useForm();
  const [hidePass, setHidePass] = useState(true);
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
      router.push("/desktops");
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
    <div style={pageShell}>
      <Page size="sm" gap="md" padded={false}>
        <div style={brandRow}>
          <Image
            alt="Infinibay logo"
            src="/images/logo.png"
            width={64}
            height={64}
            priority
          />
        </div>

        <Card variant="default">
          <ResponsiveStack direction="col" gap={5}>
            <div>
              <h2 style={heading}>Welcome back</h2>
              <p style={subtle}>Sign in to access your desktops.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ResponsiveStack direction="col" gap={4}>
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
                    <FormField label="Email address" error={fieldState.error?.message}>
                      <TextField
                        type="email"
                        placeholder="admin@infinibay.com"
                        icon={<Mail size={16} />}
                        {...field}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                    maxLength: { value: 20, message: "Password must be less than 20 characters" },
                  }}
                  render={({ field, fieldState }) => (
                    <FormField label="Password" error={fieldState.error?.message}>
                      <TextField
                        type={hidePass ? "password" : "text"}
                        placeholder="Enter your password"
                        icon={<Lock size={16} />}
                        suffix={
                          <IconButton
                            size="sm"
                            variant="ghost"
                            label={hidePass ? "Show password" : "Hide password"}
                            icon={hidePass ? <EyeOff size={16} /> : <Eye size={16} />}
                            onClick={() => setHidePass((s) => !s)}
                            type="button"
                          />
                        }
                        {...field}
                      />
                    </FormField>
                  )}
                />

                <div style={rowBetween}>
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
                  <Link href="/auth/forgot-password" style={{ fontSize: "0.875rem", ...linkAccent }}>
                    Forgot password?
                  </Link>
                </div>

                {error && <Alert tone="danger">{error}</Alert>}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  icon={<LogIn size={16} />}
                >
                  {isLoading ? "Signing in…" : "Sign in"}
                </Button>
              </ResponsiveStack>
            </form>

            <div style={dividerFoot}>
              <span>Don&apos;t have an account? </span>
              <Link href="/auth/sign-up" style={linkAccent}>Sign up</Link>
            </div>
          </ResponsiveStack>
        </Card>

        <p style={fineprint}>
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </Page>
    </div>
  );
};

export default Page_;
