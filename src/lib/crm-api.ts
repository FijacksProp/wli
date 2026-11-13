export type CrmSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email?: string };
};

export type CrmEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "in_progress" | "waiting" | "resolved" | "archived";
  internal_notes: string;
  created_at: string;
  updated_at: string;
};

const API_URL = import.meta.env["VITE_SUPABASE_URL"]?.replace(/\/$/, "");
const ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];
const SESSION_KEY = "wli-crm-session";

export const isCrmConfigured = Boolean(API_URL && ANON_KEY);

function requireConfig() {
  if (!API_URL || !ANON_KEY) throw new Error("The WLI contact service is not available right now.");
  return { apiUrl: API_URL, anonKey: ANON_KEY };
}

async function api<T>(path: string, init: RequestInit = {}, token = ANON_KEY): Promise<T> {
  const { apiUrl, anonKey } = requireConfig();
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new Error(typeof details?.message === "string" ? details.message : "The request could not be completed.");
  }
  if (response.status === 204 || response.headers.get("content-length") === "0" || init.headers && new Headers(init.headers).get("Prefer")?.includes("return=minimal")) return undefined as T;
  return response.json() as Promise<T>;
}

export function getSavedCrmSession(): CrmSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as CrmSession;
    if (session.expires_at <= Math.floor(Date.now() / 1000)) {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signInToCrm(email: string, password: string): Promise<CrmSession> {
  const { apiUrl, anonKey } = requireConfig();
  const response = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.msg ?? data?.message ?? "Sign-in failed. Check your email and password.");
  const session: CrmSession = { ...data, expires_at: Math.floor(Date.now() / 1000) + data.expires_in };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signOutFromCrm(session: CrmSession) {
  try {
    await api<void>("/auth/v1/logout", { method: "POST" }, session.access_token);
  } finally {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

export function listCrmEnquiries(session: CrmSession) {
  return api<CrmEnquiry[]>(
    "/rest/v1/crm_enquiries?select=id,name,email,phone,message,status,internal_notes,created_at,updated_at&order=created_at.desc&limit=200",
    {},
    session.access_token,
  );
}

export function updateCrmEnquiry(session: CrmSession, id: string, updates: Pick<CrmEnquiry, "status" | "internal_notes">) {
  return api<CrmEnquiry[]>(
    `/rest/v1/crm_enquiries?id=eq.${encodeURIComponent(id)}&select=*`,
    { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(updates) },
    session.access_token,
  );
}

export function submitCrmEnquiry(enquiry: { name: string; email: string; phone: string | null; message: string }) {
  return api<void>(
    "/rest/v1/crm_enquiries",
    {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ...enquiry, source: "website" }),
    },
  );
}
