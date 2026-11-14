import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { StaffWorkspace } from "@/components/admin/StaffWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  crmConfigurationError,
  getSavedCrmSession,
  isCrmConfigured,
  signInToCrm,
  signOutFromCrm,
  type CrmSession,
} from "@/lib/crm-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "WLI Staff Workspace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<CrmSession | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSession(getSavedCrmSession());
    setReady(true);
  }, []);

  if (!isCrmConfigured)
    return (
      <main className="container-page max-w-3xl py-16 sm:py-24">
        <p className="eyebrow">WLI workspace</p>
        <h1 className="mt-4 text-4xl font-medium text-purple">
          Admin setup required
        </h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {crmConfigurationError}. Setup instructions are in{" "}
          <code>docs/crm-setup.md</code>.
        </p>
      </main>
    );
  if (!ready)
    return (
      <div
        className="container-page py-16 text-sm text-muted-foreground"
        role="status"
      >
        Loading your workspace…
      </div>
    );
  if (!session) return <CrmLogin onSignedIn={setSession} />;
  return (
    <StaffWorkspace
      session={session}
      onSignOut={() =>
        void signOutFromCrm(session).finally(() => setSession(null))
      }
    />
  );
}

function CrmLogin({
  onSignedIn,
}: {
  onSignedIn: (session: CrmSession) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="container-page max-w-lg py-16 sm:py-24">
      <p className="eyebrow">WLI workspace</p>
      <h1 className="mt-4 text-4xl font-medium text-purple">Staff sign in</h1>
      <p className="mt-3 text-muted-foreground">
        Sign in with the account created for you by a WLI administrator.
      </p>
      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          try {
            onSignedIn(await signInToCrm(email, password));
          } catch (e) {
            setError(e instanceof Error ? e.message : "Sign-in failed.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm font-semibold" htmlFor="crm-email">
          Email
        </label>
        <Input
          id="crm-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block text-sm font-semibold" htmlFor="crm-password">
          Password
        </label>
        <Input
          id="crm-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
