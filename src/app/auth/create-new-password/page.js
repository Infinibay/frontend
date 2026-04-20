"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Lock, Check } from "lucide-react";
import {
  Page,
  Card,
  Button,
  IconButton,
  TextField,
  FormField,
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
const matchRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.75rem",
  opacity: 0.7,
};

const CreateNewPasswordPage = () => {
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, watch, getValues } = useForm();

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

  const pass = watch("password") || "";
  const confirm = watch("confirmpass");
  const match = !!pass && pass === confirm;

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
              <h1 style={heading}>Create a new password</h1>
              <p style={subtle}>Pick something different from your previous password.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ResponsiveStack direction="col" gap={4}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                    maxLength: { value: 20, message: "Max 20 characters" },
                  }}
                  render={({ field, fieldState }) => (
                    <FormField label="New password" error={fieldState.error?.message}>
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
                      <PasswordStrength value={pass} />
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
                    <FormField label="Confirm new password" error={fieldState.error?.message}>
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

                <div style={matchRow}>
                  <span>Both passwords must match.</span>
                  <Check
                    size={16}
                    color={match ? "rgb(74,222,128)" : "rgba(255,255,255,0.3)"}
                  />
                </div>

                {error && <Alert tone="danger">{error}</Alert>}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating…" : "Confirm"}
                </Button>
              </ResponsiveStack>
            </form>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default CreateNewPasswordPage;
