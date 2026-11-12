import { createFileRoute } from "@tanstack/react-router";

import { PageHero, ResourceCard, ResourceIcon } from "@/components/site/blocks";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { RESOURCE_CATEGORIES, RESOURCES } from "@/lib/content";

const TITLE = "Insights (Blog) — Wisdom Leadership Initiatives";
const DESC = "Stories, reflections and articles on leadership and personal growth from WLI.";

export const Route = createFileRoute("/insights/")({
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
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights (blog)"
        title="Perspectives for leaders who keep growing."
        intro="Stories, reflections and articles on leadership, wisdom and personal growth."
        imageSrc="/images/insights-hero.jpg"
        imagePosition="center 54%"
      >
        <nav aria-label="Resource categories" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {RESOURCE_CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary active:bg-accent"
                >
                  <ResourceIcon category={c.name} className="size-4 text-primary" />
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="container-page divide-y divide-border py-6">
        {RESOURCE_CATEGORIES.map((c) => {
          const items = RESOURCES.filter((r) => r.category === c.name);
          return (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-24 py-12 sm:py-14">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 id={`${c.id}-h`} className="text-3xl font-medium text-purple">
                    {c.name}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{c.blurb}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                  {items.map((r, i) => (
                    <ScrollReveal key={r.slug} className="h-full" delay={(i % 2) * 85}>
                      <ResourceCard resource={r} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
