import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpRight, BookOpen, Play } from "lucide-react";

import { PageHero, ProgramCard } from "@/components/site/blocks";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import { BOOKS, PROGRAMS, VIDEO_MESSAGES } from "@/lib/content";

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

      <section id="books" className="border-y border-border bg-tint py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Reading library</p>
              <h2 className="mt-3 text-3xl font-medium text-purple sm:text-4xl">Books for a life of growth</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Download WLI books and meditation booklets to read at your own pace.</p>
            </div>
            <span className="text-sm text-muted-foreground">PDF downloads</span>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOOKS.map((book) => (
              <li key={book.file}>
                <a href={`https://thewisdomplaceonline.com/wp-content/uploads/2025/01/${book.source}`} target="_blank" rel="noreferrer" className="group flex h-full min-h-36 flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                  <div className="flex items-center justify-between text-primary">
                    <BookOpen className="size-5" aria-hidden />
                    <ArrowDownToLine className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-medium leading-snug text-purple">{book.title}</h3>
                  <span className="mt-auto pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Open PDF</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="video-messages" className="container-page py-16 sm:py-20">
        <div>
          <p className="eyebrow">Watch and reflect</p>
          <h2 className="mt-3 text-3xl font-medium text-purple sm:text-4xl">Video messages</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Watch WLI messages on wisdom, growth and purposeful living.</p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_MESSAGES.map((video) => (
            <li key={video.id}>
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-purple-deep">
                  <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt="" aria-hidden="true" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 grid place-items-center bg-black/20 text-white"><span className="grid size-12 place-items-center rounded-full bg-white/95 text-primary"><Play className="ml-0.5 size-5 fill-current" aria-hidden /></span></span>
                </div>
                <span className="flex items-center justify-between gap-3 p-5">
                  <span className="font-medium text-purple">{video.title}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
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
