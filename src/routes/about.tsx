import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, SectionHeading } from "@/components/site/blocks";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ORG, VALUES } from "@/lib/content";

const TITLE = "About WLI — Wisdom Leadership Initiatives";
const DESC =
  "Who we are, our vision and mission, our core values — including Chokmah (wisdom) — and our approach to leadership and societal change.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const APPROACH = [
  {
    step: "Develop",
    body: "Strengthen people’s ability to lead themselves and their societies.",
  },
  {
    step: "Train & equip",
    body: "Share knowledge for personal transformation and, by extension, societal development.",
  },
  {
    step: "Recruit & empower",
    body: "Support emerging leaders to solve pressing societal problems.",
  },
  {
    step: "Deploy",
    body: "Leaders become agents of change in communities, institutions and social systems.",
  },
];

function AboutPage() {
  const [chokmah, ...values] = VALUES;
  return (
    <>
      <PageHero
        eyebrow="About WLI"
        title="Wisdom that builds people — and the societies they lead."
        intro={`${ORG.name} (${ORG.alias}) develops principled leaders who contribute to positive change in communities and society.`}
        imageSrc="/images/about-hero.jpg"
        imagePosition="center 52%"
      />

      {/* Who we are */}
      <section className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
        <ScrollReveal className="lg:col-span-5">
          <img
            src="/images/about-who-we-are.jpg"
            alt="A person studying and writing beside an open book, with their face out of frame"
            className="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </ScrollReveal>
        <ScrollReveal className="lg:col-span-7 lg:pt-6" delay={90}>
          <SectionHeading eyebrow="Who we are" title="Leaders who lead themselves well can lead change." />
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/85">
            <p>
              Wisdom Leadership Initiatives, also known as The Wisdom Place, offers wisdom, strategies
              and coaching for leaders. We work with young people and community members to build the
              character, judgment and skills that principled leadership needs.
            </p>
            <p>
              Our work spans leadership training, seminars and conferences, mentoring and coaching,
              community outreach and empowerment, leadership placement, and resources for continued
              learning.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/what-we-do">
              See what we do <ArrowRight />
            </Link>
          </Button>
        </ScrollReveal>
      </section>

      {/* Vision & mission */}
      <section className="bg-purple-deep text-purple-foreground">
        <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-[0.14em] text-purple-muted uppercase">Vision</p>
            <p className="mt-6 font-display text-3xl leading-tight sm:text-[2.6rem]">“{ORG.vision}”</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-xs font-semibold tracking-[0.14em] text-purple-muted uppercase">Mission</p>
            <ul className="mt-6 divide-y divide-purple-foreground/15">
              {ORG.mission.map((m, i) => (
                <li key={i} className="flex gap-5 py-5 first:pt-0">
                  <span className="font-display text-xl text-purple-muted tabular-nums">0{i + 1}</span>
                  <p className="leading-relaxed">{m}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-16 sm:py-24">
        <SectionHeading eyebrow="Core values" title="What guides our work" />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <ScrollReveal className="lg:row-span-2">
            <div className="h-full rounded-lg border-2 border-brand-purple/30 bg-placeholder/40 p-8">
              <p className="text-5xl text-brand-purple" lang="he" aria-hidden>
                חָכְמָה
              </p>
              <h3 className="mt-6 text-3xl font-medium text-purple">{chokmah.name}</h3>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">{chokmah.body}</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {values.map((v, i) => (
              <ScrollReveal key={v.name} delay={(i % 2) * 75}>
                <div className="h-full rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-medium text-purple">{v.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-y border-border bg-tint py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our approach"
            title="From personal transformation to societal change"
            intro="Our mission moves in one direction: from the person, to the community, to society."
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <li key={a.step} className="relative bg-card">
                <ScrollReveal className="h-full p-7" delay={i * 60}>
                  <span className="font-display text-sm text-muted-foreground tabular-nums">Step 0{i + 1}</span>
                  <h3 className="mt-3 text-2xl font-medium text-purple">{a.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>


    </>
  );
}

