import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowLeft, BookOpen } from "lucide-react";

import { PageHero } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { BOOKS } from "@/lib/content";

const TITLE = "Books — Wisdom Leadership Initiatives";
const DESC = "Read and download books and meditation booklets from Wisdom Leadership Initiatives.";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Reading library"
        title="Books for a life of wisdom and growth."
        intro="Explore WLI books and meditation booklets for personal reflection and continued learning."
        imageSrc="https://images.unsplash.com/photo-1733944544317-74cca9d4647f?auto=format&fit=crop&fm=jpg&q=82&w=2000"
        imagePosition="center 48%"
      >
        <Button asChild variant="outline" className="mt-8">
          <Link to="/programs"><ArrowLeft /> Program & Resources</Link>
        </Button>
      </PageHero>

      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">WLI bookshelf</p>
            <h2 className="mt-3 text-3xl font-medium text-purple sm:text-4xl">Choose a book to read</h2>
          </div>
          <span className="text-sm text-muted-foreground">PDF downloads</span>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((book) => (
            <li key={book.file}>
              <a
                href={`/resources/books/${book.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full min-h-40 flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <span className="flex items-center justify-between text-primary">
                  <BookOpen className="size-5" aria-hidden />
                  <ArrowDownToLine className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-medium leading-snug text-purple">{book.title}</h3>
                <span className="mt-auto pt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Read book</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
