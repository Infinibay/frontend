"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Shield, LogIn } from "lucide-react";
import {
  Page,
  Card,
  Button,
  IconButton,
  TextField,
  FormField,
  Checkbox,
  Alert,
  Badge,
  ResponsiveStack,
} from "@infinibay/harbor";

const pageShell = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1rem",
};
const brandRow = { display: "flex", justifyContent: "center", marginBottom: "1rem" };
const badgeRow = { display: "flex", justifyContent: "center", marginBottom: "0.5rem" };
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
const rowBetween = { display: "flex", alignItems: "center", justifyContent: "space-between" };
const dividerFoot = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  marginTop: "1.25rem",
  paddingTop: "1.25rem",
  textAlign: "center",
  fontSize: "0.875rem",
  opacity: 0.7,
};
const linkAccent = { color: "rgb(232,121,249)", fontWeight: 500 };

const AdminSignInPage = () => {
  const [hidePass, setHidePass] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm();

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
              <div style={badgeRow}>
                <Badge tone="danger" icon={<Shield size={12} />}>
                  Administrator access
                </Badge>
              </div>
              <h1 style={heading}>Welcome back</h1>
              <p style={subtle}>Sign in with your admin credentials.</p>
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
                  {isLoading ? "Signing in…" : "Sign in as admin"}
                </Button>
              </ResponsiveStack>
            </form>

            <div style={dividerFoot}>
              <span>Not an admin? </span>
              <Link href="/auth/sign-in" style={linkAccent}>Sign in as user</Link>
            </div>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default AdminSignInPage;
