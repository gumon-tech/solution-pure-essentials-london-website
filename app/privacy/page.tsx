import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy notice | Pure Essentials London",
  alternates: {
    canonical: "/privacy/",
  },
  robots: {
    index: true,
  },
};

export default function PrivacyPage() {
  const blocks = getLegalDocument("privacy");
  return <LegalPage blocks={blocks} />;
}
