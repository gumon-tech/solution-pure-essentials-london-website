// Verbatim from content/contact.md's "## getting-here" section.
const SENTENCE =
  "King's Cross St Pancras (Circle, Hammersmith and City, Metropolitan, Northern, Piccadilly, Victoria lines) is the nearest station.";

export default function GettingHere() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl text-espresso">Getting here</h2>
      <p className="mt-3 max-w-prose text-cocoa">{SENTENCE}</p>
    </section>
  );
}
