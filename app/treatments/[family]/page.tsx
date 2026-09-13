import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FamilyPage from "@/components/FamilyPage";
import { getFamilyPage, getFamilyPages } from "@/lib/family-pages";

// Static export: every family page is known at build time, and no other slug is
// ever valid (a request for one falls through to the site's 404 page).
export const dynamicParams = false;

export function generateStaticParams() {
  return getFamilyPages().map((page) => ({ family: page.slug }));
}

/** "<title> in King's Cross | Pure Essentials London", or without the King's Cross
 * phrase when that would be over 60 characters. */
function metaTitle(title: string): string {
  const full = `${title} in King's Cross | Pure Essentials London`;
  if (full.length <= 60) return full;
  return `${title} | Pure Essentials London`;
}

/** Text up to and including the first ". ", or the whole string if there is no
 * mid-string sentence break. */
function firstSentence(text: string): string {
  const idx = text.indexOf(". ");
  return idx === -1 ? text : text.slice(0, idx + 1);
}

/** Cuts `text` to at most `max` characters, never inside a word. */
function truncateOnWordBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}): Promise<Metadata> {
  const { family } = await params;
  const page = getFamilyPage(family);
  if (!page) return {};

  const description = truncateOnWordBoundary(firstSentence(page.paragraphs[0] ?? ""), 155);

  return {
    title: metaTitle(page.title),
    description,
    alternates: {
      canonical: `/treatments/${page.slug}/`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ family: string }>;
}) {
  const { family } = await params;
  const page = getFamilyPage(family);
  if (!page) notFound();

  return <FamilyPage page={page} />;
}
