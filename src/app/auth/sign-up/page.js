"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, UserPlus } from "lucide-react";
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
  PasswordStrength,
} from "@infinibay/harbor";

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

const heading = { fontSize: "1.5rem", fontWeight: 600, textAlign: "center", margin: 0 };
const subtle = { fontSize: "0.875rem", opacity: 0.7, textAlign: "center", margin: "0.25rem 0 0 0" };
const backLink = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.875rem",
  opacity: 0.7,
  marginBottom: "0.5rem",
};

const dividerFoot = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  marginTop: "1.25rem",
  paddingTop: "1.25rem",
  textAlign: "center",
  fontSize: "0.875rem",
  opacity: 0.7,
};

const linkAccent = { color: "rgb(232,121,249)", fontWeight: 500 };

const SignUpPage = () => {
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, getValues, watch } = useForm();
  const pwdValue = watch("password") || "";

  const onSubmit = async (_data) => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageShell}>
      <Page size="sm" gap="md" padded={false}>
        <Link href="/" style={backLink}>
          <ArrowLeft size={16} /> Return home
        </Link>

        <Card variant="default">
          <ResponsiveStack direction="col" gap={5}>
            <div style={brandRow}>
              <Image alt="Infinibay" src="/images/logo.png" width={56} height={56} priority />
            </div>

            <div>
              <h1 style={heading}>Create your account</h1>
              <p style={subtle}>Welcome — let&apos;s get you set up.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ResponsiveStack direction="col" gap={4}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState }) => (
                    <FormField label="Name" error={fieldState.error?.message}>
                      <TextField placeholder="Ada Lovelace" icon={<User size={16} />} {...field} />
                    </FormField>
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
                    <FormField label="Email address" error={fieldState.error?.message}>
                      <TextField
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail size={16} />}
                        {...field}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field, fieldState }) => (
                    <FormField label="Phone" error={fieldState.error?.message}>
                      <TextField
                        type="tel"
                        placeholder="+54 11 1234 5678"
                        icon={<Phone size={16} />}
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
                    maxLength: { value: 20, message: "Max 20 characters" },
                  }}
                  render={({ field, fieldState }) => (
                    <FormField label="Password" error={fieldState.error?.message}>
                      <TextField
                        type={hidePass ? "password" : "text"}
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
                      <PasswordStrength value={pwdValue} />
                    </FormField>
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
                    <FormField label="Confirm password" error={fieldState.error?.message}>
                      <TextField
                        type={hidePass2 ? "password" : "text"}
                        icon={<Lock size={16} />}
                        suffix={
                          <IconButton
                            size="sm"
                            variant="ghost"
                            label={hidePass2 ? "Show password" : "Hide password"}
                            icon={hidePass2 ? <EyeOff size={16} /> : <Eye size={16} />}
                            onClick={() => setHidePass2((s) => !s)}
                            type="button"
                          />
                        }
                        {...field}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="terms"
                  control={control}
                  defaultValue={false}
                  rules={{ required: "You must accept the terms" }}
                  render={({ field, fieldState }) => (
                    <FormField error={fieldState.error?.message}>
                      <Checkbox
                        label="I accept the Terms & Conditions"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormField>
                  )}
                />

                {error && <Alert tone="danger">{error}</Alert>}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  icon={<UserPlus size={16} />}
                >
                  {isLoading ? "Creating account…" : "Create account"}
                </Button>
              </ResponsiveStack>
            </form>

            <div style={dividerFoot}>
              <span>Already have an account? </span>
              <Link href="/auth/sign-in" style={linkAccent}>Sign in</Link>
            </div>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default SignUpPage;
