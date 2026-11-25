import { Link } from "@tanstack/react-router";

import logoColor from "@/assets/wisdom-place-logo.png";
import logoWhite from "@/assets/wisdom-place-logo-white.png";
import { cn } from "@/lib/utils";

/** The Wisdom Place logo artwork is used unaltered; the WLI name sits beside it. */
export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex min-w-0 items-center gap-2 rounded-sm xl:gap-3", className)}
      aria-label="Wisdom Leadership Initiatives — The Wisdom Place, home"
    >
      <img
        src={inverse ? logoWhite : logoColor}
        alt=""
        width={inverse ? 640 : 216}
        height={inverse ? 498 : 169}
        className="h-10 w-auto min-[380px]:h-12 xl:h-14"
      />
      <span
        className={cn(
          "min-w-0 flex-1 whitespace-nowrap font-display text-[clamp(0.64rem,3vw,0.9rem)] leading-none font-semibold xl:flex-none xl:text-[1.05rem] xl:leading-[1.02]",
          inverse ? "text-purple-foreground" : "text-purple",
        )}
      >
        <span className="xl:hidden">Wisdom Leadership Initiatives</span>
        <span className="hidden xl:flex xl:flex-col">
          <span>Wisdom</span>
          <span>Leadership Initiative</span>
        </span>
      </span>
    </Link>
  );
}
