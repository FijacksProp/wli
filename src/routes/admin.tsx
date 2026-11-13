import { createFileRoute } from "@tanstack/react-router";
import { LogOut, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getSavedCrmSession,
  isCrmConfigured,
  listCrmEnquiries,
  signInToCrm,
  signOutFromCrm,
  updateCrmEnquiry,
  type CrmEnquiry,
  type CrmSession,
} from "@/lib/crm-api";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "WLI Staff Workspace" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

const STATUSES: CrmEnquiry["status"][] = ["new", "in_progress", "waiting", "resolved", "archived"];
const STATUS_LABELS: Record<CrmEnquiry["status"], string> = {
  new: "New",
  in_progress: "In progress",
  waiting: "Waiting",
  resolved: "Resolved",
  archived: "Archived",
};

function AdminPage() {
  const [session, setSession] = useState<CrmSession | null>(null);
  const [enquiries, setEnquiries] = useState<CrmEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => setSession(getSavedCrmSession()), []);

  const load = async (activeSession: CrmSession) => {
    setLoading(true);
    setError("");
    try {
      setEnquiries(await listCrmEnquiries(activeSession));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) void load(session);
  }, [session]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;
      const matchesQuery = !term || `${item.name} ${item.email} ${item.phone ?? ""} ${item.message}`.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [enquiries, filter, query]);

  if (!isCrmConfigured) {
    return (
      <main className="container-page max-w-3xl py-16 sm:py-24">
        <p className="eyebrow">WLI workspace</p>
        <h1 className="mt-4 text-4xl font-medium text-purple">Admin setup required</h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Add the Supabase project URL and public anon key to the deployment environment, then apply the CRM database migration.
          Setup instructions are in <code>docs/crm-setup.md</code>.
        </p>
      </main>
    );
  }

  if (!session) return <CrmLogin onSignedIn={setSession} />;

  return (
    <main className="container-page py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">WLI workspace</p>
          <h1 className="mt-3 text-4xl font-medium text-purple">Enquiries</h1>
          <p className="mt-3 text-muted-foreground">Review messages and track follow-up with the WLI team.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void load(session)} disabled={loading}>
            <RefreshCw className="size-4" aria-hidden /> Refresh
          </Button>
          <Button variant="outline" onClick={() => void signOutFromCrm(session).finally(() => setSession(null))}>
            <LogOut className="size-4" aria-hidden /> Sign out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(filter === status ? "all" : status)}
            className={`rounded-lg border p-4 text-left transition-colors ${filter === status ? "border-primary bg-tint" : "border-border bg-card hover:border-primary/50"}`}
          >
            <span className="block text-sm text-muted-foreground">{STATUS_LABELS[status]}</span>
            <span className="mt-1 block text-2xl font-semibold text-foreground">{enquiries.filter((item) => item.status === status).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people and messages" className="pl-10" />
          <span className="sr-only">Search enquiries</span>
        </label>
        <select aria-label="Filter enquiries by status" value={filter} onChange={(e) => setFilter(e.target.value)} className="h-12 rounded-md border border-input bg-card px-3 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">{error}</p>}
      {loading && <p role="status" className="mt-6 text-sm text-muted-foreground">Loading enquiries…</p>}
      {!loading && visible.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          {enquiries.length === 0 ? "No enquiries yet." : "No enquiries match those filters."}
        </div>
      )}
      <ul className="mt-6 grid gap-4">
        {visible.map((item) => (
          <li key={item.id}>
            <EnquiryCard enquiry={item} session={session} onSaved={(updated) => setEnquiries((current) => current.map((entry) => entry.id === updated.id ? updated : entry))} />
          </li>
        ))}
      </ul>
    </main>
  );
}

function CrmLogin({ onSignedIn }: { onSignedIn: (session: CrmSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="container-page max-w-lg py-16 sm:py-24">
      <p className="eyebrow">WLI workspace</p>
      <h1 className="mt-4 text-4xl font-medium text-purple">Staff sign in</h1>
      <p className="mt-3 text-muted-foreground">Sign in with the account created for you by a WLI administrator.</p>
      <form className="mt-8 space-y-5" onSubmit={async (event) => {
        event.preventDefault(); setBusy(true); setError("");
        try { onSignedIn(await signInToCrm(email, password)); }
        catch (e) { setError(e instanceof Error ? e.message : "Sign-in failed."); }
        finally { setBusy(false); }
      }}>
        <label className="block text-sm font-semibold" htmlFor="crm-email">Email</label>
        <Input id="crm-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block text-sm font-semibold" htmlFor="crm-password">Password</label>
        <Input id="crm-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
    </main>
  );
}

function EnquiryCard({ enquiry, session, onSaved }: { enquiry: CrmEnquiry; session: CrmSession; onSaved: (item: CrmEnquiry) => void }) {
  const [status, setStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.internal_notes);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold">{enquiry.name}</h2>
          <p className="mt-1 text-sm"><a className="text-primary underline underline-offset-2" href={`mailto:${enquiry.email}`}>{enquiry.email}</a>{enquiry.phone && <> · <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></>}</p>
        </div>
        <time className="text-xs text-muted-foreground" dateTime={enquiry.created_at}>{new Date(enquiry.created_at).toLocaleString()}</time>
      </div>
      <p className="mt-5 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-[13rem_1fr_auto] sm:items-end">
        <label className="text-sm font-medium">Status
          <select value={status} onChange={(e) => setStatus(e.target.value as CrmEnquiry["status"])} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3">
            {STATUSES.map((value) => <option key={value} value={value}>{STATUS_LABELS[value]}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Internal notes
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={5000} className="mt-2 min-h-11" />
        </label>
        <Button disabled={busy || (status === enquiry.status && notes === enquiry.internal_notes)} onClick={async () => {
          setBusy(true); setError("");
          try { const [updated] = await updateCrmEnquiry(session, enquiry.id, { status, internal_notes: notes }); if (updated) onSaved(updated); }
          catch (e) { setError(e instanceof Error ? e.message : "Could not save changes."); }
          finally { setBusy(false); }
        }}>{busy ? "Saving…" : "Save"}</Button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    </article>
  );
}
