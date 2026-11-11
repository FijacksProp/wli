import { useId, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { validateEmail } from "@/lib/validation";

/** Frontend prototype: validates and shows a success state, but saves nothing. */
export function NewsletterForm({ inverse = false }: { inverse?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  if (status === "done") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-md border p-4",
          inverse ? "border-purple-foreground/20 bg-purple-foreground/5" : "border-border bg-card",
        )}
      >
        <CheckCircle2 className={cn("mt-0.5 size-5 shrink-0", inverse ? "text-purple-foreground" : "text-success")} />
        <div className="text-sm">
          <p className="font-semibold">Thanks — you’re signed up (prototype).</p>
          <p className={cn("mt-1", inverse ? "text-purple-muted" : "text-muted-foreground")}>
            This form isn’t connected yet, so no email address was saved.
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail("");
              setStatus("idle");
            }}
            className="mt-2 font-semibold underline underline-offset-4 hover:no-underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const err = validateEmail(email);
        setError(err);
        if (err) return;
        setStatus("sending");
        setTimeout(() => setStatus("done"), 600);
      }}
    >
      <label htmlFor={`${id}-email`} className={cn("block text-sm font-semibold", inverse && "text-purple-foreground")}>
        Email address <span aria-hidden className={inverse ? "text-purple-muted" : "text-destructive"}>*</span>
        <span className="sr-only">(required)</span>
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(validateEmail(e.target.value));
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : `${id}-note`}
          className={cn(inverse && "border-purple-foreground/30 bg-purple-deep text-purple-foreground placeholder:text-purple-muted/70")}
        />
        <Button
          type="submit"
          variant={inverse ? "inverse" : "default"}
          disabled={status === "sending"}
          className="shrink-0"
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {error ? (
        <p id={`${id}-err`} className={cn("mt-2 text-sm font-medium", inverse ? "text-purple-foreground" : "text-destructive")}>
          <span aria-hidden>⚠ </span>
          {error}
        </p>
      ) : (
        <p id={`${id}-note`} className={cn("mt-2 text-xs", inverse ? "text-purple-muted" : "text-muted-foreground")}>
          Prototype form — not yet connected to a mailing list.
        </p>
      )}
    </form>
  );
}
