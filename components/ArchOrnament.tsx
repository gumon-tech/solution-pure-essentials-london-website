// Queue row Q44: a small outline of the site's arch, set above a section heading. It
// draws its own line as the section scrolls in (app/globals.css, "draw-line"); without
// scroll-driven animation, or with reduced motion, it is simply drawn. Decorative only.
export default function ArchOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      aria-hidden="true"
      focusable="false"
      className={`arch-ornament reveal h-8 w-12 text-oak ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* The arch, then a hairline base either side of it. */}
      <path pathLength={1} d="M20 36 V20 a12 12 0 0 1 24 0 V36" />
      <path pathLength={1} d="M2 36 H62" opacity="0.5" />
    </svg>
  );
}
