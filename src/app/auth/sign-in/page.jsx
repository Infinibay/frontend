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
  Aurora,
} from "@infinibay/harbor";

import { loginUser, fetchCurrentUser } from "@/state/slices/auth";
import { useAccentTrio } from "@/hooks/useAccentTrio";

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
  const trio = useAccentTrio();
  const auroraPalette = [trio.accent, trio.accent2, trio.accent3, trio.accent2];

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      // loginUser already performs a full-page navigation to /desktops on success
      // (window.location.href), which remounts the root layout so its auth gate
      // re-validates against the fresh token. A client-side router.push (or an
      // extra query) here races that one-shot token check and bounces the user
      // back to sign-in on the FIRST login — so we intentionally stop here.
    } catch (err) {
      // GraphQL auth failures come back as HTTP 200 with code UNAUTHENTICATED and
      // message "Invalid credentials" (no 401/403 status). After the thunk
      // serializes the error only `message`/`code` survive, so match on those too.
      const message = err?.message || "";
      const code = err?.extensions?.code || err?.code;
      const isAuthError =
        code === "UNAUTHENTICATED" ||
        err?.status === 401 ||
        err?.status === 403 ||
        /invalid credentials|unauthenticated|401|403/i.test(message);
      setError(
        isAuthError
          ? "Invalid email or password. Please check your credentials and try again."
          : "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageShell}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Aurora
          bands={4}
          amplitude={0.28}
          speed={0.6}
          intensity={0.55}
          palette={auroraPalette}
          pauseWhenHidden
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
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
                    // No length cap on sign-in: a login form must accept whatever
                    // credential the user already holds (password managers and
                    // passphrases routinely exceed 20 chars). Length/complexity
                    // policy belongs in sign-up / set-password, not at login.
                    required: "Password is required",
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
    </div>
  );
};

export default Page_;
