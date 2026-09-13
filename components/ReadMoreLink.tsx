import Link from "next/link";
import { ArrowRight } from "lucide-react";

// The one site-wide style for read more links (queue row Q36): oak text with an arrow,
// visible without hover, so a phone user can tell it is a link. Plain text is never a
// link. Two shapes: "text" (inline, e.g. under a home card) and "pill" (an outline pill
// button, e.g. "Read about HIFU" under a price list heading).

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const TEXT_CLASS = `group/rm inline-flex items-center gap-1.5 rounded-sm font-body text-oak underline decoration-oak/40 underline-offset-4 transition-colors duration-300 hover:text-espresso hover:decoration-espresso ${FOCUS}`;

const PILL_CLASS = `group/rm pill inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm font-body text-oak hover:bg-oak hover:text-white ${FOCUS}`;

const ARROW_CLASS =
  "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover/rm:translate-x-0.5";

export default function ReadMoreLink({
  href,
  children,
  variant = "text",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "text" | "pill";
  className?: string;
}) {
  return (
    <Link href={href} className={`${variant === "pill" ? PILL_CLASS : TEXT_CLASS} ${className}`.trim()}>
      <span>{children}</span>
      <ArrowRight className={ARROW_CLASS} aria-hidden="true" />
    </Link>
  );
}

/** The same look, for a label inside a card whose whole area is already the link (so no
 * nested link). The parent link should carry the Tailwind `group` class. */
export function ReadMoreLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body text-sm text-oak underline decoration-oak/40 underline-offset-4 group-hover:decoration-oak ${className}`.trim()}
    >
      <span>{children}</span>
      <ArrowRight
        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </span>
  );
}
