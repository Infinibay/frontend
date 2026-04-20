"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send } from "lucide-react";
import {
  Page,
  Card,
  Button,
  TextField,
  FormField,
  Alert,
  ResponsiveStack,
} from "@infinibay/harbor";

const pageShell = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1rem",
};

const brandRow = { display: "flex", justifyContent: "center", marginBottom: "1.25rem" };
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

const ForgotPasswordPage = () => {
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
    <div style={pageShell}>
      <Page size="sm" gap="md" padded={false}>
        <Link href="/auth/sign-in" style={backLink}>
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <Card variant="default">
          <ResponsiveStack direction="col" gap={5}>
            <div style={brandRow}>
              <Image alt="Infinibay" src="/images/logo.png" width={56} height={56} priority />
            </div>

            <div>
              <h1 style={heading}>Forgot password?</h1>
              <p style={subtle}>
                Enter the email you signed up with — we&apos;ll send a recovery code.
              </p>
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
                        placeholder="you@example.com"
                        icon={<Mail size={16} />}
                        {...field}
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
                  icon={<Send size={16} />}
                >
                  {isLoading ? "Sending…" : "Send recovery code"}
                </Button>
              </ResponsiveStack>
            </form>

            <div style={dividerFoot}>
              <span>Don&apos;t have an account? </span>
              <Link href="/auth/sign-up" style={linkAccent}>Sign up</Link>
            </div>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default ForgotPasswordPage;
