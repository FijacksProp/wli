import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpRight, BookOpen, Play } from "lucide-react";

import { PageHero, ProgramCard } from "@/components/site/blocks";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/content";

const TITLE = "Program & Resources — Wisdom Leadership Initiatives";
const DESC =
  "House of Insights, The Next Gen Leadership Conference, The Mordecai Project and The Wisdom Place — leadership programs from WLI.";

export const Route = createFileRoute("/programs/")({
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
  component: ProgramsPage,
});

function ProgramsPage() {
  const confirmed = PROGRAMS.filter((p) => p.confirmed);
  const pending = PROGRAMS.filter((p) => !p.confirmed);

  return (
    <>
      <PageHero
        eyebrow="Program & Resources"
        title="Programs and resources for leaders at every stage."
        intro="Explore WLI programs, download books for continued learning, and watch video messages on wisdom and leadership."
        imageSrc="/images/programs-hero.jpg"
        imagePosition="center 48%"
      />

      <section className="container-page py-16 sm:py-20">
        <h2 className="sr-only">Current programs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {confirmed.map((p, i) => (
            <ScrollReveal key={p.slug} className="h-full" delay={(i % 3) * 75}>
              <ProgramCard program={p} featured={i === 0} />
            </ScrollReveal>
          ))}
        </div>

        {pending.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-medium text-purple">Also from WLI</h2>
            <p className="mt-2 text-sm text-muted-foreground">Details for these programs are being confirmed.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pending.map((p, i) => (
                <ScrollReveal key={p.slug} className="h-full" delay={(i % 3) * 75}>
                  <ProgramCard program={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-tint py-16 sm:py-20">
        <div className="container-page">
          <p className="eyebrow">Continue learning</p>
          <h2 className="mt-3 text-3xl font-medium text-purple sm:text-4xl">Resources for your leadership journey</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Explore WLI books and video messages, gathered in their own easy-to-browse libraries.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link to="/books" className="group rounded-lg border border-border bg-card p-7 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-8">
              <span className="flex items-center justify-between text-primary"><BookOpen className="size-6" aria-hidden /><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
              <h3 className="mt-6 text-2xl font-medium text-purple">Books</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">Browse and download WLI books and meditation booklets.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Browse books <ArrowDownToLine className="size-4" aria-hidden /></span>
            </Link>
            <Link to="/video-messages" className="group rounded-lg border border-border bg-card p-7 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-8">
              <span className="flex items-center justify-between text-primary"><Play className="size-6" aria-hidden /><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
              <h3 className="mt-6 text-2xl font-medium text-purple">Video messages</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">Watch WLI messages on wisdom, growth and purposeful living.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore videos <Play className="size-4" aria-hidden /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-tint">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-medium text-purple">Not sure where to start?</h2>
            <p className="mt-2 text-muted-foreground">Tell us a little about yourself and we’ll point you in the right direction.</p>
          </div>
          <Button asChild size="lg">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
