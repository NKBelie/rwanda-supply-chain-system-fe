"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthShell, primaryBtn, secondaryBtn } from "@/components/auth/AuthShell";
import { verifyEmailOtp, resendEmailOtp } from "@/lib/auth/session";
import { ROLE_DASHBOARDS } from "@/lib/auth/onboarding";
import { useT } from "@/lib/i18n";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const initialDevOtp = searchParams.get("devOtp") ?? "";
  const t = useT();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(300); // 5 minutes
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState(initialDevOtp);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const code = useMemo(() => digits.join(""), [digits]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((c) => c.map((item, i) => (i === index ? digit : item)));
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function paste(value: string) {
    const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
    if (pasted.length === 0) return;
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    inputs.current[Math.min(pasted.length, 6) - 1]?.focus();
  }

  async function verify() {
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const result = await verifyEmailOtp(email, code);
      setNotice(t("auth.otp.success"));
      const target = result.session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[result.session.claims.role];
      router.push(target);
    } catch (error) {
      setErr(error instanceof Error ? error.message : t("auth.otp.error"));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const result = await resendEmailOtp(email);
      setCooldown(300);
      setDevOtp(result.devOtp ?? "");
      setNotice(t("auth.otp.resent"));
    } catch (error) {
      setErr(error instanceof Error ? error.message : t("auth.otp.resendError"));
    } finally {
      setBusy(false);
    }
  }

  const minutes = Math.floor(cooldown / 60);
  const seconds = cooldown % 60;
  const countdownLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <AuthShell title={t("auth.otp.title")} description={`${t("auth.otp.description")} ${email || "your email address"}.`}>
      {/* <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
        Enter the 6-digit code: <span className="font-mono font-semibold">123456</span>
      </div> */}

      <div className="flex justify-between gap-2" onPaste={(e) => { e.preventDefault(); paste(e.clipboardData.getData("text")); }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(node) => { inputs.current[i] = node; }}
            value={digit}
            maxLength={1}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : undefined}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus(); }}
            className="h-14 w-full max-w-[52px] rounded-lg border border-border bg-background text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-ring"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">
          {cooldown > 0 ? `Expires in ${countdownLabel}` : "Code expired. Request a new one."}
        </span>
        <button type="button" disabled={cooldown > 0 || busy} onClick={resend} className="font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline">
          {cooldown > 0 ? `${t("auth.otp.resendIn")} ${countdownLabel}` : t("auth.otp.resend")}
        </button>
      </div>

      {err && <p className="mt-4 rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{err}</p>}
      {notice && <p className="mt-4 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs text-success">{notice}</p>}

      <div className="mt-6 space-y-2">
        <button type="button" onClick={verify} disabled={busy || code.length !== 6} className={primaryBtn}>
          {busy ? t("auth.otp.verifying") : t("auth.otp.verify")}
        </button>
        <Link href="/auth/register" className={secondaryBtn}>{t("form.back")}</Link>
      </div>
    </AuthShell>
  );
}