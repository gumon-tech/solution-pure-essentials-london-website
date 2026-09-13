#!/usr/bin/env node
// Post-build check for queue rows Q25/Q26/Q27 (11 storytelling landing pages rendered
// from content/stories/*.md: 8 in the strict 8-section grammar, 3 "set 3" pages in
// the flexible grammar -- see lib/stories.ts). Dependency-free (Node 22, no npm
// packages), in the style of scripts/check-family-pages.mjs -- but deliberately
// independent of lib/stories.ts: this is its own simple line-by-line reading of the
// markdown, so a bug shared by both the build-time parser and this check would not
// cancel itself out.
//
// For each of the 11 story files, checks its built out/<slug>/index.html:
//   - picture count vs `[image: ...]` line count (must match)
//   - every prose sentence (paragraphs, numbered-list text, faq questions and answers
//     -- never headings, table rows, image lines, button lines or front matter) is
//     found verbatim in the visible text
//   - every price-table row's slug has a wa.me link whose decoded text contains
//     "Ref: <SLUG UPPERCASED>", and the row's price (as written, or its £ form) appears
//     in the visible text
//   - every info-table row's cells (a table whose header's last column is not "Source
//     slug" -- e.g. set 3's "Day | Hours") appear verbatim in the visible text
//   - hard checks on the visible text: no leaked "#", "|", "[image", "Button (", "**",
//     "£ " + digit, "GBP ", "include VAT", or botox/botulinum/anti-wrinkle/lidocaine
//   - every visible link whose text contains "Treatwell" has an href starting with
//     https://www.treatwell.co.uk/ (fails if a page's md has a Treatwell button but 0
//     such links are found)
//   - the room-photo sentence ("The photographs in this section show treatment rooms
//     at Pure Essentials London.") appears only in a section whose every [image: ...]
//     is a real room slot (room-warm, room-trolley, room-analyser, room-couch)
//   - "we will not recommend a treatment that is not right for you" appears at most
//     once per page
//
// Exits 1 on any failure, and exits 1 if 0 pages were checked.
//
// Usage: node scripts/check-story-pages.mjs [out-dir]   (default "out")

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const FORBIDDEN_WORDS_RE = /botox|botulinum|anti-?wrinkle|lidocaine/gi;
const ROOM_PHOTO_SENTENCE = "The photographs in this section show treatment rooms at Pure Essentials London.";
const ROOM_SLOTS = new Set(["room-warm", "room-trolley", "room-analyser", "room-couch"]);
const RECOMMEND_SENTENCE_RE = /we will not recommend a treatment that is not right for you/g;

// The 8 storytelling pages built by queue rows Q25/Q26, in the strict 8-section
// grammar.
const STORY_SLUGS = [
  "hifu-kings-cross",
  "laser-hair-removal-kings-cross",
  "facials-kings-cross",
  "body-contouring-kings-cross",
  "massage-kings-cross",
  "waxing-kings-cross",
  "microneedling-peels-kings-cross",
  "skin-boosters-kings-cross",
];

// The 3 "set 3" storytelling pages built by queue row Q27, in the flexible grammar.
const STORY_SET3_SLUGS = ["our-clinic-kings-cross", "your-visit", "first-visit-guide"];

function readText(p) {
  return readFileSync(p, "utf8");
}

// --- markdown parsing (independent of lib/stories.ts) -----------------------------

function stripFrontMatter(raw) {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") return raw;
  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") i++;
  return lines.slice(i + 1).join("\n");
}

function splitTableRow(line) {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

// Splits a paragraph on a period followed by whitespace (same boundary used by
// app/treatments/[family]/page.tsx and scripts/check-family-pages.mjs), keeping the
// trailing period on each piece.
function splitSentences(text) {
  return text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

/** Parses one story markdown file (body only, front matter already stripped) into:
 *  - imageLineCount: number of `[image: slot]` lines
 *  - proseSentences: every sentence that must appear verbatim in the rendered page
 *  - priceRows: every {name, duration, price, slug} price-table data row
 *  - infoTableCells: every cell (verbatim) of every non-price table's data rows
 *  - hasTreatwellButton: whether any button line's text contains "Treatwell"
 *  - sections: every "## id" section in file order, with the image slots it holds and
 *    whether the room-photo sentence appears in its prose (for the room-photo rule)
 *  - recommendSentenceCount: occurrences of the "we will not recommend..." sentence */
function parseStoryMarkdown(body) {
  const lines = body.split("\n");
  let imageLineCount = 0;
  let hasTreatwellButton = false;
  const proseSentences = [];
  const priceRows = [];
  const infoTableCells = [];
  const sections = [];
  let currentSection = null;

  function section() {
    if (!currentSection) {
      currentSection = { id: "(before first heading)", imageSlots: [], hasRoomSentence: false };
      sections.push(currentSection);
    }
    return currentSection;
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      currentSection = { id: heading[1].trim(), imageSlots: [], hasRoomSentence: false };
      sections.push(currentSection);
      i++;
      continue;
    }
    const imgMatch = /^\[image: ([a-z0-9-]+)\]$/.exec(line);
    if (imgMatch) {
      imageLineCount++;
      section().imageSlots.push(imgMatch[1]);
      i++;
      continue;
    }
    const buttonMatch = /^- Button \((primary|secondary)\): (.+)$/.exec(line);
    if (buttonMatch) {
      if (buttonMatch[2].includes("Treatwell")) hasTreatwellButton = true;
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // First row is the header, second the separator; skip both, keep data rows.
      // A table is a price table iff its header's 4th column is literally "Source
      // slug" (mirrors lib/stories.ts's isPriceTableHeader) -- anything else is a
      // plain info table (set 3, e.g. "Day | Hours"): every cell must appear verbatim.
      const header = splitTableRow(tableLines[0] ?? "");
      const isPriceTable = header.length === 4 && header[3] === "Source slug";
      for (const row of tableLines.slice(2)) {
        const cells = splitTableRow(row);
        if (isSeparatorRow(cells)) continue;
        if (isPriceTable) {
          if (cells.length !== 4) continue;
          const [name, duration, price, slug] = cells;
          priceRows.push({ name, duration, price, slug });
        } else {
          for (const cell of cells) {
            if (cell) infoTableCells.push(cell);
          }
        }
      }
      continue;
    }

    let prose = line;
    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      prose = numbered[1];
    } else if (line.startsWith("- ")) {
      prose = line.slice(2);
    }
    prose = prose.replace(/\*\*/g, "").trim();
    if (prose) {
      if (prose.includes(ROOM_PHOTO_SENTENCE)) section().hasRoomSentence = true;
      proseSentences.push(...splitSentences(prose));
    }
    i++;
  }

  const recommendSentenceCount = (body.match(RECOMMEND_SENTENCE_RE) ?? []).length;

  return {
    imageLineCount,
    proseSentences,
    priceRows,
    infoTableCells,
    hasTreatwellButton,
    sections,
    recommendSentenceCount,
  };
}

// --- price format (mirrors lib/stories.ts's formatPrice, independently) -----------

function withThousandsSeparators(digits) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** The site's £ style for a price cell's literal markdown text, or null when the cell
 * isn't a GBP amount (e.g. "Ask for a quote", which is left to match itself). */
function poundForm(raw) {
  if (raw === "Ask for a quote") return null;
  const fromMatch = /^from GBP (\d+)$/.exec(raw);
  if (fromMatch) return `From £${withThousandsSeparators(fromMatch[1])}`;
  const plainMatch = /^GBP (\d+)$/.exec(raw);
  if (plainMatch) return `£${withThousandsSeparators(plainMatch[1])}`;
  return null;
}

// --- HTML normalisation -------------------------------------------------------------

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(html) {
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#39;|&apos;|&nbsp;/g, (m) => ENTITY_MAP[m]);
}

function stripHead(html) {
  return html.replace(/<head[\s\S]*?<\/head>/i, "");
}

function stripScriptsAndStyles(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ");
}

function toVisibleText(rawHtml) {
  const bodyOnly = stripScriptsAndStyles(stripHead(rawHtml));
  return normalizeWhitespace(decodeEntities(stripTags(bodyOnly)));
}

// --- wa.me link extraction ----------------------------------------------------------

function extractWaLinkDecodedTexts(rawHtml) {
  const hrefs = [...rawHtml.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)].map((m) => m[1]);
  return hrefs.map((href) => {
    try {
      return decodeURIComponent(href);
    } catch {
      return href;
    }
  });
}

/** Every <a href="...">visible text</a> in the built HTML, decoded and tag-stripped. */
function extractLinks(rawHtml) {
  return [...rawHtml.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: m[1],
    text: normalizeWhitespace(decodeEntities(stripTags(m[2]))),
  }));
}

// --- main ----------------------------------------------------------------------------

function main() {
  const outDir = process.argv[2] ?? "out";
  const storiesDir = "content/stories";
  const problems = [];

  const files = [...STORY_SLUGS, ...STORY_SET3_SLUGS].map((slug) => `${slug}.md`);

  console.log(`story files found: ${files.length}`);
  console.log("");

  let pagesChecked = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = readText(path.join(storiesDir, file));
    const body = stripFrontMatter(raw);
    const {
      imageLineCount,
      proseSentences,
      priceRows,
      infoTableCells,
      hasTreatwellButton,
      sections,
      recommendSentenceCount,
    } = parseStoryMarkdown(body);

    const htmlPath = path.join(outDir, slug, "index.html");
    console.log(`--- ${slug} ---`);

    if (!existsSync(htmlPath)) {
      problems.push(`${slug}: built file missing at ${htmlPath}`);
      console.log(`  MISSING: ${htmlPath}`);
      console.log("");
      continue;
    }

    pagesChecked++;
    const rawHtml = readText(htmlPath);
    const text = toVisibleText(rawHtml);

    const pictureCount = (rawHtml.match(/<picture[\s>]/gi) ?? []).length;
    console.log(`  pictures: ${pictureCount}, [image: ...] lines: ${imageLineCount}`);
    if (pictureCount !== imageLineCount) {
      problems.push(
        `${slug}: picture count (${pictureCount}) does not match [image: ...] line count (${imageLineCount})`,
      );
    }

    const missingSentences = proseSentences.filter(
      (sentence) => !text.includes(normalizeWhitespace(sentence)),
    );
    console.log(
      `  prose sentences: ${proseSentences.length - missingSentences.length}/${proseSentences.length} found`,
    );
    if (missingSentences.length) {
      console.log(`    missing:`);
      for (const s of missingSentences) console.log(`      - ${s}`);
      problems.push(`${slug}: prose sentence(s) missing from built HTML`);
    }

    const waLinkTexts = extractWaLinkDecodedTexts(rawHtml);
    const priceRowResults = priceRows.map((row) => {
      const refText = `Ref: ${row.slug.toUpperCase()}`;
      const hasRefLink = waLinkTexts.some((t) => t.includes(refText));
      const pound = poundForm(row.price);
      const priceFound =
        text.includes(normalizeWhitespace(row.price)) || (pound !== null && text.includes(normalizeWhitespace(pound)));
      return { ...row, hasRefLink, priceFound };
    });
    const badRows = priceRowResults.filter((r) => !r.hasRefLink || !r.priceFound);
    console.log(`  price rows: ${priceRows.length}, ok ${priceRows.length - badRows.length}`);
    if (badRows.length) {
      for (const r of badRows) {
        console.log(
          `    - ${r.slug}: wa.me Ref link ${r.hasRefLink ? "OK" : "MISSING"}, price "${r.price}" ${
            r.priceFound ? "OK" : "MISSING"
          }`,
        );
      }
      problems.push(`${slug}: price row(s) failed (missing Ref link or price text)`);
    }

    const missingInfoCells = infoTableCells.filter((cell) => !text.includes(normalizeWhitespace(cell)));
    console.log(
      `  info table cells: ${infoTableCells.length - missingInfoCells.length}/${infoTableCells.length} found`,
    );
    if (missingInfoCells.length) {
      console.log(`    missing:`);
      for (const c of missingInfoCells) console.log(`      - ${c}`);
      problems.push(`${slug}: info table cell(s) missing from built HTML`);
    }

    const roomSentenceViolations = sections.filter(
      (s) => s.hasRoomSentence && !s.imageSlots.every((slot) => ROOM_SLOTS.has(slot)),
    );
    console.log(
      `  room-photo sentence: appears in section(s) [${sections
        .filter((s) => s.hasRoomSentence)
        .map((s) => s.id)
        .join(", ")}], ${roomSentenceViolations.length === 0 ? "OK" : "VIOLATED"}`,
    );
    if (roomSentenceViolations.length) {
      for (const s of roomSentenceViolations) {
        console.log(`    - section "${s.id}" has non-room image slot(s): ${s.imageSlots.join(", ")}`);
      }
      problems.push(`${slug}: room-photo sentence present in section(s) with a non-room image`);
    }

    console.log(
      `  "we will not recommend..." sentence: ${recommendSentenceCount} occurrence(s)` +
        (recommendSentenceCount <= 1 ? " (OK)" : " (VIOLATED, expected at most 1)"),
    );
    if (recommendSentenceCount > 1) {
      problems.push(
        `${slug}: "we will not recommend a treatment that is not right for you" appears ${recommendSentenceCount} times, expected at most 1`,
      );
    }

    const hardChecks = [
      { label: '"#"', re: /#/ },
      { label: '"|"', re: /\|/ },
      { label: '"[image"', re: /\[image/ },
      { label: '"Button ("', re: /Button \(/ },
      { label: '"**"', re: /\*\*/ },
      { label: '"£ " + digit', re: /£ \d/ },
      { label: '"GBP "', re: /GBP / },
      { label: '"include VAT"', re: /include VAT/ },
      { label: "botox/botulinum/anti-wrinkle/lidocaine", re: FORBIDDEN_WORDS_RE },
    ];
    const hardFailures = [];
    for (const check of hardChecks) {
      const matches = [...text.matchAll(new RegExp(check.re, check.re.flags.includes("g") ? check.re.flags : check.re.flags + "g"))];
      if (matches.length > 0) {
        hardFailures.push(`${check.label}: ${matches.length} occurrence(s)`);
      }
    }
    console.log(`  hard checks: ${hardChecks.length - hardFailures.length}/${hardChecks.length} clean`);
    if (hardFailures.length) {
      for (const f of hardFailures) console.log(`    - ${f}`);
      problems.push(`${slug}: hard check(s) failed: ${hardFailures.join("; ")}`);
    }

    const treatwellLinks = extractLinks(rawHtml).filter((l) => l.text.includes("Treatwell"));
    const treatwellLinksOk = treatwellLinks.filter((l) => l.href.startsWith("https://www.treatwell.co.uk/"));
    console.log(
      `  Treatwell links: ${treatwellLinksOk.length}/${treatwellLinks.length} with a treatwell.co.uk href` +
        (hasTreatwellButton ? " (md has a Treatwell button)" : " (md has no Treatwell button)"),
    );
    if (treatwellLinks.length !== treatwellLinksOk.length) {
      const bad = treatwellLinks.filter((l) => !l.href.startsWith("https://www.treatwell.co.uk/"));
      for (const l of bad) console.log(`    - "${l.text}" -> ${l.href}`);
      problems.push(`${slug}: Treatwell-labelled link(s) not pointing at https://www.treatwell.co.uk/`);
    }
    if (hasTreatwellButton && treatwellLinksOk.length === 0) {
      problems.push(`${slug}: md has a Treatwell button but 0 matching links found in built HTML`);
    }

    console.log("");
  }

  console.log(`pages checked: ${pagesChecked}`);

  if (pagesChecked === 0) {
    problems.push("0 pages were checked");
  }

  if (problems.length > 0) {
    console.error(`${problems.length} problem(s) found:`);
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
  }

  console.log("OK: no problems found");
  process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
