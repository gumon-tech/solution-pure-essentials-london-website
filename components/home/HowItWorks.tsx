import { IMAGES, type ImageSlot } from "@/lib/images";

// These 4 step images sit right after the group cards, not in the initial
// viewport but close to it -- loaded eagerly (not lib/Picture's default
// lazy) so they are ready by the time the user scrolls to them. Rendered
// directly from IMAGES rather than via components/Picture so that only the
// hero keeps fetchPriority "high" (Picture ties eager loading to that).
const STEP_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw";

// Titles and sentences verbatim from content/home.md's "## how-it-works" section
// (numeral prefixes on the md headings dropped; the step order itself carries
// the numbering visually).
const STEPS: { title: string; sentence: string; slot: ImageSlot }[] = [
  {
    title: "Message us",
    sentence: "Tell us what you would like to change or ask about, on WhatsApp or by email.",
    slot: "step-1-message",
  },
  {
    title: "Free consultation",
    sentence: "We look at your skin or your goal and recommend what suits you.",
    slot: "step-2-consultation",
  },
  {
    title: "Your treatment",
    sentence: "Booked at a time that suits you, 7 days a week.",
    slot: "step-3-treatment",
  },
  {
    title: "Aftercare",
    sentence: "You leave with clear aftercare advice and can message us with any question.",
    slot: "step-4-aftercare",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <h2 className="font-display text-4xl text-espresso">How it works</h2>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => {
            const entry = IMAGES[step.slot];
            return (
              <div key={step.slot}>
                <picture>
                  <source type="image/avif" srcSet={entry.srcset.avif} sizes={STEP_SIZES} />
                  <source type="image/webp" srcSet={entry.srcset.webp} sizes={STEP_SIZES} />
                  <img
                    src={entry.fallback}
                    srcSet={entry.srcset.jpg}
                    sizes={STEP_SIZES}
                    alt={entry.alt}
                    width={entry.width}
                    height={entry.height}
                    decoding="async"
                    className="rounded-arch w-full object-cover"
                  />
                </picture>
                <p className="mt-4 font-body text-xs uppercase tracking-[0.12em] text-walnut">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-display text-xl text-espresso">{step.title}</h3>
                <p className="mt-2 text-cocoa">{step.sentence}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
