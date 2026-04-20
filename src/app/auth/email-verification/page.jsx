"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, MailCheck, KeyRound } from "lucide-react";
import {
  Page,
  Card,
  Button,
  TextField,
  FormField,
  Alert,
  ResponsiveStack,
  IconTile,
} from "@infinibay/harbor";

const pageShell = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1rem",
};
const iconRow = { display: "flex", justifyContent: "center", marginBottom: "1rem" };
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
const resendBtn = {
  background: "transparent",
  border: 0,
  color: "rgb(232,121,249)",
  fontWeight: 500,
  cursor: "pointer",
  padding: 0,
  font: "inherit",
};

const EmailVerificationPage = () => {
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
    <div style={pageShell}>
      <Page size="sm" gap="md" padded={false}>
        <Link href="/auth/forgot-password" style={backLink}>
          <ArrowLeft size={16} /> Back
        </Link>

        <Card variant="default">
          <ResponsiveStack direction="col" gap={5}>
            <div style={iconRow}>
              <IconTile icon={<MailCheck size={20} />} tone="sky" size="lg" />
            </div>

            <div>
              <h1 style={heading}>Check your email</h1>
              <p style={subtle}>
                We sent a recovery code to your inbox. Enter it below to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ResponsiveStack direction="col" gap={4}>
                <Controller
                  name="code"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Code is required",
                    maxLength: { value: 10, message: "Max 10 characters" },
                  }}
                  render={({ field, fieldState }) => (
                    <FormField label="Recovery code" error={fieldState.error?.message}>
                      <TextField
                        type="text"
                        inputMode="numeric"
                        placeholder="123456"
                        icon={<KeyRound size={16} />}
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
                >
                  {isLoading ? "Verifying…" : "Confirm"}
                </Button>
              </ResponsiveStack>
            </form>

            <div style={dividerFoot}>
              Didn&apos;t receive the email?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={resending}
                style={resendBtn}
              >
                {resending ? "Resending…" : "Resend"}
              </button>
            </div>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default EmailVerificationPage;
