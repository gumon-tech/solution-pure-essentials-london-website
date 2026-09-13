import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Website terms | Pure Essentials London",
  alternates: {
    canonical: "/terms/",
  },
  robots: {
    index: true,
  },
};

export default function TermsPage() {
  const blocks = getLegalDocument("terms");
  return <LegalPage blocks={blocks} />;
}
