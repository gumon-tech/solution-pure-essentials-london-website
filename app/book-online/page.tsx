import type { Metadata } from "next";
import TreatwellWidget from "@/components/TreatwellWidget";
import Link from "next/link";
import { SITE, waSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Online | Pure Essentials London",
  description:
    "Book a treatment at Pure Essentials London, 155 King's Cross Road, online on Treatwell. Choose a treatment and a time, and book straight away.",
  alternates: {
    canonical: "/book-online/",
  },
};

const LINK_CLASS =
  "text-espresso underline underline-offset-4 hover:text-oak focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm";

export default function BookOnlinePage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <h1 className="font-display text-5xl text-espresso lg:text-6xl">Book online</h1>
        <p className="mt-4 max-w-prose text-lg text-cocoa">
          Choose a treatment and a time, and book straight away on Treatwell.
        </p>

        <p className="mt-8 text-sm text-cocoa">
          This booking calendar and its treatment menu are provided by Treatwell, which sets its own cookies. See our{" "}
          <Link href="/privacy/" className={LINK_CLASS}>
            privacy notice
          </Link>
          .
        </p>

        <div className="mt-3">
          <TreatwellWidget loading="eager" />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-cocoa">
          <p>
            Widget not loading?{" "}
            <a href={SITE.treatwell} target="_blank" rel="noopener" className={LINK_CLASS}>
              Open Treatwell in a new tab
            </a>
          </p>
          <p>
            Prefer to ask first?{" "}
            <a href={waSite("SITE-BOOK")} target="_blank" rel="noopener" className={LINK_CLASS}>
              Message us on WhatsApp.
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
