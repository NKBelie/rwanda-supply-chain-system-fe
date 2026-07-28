"use client";
import Link from "next/link";
import { AuthShell, primaryBtn } from "@/components/auth/AuthShell";
import { Shield } from "lucide-react";

export default function TwoFactorPage() {
  return (
    <AuthShell title="Enable two-factor authentication" description="Add an extra layer of protection to your account.">
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <Shield className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Authenticator app setup is optional and separate from registration. Registration verification uses email OTP only.</p>
        <div className="mx-auto mt-4 h-40 w-40 rounded-lg border border-border bg-background" />
      </div>
      <Link href="/auth/login" className={`mt-6 ${primaryBtn}`}>Back to Login</Link>
    </AuthShell>
  );
}