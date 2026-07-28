import { NextRequest, NextResponse } from "next/server";
import {
  ROLE_DASHBOARDS,
  ROLE_PROFILE_CONFIG,
  RWANDA_PROVINCES,
  getCells,
  getDistricts,
  getSectors,
  getVillages,
  withLocationMetadata,
  type RegistrationRole,
} from "@/lib/auth/onboarding";
import {
  ACCOUNT_COOKIE,
  SESSION_COOKIE,
  accountMaxAge,
  cookieSecurity,
  createSessionFromAccount,
  readSignedCookie,
  sessionMaxAge,
  signCookiePayload,
  toPublicSession,
  type AccountCookie,
  type AuthSessionCookie,
} from "@/lib/auth/session-cookie";

const locationFieldNames = new Set(["province", "district", "sector", "cell", "village"]);
const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

type SubmittedDocument = {
  key: string;
  label: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  const session = await readSignedCookie<AuthSessionCookie>(req.cookies.get(SESSION_COOKIE)?.value);
  const account = await readSignedCookie<AccountCookie>(req.cookies.get(ACCOUNT_COOKIE)?.value);
  if (!session || !account || account.sub !== session.claims.sub) return fail("Please sign in before completing profile setup.", 401);

  if (session.claims.role === "buyer" || session.claims.role === "super_admin") {
    return NextResponse.json({ ok: true, session: toPublicSession(session), nextPath: ROLE_DASHBOARDS[session.claims.role] });
  }

  const role = session.claims.role as RegistrationRole;
  const config = ROLE_PROFILE_CONFIG[role];
  if (!config || !config.requiresBusinessProfile) return fail("Profile setup is not required for this role.", 400);

  const fields = normalizeFields(body?.fields);
  const documents = normalizeDocuments(body?.documents);
  const validationError = validateProfileSetup(role, fields, documents);
  if (validationError) return fail(validationError, 400);

  const location = withLocationMetadata({
    province: fields.province ?? "",
    district: fields.district ?? "",
    sector: fields.sector ?? "",
    cell: fields.cell ?? "",
    village: fields.village ?? "",
  });
  const now = Math.floor(Date.now() / 1000);
  const updatedAccount: AccountCookie = {
    ...account,
    profileComplete: true,
    profile: { ...fields, documents, location, completedAt: now },
    updatedAt: now,
  };
  const updatedSession = createSessionFromAccount(updatedAccount, session.remember);
  const nextPath = ROLE_DASHBOARDS[updatedSession.claims.role];

  const res = NextResponse.json({ ok: true, session: toPublicSession(updatedSession), nextPath });
  res.cookies.set(ACCOUNT_COOKIE, await signCookiePayload(updatedAccount), { ...cookieSecurity, maxAge: accountMaxAge() });
  res.cookies.set(SESSION_COOKIE, await signCookiePayload(updatedSession), { ...cookieSecurity, maxAge: sessionMaxAge(updatedSession.remember) });
  return res;
}

function validateProfileSetup(role: RegistrationRole, fields: Record<string, string>, documents: SubmittedDocument[]) {
  const config = ROLE_PROFILE_CONFIG[role];
  for (const field of config.fields) {
    const value = fields[field.name]?.trim() ?? "";
    if (field.required && !value) return `${field.label} is required.`;
    if (!value) continue;
    if (field.type === "number" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
      return `${field.label} must be a positive number.`;
    }
    if (field.options && !field.options.includes(value)) {
      return `Select a valid ${field.label.toLowerCase()}.`;
    }
  }

  const locationError = validateLocation(fields, config.fields);
  if (locationError) return locationError;

  const allowedDocumentKeys = new Set(config.documents.map((doc) => doc.key));
  for (const doc of documents) {
    if (!allowedDocumentKeys.has(doc.key)) return `Unsupported document type: ${doc.label || doc.key}.`;
    const extensionOk = allowedExtensions.some((ext) => doc.name.toLowerCase().endsWith(ext));
    if (!allowedTypes.has(doc.type) && !extensionOk) return `${doc.name} must be a PDF, JPG, JPEG, or PNG file.`;
    if (doc.size > 10 * 1024 * 1024) return `${doc.name} must be 10 MB or smaller.`;
  }

  const missingDocument = config.documents.find((doc) => doc.required && !documents.some((file) => file.key === doc.key));
  return missingDocument ? `${missingDocument.label} is required.` : null;
}

function validateLocation(fields: Record<string, string>, configFields: { name: string; label: string; type: string; required?: boolean; options?: string[] }[]) {
  const locationFields = configFields.filter((field) => locationFieldNames.has(field.name));
  if (locationFields.length === 0) return null;

  const province = fields.province ?? "";
  const district = fields.district ?? "";
  const sector = fields.sector ?? "";
  const cell = fields.cell ?? "";
  const village = fields.village ?? "";

  if (!RWANDA_PROVINCES.includes(province as (typeof RWANDA_PROVINCES)[number])) return "Select a valid province.";
  if (locationFields.some((field) => field.name === "district") && !getDistricts(province).includes(district)) return "Select a valid district for the selected province.";
  if (locationFields.some((field) => field.name === "sector") && !getSectors(district).includes(sector)) return "Select a valid sector for the selected district.";
  if (locationFields.some((field) => field.name === "cell") && !getCells(sector).includes(cell)) return "Select a valid cell for the selected sector.";
  if (locationFields.some((field) => field.name === "village") && !getVillages(cell).includes(village)) return "Select a valid village for the selected cell.";
  return null;
}

function normalizeFields(value: unknown) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return Object.fromEntries(Object.entries(source).map(([key, item]) => [key, String(item ?? "").trim()])) as Record<string, string>;
}

function normalizeDocuments(value: unknown): SubmittedDocument[] {
  if (!Array.isArray(value)) return [];
  const mapped = value.map((item) => {
    const file = item && typeof item === "object" ? item as Record<string, unknown> : null;
    if (!file) return null;
    return {
      key: String(file.key ?? "").trim(),
      label: String(file.label ?? "").trim(),
      name: String(file.name ?? "").trim(),
      size: Number(file.size ?? 0),
      type: String(file.type ?? "").trim(),
      progress: Number(file.progress ?? 0),
    } satisfies SubmittedDocument;
  });
  const filtered = mapped.filter((file) => file !== null && Boolean(file.key && file.name && Number.isFinite(file.size)));
  return filtered as SubmittedDocument[];
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}