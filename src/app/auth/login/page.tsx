"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthShell, Field, inputCls, primaryBtn } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { signInWithCredentials } from "@/lib/auth/session";
import { ROLE_DASHBOARDS } from "@/lib/auth/onboarding";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const result = await signInWithCredentials({ email, password, remember });
      const target = redirect && redirect !== "/auth/profile-setup" ? redirect : ROLE_DASHBOARDS[result.session.claims.role];
      router.push(target);
    } catch (error: unknown) {
      const e = error as Error & { unverified?: boolean; email?: string };
      if (e.unverified && e.email) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(e.email)}`);
        return;
      }
      setErr(e.message ?? t("auth.login.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      footer={<>{t("auth.login.footer.prompt")} <Link href="/auth/register" className="font-medium text-primary hover:underline">{t("auth.login.footer.link")}</Link></>}
    >
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label={t("auth.login.email")}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" required />
          </Field>
          <Field label={t("auth.login.password")}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} autoComplete="current-password" required />
          </Field>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-border" /> {t("auth.login.remember")}
            </label>
            <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">{t("auth.login.forgot")}</Link>
          </div>
          {err && <p className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{err}</p>}
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? t("auth.login.signingIn") : t("auth.login.button")}
          </button>
        </form>
        <GoogleButton disabled={busy} />
      </div>
    </AuthShell>
  );
}
