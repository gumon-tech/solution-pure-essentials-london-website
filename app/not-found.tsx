import ReadMoreLink from "@/components/ReadMoreLink";

// Queue row Q42 section C: the site's own 404 page, so its heading follows the Title Case
// rule (Next.js's built-in page had the sentence-case heading "This page could not be found.").
export default function NotFound() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h1 className="font-display text-4xl text-espresso md:text-5xl">Page Not Found</h1>
        <p className="mt-4 text-cocoa">This page could not be found.</p>
        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <ReadMoreLink href="/" variant="pill">
              Home
            </ReadMoreLink>
          </li>
          <li>
            <ReadMoreLink href="/treatments/" variant="pill">
              Treatments and Prices
            </ReadMoreLink>
          </li>
        </ul>
      </section>
    </main>
  );
}
