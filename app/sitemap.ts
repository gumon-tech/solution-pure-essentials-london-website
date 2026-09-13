import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/site";
import { getFamilyPages } from "@/lib/family-pages";
import { getStorySlugs } from "@/lib/stories";

// Static export (next.config.mjs: output "export"): every entry must be knowable at
// build time, no request-time data.
export const dynamic = "force-static";

/** Whether app/<route>/page.tsx exists in this checkout right now -- lets this file
 * work before and after the legal pages (privacy/terms, worked by another executor)
 * land, without importing anything from their files. */
function hasPage(route: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "app", route, "page.tsx"));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/` },
    { url: `${base}/treatments/` },
    { url: `${base}/contact/` },
    { url: `${base}/book-online/` },
  ];

  for (const page of getFamilyPages()) {
    entries.push({ url: `${base}/treatments/${page.slug}/` });
  }

  for (const slug of getStorySlugs()) {
    entries.push({ url: `${base}/${slug}/` });
  }

  if (hasPage("privacy")) {
    entries.push({ url: `${base}/privacy/` });
  }
  if (hasPage("terms")) {
    entries.push({ url: `${base}/terms/` });
  }

  return entries;
}
