// Build-time parser for the storytelling landing pages (queue rows Q25/Q26).
//
// Reads the 8 PEL-approved copy files in content/stories/*.md straight off disk (no
// caching between requests matters here: this only ever runs at `next build` time,
// for a fully static export) and turns each into a StoryPage: front matter plus an
// ordered list of sections, each holding an ordered list of blocks.
//
// The parser is deliberately strict: content/stories/*.md is approved copy (read-only
// for this row -- see the executor brief), so any line it does not recognise is a
// build error, not a best-effort guess. That is what lets StoryPage.tsx render every
// file the same way without a single per-file special case.
import fs from "node:fs";
import path from "node:path";
import { IMAGES, type ImageSlot } from "@/lib/images";
import { waLink, liveServices, type Service } from "@/lib/services";
import { SITE, waSite } from "@/lib/site";

export interface StoryFrontMatter {
  title: string;
  description: string;
  h1: string;
}

export interface StoryPriceRow {
  /** The "Treatment" column, exactly as written in the markdown. */
  name: string;
  /** The "Duration" column, exactly as written (e.g. "1 hr 45 min", "ask"). */
  duration: string;
  /** The "Price" column, converted to the site's £ style (e.g. "£450", "From £350"); "Ask for
   * a quote" passes through unchanged. See formatPrice() below. */
  price: string;
  /** The "Source slug" column -- data/services.json's slug for this row. Not rendered. */
  slug: string;
  waHref: string;
}

export interface StoryButton {
  label: string;
  href: string;
  /** True for a link that must open in a new tab (WhatsApp, Treatwell); false for an
   * in-site Next Link (e.g. to /treatments/). */
  external: boolean;
}

export type StoryBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "image"; slot: ImageSlot }
  | { kind: "numbered-list"; items: { lead: string; rest: string }[] }
  | { kind: "bullet-list"; items: string[] }
  | { kind: "buttons"; primary: StoryButton; secondary: StoryButton }
  | { kind: "table"; rows: StoryPriceRow[] }
  | { kind: "faq-item"; question: string; answer: string };

export interface StorySection {
  id: (typeof SECTION_ORDER)[number];
  blocks: StoryBlock[];
}

export interface StoryPage {
  slug: string;
  frontMatter: StoryFrontMatter;
  sections: StorySection[];
}

const SECTION_ORDER = [
  "hero",
  "what-it-is",
  "who-it-may-suit",
  "your-visit",
  "prices",
  "aftercare",
  "faq",
  "call-to-action",
] as const;

const TREATMENTS_HREF = "/treatments/";

function storyRef(slug: string): string {
  return `STORY-${slug.toUpperCase().replace(/-/g, "_")}`;
}

function withThousandsSeparators(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Converts a price cell's literal markdown text to the site's £ style: "GBP 450" ->
 * "£450", "from GBP 350" -> "From £350" (thousands separators added, e.g. "GBP 1300"
 * -> "£1,300"). "Ask for a quote" passes through unchanged. Throws on anything else. */
function formatPrice(raw: string, slug: string): string {
  if (raw === "Ask for a quote") return raw;
  const fromMatch = /^from GBP (\d+)$/.exec(raw);
  if (fromMatch) {
    return `From £${withThousandsSeparators(fromMatch[1])}`;
  }
  const plainMatch = /^GBP (\d+)$/.exec(raw);
  if (plainMatch) {
    return `£${withThousandsSeparators(plainMatch[1])}`;
  }
  throw new Error(`${slug}: price cell not recognised: ${JSON.stringify(raw)}`);
}

// --- front matter ----------------------------------------------------------------

function parseFrontMatter(raw: string, slug: string): { frontMatter: StoryFrontMatter; rest: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") {
    throw new Error(`${slug}: expected front matter to open with "---"`);
  }
  const fields: Record<string, string> = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i];
    const m = /^(\w+):\s*"(.*)"$/.exec(line);
    if (!m) {
      throw new Error(`${slug}: front matter line not recognised: ${JSON.stringify(line)}`);
    }
    fields[m[1]] = m[2];
    i++;
  }
  if (lines[i]?.trim() !== "---") {
    throw new Error(`${slug}: front matter never closed with "---"`);
  }
  i++;
  for (const key of ["title", "description", "h1"]) {
    if (!(key in fields)) {
      throw new Error(`${slug}: front matter missing "${key}"`);
    }
  }
  return {
    frontMatter: { title: fields.title, description: fields.description, h1: fields.h1 },
    rest: lines.slice(i).join("\n"),
  };
}

// --- section splitting -------------------------------------------------------------

function splitSections(body: string, slug: string): Map<string, string[]> {
  const lines = body.split("\n");
  const sections = new Map<string, string[]>();
  let current: string | null = null;
  let buf: string[] = [];

  for (const line of lines) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      if (current) sections.set(current, buf);
      current = heading[1].trim();
      buf = [];
      continue;
    }
    if (current) {
      buf.push(line);
    } else if (line.trim() !== "") {
      throw new Error(`${slug}: content before the first "## " section header: ${JSON.stringify(line)}`);
    }
  }
  if (current) sections.set(current, buf);

  const ids = [...sections.keys()];
  const expected = [...SECTION_ORDER];
  const matches = ids.length === expected.length && expected.every((id, idx) => ids[idx] === id);
  if (!matches) {
    throw new Error(
      `${slug}: sections must be exactly ${expected.join(", ")} in that order; found ${ids.join(", ")}`,
    );
  }
  return sections;
}

// --- table parsing -----------------------------------------------------------------

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function parseTable(tableLines: string[], slug: string, servicesBySlug: Map<string, Service>): StoryPriceRow[] {
  if (tableLines.length < 2) {
    throw new Error(`${slug}: table has no header/separator row: ${JSON.stringify(tableLines)}`);
  }
  const header = splitTableRow(tableLines[0]);
  const sep = splitTableRow(tableLines[1]);
  if (header.length !== 4) {
    throw new Error(`${slug}: table header must have 4 columns, got ${header.length}: ${JSON.stringify(header)}`);
  }
  if (header[3] !== "Source slug") {
    throw new Error(`${slug}: table's 4th column must be "Source slug", got ${JSON.stringify(header[3])}`);
  }
  if (!isSeparatorRow(sep) || sep.length !== 4) {
    throw new Error(`${slug}: table separator row malformed: ${JSON.stringify(tableLines[1])}`);
  }

  return tableLines.slice(2).map((line) => {
    const cells = splitTableRow(line);
    if (cells.length !== 4) {
      throw new Error(`${slug}: table row must have 4 columns, got ${cells.length}: ${JSON.stringify(line)}`);
    }
    const [name, duration, price, rowSlug] = cells;
    const service = servicesBySlug.get(rowSlug);
    if (!service) {
      throw new Error(`${slug}: table row slug ${JSON.stringify(rowSlug)} is not a live row in data/services.json`);
    }
    const waName = service.display_name ?? service.name;
    return {
      name,
      duration,
      price: formatPrice(price, slug),
      slug: rowSlug,
      waHref: waLink(waName, rowSlug),
    };
  });
}

// --- block parsing -----------------------------------------------------------------

function parseBlocks(
  lines: string[],
  sectionId: string,
  slug: string,
  servicesBySlug: Map<string, Service>,
): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i++;
      continue;
    }

    if (sectionId === "faq") {
      const question = /^\*\*(.+)\*\*$/.exec(lines[i]);
      if (!question) {
        throw new Error(`${slug} [faq]: expected a bold question line, got ${JSON.stringify(lines[i])}`);
      }
      i++;
      const answerLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^\*\*(.+)\*\*$/.test(lines[i])) {
        answerLines.push(lines[i].trim());
        i++;
      }
      if (answerLines.length === 0) {
        throw new Error(`${slug} [faq]: question ${JSON.stringify(question[1])} has no answer line`);
      }
      blocks.push({ kind: "faq-item", question: question[1], answer: answerLines.join(" ") });
      continue;
    }

    const imgMatch = /^\[image: ([a-z0-9-]+)\]$/.exec(lines[i]);
    if (imgMatch) {
      const slotName = imgMatch[1];
      if (!(slotName in IMAGES)) {
        throw new Error(`${slug}: image slot ${JSON.stringify(slotName)} is not a key of IMAGES in lib/images.ts`);
      }
      blocks.push({ kind: "image", slot: slotName as ImageSlot });
      i++;
      continue;
    }

    if (lines[i].startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push({ kind: "table", rows: parseTable(tableLines, slug, servicesBySlug) });
      continue;
    }

    if (/^\d+\.\s/.test(lines[i])) {
      const items: { lead: string; rest: string }[] = [];
      let n = 1;
      while (i < lines.length && new RegExp(`^${n}\\.\\s`).test(lines[i])) {
        const m = new RegExp(`^${n}\\.\\s+\\*\\*([^*]+)\\*\\*\\s*(.*)$`).exec(lines[i]);
        if (!m) {
          throw new Error(`${slug}: numbered list item ${n} missing a **bold** lead-in: ${JSON.stringify(lines[i])}`);
        }
        items.push({ lead: m[1], rest: m[2].trim() });
        i++;
        n++;
      }
      if (items.length !== 3) {
        throw new Error(`${slug}: numbered list must have exactly 3 items, found ${items.length}`);
      }
      blocks.push({ kind: "numbered-list", items });
      continue;
    }

    if (lines[i].startsWith("- ")) {
      const bulletLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        bulletLines.push(lines[i]);
        i++;
      }
      const buttonMatches = bulletLines.map((l) => /^- Button \((primary|secondary)\): (.+)$/.exec(l));
      if (buttonMatches.every((m) => m !== null)) {
        const primaryMatch = buttonMatches.find((m) => m![1] === "primary");
        const secondaryMatch = buttonMatches.find((m) => m![1] === "secondary");
        if (!primaryMatch || !secondaryMatch || bulletLines.length !== 2) {
          throw new Error(
            `${slug}: expected exactly one primary and one secondary button line, got ${JSON.stringify(bulletLines)}`,
          );
        }
        const secondaryLabel = secondaryMatch[2];
        const secondaryIsTreatwell = secondaryLabel.includes("Treatwell");
        blocks.push({
          kind: "buttons",
          primary: { label: primaryMatch[2], href: waSite(storyRef(slug)), external: true },
          secondary: {
            label: secondaryLabel,
            href: secondaryIsTreatwell ? SITE.treatwell : TREATMENTS_HREF,
            external: secondaryIsTreatwell,
          },
        });
      } else {
        blocks.push({ kind: "bullet-list", items: bulletLines.map((l) => l.slice(2).trim()) });
      }
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\[image: /.test(lines[i]) &&
      !lines[i].startsWith("|") &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith("- ")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length === 0) {
      throw new Error(`${slug}: line not recognised: ${JSON.stringify(lines[i])}`);
    }
    blocks.push({ kind: "paragraph", text: paraLines.join(" ") });
  }

  return blocks;
}

// --- whole-file parse ---------------------------------------------------------------

function parseStoryFile(filePath: string, slug: string, servicesBySlug: Map<string, Service>): StoryPage {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontMatter, rest } = parseFrontMatter(raw, slug);
  const sectionLines = splitSections(rest, slug);

  const sections: StorySection[] = SECTION_ORDER.map((id) => ({
    id,
    blocks: parseBlocks(sectionLines.get(id) ?? [], id, slug, servicesBySlug),
  }));

  return { slug, frontMatter, sections };
}

// The 8 storytelling pages this row builds (queue rows Q25/Q26). content/stories/ is
// shared with other executors' in-progress drafts (e.g. "your-visit.md",
// "first-visit-guide.md", "our-clinic-kings-cross.md" -- not part of this row and not
// written to this 8-section grammar), so this list is explicit rather than a glob of
// every "*.md" in the directory: a glob would break the build the moment one of those
// drafts landed on main (as it did -- see HANDOFF/queue history for this row).
const STORY_SLUGS = [
  "hifu-kings-cross",
  "laser-hair-removal-kings-cross",
  "facials-kings-cross",
  "body-contouring-kings-cross",
  "massage-kings-cross",
  "waxing-kings-cross",
  "microneedling-peels-kings-cross",
  "skin-boosters-kings-cross",
] as const;

let cache: StoryPage[] | null = null;

function loadAll(): StoryPage[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "content/stories");
  const servicesBySlug = new Map(liveServices().map((s) => [s.slug, s]));
  cache = STORY_SLUGS.map((slug) => parseStoryFile(path.join(dir, `${slug}.md`), slug, servicesBySlug));
  return cache;
}

export function getStorySlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

export function getStoryPages(): StoryPage[] {
  return loadAll();
}

export function getStoryPage(slug: string): StoryPage | undefined {
  return loadAll().find((p) => p.slug === slug);
}

/** The hero section's image slot: always its first block, used for openGraph. */
export function getHeroSlot(page: StoryPage): ImageSlot {
  const hero = page.sections.find((s) => s.id === "hero");
  const first = hero?.blocks[0];
  if (!first || first.kind !== "image") {
    throw new Error(`${page.slug}: hero section must start with an [image: ...] block`);
  }
  return first.slot;
}
