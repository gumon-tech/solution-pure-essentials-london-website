import Link from "next/link";
import Picture from "@/components/Picture";
import { waSite } from "@/lib/site";

// Copy verbatim from content/home.md's "## hero" section.
const SENTENCE =
  "Facials, HIFU, laser, body contouring, massage and waxing at 155 King's Cross Road, 7 days a week. Every treatment starts with a free consultation.";

export default function Hero({ h1 }: { h1: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Image renders first in the DOM so it is first on a stacked mobile
            layout; lg:order-2 moves it to the right on the 2-column layout. */}
        <div className="settle-in lg:order-2">
          <Picture
            slot="home-hero"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="rounded-arch w-full object-cover"
          />
        </div>

        <div className="lg:order-1">
          <h1 className="rise-in font-display text-5xl text-espresso lg:text-6xl">{h1}</h1>
          <p className="rise-in rise-delay-1 mt-6 max-w-prose text-lg text-cocoa">{SENTENCE}</p>

          <div className="rise-in rise-delay-2 mt-8 flex flex-wrap gap-4">
            <a
              href={waSite("SITE-HOME")}
              target="_blank"
              rel="noopener"
              className="pill hidden items-center justify-center rounded-full bg-oak px-6 py-3 font-body text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:inline-flex"
            >
              Message us on WhatsApp
            </a>
            <Link
              href="/treatments/"
              className="pill inline-flex items-center justify-center rounded-full border border-espresso px-6 py-3 font-body text-espresso hover:bg-espresso hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              See treatments and prices
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
