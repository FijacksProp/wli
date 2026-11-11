import { Link } from "@tanstack/react-router";

import logoColor from "@/assets/wisdom-place-logo.png.asset.json";
import logoWhite from "@/assets/wisdom-place-logo-white.png.asset.json";
import { cn } from "@/lib/utils";

/** The Wisdom Place logo artwork is used unaltered; the WLI name sits beside it. */
export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-3 rounded-sm", className)}
      aria-label="Wisdom Leadership Initiatives — The Wisdom Place, home"
    >
      <img
        src={inverse ? logoWhite.url : logoColor.url}
        alt=""
        width={inverse ? 640 : 216}
        height={inverse ? 498 : 169}
        className="h-12 w-auto sm:h-14"
      />
      <span
        className={cn(
          "font-display text-[0.95rem] leading-[1.1] font-semibold sm:text-base",
          inverse ? "text-purple-foreground" : "text-purple",
        )}
      >
        Wisdom Leadership
        <br />
        Initiatives
      </span>
    </Link>
  );
}
