import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Facebook, Mail, Phone } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ORG } from "@/lib/content";
import { cn } from "@/lib/utils";
import { validateContact, type ContactErrors, type ContactValues } from "@/lib/validation";

const TITLE = "Contact — Wisdom Leadership Initiatives";
const DESC = "Let’s talk about growing your leadership. Get in touch with Wisdom Leadership Initiatives (The Wisdom Place).";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const EMPTY: ContactValues = { name: "", email: "", phone: "", message: "" };
const LABELS: Record<keyof ContactValues, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

function ContactPage() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [showSummary, setShowSummary] = useState(false);

  const update = (key: keyof ContactValues, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key] || errors[key]) setErrors(validateContact(next));
  };

  const blur = (key: keyof ContactValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const all = validateContact(values);
    setErrors((e) => ({ ...e, [key]: all[key] }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const all = validateContact(values);
    setErrors(all);
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(all).length) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      requestAnimationFrame(() => doneRef.current?.focus());
    }, 700);
  };

  const errorList = (Object.keys(errors) as (keyof ContactValues)[]).filter((k) => errors[k]);

  return (
    <section className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-4xl leading-[1.05] font-medium text-purple sm:text-5xl lg:text-[3.5rem]">
          Let’s talk about growing your leadership.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Whether you’re a young leader, a parent, a school, a community group or a potential partner —
          we’d love to hear from you.
        </p>

        <ul className="mt-10 space-y-6">
          <li className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-primary">
              <Mail className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Email</p>
              <a href={`mailto:${ORG.email}`} className="mt-1 block font-medium break-all text-purple hover:text-primary hover:underline underline-offset-4">
                {ORG.email}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-primary">
              <Phone className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Phone</p>
              <div className="mt-1 flex flex-col items-start gap-1">
                {ORG.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="font-medium text-purple hover:underline underline-offset-4">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-primary">
              <Facebook className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Social</p>
              <div className="mt-1 flex flex-col items-start gap-1">
                {ORG.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-purple hover:underline underline-offset-4"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </li>

        </ul>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-lg border border-border bg-card p-6 shadow-[0_20px_50px_-30px_var(--color-purple)] sm:p-10">
          {status === "done" ? (
            <div ref={doneRef} tabIndex={-1} role="status" className="py-6 text-center focus:outline-none">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="size-7" aria-hidden />
              </span>
              <h2 className="mt-6 text-3xl font-medium text-purple">Thank you, {values.name.trim().split(" ")[0]}.</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                We appreciate your interest in Wisdom Leadership Initiatives and the time you took to connect with us.
              </p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => {
                  setValues(EMPTY);
                  setErrors({});
                  setTouched({});
                  setStatus("idle");
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <h2 className="text-2xl font-medium text-purple">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked <span className="font-semibold text-destructive">*</span> are required.
              </p>

              {showSummary && errorList.length > 0 && (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 focus:outline-2 focus:outline-destructive"
                >
                  <p className="flex items-center gap-2 font-semibold text-destructive">
                    <AlertCircle className="size-4" aria-hidden /> Please fix {errorList.length}{" "}
                    {errorList.length === 1 ? "problem" : "problems"}:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                    {errorList.map((k) => (
                      <li key={k}>
                        <a href={`#contact-${k}`} className="underline underline-offset-2 hover:no-underline">
                          {errors[k]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field id="name" label={LABELS.name} required error={errors.name}>
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                    onBlur={() => blur("name")}
                    aria-invalid={!!errors.name}
                    aria-required
                    aria-describedby={errors.name ? "contact-name-err" : undefined}
                  />
                </Field>
                <Field id="email" label={LABELS.email} required error={errors.email}>
                  <Input
                    id="contact-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => blur("email")}
                    aria-invalid={!!errors.email}
                    aria-required
                    aria-describedby={errors.email ? "contact-email-err" : undefined}
                  />
                </Field>
                <Field id="phone" label={LABELS.phone} hint="Optional" error={errors.phone} className="sm:col-span-2">
                  <Input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    onBlur={() => blur("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "contact-phone-err" : "contact-phone-hint"}
                  />
                </Field>
                <Field id="message" label={LABELS.message} required error={errors.message} className="sm:col-span-2">
                  <Textarea
                    id="contact-message"
                    rows={6}
                    value={values.message}
                    onChange={(e) => update("message", e.target.value)}
                    onBlur={() => blur("message")}
                    aria-invalid={!!errors.message}
                    aria-required
                    aria-describedby={errors.message ? "contact-message-err" : undefined}
                  />
                </Field>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" size="lg" disabled={status === "sending"} className="sm:min-w-44">
                  {status === "sending" ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={`contact-${id}`} className="flex items-baseline gap-2 text-sm font-semibold text-foreground">
        {label}
        {required && (
          <>
            <span aria-hidden className="text-destructive">*</span>
            <span className="sr-only">(required)</span>
          </>
        )}
        {hint && (
          <span id={`contact-${id}-hint`} className="text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`contact-${id}-err`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}
