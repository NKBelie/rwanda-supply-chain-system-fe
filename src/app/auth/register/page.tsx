"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, Field, inputCls, primaryBtn } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordStrength, scorePassword } from "@/components/auth/PasswordStrength";
import { REGISTRATION_ROLES, type RegistrationRole } from "@/lib/auth/onboarding";
import { ROLE_META } from "@/lib/auth/roles";
import { registerAccount } from "@/lib/auth/session";
import { useT } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", role: "" as RegistrationRole | "", acceptedTerms: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const strong = scorePassword(form.password) >= 3;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.role) { setErr(t("auth.register.roleRequired")); return; }
    setBusy(true);
    setErr(null);
    try {
      const result = await registerAccount({ ...form, role: form.role });
      const params = new URLSearchParams({ email: form.email });
      if (result.devOtp) params.set("devOtp", result.devOtp);
      router.push(`/auth/verify-otp?${params.toString()}`);
    } catch (error) {
      setErr(error instanceof Error ? error.message : t("auth.register.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t("auth.register.title")}
      description={t("auth.register.description")}
      footer={<>{t("auth.register.footer.prompt")} <Link href="/auth/login" className="font-medium text-primary hover:underline">{t("auth.register.footer.link")}</Link></>}
    >
      <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
        Email OTP verification is required before access is granted to your dashboard or profile setup.
      </div>
      <ol className="mb-6 grid grid-cols-3 gap-2 text-xs">
        {[t("auth.register.steps.account"), t("auth.register.steps.verify"), t("auth.register.steps.profile")].map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>{index + 1}</span>
            <span className={index === 0 ? "font-medium" : "text-muted-foreground"}>{step}</span>
          </li>
        ))}
      </ol>

      <div className="space-y-4">
        <GoogleButton disabled={busy} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>{t("auth.register.or")}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <Field label={t("auth.register.fullName")}><input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputCls} autoComplete="name" required /></Field>
          <Field label={t("auth.register.email")}><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="you@company.rw" autoComplete="email" required /></Field>
          <Field label={t("auth.register.phone")}><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="+250 78..." autoComplete="tel" required /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label={t("auth.register.password")}><input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} className={inputCls} autoComplete="new-password" required /></Field>
              <PasswordStrength value={form.password} />
            </div>
            <Field label={t("auth.register.confirmPassword")}><input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className={inputCls} autoComplete="new-password" required /></Field>
          </div>
          <Field label={t("auth.register.role")}>
            <select value={form.role} onChange={(e) => update("role", e.target.value as RegistrationRole)} className={inputCls} required>
              <option value="">{t("auth.register.selectRole")}</option>
              {REGISTRATION_ROLES.map((role) => <option key={role} value={role}>{ROLE_META[role].label}</option>)}
            </select>
          </Field>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={form.acceptedTerms} onChange={(e) => update("acceptedTerms", e.target.checked)} className="mt-0.5 rounded border-border" required />
            <span>{t("auth.register.terms")} <Link href="/auth/terms" className="text-primary hover:underline">{t("auth.register.termsLink")}</Link> {t("auth.register.privacy")}</span>
          </label>
          {err && <p className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{err}</p>}
          <button type="submit" disabled={busy || !strong} className={primaryBtn}>
            {busy ? t("auth.register.creating") : t("auth.register.continue")}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}