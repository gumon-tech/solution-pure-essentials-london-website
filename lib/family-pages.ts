// View model for /treatments/<family>/ (queue row Q12): joins the PEL-approved copy
// in content/treatment-descriptions.md with lib/families.ts (which live cms row is
// which family) and the live priced booking rows in data/services.json (via
// lib/services.ts), at build time.
//
// A family gets a page only when both are true:
//  (a) it has a `## <slug>` section in content/treatment-descriptions.md that is not
//      under the file's `## held-back` heading, and
//  (b) that slug is a live row in data/services.json.
// lib/families.ts's own comment records that every FAMILIES entry is already a live
// cms row (24 live cms rows, checked 2026-09-13), so in practice (b) only re-confirms
// what (a) decides: a family with no section, or one listed under held-back, is left
// out. See docs/plans/Q12-family-pages-report.md (written by this row) for the built
// list and the 2 families skipped (aesthetics_1_emsculpt, aesthetics_body_carboxytherapy).
import fs from "node:fs";
import path from "node:path";
import { FAMILIES, type Family } from "./families";
import { liveServices, waLink } from "./services";
import { GROUPS, groupOf, type GroupId } from "./groups";
import { storyForCategory } from "./story-map";

export interface FamilyPriceRow {
  slug: string;
  name: string;
  duration: string | null;
  priceGbp: number | null;
  priceFrom: boolean;
  waHref: string;
  waAriaLabel: string;
}

export interface FamilyPage {
  slug: string;
  title: string;
  category: Family["category"];
  groupId: GroupId;
  groupLabel: string;
  /** The description text only, split on blank lines. Never the md file's sources list. */
  paragraphs: string[];
  /** This family's live priced rows, in lib/families.ts's `priced` order. */
  priced: FamilyPriceRow[];
}

const MD_PATH = path.join(process.cwd(), "content", "treatment-descriptions.md");

interface DescriptionSection {
  title: string;
  paragraphs: string[];
}

/** Parses content/treatment-descriptions.md into 1 section per `## <slug>` heading,
 * stopping at `## story-pages` (story pages are not families) so `## held-back` (a
 * plain bullet list, not `## <slug>` sections) is never reached or mistaken for one. */
function parseDescriptions(raw: string): Map<string, DescriptionSection> {
  const sections = new Map<string, DescriptionSection>();
  const lines = raw.split("\n");
  let i = 0;

  while (i < lines.length) {
    const header = /^##\s+(\S+)\s*$/.exec(lines[i]);
    if (!header) {
      i++;
      continue;
    }
    const slug = header[1];
    i++;

    if (slug === "story-pages" || slug === "held-back") {
      break;
    }

    const bodyLines: string[] = [];
    while (i < lines.length && !/^##\s+/.test(lines[i])) {
      bodyLines.push(lines[i]);
      i++;
    }

    let idx = 0;
    while (idx < bodyLines.length && bodyLines[idx].trim() === "") idx++;

    let title = slug;
    const titleMatch = /^title:\s*(.+)$/.exec(bodyLines[idx] ?? "");
    if (titleMatch) {
      title = titleMatch[1].trim();
      idx++;
    }
    while (idx < bodyLines.length && bodyLines[idx].trim() === "") idx++;

    const paragraphs: string[] = [];
    let current: string[] = [];
    while (idx < bodyLines.length && bodyLines[idx].trim() !== "sources:") {
      const line = bodyLines[idx];
      if (line.trim() === "") {
        if (current.length) {
          paragraphs.push(current.join(" ").trim());
          current = [];
        }
      } else {
        current.push(line.trim());
      }
      idx++;
    }
    if (current.length) paragraphs.push(current.join(" ").trim());

    sections.set(slug, { title, paragraphs });
  }

  return sections;
}

let cachedDescribed: FamilyPage[] | null = null;

/** Builds the view model of every described, live family. Cached for the life of the
 * build process: fs + JSON parsing runs once no matter how many callers
 * (generateStaticParams, every page's generateMetadata, every page's render) ask for it. */
function getDescribedFamilies(): FamilyPage[] {
  if (cachedDescribed) return cachedDescribed;

  const raw = fs.readFileSync(MD_PATH, "utf8");
  const sections = parseDescriptions(raw);
  const liveBySlug = new Map(liveServices().map((s) => [s.slug, s] as const));

  const pages: FamilyPage[] = [];
  for (const family of FAMILIES) {
    const section = sections.get(family.slug);
    if (!section) continue; // not described, or held-back
    if (!liveBySlug.has(family.slug)) continue; // defensive: family slug is not a live row

    const priced: FamilyPriceRow[] = [];
    for (const bookingSlug of family.priced) {
      const service = liveBySlug.get(bookingSlug);
      if (!service) continue; // defensive: only live priced rows render
      const name = service.display_name ?? service.name;
      priced.push({
        slug: service.slug,
        name,
        duration: service.duration,
        priceGbp: service.price_gbp,
        priceFrom: service.price_from,
        waHref: waLink(name, service.slug),
        waAriaLabel: `Ask about ${name} on WhatsApp`,
      });
    }

    const groupId = groupOf(family.category);
    pages.push({
      slug: family.slug,
      title: section.title,
      category: family.category,
      groupId,
      groupLabel: GROUPS.find((g) => g.id === groupId)?.label ?? "",
      paragraphs: section.paragraphs,
      priced,
    });
  }

  cachedDescribed = pages;
  return pages;
}

/** The built family pages. Queue row Q36 (owner decision 2026-09-13): a family whose
 * category has a story in lib/story-map.ts is no longer a page; its old path is a redirect
 * stub to that story (scripts/internal-redirects.json, written after next build). */
export function getFamilyPages(): FamilyPage[] {
  return getDescribedFamilies().filter((page) => !storyForCategory(page.category));
}

/** The described families retired into story `storySlug`, in lib/families.ts order. Their
 * approved description renders word for word on that story, each with a Service JSON-LD
 * node (PEL brief section 34, conditions 1 and 2). */
export function getStoryFamilies(storySlug: string): FamilyPage[] {
  return getDescribedFamilies().filter((page) => storyForCategory(page.category) === storySlug);
}

export function getFamilyPage(slug: string): FamilyPage | undefined {
  return getFamilyPages().find((p) => p.slug === slug);
}

/** Up to `limit` other family pages in the same category (first) or the same group
 * (to fill any remaining slots), in lib/families.ts's declared order. */
export function getRelatedFamilyPages(slug: string, limit = 3): FamilyPage[] {
  const pages = getFamilyPages();
  const current = pages.find((p) => p.slug === slug);
  if (!current) return [];

  const others = pages.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const sameGroupOnly = others.filter(
    (p) => p.category !== current.category && p.groupId === current.groupId,
  );

  return [...sameCategory, ...sameGroupOnly].slice(0, limit);
}
