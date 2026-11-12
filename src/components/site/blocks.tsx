import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  FileText,
  HeartHandshake,
  Library,
  MessageSquareQuote,
  Mic2,
  ScrollText,
  Sprout,
  Users,
} from "lucide-react";

import { Copy, ImagePlaceholder } from "@/components/site/Placeholder";
import type { Program, Resource, ResourceCategory, ServiceArea } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl leading-[1.1] font-medium text-purple sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  imageSrc,
  imagePosition = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  imageSrc?: string;
  imagePosition?: string;
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border",
        hasImage ? "page-hero-image min-h-[23rem] bg-purple-deep text-white sm:min-h-[27rem]" : "bg-tint",
      )}
    >
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 z-0 size-full object-cover"
            style={{ objectPosition: imagePosition }}
            fetchPriority="high"
            decoding="async"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(23,18,27,0.78)_0%,rgba(23,18,27,0.78)_100%)] sm:bg-[linear-gradient(90deg,rgba(23,18,27,0.94)_0%,rgba(23,18,27,0.83)_43%,rgba(23,18,27,0.58)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-gradient-to-t from-[#17121B]/35 via-transparent to-[#17121B]/10"
          />
        </>
      )}
      <div className="container-page relative z-20 py-14 sm:py-20 lg:py-24">
        <p className={cn("eyebrow", hasImage && "text-white")}>{eyebrow}</p>
        <h1
          className={cn(
            "mt-4 max-w-3xl text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl",
            hasImage ? "text-white" : "text-purple",
          )}
        >
          {title}
        </h1>
        {intro && (
          <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed", hasImage ? "text-white/85" : "text-muted-foreground")}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

const SERVICE_ICONS: Record<string, typeof Users> = {
  training: Compass,
  seminars: Mic2,
  mentoring: Users,
  outreach: HeartHandshake,
  placement: Sprout,
  resources: Library,
};

export function ServiceIcon({ id, className }: { id: string; className?: string }) {
  const Icon = SERVICE_ICONS[id] ?? Compass;
  return <Icon className={className} aria-hidden />;
}

export function ServiceCard({ service, index }: { service: ServiceArea; index: number }) {
  return (
    <Link
      to="/what-we-do"
      hash={service.id}
      className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_12px_30px_-18px_var(--color-purple)] active:translate-y-0 sm:p-7"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-md bg-tint text-primary">
          <ServiceIcon id={service.id} className="size-5" />
        </span>
        <span className="font-display text-sm text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-6 text-xl leading-snug font-medium text-purple">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function ProgramCard({ program, featured = false }: { program: Program; featured?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-[0_16px_40px_-24px_var(--color-purple)] focus-within:border-primary">
      <ImagePlaceholder
        label={program.photoLabel}
        tone={featured ? "purple" : "light"}
        className="aspect-[16/10] rounded-none"
      />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          <Copy text={program.format} />
        </p>
        <h3 className="mt-3 text-2xl leading-tight font-medium text-purple">
          <Link
            to="/programs/$slug"
            params={{ slug: program.slug }}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {program.name}
            {program.short && <span className="text-muted-foreground"> ({program.short})</span>}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted-foreground">
          <Copy text={program.summary} />
        </p>
        <dl className="mt-5 border-t border-border pt-4 text-sm">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">For</dt>
          <dd className="mt-1 font-medium text-foreground">
            <Copy text={program.audience} />
          </dd>
        </dl>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-primary-hover">
          Learn more <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

const RESOURCE_ICONS: Record<ResourceCategory, typeof Users> = {
  "Success Scrolls": ScrollText,
  "Program testimonials": MessageSquareQuote,
  "Articles & blog": FileText,
};

export function ResourceIcon({ category, className }: { category: ResourceCategory; className?: string }) {
  const Icon = RESOURCE_ICONS[category];
  return <Icon className={className} aria-hidden />;
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-[0_12px_30px_-20px_var(--color-purple)] focus-within:border-primary">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
        <ResourceIcon category={resource.category} className="size-4" />
        {resource.category}
      </div>
      <h3 className="mt-4 text-xl leading-snug font-medium text-purple">
        <Link
          to="/insights/$slug"
          params={{ slug: resource.slug }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          <Copy text={resource.title} />
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        <Copy text={resource.excerpt} />
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <Copy text={resource.meta} />
        <ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </div>
    </article>
  );
}
