import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static export (next.config.mjs: output "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
