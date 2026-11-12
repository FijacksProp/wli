import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";

import { PageHero } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { VIDEO_MESSAGES } from "@/lib/content";

const TITLE = "Video Messages — Wisdom Leadership Initiatives";
const DESC = "Watch WLI video messages on wisdom, growth and purposeful living.";

export const Route = createFileRoute("/video-messages")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VideoMessagesPage,
});

function VideoMessagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Watch and reflect"
        title="Video messages for the leadership journey."
        intro="Watch WLI messages on wisdom, growth and purposeful living. Each video opens on YouTube."
        imageSrc="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&fm=jpg&q=82&w=2000"
        imagePosition="center 42%"
      >
        <Button asChild variant="outline" className="mt-8">
          <Link to="/programs"><ArrowLeft /> Program & Resources</Link>
        </Button>
      </PageHero>

      <section className="container-page py-16 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_MESSAGES.map((video) => (
            <li key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-purple-deep">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/20 text-white">
                    <span className="grid size-12 place-items-center rounded-full bg-white/95 text-primary">
                      <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                    </span>
                  </span>
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
    </>
  );
}
