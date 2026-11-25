import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV, ORG } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isNavigating = useRouterState({ select: (state) => state.status === "pending" });
  const aboutIsActive = ["/about", "/team"].includes(pathname);
  const desktopLinks = NAV.filter(
    (item) => !["/about", "/team"].includes(item.to),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <span className="navigation-progress" data-active={isNavigating ? "true" : undefined} aria-hidden="true">
        <span />
      </span>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-purple focus:px-4 focus:py-2 focus:text-purple-foreground"
      >
        Skip to content
      </a>
      <div className="container-page relative flex h-20 items-center justify-between gap-3 xl:gap-6">
        <Logo className="flex-1 xl:flex-none" />

        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:block"
        >
          <ul className="flex items-center gap-1 whitespace-nowrap">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${aboutIsActive ? "text-purple" : "text-foreground/80"}`}
                  aria-label="About WLI pages"
                >
                  About <ChevronDown className="size-3.5" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" sideOffset={8} className="w-52 p-1.5">
                  {NAV.filter((item) =>
                    ["/about", "/team"].includes(item.to),
                  ).map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link
                        to={item.to}
                        className="min-h-10 cursor-pointer rounded-md px-3 font-medium"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {desktopLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-purple after:absolute after:inset-x-2.5 after:-bottom-[1px] after:h-0.5 after:scale-x-0 after:bg-brand-purple after:transition-transform data-[status=active]:after:scale-x-100"
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden xl:inline-flex">
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
