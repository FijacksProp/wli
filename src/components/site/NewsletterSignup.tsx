import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/newsletter-server";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function NewsletterSignup({
  compact = false,
  dialog = false,
  onSuccess,
}: {
  compact?: boolean;
  dialog?: boolean;
  onSuccess?: (brevoSynced: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [brevoSynced, setBrevoSynced] = useState(true);

  if (complete) {
    if (dialog) return null;
    if (compact) {
      return (
        <Dialog open>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="sr-only">
              Newsletter signup complete
            </DialogTitle>
            <NewsletterSignupConfirmation dialog brevoSynced={brevoSynced} />
          </DialogContent>
        </Dialog>
      );
    }
    return <NewsletterSignupConfirmation brevoSynced={brevoSynced} />;
  }

  return (
    <form
      className={
        compact || dialog
          ? "space-y-3"
          : "mt-7 space-y-3 border-t border-border pt-6"
      }
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        setBusy(true);
        setError("");
        try {
          const result = await subscribeToNewsletter({
            data: {
              email: String(formData.get("email") ?? ""),
              name: String(formData.get("name") ?? ""),
              consent: formData.get("consent") === "on",
              website: String(formData.get("website") ?? ""),
            },
          });
          const synced = result.brevoSynced === true;
          setBrevoSynced(synced);
          setComplete(true);
          onSuccess?.(synced);
          form.reset();
        } catch (reason) {
          setError(
            reason instanceof Error
              ? reason.message
              : "We couldn’t complete your signup. Please try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {!dialog && (
        <div>
          {!compact && (
            <h3 className="font-display text-xl font-medium text-purple-foreground">
              Get WLI updates
            </h3>
          )}
          <p
            className={
              compact
                ? "text-sm leading-relaxed text-muted-foreground"
                : "mt-1 text-sm leading-relaxed text-purple-muted"
            }
          >
            Occasional news, resources and updates from Wisdom Leadership
            Initiatives.
          </p>
        </div>
      )}
      <div
        className={
          compact
            ? "grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]"
            : "grid gap-2"
        }
      >
        <label
          className="sr-only"
          htmlFor={compact ? "newsletter-name-home" : "newsletter-name-footer"}
        >
          Name (optional)
        </label>
        <Input
          id={compact ? "newsletter-name-home" : "newsletter-name-footer"}
          name="name"
          autoComplete="name"
          maxLength={100}
          placeholder="Name (optional)"
          className={
            compact || dialog
              ? "bg-background"
              : "border-white/20 bg-white/10 text-white placeholder:text-white/60"
          }
        />
        <label
          className="sr-only"
          htmlFor={
            compact ? "newsletter-email-home" : "newsletter-email-footer"
          }
        >
          Email address
        </label>
        <Input
          id={compact ? "newsletter-email-home" : "newsletter-email-footer"}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="Email address"
          required
          className={
            compact || dialog
              ? "bg-background"
              : "border-white/20 bg-white/10 text-white placeholder:text-white/60"
          }
        />
        <Button
          type="submit"
          disabled={busy}
          variant={compact || dialog ? "default" : "inverse"}
          className={dialog ? "w-full" : undefined}
        >
          <Mail className="size-4" aria-hidden />
          {busy ? "Joining…" : "Subscribe"}
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <input
          id={compact ? "newsletter-consent-home" : "newsletter-consent-footer"}
          name="consent"
          type="checkbox"
          required
          className="mt-1 size-4 shrink-0 accent-[var(--color-primary)]"
        />
        <label
          htmlFor={
            compact ? "newsletter-consent-home" : "newsletter-consent-footer"
          }
          className={
            compact || dialog
              ? "text-xs leading-relaxed text-muted-foreground"
              : "text-xs leading-relaxed text-purple-muted"
          }
        >
          I agree to receive occasional email updates from WLI. I can
          unsubscribe at any time.
        </label>
      </div>
      <div
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label
          htmlFor={
            compact ? "newsletter-website-home" : "newsletter-website-footer"
          }
        >
          Leave this field empty
        </label>
        <input
          id={compact ? "newsletter-website-home" : "newsletter-website-footer"}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export function NewsletterSignupConfirmation({
  compact = false,
  dialog = false,
  brevoSynced,
}: {
  compact?: boolean;
  dialog?: boolean;
  brevoSynced: boolean;
}) {
  const title = brevoSynced
    ? "You’re on the WLI update list."
    : "We’ve received your signup.";

  return (
    <section
      role="status"
      aria-live="polite"
      className={
        dialog
          ? "-mx-6 -my-6 flex min-h-[360px] animate-in fade-in-0 zoom-in-95 flex-col items-center justify-center rounded-lg bg-purple-deep px-7 py-12 text-center text-purple-foreground duration-300 sm:px-10"
          : compact
            ? "my-4 flex animate-in fade-in-0 slide-in-from-bottom-2 flex-col items-center justify-center rounded-lg bg-purple-deep px-6 py-9 text-center text-purple-foreground shadow-md duration-300 sm:px-9"
            : "flex flex-col items-center justify-center rounded-lg bg-tint px-6 py-8 text-center"
      }
    >
      <span
        className={`grid size-16 place-items-center rounded-full ${compact || dialog ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-purple/10 text-purple"}`}
        aria-hidden="true"
      >
        <CheckCircle2 className="size-9" />
      </span>
      <p
        className={`mt-5 text-xs font-bold tracking-[0.16em] uppercase ${compact || dialog ? "text-purple-muted" : "text-primary"}`}
      >
        Signup received
      </p>
      <h2
        className={`mt-2 max-w-md font-display font-semibold leading-tight ${compact || dialog ? "text-3xl sm:text-4xl" : "text-2xl"}`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 max-w-sm text-sm leading-relaxed ${compact || dialog ? "text-purple-foreground/80" : "text-muted-foreground"}`}
      >
        We’ll share occasional news, resources and updates from Wisdom
        Leadership Initiatives.
      </p>
      {dialog && (
        <p className="mt-7 text-xs text-purple-muted">
          You can close this window now.
        </p>
      )}
    </section>
  );
}
