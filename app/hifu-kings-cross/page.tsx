import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryPage from "@/components/StoryPage";
import { getHeroSlot, getStoryPage } from "@/lib/stories";
import { IMAGES } from "@/lib/images";

const SLUG = "hifu-kings-cross";

export function generateMetadata(): Metadata {
  const page = getStoryPage(SLUG);
  if (!page) return {};
  const heroSlot = getHeroSlot(page);
  return {
    title: page.frontMatter.title,
    description: page.frontMatter.description,
    alternates: { canonical: `/${SLUG}/` },
    openGraph: { images: [IMAGES[heroSlot].fallback] },
  };
}

export default function Page() {
  const page = getStoryPage(SLUG);
  if (!page) notFound();
  return <StoryPage page={page} />;
}
