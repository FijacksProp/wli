import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ProgramCard, ResourceCard, SectionHeading, ServiceCard } from "@/components/site/blocks";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ScrollReveal } from "@/components/site/ScrollReveal";
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
      <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-purple-deep text-white sm:min-h-[38rem]">
        <img
          src="https://images.unsplash.com/photo-1779582994107-c8ceb7a0e3a1?auto=format&fit=crop&fm=jpg&q=85&w=2600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 size-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(20,16,24,0.88)_0%,rgba(20,16,24,0.68)_58%,rgba(20,16,24,0.28)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-[#141018]/75 via-transparent to-[#141018]/10" />
        <div className="container-page relative z-20 w-full py-16 sm:py-20 lg:py-24">
          <p className="eyebrow text-white">{ORG.tagline}</p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] font-medium text-white sm:text-6xl lg:text-7xl">
            Developing principled leaders for <em className="text-[#d8c4e7]">positive change.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            Wisdom Leadership Initiatives equips, empowers and deploys leaders who strengthen their
            communities and help build a better society.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/programs">
                Explore Programs <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-inverse">
              <Link to="/about">Learn About WLI</Link>
            </Button>
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
              <ScrollReveal key={s.id} className="h-full" delay={(i % 3) * 75}>
                <ServiceCard service={s} index={i} />
              </ScrollReveal>
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
            <ScrollReveal key={p.slug} className="h-full" delay={i * 80}>
              <ProgramCard program={p} featured={i === 0} />
            </ScrollReveal>
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
            {insights.map((r, i) => (
              <ScrollReveal key={r.slug} className="h-full" delay={i * 80}>
                <ResourceCard resource={r} />
              </ScrollReveal>
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
