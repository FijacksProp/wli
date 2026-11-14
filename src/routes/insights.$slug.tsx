import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { ContactCta } from "@/components/site/ContactCta";
import {
  getPublishedBlogPost,
  type BlogBlock,
  type BlogPost,
} from "@/lib/crm-api";

export const Route = createFileRoute("/insights/$slug")({
  head: () => ({
    meta: [
      { title: "WLI Insights — Wisdom Leadership Initiatives" },
      {
        name: "description",
        content: "Stories and reflections from Wisdom Leadership Initiatives.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: InsightArticle,
});

function InsightArticle() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublishedBlogPost(slug)
      .then(([item]) => {
        if (active) setPost(item ?? null);
      })
      .catch(() => {
        if (active) setPost(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  if (loading)
    return (
      <div
        className="container-page min-h-[40vh] py-16 text-sm text-muted-foreground"
        role="status"
      >
        Loading article…
      </div>
    );
  if (!post)
    return (
      <main className="container-page max-w-3xl py-16">
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="size-4" /> Back to Insights
        </Link>
        <h1 className="mt-6 text-4xl font-medium text-purple">
          This insight isn’t available.
        </h1>
        <p className="mt-3 text-muted-foreground">
          It may have been unpublished or moved.
        </p>
      </main>
    );
  return (
    <article>
      <header className="border-b border-border bg-tint">
        <div className="container-page max-w-4xl py-10 sm:py-14">
          <Link
            to="/insights"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden /> Insights (Blog)
          </Link>
          <h1 className="mt-6 text-4xl leading-tight font-medium text-purple sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            By {post.author}
            {post.published_at
              ? ` · ${new Date(post.published_at).toLocaleDateString()}`
              : ""}
          </p>
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt=""
              className="mt-8 aspect-[16/8] w-full rounded-lg object-cover"
            />
          )}
        </div>
      </header>
      <div className="container-page max-w-4xl py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
          {post.blocks.map((block) => (
            <PublishedBlock key={block.id} block={block} />
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-2xl rounded-lg border border-border bg-tint p-7">
          <h2 className="text-2xl font-medium text-purple">
            Stay connected with WLI
          </h2>
          <p className="mt-2 text-muted-foreground">
            For enquiries or to learn more about our work, reach out to our
            team.
          </p>
          <div className="mt-4">
            <ContactCta />
          </div>
        </div>
      </div>
    </article>
  );
}

function PublishedBlock({ block }: { block: BlogBlock }) {
  if (block.type === "image")
    return block.url ? (
      <figure>
        <img src={block.url} alt={block.text} className="w-full rounded-lg" />
        {block.text && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {block.text}
          </figcaption>
        )}
      </figure>
    ) : null;
  if (block.type === "heading")
    return (
      <h2 className="pt-3 text-2xl font-medium text-purple sm:text-3xl">
        {block.text}
      </h2>
    );
  if (block.type === "quote")
    return (
      <blockquote className="border-l-2 border-brand-purple pl-6 font-display text-2xl text-purple italic">
        {block.text}
      </blockquote>
    );
  if (block.type === "list")
    return (
      <ul className="list-disc space-y-2 pl-6">
        {block.text
          .split("\n")
          .filter(Boolean)
          .map((item, i) => (
            <li key={i}>{item}</li>
          ))}
      </ul>
    );
  if (block.type === "callout")
    return (
      <aside className="rounded-lg bg-tint p-6 text-base">{block.text}</aside>
    );
  return <p className="whitespace-pre-wrap">{block.text}</p>;
}
