import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { PageHero } from "@/components/site/blocks";
import { Ph } from "@/components/site/Placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TITLE = "Design system — Wisdom Leadership Initiatives";
const DESC = "A restrained plum, charcoal, white and neutral palette, typography, buttons, form states and launch placeholders for the WLI website.";

export const Route = createFileRoute("/style-guide")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StyleGuide,
});

const SWATCHES = [
  { name: "Rich plum", token: "purple", cls: "bg-purple", note: "Headings and restrained brand surfaces · #5A2F78" },
  { name: "Charcoal plum", token: "purple-deep", cls: "bg-purple-deep", note: "Dark feature panels and footer · #211A25" },
  { name: "Royal amethyst", token: "primary", cls: "bg-primary", note: "Buttons, links and selected states · #7040A4" },
  { name: "Logo purple", token: "brand-purple", cls: "bg-brand-purple", note: "Small identity accent · #8201CF" },
  { name: "Black", token: "foreground", cls: "bg-foreground text-background", note: "Primary text · #111111" },
  { name: "White", token: "background", cls: "bg-background border border-border", note: "Main page surface · #FFFFFF" },
  { name: "Tint", token: "tint", cls: "bg-tint", note: "Alternate section background" },
];

const PLACEHOLDERS = [
  "Hero, organization, program and cover photos (rights-cleared)",
  "Location (only if needed)",
  "Impact figures",
  "Team introduction, names, titles, bios and photos",
  "The Wisdom Place program: description, format and audience",
  "Mordecai Project eligibility and support details",
  "Leadership placement process and details",
  "Insights (Blog) entries: stories, testimonials, articles, summaries, authors and dates",
  "Approved, consented program testimonials and Success Scrolls",
];

function StyleGuide() {
  return (
    <>
      <PageHero
        eyebrow="Design system"
        title="WLI website design system"
        intro="A quick reference for keeping pages consistent as content is added."
      />
      <div className="container-page space-y-20 py-16">
        <section>
          <h2 className="text-3xl font-medium text-purple">Color</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SWATCHES.map((s) => (
              <li key={s.token} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className={`h-20 ${s.cls}`} />
                <div className="p-4">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">--{s.token} · {s.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-medium text-purple">Typography</h2>
          <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-8">
            <p className="eyebrow">Eyebrow · Public Sans 600</p>
            <p className="font-display text-5xl text-purple">Display — Newsreader</p>
            <p className="font-display text-3xl text-purple">Section heading — Newsreader</p>
            <p className="text-lg text-foreground/85">Body large — Public Sans 400, relaxed leading.</p>
            <p className="text-sm text-muted-foreground">Small / muted — captions and metadata.</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-medium text-purple">Buttons</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hover, press and Tab through them to see states. Minimum height 44px.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="purple">Purple</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="link">Text link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 rounded-lg bg-purple p-6">
            <Button variant="inverse">Inverse</Button>
            <Button variant="outline-inverse">Outline inverse</Button>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-medium text-purple">Form fields</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="sg-default" className="text-sm font-semibold">Default</label>
              <Input id="sg-default" className="mt-2" placeholder="Type here" />
            </div>
            <div>
              <label htmlFor="sg-error" className="text-sm font-semibold">Error</label>
              <Input id="sg-error" className="mt-2" aria-invalid defaultValue="name@" aria-describedby="sg-error-msg" />
              <p id="sg-error-msg" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
                <AlertCircle className="size-4" aria-hidden /> Enter a valid email address.
              </p>
            </div>
            <div>
              <label htmlFor="sg-disabled" className="text-sm font-semibold">Disabled</label>
              <Input id="sg-disabled" className="mt-2" disabled defaultValue="Not editable" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-medium text-purple">Placeholders to replace before launch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Missing content appears on the site like this: <Ph>[To be supplied]</Ph>
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {PLACEHOLDERS.map((p) => (
              <li key={p} className="rounded-md border border-dashed border-input bg-card px-4 py-3 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
