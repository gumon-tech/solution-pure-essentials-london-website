import Picture from "@/components/Picture";
import { SITE } from "@/lib/site";

export default function Welcome({ h1 }: { h1: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="settle-in lg:order-2">
          <Picture
            slot="contact-welcome"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="rounded-arch w-full object-cover"
          />
        </div>

        <div className="lg:order-1">
          <h1 className="rise-in font-display text-5xl text-espresso lg:text-6xl">{h1}</h1>
          {/* Address, verbatim from content/contact.md's "## welcome" section
              (same text as lib/site.ts's SITE.address). */}
          <p className="rise-in rise-delay-1 mt-6 max-w-prose text-lg text-cocoa">{SITE.address}</p>
        </div>
      </div>
    </section>
  );
}
