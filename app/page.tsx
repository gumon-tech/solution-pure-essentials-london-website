import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Groups from "@/components/home/Groups";
import HowItWorks from "@/components/home/HowItWorks";
import Clinic from "@/components/home/Clinic";
import CallToAction from "@/components/home/CallToAction";

// Title, description and h1 from content/home.md's front matter.
export const metadata: Metadata = {
  title: "Beauty Treatments in King's Cross | Pure Essentials London",
  description:
    "Facials, HIFU, laser, body contouring, massage and waxing at 155 King's Cross Road, 7 days a week. Every treatment starts with a free consultation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: ["/img/gen/home-hero-800.jpg"],
  },
};

const H1 = "Beauty and skin treatments in King's Cross";

export default function Home() {
  return (
    <main className="bg-cream">
      <Hero h1={H1} />
      <Groups />
      <HowItWorks />
      <Clinic />
      <CallToAction />
    </main>
  );
}
