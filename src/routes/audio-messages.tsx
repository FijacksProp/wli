import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Headphones } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHero } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { listPublishedResources, type WliResource } from "@/lib/crm-api";

export const Route = createFileRoute("/audio-messages")({
  head: () => ({
    meta: [
      { title: "Audio Messages — Wisdom Leadership Initiatives" },
      {
        name: "description",
        content: "Listen to audio messages from Wisdom Leadership Initiatives.",
      },
    ],
  }),
  component: AudioMessagesPage,
});

function AudioMessagesPage() {
  const [items, setItems] = useState<WliResource[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    listPublishedResources("audio")
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
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
        eyebrow="Listen and reflect"
        title="Audio messages for everyday growth."
        intro="Listen to WLI messages on wisdom, leadership and purposeful living."
        imageSrc="/images/programs-hero.jpg"
        imagePosition="center 48%"
      >
        <Button asChild variant="outline" className="mt-8">
          <Link to="/programs">
            <ArrowLeft /> Program & Resources
          </Link>
        </Button>
      </PageHero>
      <section className="container-page min-h-[30vh] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {loading ? (
            <p role="status" className="text-sm text-muted-foreground">
              Loading audio messages…
            </p>
          ) : items.length ? (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-purple-50 text-primary">
                      <Headphones className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-semibold text-purple">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <audio
                    className="mt-4 w-full"
                    controls
                    preload="none"
                    src={item.file_url}
                    aria-label={`Play ${item.title}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
              <Headphones className="mx-auto size-7 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl font-medium text-purple">
                Audio messages are coming soon.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                WLI audio resources will be shared here when they are ready.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
