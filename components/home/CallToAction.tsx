import Link from "next/link";
import Picture from "@/components/Picture";
import { waSite } from "@/lib/site";

// Verbatim from content/home.md's "## call-to-action" section.
const SENTENCE = "Message us on WhatsApp, or book online any time on Treatwell.";

export default function CallToAction() {
  return (
    <section className="bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <Picture
            slot="contact-welcome"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="reveal rounded-arch w-full object-cover"
          />

          <div className="reveal">
            <h2 className="font-display text-4xl text-espresso">Ready when you are</h2>
            <p className="mt-4 max-w-prose text-cocoa">{SENTENCE}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={waSite("SITE-HOME-CTA")}
                target="_blank"
                rel="noopener"
                className="pill inline-flex items-center justify-center rounded-full bg-oak px-6 py-3 font-body text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Message us on WhatsApp
              </a>
              <Link
                href="/book-online/"
                className="pill inline-flex items-center justify-center rounded-full border border-oak bg-cream px-6 py-3 font-body text-espresso hover:bg-oak hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Book online on Treatwell
              </Link>
              <Link
                href="/treatments/"
                className="pill inline-flex items-center justify-center rounded-full px-6 py-3 font-body text-espresso underline underline-offset-4 hover:text-oak focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                See treatments and prices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
