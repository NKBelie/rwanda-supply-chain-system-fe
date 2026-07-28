"use client";
import Link from "next/link";
import { AuthShell, primaryBtn, secondaryBtn } from "@/components/auth/AuthShell";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Email OTP verification" description="RSCN verifies registration by email OTP only.">
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <MailCheck className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">
          After registration, enter the one-time password sent to your email address. Email is the only onboarding verification channel.
        </p>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link href="/auth/register" className={secondaryBtn}>Register</Link>
        <Link href="/auth/verify-otp" className={primaryBtn}>Enter OTP</Link>
      </div>
    </AuthShell>
  );
}