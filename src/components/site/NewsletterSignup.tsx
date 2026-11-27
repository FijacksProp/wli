import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/newsletter-server";

export function NewsletterSignup({
  compact = false,
  dialog = false,
}: {
  compact?: boolean;
  dialog?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

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
        setMessage("");
        setFailed(false);
        try {
          const result = await subscribeToNewsletter({
            data: {
              email: String(formData.get("email") ?? ""),
              name: String(formData.get("name") ?? ""),
              consent: formData.get("consent") === "on",
              website: String(formData.get("website") ?? ""),
            },
          });
          setMessage(
            result.brevoSynced
              ? "Thank you for subscribing. You are on the WLI update list."
              : "Thank you. We have received your signup.",
          );
          form.reset();
        } catch (error) {
          setFailed(true);
          setMessage(
            error instanceof Error
              ? error.message
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
              compact || dialog
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
      {message && (
        <p
          role={failed ? "alert" : "status"}
          className={`flex items-start gap-2 text-sm ${failed ? "text-destructive" : compact || dialog ? "text-green-700" : "text-purple-foreground"}`}
        >
          {!failed && (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          )}
          {message}
        </p>
      )}
    </form>
  );
}
