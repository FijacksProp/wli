import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Headphones, PlayCircle } from "lucide-react";

import { ResourceCard, ResourceIcon } from "@/components/site/blocks";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Copy, ImagePlaceholder, Ph } from "@/components/site/Placeholder";
import { getResource, RESOURCES } from "@/lib/content";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const resource = getResource(params.slug);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Resource not found — WLI" }, { name: "robots", content: "noindex" }] };
    const { resource } = loaderData;
    const title = `${resource.category} — WLI Insights & Resources`;
    const desc = `${resource.category} from Wisdom Leadership Initiatives (The Wisdom Place).`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        // Placeholder entries should not be indexed until real content is supplied.
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: ResourceDetail,
});

function ResourceDetail() {
  const { resource } = Route.useLoaderData();
  const related = RESOURCES.filter((r) => r.slug !== resource.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-border bg-tint">
          <div className="container-page max-w-4xl py-10 sm:py-14">
            <Link
              to="/insights"
              className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4"
            >
              <ArrowLeft className="size-4" aria-hidden /> Insights & Resources
            </Link>
            <p className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              <ResourceIcon category={resource.category} className="size-4" />
              {resource.category}
            </p>
            <h1 className="mt-4 text-4xl leading-[1.1] font-medium text-purple sm:text-5xl">
              <Copy text={resource.title} />
            </h1>
            <p className="mt-5 text-sm text-muted-foreground">
              <Copy text={resource.meta} />
            </p>
          </div>
        </header>

        <div className="container-page max-w-4xl py-12 sm:py-16">
          {resource.media === "video" ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg bg-purple text-purple-muted">
              <PlayCircle className="size-12" aria-hidden />
              <span className="text-sm">[Video embed to be supplied]</span>
            </div>
          ) : resource.media === "audio" ? (
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple text-purple-foreground">
                <Headphones className="size-5" aria-hidden />
              </span>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-muted" />
                <p className="mt-2 text-xs">
                  <Ph>[Audio file to be supplied]</Ph>
                </p>
              </div>
            </div>
          ) : (
            <ImagePlaceholder label="[Cover image to be supplied]" className="aspect-[16/8] w-full" />
          )}

          <div className="mx-auto mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/85">
            <p className="font-display text-2xl leading-snug text-purple">
              <Copy text={resource.excerpt} />
            </p>
            <p>
              <Ph>[Body text to be supplied]</Ph>
            </p>
            <p>
              <Ph>[Body text to be supplied]</Ph>
            </p>
            <blockquote className="border-l-2 border-brand-purple pl-6 font-display text-2xl text-purple italic">
              <Ph>[Pull quote to be supplied]</Ph>
            </blockquote>
            <p>
              <Ph>[Body text to be supplied]</Ph>
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl rounded-lg border border-border bg-tint p-7">
            <h2 className="text-2xl font-medium text-purple">Get new insights by email</h2>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-border py-16">
        <div className="container-page">
          <h2 className="text-3xl font-medium text-purple">More resources</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
