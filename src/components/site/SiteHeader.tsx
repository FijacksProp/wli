import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, ORG } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-purple focus:px-4 focus:py-2 focus:text-purple-foreground"
      >
        Skip to content
      </a>
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-purple after:absolute after:inset-x-3 after:-bottom-[1px] after:h-0.5 after:scale-x-0 after:bg-brand-purple after:transition-transform data-[status=active]:after:scale-x-100"
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
                  <Link to="/programs">Explore Resources</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0">
              <div className="border-b border-border px-6 py-5">
                <SheetTitle className="font-display text-lg text-purple">Menu</SheetTitle>
                <SheetDescription className="text-xs">{ORG.tagline}</SheetDescription>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col">
                  {NAV.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        activeOptions={{ exact: item.to === "/" }}
                        className="flex min-h-12 items-center rounded-md px-3 font-display text-xl text-foreground transition-colors hover:bg-tint active:bg-accent data-[status=active]:bg-tint data-[status=active]:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-border p-6">
                <Button asChild size="lg" className="w-full">
                  <Link to="/programs" onClick={() => setOpen(false)}>
                    Explore Resources
                  </Link>
                </Button>
                <a
                  href={`mailto:${ORG.email}`}
                  className="mt-4 block break-all text-center text-sm text-muted-foreground hover:text-primary"
                >
                  {ORG.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
