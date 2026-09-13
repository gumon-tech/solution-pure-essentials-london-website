import type { Metadata } from "next";
import Welcome from "@/components/contact/Welcome";
import InfoPanel from "@/components/contact/InfoPanel";
import GettingHere from "@/components/contact/GettingHere";
import MapSection from "@/components/contact/MapSection";
import RoomsRow from "@/components/contact/RoomsRow";

// Title and description from content/contact.md's front matter.
export const metadata: Metadata = {
  title: "Contact and Hours, King's Cross | Pure Essentials London",
  description:
    "Find us at 155 King's Cross Road, London WC1X 9BN. Open Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00.",
  alternates: {
    canonical: "/contact/",
  },
};

const H1 = "Find us";

export default function ContactPage() {
  return (
    <main className="bg-cream">
      <Welcome h1={H1} />
      <InfoPanel />
      <GettingHere />
      <MapSection />
      <RoomsRow />
    </main>
  );
}
