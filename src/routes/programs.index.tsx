import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, ProgramCard } from "@/components/site/blocks";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/content";

const TITLE = "Programs — Wisdom Leadership Initiatives";
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
        eyebrow="Programs"
        title="Programs that grow leaders of character."
        intro="Each program serves a different group — young leaders, secondary school students, and people who need support to keep learning."
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
