import { ImageIcon } from "lucide-react";

import logoWhite from "@/assets/wisdom-place-logo-white.png";
import { cn } from "@/lib/utils";

/** Visible slot for an image that still needs an approved, rights-cleared photo. */
export function ImagePlaceholder({
  label,
  tone = "light",
  className,
}: {
  label: string;
  tone?: "light" | "purple";
  className?: string;
}) {
  const purple = tone === "purple";
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg",
        purple ? "bg-purple text-purple-muted" : "bg-tint text-muted-foreground",
        className,
      )}
    >
      {purple && (
        <img
          src={logoWhite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-[12%] -bottom-[18%] w-[85%] max-w-none opacity-[0.07]"
        />
      )}
      <div
        className={cn(
          "absolute inset-3 rounded-md border border-dashed",
          purple ? "border-purple-foreground/25" : "border-input",
        )}
      />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <ImageIcon className="size-6 opacity-70" aria-hidden />
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
    </div>
  );
}

/** Inline marker for missing copy. Keeps the bracketed text so it is easy to search for. */
export function Ph({ children, className }: { children: React.ReactNode; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "rounded-sm bg-placeholder px-1.5 py-0.5 font-sans text-[0.85em] font-medium text-placeholder-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Renders text, highlighting it as a placeholder when it is a bracketed "[...]" string. */
export function Copy({ text, className }: { text: string; className?: string | undefined }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") ? (
          <Ph key={i} className={className}>
            {part}
          </Ph>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
