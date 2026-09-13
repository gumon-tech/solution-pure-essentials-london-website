#!/usr/bin/env node
// Verifies that the static export of /privacy/ and /terms/ contains, verbatim,
// every unit of the PEL-approved content/legal/*.md source:
//   - heading text (h1/h2/h3), checked whole (not sentence-split)
//   - paragraph and bullet-list text, sentence-split
//   - table cells (header + body), checked whole (not sentence-split)
// Plus hard checks that no raw markdown syntax ("#" heading markers, "|"
// table pipes) leaked into the rendered visible text, and that /privacy/
// renders exactly one <h3> per "### " line in privacy.md.
// Exits 1 if anything is missing, if any hard check fails, or if it found
// nothing to check at all.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATE_PLACEHOLDER = "[date to fill on publish]";

const DOCS = [
  { slug: "privacy", md: "content/legal/privacy.md", html: "out/privacy/index.html" },
  { slug: "terms", md: "content/legal/terms.md", html: "out/terms/index.html" },
];

function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^\n+/, "");
}

function splitTableRow(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((cell) => cell.trim());
}

// Same general heading rule as lib/legal.ts: count leading "#" characters.
// 1-3 supported; 4+ or a "#" run with no following space is a build error.
function parseHeading(line, slug) {
  const match = /^(#+)(.*)$/.exec(line);
  if (!match) return null;
  const hashes = match[1];
  const rest = match[2];
  if (hashes.length > 3) {
    throw new Error(`${slug}.md: heading "${line}" has ${hashes.length} "#" characters; only 1-3 are supported`);
  }
  if (!rest.startsWith(" ")) {
    throw new Error(`${slug}.md: heading "${line}" needs a space after the "#" characters`);
  }
  return { level: hashes.length, text: rest.trim() };
}

// Same block grammar as lib/legal.ts: #/##/### headings, blank-line-joined
// paragraphs, "- " bullet lists, and GFM pipe tables (header + separator +
// body rows). Returns { headings: string[], textBlocks: string[], tableCells:
// string[], h3Count: number }.
function parseUnits(body, slug) {
  const lines = body.split("\n");
  const headings = [];
  const textBlocks = [];
  const tableCells = [];
  let h3Count = 0;
  let paraBuf = [];
  let i = 0;

  const flushPara = () => {
    if (paraBuf.length > 0) {
      textBlocks.push(paraBuf.join(" "));
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
        headings.push(heading.text);
        if (heading.level === 3) h3Count++;
        i++;
        continue;
      }
    }

    if (line.startsWith("- ")) {
      flushPara();
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        textBlocks.push(lines[i].trim().slice(2).trim());
        i++;
      }
      continue;
    }
    if (line.startsWith("|")) {
      flushPara();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      if (rows.length < 3) {
        throw new Error(`${slug}.md: malformed table (expected header, separator and body rows)`);
      }
      const [header, separator, ...bodyRows] = rows;
      const isSeparator = separator.every((cell) => /^-+$/.test(cell));
      if (!isSeparator) {
        throw new Error(`${slug}.md: expected a "|---|" separator row after the table header`);
      }
      for (const cell of header) tableCells.push(cell);
      for (const row of bodyRows) {
        for (const cell of row) tableCells.push(cell);
      }
      continue;
    }

    paraBuf.push(line);
    i++;
  }
  flushPara();
  return { headings, textBlocks, tableCells, h3Count };
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(str) {
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, ent) => {
    if (ent[0] === "#") {
      const isHex = ent[1] === "x" || ent[1] === "X";
      const code = Number.parseInt(ent.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, ent) ? NAMED_ENTITIES[ent] : match;
  });
}

function collapseWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

// Tags are removed outright (not replaced with a space): adjacent inline
// elements such as an <a> link followed immediately by punctuation render
// with no space between them in the browser, and a sentence like
// "...info@pureessentialslondon.com." must still match verbatim.
//
// <head> is dropped entirely first: its <title> (e.g. "Website terms | Pure
// Essentials London") and <meta> tags are not visible page content, but they
// do contain literal "|" and other characters that would otherwise pollute
// the visible-text extraction used by the hard "#"/"|" checks below.
function visibleTextFromHtml(html) {
  const withoutHead = html.replace(/<head[\s\S]*?<\/head>/gi, "");
  const withoutScripts = withoutHead.replace(/<script[\s\S]*?<\/script>/gi, "");
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const withoutTags = withoutStyles.replace(/<[^>]+>/g, "");
  return collapseWhitespace(decodeEntities(withoutTags));
}

function countTag(html, tagName) {
  const re = new RegExp(`<${tagName}[\\s>]`, "gi");
  return (html.match(re) || []).length;
}

function main() {
  const buildDate = new Date().toISOString().slice(0, 10);

  let totalChecked = 0;
  let totalMissing = 0;
  let hadError = false;

  for (const doc of DOCS) {
    console.log(`== ${doc.slug} ==`);

    const mdPath = path.join(ROOT, doc.md);
    const htmlPath = path.join(ROOT, doc.html);

    if (!fs.existsSync(htmlPath)) {
      console.log(`  MISSING BUILD OUTPUT: ${doc.html}`);
      hadError = true;
      continue;
    }

    const raw = fs.readFileSync(mdPath, "utf8");
    const body = stripFrontmatter(raw).split(DATE_PLACEHOLDER).join(buildDate);
    const { headings, textBlocks, tableCells, h3Count } = parseUnits(body, doc.slug);

    const headingUnits = headings.map((h) => h.trim()).filter(Boolean);
    const sentences = textBlocks.flatMap(splitSentences);
    const cells = tableCells.map((c) => c.trim()).filter(Boolean);

    const html = fs.readFileSync(htmlPath, "utf8");
    const visibleText = visibleTextFromHtml(html);

    const missingHeadings = headingUnits.filter((h) => !visibleText.includes(collapseWhitespace(h)));
    const missingSentences = sentences.filter((s) => !visibleText.includes(collapseWhitespace(s)));
    const missingCells = cells.filter((c) => !visibleText.includes(collapseWhitespace(c)));

    console.log(`  headings checked: ${headingUnits.length}, missing: ${missingHeadings.length}`);
    if (missingHeadings.length > 0) {
      for (const h of missingHeadings) console.log(`    MISSING HEADING: ${h}`);
    }
    console.log(`  sentences checked: ${sentences.length}, missing: ${missingSentences.length}`);
    if (missingSentences.length > 0) {
      for (const s of missingSentences) console.log(`    MISSING SENTENCE: ${s}`);
    }
    console.log(`  table cells checked: ${cells.length}, missing: ${missingCells.length}`);
    if (missingCells.length > 0) {
      for (const c of missingCells) console.log(`    MISSING CELL: ${c}`);
    }

    // Hard check: no raw markdown syntax should leak into visible text.
    const hashCount = (visibleText.match(/#/g) || []).length;
    const pipeCount = (visibleText.match(/\|/g) || []).length;
    console.log(`  visible "#" characters: ${hashCount}, visible "|" characters: ${pipeCount}`);
    if (hashCount !== 0) {
      console.log(`    FAIL: expected 0 "#" characters in visible text, found ${hashCount}`);
      hadError = true;
    }
    if (pipeCount !== 0) {
      console.log(`    FAIL: expected 0 "|" characters in visible text, found ${pipeCount}`);
      hadError = true;
    }

    // Hard check (privacy only): <h3> count in the rendered HTML must equal
    // the number of "### " lines found in the source markdown.
    if (doc.slug === "privacy") {
      const h3InHtml = countTag(html, "h3");
      console.log(`  <h3> in HTML: ${h3InHtml}, "### " lines in source: ${h3Count}`);
      if (h3InHtml !== h3Count) {
        console.log(`    FAIL: expected ${h3Count} <h3> elements, found ${h3InHtml}`);
        hadError = true;
      }
    }

    totalChecked += headingUnits.length + sentences.length + cells.length;
    totalMissing += missingHeadings.length + missingSentences.length + missingCells.length;
  }

  console.log(`== total ==`);
  console.log(`units checked: ${totalChecked}, missing: ${totalMissing}`);

  if (hadError || totalMissing > 0 || totalChecked === 0) {
    process.exitCode = 1;
  }
}

main();
