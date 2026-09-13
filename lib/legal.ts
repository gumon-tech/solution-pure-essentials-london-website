import fs from "node:fs";
import path from "node:path";

// Renders content/legal/*.md verbatim. Supports only what those files use:
// `#`, `##` and `###` headings, paragraphs (consecutive lines joined with a
// space), `- ` bullet lists, GFM pipe tables (header row + separator row +
// body rows), and inline links written as bare email addresses or bare
// domains. This is PEL-approved legal text and must not be edited, reordered,
// or trimmed here.

export type LegalSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

export type LegalBlock =
  | { type: "h1"; segments: LegalSegment[] }
  | { type: "h2"; segments: LegalSegment[] }
  | { type: "h3"; segments: LegalSegment[] }
  | { type: "p"; segments: LegalSegment[] }
  | { type: "ul"; items: LegalSegment[][] }
  | { type: "table"; header: LegalSegment[][]; rows: LegalSegment[][][] };

type HeadingLevel = 1 | 2 | 3;

type RawBlock =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] };

const DATE_PLACEHOLDER = "[date to fill on publish]";
const HEADING_LEVEL_TYPE: Record<HeadingLevel, "h1" | "h2" | "h3"> = { 1: "h1", 2: "h2", 3: "h3" };

// Matches a bare email address, or a bare domain ending in a common TLD-ish
// label (optionally followed by a second label, e.g. "ico.org.uk"). Order
// matters: the email alternative is tried first so "user@example.com" is
// consumed whole rather than the regex re-matching "example.com" on its own.
const LINK_PATTERN =
  /([A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+)|(\b(?:[a-z0-9-]+\.)+(?:org|com|net|co)(?:\.[a-z]{2,})?\b)/gi;

function linkify(text: string): LegalSegment[] {
  const segments: LegalSegment[] = [];
  let lastIndex = 0;
  LINK_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const email = match[1];
    const domain = match[2];
    if (email) {
      segments.push({ type: "link", value: email, href: `mailto:${email}` });
    } else if (domain) {
      segments.push({ type: "link", value: domain, href: `https://${domain}` });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((cell) => cell.trim());
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^\n+/, "");
}

// General heading parser: counts leading "#" characters. 1-3 are supported
// (h1/h2/h3); 4 or more is a build error, as is a "#" run with no following
// space (e.g. "##Foo" or a stray "#" with no space at all).
function parseHeading(line: string, slug: string): { level: HeadingLevel; text: string } | null {
  const match = /^(#+)(.*)$/.exec(line);
  if (!match) return null;

  const hashes = match[1];
  const rest = match[2];

  if (hashes.length > 3) {
    throw new Error(
      `content/legal/${slug}.md: heading "${line}" has ${hashes.length} "#" characters; only 1-3 are supported`,
    );
  }
  if (!rest.startsWith(" ")) {
    throw new Error(
      `content/legal/${slug}.md: heading "${line}" needs a space after the "#" characters`,
    );
  }

  return { level: hashes.length as HeadingLevel, text: rest.trim() };
}

function parseBlocks(body: string, slug: string): RawBlock[] {
  const lines = body.split("\n");
  const blocks: RawBlock[] = [];
  let paraBuf: string[] = [];
  let i = 0;

  const flushPara = () => {
    if (paraBuf.length > 0) {
      blocks.push({ type: "p", text: paraBuf.join(" ") });
      paraBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === "") {
      flushPara();
      i++;
      continue;
    }

    if (line.startsWith("#")) {
      const heading = parseHeading(line, slug);
      if (heading) {
        flushPara();
        blocks.push({ type: HEADING_LEVEL_TYPE[heading.level], text: heading.text });
        i++;
        continue;
      }
    }

    if (line.startsWith("- ")) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (line.startsWith("|")) {
      flushPara();
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      if (rows.length < 3) {
        throw new Error(
          `content/legal/${slug}.md: malformed table (expected header, separator and at least one body row)`,
        );
      }
      const [header, separator, ...bodyRows] = rows;
      const isSeparator = separator.every((cell) => /^-+$/.test(cell));
      if (!isSeparator) {
        throw new Error(`content/legal/${slug}.md: expected a "|---|" separator row after the table header`);
      }
      blocks.push({ type: "table", header, rows: bodyRows });
      continue;
    }

    paraBuf.push(line);
    i++;
  }
  flushPara();
  return blocks;
}

function toLegalBlocks(raw: RawBlock[]): LegalBlock[] {
  return raw.map((block): LegalBlock => {
    switch (block.type) {
      case "h1":
      case "h2":
      case "h3":
      case "p":
        return { type: block.type, segments: linkify(block.text) };
      case "ul":
        return { type: "ul", items: block.items.map(linkify) };
      case "table":
        return {
          type: "table",
          header: block.header.map(linkify),
          rows: block.rows.map((row) => row.map(linkify)),
        };
    }
  });
}

export function getBuildDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getLegalDocument(slug: "privacy" | "terms"): LegalBlock[] {
  const filePath = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const body = stripFrontmatter(raw);
  const withDate = body.split(DATE_PLACEHOLDER).join(getBuildDate());

  if (withDate.includes("[")) {
    throw new Error(
      `content/legal/${slug}.md: an unresolved "[" placeholder remains after substituting the publish date`,
    );
  }

  const rawBlocks = parseBlocks(withDate, slug);
  return toLegalBlocks(rawBlocks);
}
