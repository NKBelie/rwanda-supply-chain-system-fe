"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { AuthShell, Field, inputCls, primaryBtn } from "@/components/auth/AuthShell";
import { DocumentUpload, type UploadedDocument } from "@/components/auth/DocumentUpload";
import { LocationCascade } from "@/components/auth/LocationCascade";
import { RoleIcon } from "@/components/auth/RoleIcon";
import {
  ROLE_DASHBOARDS,
  ROLE_PROFILE_CONFIG,
  getLocationRecommendations,
  type RegistrationRole,
  type RwandaLocation,
} from "@/lib/auth/onboarding";
import { ROLE_META } from "@/lib/auth/roles";
import { completeProfileSetup, initSession, useSession, signOut } from "@/lib/auth/session";
import { useT } from "@/lib/i18n";

const locationFieldNames = new Set(["province", "district", "sector", "cell", "village"]);

export default function ProfileSetupPage() {
  const router = useRouter();
  const session = useSession();
  const t = useT();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [location, setLocation] = useState<Partial<RwandaLocation>>({});
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void initSession().then((current) => {
      console.log("Authenticated User:", current);
      console.log("Profile Completed:", current?.profileCompleted);
      if (!current) {
        console.log("Current Route:", window.location.pathname);
        router.replace("/auth/login");
      } else if (current.profileCompleted || current.claims.role === "buyer" || current.claims.role === "super_admin") {
        router.replace(ROLE_DASHBOARDS[current.claims.role]);
      }
    });
  }, [router]);

  const role = session?.claims.role as RegistrationRole | undefined;
  const config = role ? ROLE_PROFILE_CONFIG[role] : undefined;
  const visibleFields = config?.fields.filter((field) => !locationFieldNames.has(field.name)) ?? [];
  const locationFields = config?.fields.filter((field) => locationFieldNames.has(field.name)) ?? [];
  const recommendations = useMemo(() => role ? getLocationRecommendations(role, location) : [], [role, location]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!config || !role) return;
    const missingField = visibleFields.find((field) => field.required && !fields[field.name]?.trim());
    if (missingField) {
      setErr(`${missingField.label} is required.`);
      return;
    }
    const missingLocation = locationFields.find((field) => field.required && !String(location[field.name as keyof RwandaLocation] ?? "").trim());
    if (missingLocation) {
      setErr(`${missingLocation.label} is required.`);
      return;
    }
    const missingDocument = config.documents.find((doc) => doc.required && !documents.some((file) => file.key === doc.key));
    if (missingDocument) {
      setErr(`${missingDocument.label} is required.`);
      return;
    }

    setBusy(true);
    setErr(null);
    try {
      if (!session?.claims.email) throw new Error("Session expired. Please sign in again.");
      const result = await completeProfileSetup(session.claims.email, { fields: { ...fields, ...location }, documents, recommendations });
      router.push(result.nextPath);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Profile setup failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!session || !config || !role) {
    return <AuthShell title={t("common.loading")} description={t("auth.profile.loading")}><div className="h-32 animate-pulse rounded-xl bg-surface" /></AuthShell>;
  }

  return (
    <AuthShell title={config.title} description={config.description} back="/auth/login">
      <form className="space-y-6" onSubmit={submit}>
        <div className="rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold"><RoleIcon role={role} className="h-4 w-4 text-primary" /> {ROLE_META[role].label}</div>
          <p className="mt-1 text-muted-foreground">{t("auth.profile.mandatoryOnce")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {visibleFields.map((field) => (
            <Field key={field.name} label={field.label}>
              {field.type === "textarea" ? (
                <textarea value={fields[field.name] ?? ""} onChange={(event) => setFields((current) => ({ ...current, [field.name]: event.target.value }))} className="min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" required={field.required} />
              ) : field.type === "select" ? (
                <select value={fields[field.name] ?? ""} onChange={(event) => setFields((current) => ({ ...current, [field.name]: event.target.value }))} className={inputCls} required={field.required}>
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input type={field.type} value={fields[field.name] ?? ""} placeholder={field.placeholder} onChange={(event) => setFields((current) => ({ ...current, [field.name]: event.target.value }))} className={inputCls} required={field.required} />
              )}
            </Field>
          ))}
        </div>

        {locationFields.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> Rwanda location hierarchy</div>
            <LocationCascade value={location} onChange={setLocation} visibleLevels={locationFields.map((field) => field.name as keyof RwandaLocation)} />
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="rounded-xl border border-border bg-surface p-4">
            <h2 className="text-sm font-semibold">Smart location recommendations</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {recommendations.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
            </ul>
          </section>
        )}

        <DocumentUpload documents={config.documents} value={documents} onChange={setDocuments} />
        {err && <p className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{err}</p>}
        <button type="submit" disabled={busy} className={primaryBtn}>{busy ? t("auth.profile.saving") : t("auth.profile.complete")}</button>
      </form>
    </AuthShell>
  );
}



