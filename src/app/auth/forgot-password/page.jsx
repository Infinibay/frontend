"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldQuestion } from "lucide-react";
import {
  Page,
  Card,
  Alert,
  ResponsiveStack,
} from "@infinibay/harbor";

// Honest recovery page.
//
// Infinibay accounts are administrator-managed: there is no self-service
// password-reset backend (no forgotPassword/resetPassword GraphQL operation).
// The previous version of this page faked a "we sent a recovery code" flow that
// never contacted a server, deceiving locked-out users. Until a real, secure
// reset flow exists on the backend, this page tells the user the truth and
// points them at the only path that actually works: their administrator.

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
const iconWrap = { display: "flex", justifyContent: "center", color: "rgb(var(--harbor-accent))" };

const ForgotPasswordPage = () => {
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

            <div style={iconWrap}>
              <ShieldQuestion size={40} aria-hidden />
            </div>

            <div>
              <h1 style={heading}>Need to reset your password?</h1>
              <p style={subtle}>
                Infinibay accounts are managed by your administrator.
              </p>
            </div>

            <Alert tone="info">
              To regain access, contact your Infinibay administrator and ask them
              to reset your password from the Users section. For security, resets
              are performed by an administrator — not by email.
            </Alert>
          </ResponsiveStack>
        </Card>
      </Page>
    </div>
  );
};

export default ForgotPasswordPage;
