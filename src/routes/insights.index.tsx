import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHero } from "@/components/site/blocks";
import { listPublishedBlogPosts, type BlogPost } from "@/lib/crm-api";

const TITLE = "Insights (Blog) — Wisdom Leadership Initiatives";
const DESC =
  "Stories, reflections and articles on leadership and personal growth from WLI.";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    listPublishedBlogPosts()
      .then((items) => {
        if (active) setPosts(items);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <PageHero
        eyebrow="Insights (blog)"
        title="Perspectives for leaders who keep growing."
        intro="Stories, reflections and articles on leadership, wisdom and personal growth."
        imageSrc="/images/insights-hero.jpg"
        imagePosition="center 54%"
      />
      <section className="container-page py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">WLI journal</p>
          <h2 className="mt-3 text-3xl font-medium text-purple sm:text-4xl">
            Ideas to carry into your work
          </h2>
        </div>
        {loading ? (
          <p role="status" className="mt-8 text-sm text-muted-foreground">
            Loading the latest insights…
          </p>
        ) : posts.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md"
              >
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "WLI Insights"}
                  </p>
                  <h3 className="mt-3 text-xl font-medium leading-snug text-purple">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <Link
                    to="/insights/$slug"
                    params={{ slug: post.slug }}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Read article{" "}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="font-medium text-foreground">
              New insights are on the way.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for reflections and resources from WLI.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
