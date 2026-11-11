import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Mail } from "lucide-react";

import { ProgramCard } from "@/components/site/blocks";
import { Copy, ImagePlaceholder } from "@/components/site/Placeholder";
import { Button } from "@/components/ui/button";
import { getProgram, PROGRAMS } from "@/lib/content";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = getProgram(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Program not found — WLI" }, { name: "robots", content: "noindex" }] };
    const { program } = loaderData;
    const title = `${program.name} — Wisdom Leadership Initiatives`;
    const desc = program.confirmed ? program.summary : `${program.name}, a program of Wisdom Leadership Initiatives.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { program } = Route.useLoaderData();
  const others = PROGRAMS.filter((p) => p.slug !== program.slug && p.confirmed).slice(0, 2);

  return (
    <>
      <section className="border-b border-border bg-tint">
        <div className="container-page py-10 sm:py-14">
          <Link
            to="/programs"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4"
          >
            <ArrowLeft className="size-4" aria-hidden /> All programs
          </Link>
          <div className="mt-6 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">
                <Copy text={program.format} />
              </p>
              <h1 className="mt-4 text-4xl leading-[1.05] font-medium text-purple sm:text-5xl lg:text-6xl">
                {program.name}
                {program.short && <span className="text-muted-foreground"> ({program.short})</span>}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                <Copy text={program.summary} />
              </p>
            </div>
            <div className="lg:col-span-5">
              <ImagePlaceholder tone="purple" label={program.photoLabel} className="aspect-[16/10] w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-8">
          <div>
            <h2 className="text-3xl font-medium text-purple">Overview</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
              {program.overview.map((p, i) => (
                <p key={i}>
                  <Copy text={p} />
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-medium text-purple">What participants can expect</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {program.expect.map((e) => (
                <li key={e} className="flex gap-3 rounded-lg border border-border bg-card p-5">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="leading-relaxed">
                    <Copy text={e} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-6 rounded-lg border border-border bg-card p-7 lg:sticky lg:top-28">
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Intended audience</dt>
                <dd className="mt-1.5 text-lg font-medium text-purple">
                  <Copy text={program.audience} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Format</dt>
                <dd className="mt-1.5 text-lg font-medium text-purple">
                  <Copy text={program.format} />
                </dd>
              </div>
            </dl>
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Want to take part, refer someone or support this program?
              </p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link to="/contact">
                  <Mail /> Contact us to learn more
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>

      {others.length > 0 && (
        <section className="border-t border-border bg-tint py-16 sm:py-20">
          <div className="container-page">
            <h2 className="text-3xl font-medium text-purple">Other programs</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {others.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
