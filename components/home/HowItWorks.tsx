import Picture from "@/components/Picture";
import type { ImageSlot } from "@/lib/images";

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
          {STEPS.map((step, index) => (
            <div key={step.slot}>
              <Picture
                slot={step.slot}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="rounded-arch w-full object-cover"
              />
              <p className="mt-4 font-body text-xs uppercase tracking-[0.12em] text-walnut">
                Step {index + 1}
              </p>
              <h3 className="mt-1 font-display text-xl text-espresso">{step.title}</h3>
              <p className="mt-2 text-cocoa">{step.sentence}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
