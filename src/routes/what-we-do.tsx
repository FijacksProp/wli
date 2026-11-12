import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, ServiceIcon } from "@/components/site/blocks";
import { Copy } from "@/components/site/Placeholder";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/content";

const TITLE = "What We Do — Wisdom Leadership Initiatives";
const DESC =
  "Leadership training, seminars and conferences, mentoring and coaching, community outreach, leadership placement and leadership resources.";

export const Route = createFileRoute("/what-we-do")({
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
  component: WhatWeDoPage,
});

function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="We equip, empower and deploy leaders."
        intro="Six connected areas of work help people grow as leaders — and put that leadership to work in their communities."
        imageSrc="/images/what-we-do-hero.jpg"
        imagePosition="center 66%"
      />

      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <nav aria-label="Work areas" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">On this page</p>
            <ul className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-border lg:pb-0">
              {SERVICES.map((s, i) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm whitespace-nowrap text-foreground/80 transition-colors hover:border-primary hover:text-primary lg:-ml-px lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:px-4 lg:whitespace-normal lg:hover:border-primary"
                  >
                    <span className="font-display text-muted-foreground tabular-nums">0{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-9">
          <ol className="divide-y divide-border">
            {SERVICES.map((s, i) => (
              <li key={s.id} id={s.id} className="scroll-mt-28 py-10 first:pt-0 sm:py-12">
                <ScrollReveal delay={Math.min(i * 45, 180)}>
                  <div className="grid gap-6 sm:grid-cols-[4rem_1fr]">
                    <span className="flex size-14 items-center justify-center rounded-lg bg-tint text-primary">
                      <ServiceIcon id={s.id} className="size-6" />
                    </span>
                    <div>
                      <p className="font-display text-sm text-muted-foreground tabular-nums">0{i + 1}</p>
                      <h2 className="mt-1 text-3xl leading-tight font-medium text-purple sm:text-4xl">{s.title}</h2>
                      <p className="mt-4 text-lg leading-relaxed text-foreground/85">{s.summary}</p>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        <Copy text={s.detail} />
                      </p>
                      {s.related && (
                        <div className="mt-6">
                          {s.related.slug ? (
                            <Button asChild variant="outline">
                              <Link to="/programs/$slug" params={{ slug: s.related.slug }}>
                                {s.related.label} <ArrowRight />
                              </Link>
                            </Button>
                          ) : (
                            <Button asChild variant="outline">
                              <Link to="/insights">
                                {s.related.label} <ArrowRight />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="bg-purple-deep text-purple-foreground">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl leading-tight font-medium sm:text-4xl">
            Find the program that fits where you are.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="lg">
              <Link to="/programs">Explore Programs</Link>
            </Button>
            <Button asChild variant="outline-inverse" size="lg">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
