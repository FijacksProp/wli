import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ProgramCard, ResourceCard, SectionHeading, ServiceCard } from "@/components/site/blocks";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ImagePlaceholder } from "@/components/site/Placeholder";
import { Button } from "@/components/ui/button";
import { ORG, PROGRAMS, RESOURCES, SERVICES } from "@/lib/content";

const TITLE = "Wisdom Leadership Initiatives — Developing principled leaders";
const DESC =
  "Wisdom Leadership Initiatives (The Wisdom Place) equips, empowers and deploys leaders who will be agents of positive change in communities and society.";

export const Route = createFileRoute("/")({
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
  component: HomePage,
});

function HomePage() {
  const featured = PROGRAMS.filter((p) => p.confirmed);
  const insights = ["article-1", "success-scroll-1", "video-1"].map((s) => RESOURCES.find((r) => r.slug === s)).filter((r): r is (typeof RESOURCES)[number] => !!r);

  return (
    <>
      {/* Hero */}
      <section className="ambient-hero relative isolate overflow-hidden">
        <div className="container-page relative z-10 grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="eyebrow">{ORG.tagline}</p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-medium text-foreground sm:text-6xl lg:text-[4.5rem]">
              Developing principled leaders for <em className="text-primary">positive change.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We help young people and community members lead themselves and their societies well —
              through training, mentoring, conferences, community outreach and resources.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/programs">
                  Explore Programs <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Learn About WLI</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ImagePlaceholder
              tone="light"
              label="[Hero photo of a WLI program to be supplied]"
              className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-y border-border bg-tint">
        <div className="container-page grid gap-8 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Who we are</p>
          </div>
          <div className="lg:col-span-8">
            <p className="font-display text-2xl leading-snug text-purple sm:text-3xl">
              Wisdom Leadership Initiatives — also known as The Wisdom Place — is a non-profit
              organization focused on developing principled leaders who contribute to positive
              change in their communities and society.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4"
            >
              More about WLI <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-lg bg-purple-deep p-8 text-purple-foreground sm:p-10 lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-purple-muted uppercase">Our vision</p>
            <blockquote className="mt-6 font-display text-3xl leading-tight sm:text-4xl">“{ORG.vision}”</blockquote>
            <div className="mt-10 h-1 w-12 bg-brand-purple" aria-hidden />
          </div>
          <div className="rounded-lg border border-border bg-card p-8 sm:p-10 lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Our mission</p>
            <ol className="mt-6 space-y-6">
              {ORG.mission.map((m, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="font-display text-2xl text-primary tabular-nums">0{i + 1}</span>
                  <p className="leading-relaxed text-foreground">{m}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-tint py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="What we do"
              title="Six ways we develop leaders"
              intro="From the classroom to the community, our work strengthens people’s ability to lead themselves and others."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/what-we-do">See all our work</Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="container-page py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured programs"
            title="Programs for every stage of leadership"
            intro="Distinct offerings for young leaders, students and those who need support to keep learning."
          />
          <Button asChild className="self-start md:self-auto">
            <Link to="/programs">Explore Programs</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProgramCard key={p.slug} program={p} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Insights & resources"
              title="Keep learning between programs"
              intro="Articles, Success Scrolls, books, audio and video messages on leadership and personal growth."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/insights">Browse all resources</Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {insights.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Get involved + newsletter */}
      <section className="container-page pb-16 sm:pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-lg bg-purple-deep p-8 text-primary-foreground sm:p-10">
            <div>
              <h2 className="text-3xl leading-tight font-medium sm:text-4xl">Partner with us</h2>
              <p className="mt-4 max-w-md leading-relaxed opacity-90">
                Institutions, partners and supporters: talk to us about helping more leaders grow.
              </p>
            </div>
            <Button asChild variant="inverse" className="mt-8 self-start">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
            <h2 className="text-3xl leading-tight font-medium text-purple sm:text-4xl">Get our newsletter</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Updates on programs, events and new resources.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
