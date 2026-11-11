import { Link } from "@tanstack/react-router";
import { Facebook, Mail, Phone } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { NAV, ORG, PROGRAMS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-purple-deep text-purple-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5 lg:col-span-4">
          <Logo inverse />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-purple-muted">{ORG.description}</p>
          <p className="mt-4 font-display text-lg italic">“{ORG.tagline}”</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 lg:col-span-4">
          <div>
            <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-purple-muted uppercase">Explore</h2>
            <ul className="mt-4 space-y-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-9 items-center text-sm hover:underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-purple-muted uppercase">Programs</h2>
            <ul className="mt-4 space-y-1">
              {PROGRAMS.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex min-h-9 items-center text-sm hover:underline underline-offset-4"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="md:col-span-12 lg:col-span-4">
          <h2 className="font-display text-2xl">Stay in touch</h2>
          <p className="mt-2 text-sm text-purple-muted">News on programs, insights and resources.</p>
          <div className="mt-5">
            <NewsletterForm inverse />
          </div>
          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-purple-muted" aria-hidden />
              <a href={`mailto:${ORG.email}`} className="break-all hover:underline underline-offset-4">
                {ORG.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-purple-muted" aria-hidden />
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {ORG.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="whitespace-nowrap hover:underline underline-offset-4">
                    {phone}
                  </a>
                ))}
              </span>
            </li>
            {ORG.socials.map((social) => (
              <li key={social.name} className="flex items-start gap-3">
                <Facebook className="mt-0.5 size-4 shrink-0 text-purple-muted" aria-hidden />
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-purple-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {ORG.name} ({ORG.alias}). All rights reserved.
          </p>
          <p>{ORG.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
