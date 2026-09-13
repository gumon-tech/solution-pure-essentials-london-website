#!/usr/bin/env node
// Post-build check for queue row Q12 (one static page per approved treatment family,
// at /treatments/<family>/). Dependency-free (Node 22, no npm packages), in the style
// of scripts/validate-services.mjs: re-derives the expected family list and expected
// priced rows straight from content/treatment-descriptions.md, lib/families.ts and
// data/services.json (not by importing lib/family-pages.ts, which is a TypeScript
// module built as part of the Next.js app, not a plain Node script), then checks each
// built out/treatments/<slug>/index.html against that.
//
// For every expected family page, prints: slug, img count, priced rows expected vs
// found, wa.me links count, any held/review row names found (must be 0), any
// forbidden words found (must be 0), and any description sentence missing from the
// built HTML (must be none). Exits 1 on any failure, and exits 1 if it checked 0
// pages.
//
// Usage: node scripts/check-family-pages.mjs [out-dir]   (default "out")

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const FORBIDDEN_WORDS_RE = /botox|botulinum|anti-?wrinkle|lidocaine|include vat/gi;

function readText(p) {
  return readFileSync(p, "utf8");
}

// --- data/services.json --------------------------------------------------------

function loadServices() {
  const data = JSON.parse(readText("data/services.json"));
  return data.services;
}

// --- lib/families.ts (dependency-free parse: this is a read-only file for this
// row, so it is parsed as text rather than hand-edited or imported as TS) --------

function splitTopLevelBraceBlocks(text) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        blocks.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function stringField(block, name) {
  const m = block.match(new RegExp(`${name}:\\s*"([^"]*)"`));
  return m ? m[1] : null;
}

function pricedField(block) {
  const m = block.match(/priced:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((mm) => mm[1]);
}

function loadFamilies() {
  const src = readText("lib/families.ts");
  const arrayStart = src.indexOf("export const FAMILIES");
  if (arrayStart === -1) throw new Error("lib/families.ts: FAMILIES export not found");
  const body = src.slice(arrayStart);
  const blocks = splitTopLevelBraceBlocks(body);
  // The first brace block is the type annotation-free array itself only if we slice
  // from "[" -- simpler: every object literal in FAMILIES has a "slug" field, so
  // filter blocks down to those and ignore any incidental brace block that isn't one
  // (there are none in this file, but this keeps the parse honest either way).
  return blocks
    .map((block) => ({
      slug: stringField(block, "slug"),
      title: stringField(block, "title"),
      category: stringField(block, "category"),
      priced: pricedField(block),
    }))
    .filter((f) => f.slug !== null);
}

// --- content/treatment-descriptions.md ------------------------------------------

function parseDescriptions(raw) {
  const sections = new Map();
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
    if (slug === "story-pages" || slug === "held-back") break;

    const bodyLines = [];
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

    const paragraphs = [];
    let current = [];
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

function splitSentences(paragraph) {
  // Same boundary as app/treatments/[family]/page.tsx's firstSentence: ". " (a
  // period followed by a space). Keeps the trailing period on each sentence.
  const parts = paragraph.split(/(?<=\.)\s+/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

// --- HTML normalisation ----------------------------------------------------------

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

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function toSearchableText(html) {
  return normalizeWhitespace(decodeEntities(html));
}

// --- main --------------------------------------------------------------------

function main() {
  const outDir = process.argv[2] ?? "out";
  const problems = [];

  const services = loadServices();
  const liveBySlug = new Map(services.filter((s) => s.status === "live").map((s) => [s.slug, s]));
  const heldOrReviewNames = services
    .filter((s) => s.status === "held" || s.status === "review")
    .flatMap((s) => [s.name, s.display_name].filter((n) => typeof n === "string" && n.length > 0));

  const families = loadFamilies();
  const mdRaw = readText("content/treatment-descriptions.md");
  const sections = parseDescriptions(mdRaw);

  // Queue row Q36: families retired into their category story are redirect stubs, not
  // pages. The expected page list is derived, never hardcoded: described + live families,
  // minus the entries of scripts/internal-redirects.json (16 on 2026-09-13, leaving the 5
  // skin-laser pages).
  const internalMap = JSON.parse(readText("scripts/internal-redirects.json"));
  const retiredTargets = new Map(
    internalMap.entries
      .map((e) => [/^\/treatments\/([A-Za-z0-9_]+)$/.exec(e.old)?.[1], e.target])
      .filter(([slug]) => Boolean(slug)),
  );
  if (retiredTargets.size !== internalMap.entries.length) {
    problems.push("scripts/internal-redirects.json: every old path must be /treatments/<family slug>");
  }

  const expectedFamilies = [];
  const retiredFamilies = [];
  const skipped = [];
  for (const family of families) {
    const section = sections.get(family.slug);
    if (!section) {
      skipped.push(`${family.slug}: no description section (held-back, or missing)`);
      if (retiredTargets.has(family.slug)) problems.push(`${family.slug}: in internal-redirects.json but never had a page`);
      continue;
    }
    if (!liveBySlug.has(family.slug)) {
      skipped.push(`${family.slug}: not a live row in data/services.json`);
      if (retiredTargets.has(family.slug)) problems.push(`${family.slug}: in internal-redirects.json but never had a page`);
      continue;
    }
    if (retiredTargets.has(family.slug)) {
      retiredFamilies.push({
        slug: family.slug,
        target: retiredTargets.get(family.slug),
        title: section.title,
        paragraphs: section.paragraphs,
      });
      continue;
    }
    const priced = family.priced
      .map((slug) => liveBySlug.get(slug))
      .filter((s) => Boolean(s));
    expectedFamilies.push({
      slug: family.slug,
      title: section.title,
      paragraphs: section.paragraphs,
      priced,
    });
  }

  console.log(`expected family pages: ${expectedFamilies.length}`);
  if (skipped.length) {
    console.log(`families skipped (${skipped.length}):`);
    for (const s of skipped) console.log(`  - ${s}`);
  }
  console.log("");

  let pagesChecked = 0;

  for (const family of expectedFamilies) {
    const htmlPath = path.join(outDir, "treatments", family.slug, "index.html");
    console.log(`--- ${family.slug} ---`);

    if (!existsSync(htmlPath)) {
      problems.push(`${family.slug}: built file missing at ${htmlPath}`);
      console.log(`  MISSING: ${htmlPath}`);
      console.log("");
      continue;
    }

    pagesChecked++;
    const rawHtml = readText(htmlPath);
    const text = toSearchableText(rawHtml);

    const imgCount = (rawHtml.match(/<img[\s>]/gi) ?? []).length;
    const waLinksCount = (rawHtml.match(/wa\.me\//g) ?? []).length;

    const priceRowResults = family.priced.map((row) => {
      const name = row.display_name ?? row.name;
      const found =
        row.price_gbp === null
          ? text.includes(normalizeWhitespace(name))
          : text.includes(`£${row.price_gbp}`);
      return { slug: row.slug, name, found };
    });
    const pricedFoundCount = priceRowResults.filter((r) => r.found).length;
    const missingPriced = priceRowResults.filter((r) => !r.found);

    const foundHeldOrReview = heldOrReviewNames.filter((name) =>
      text.includes(normalizeWhitespace(name)),
    );
    const uniqueHeldOrReview = [...new Set(foundHeldOrReview)];

    const forbiddenMatches = [...text.matchAll(FORBIDDEN_WORDS_RE)].map((m) => m[0]);
    const uniqueForbidden = [...new Set(forbiddenMatches.map((m) => m.toLowerCase()))];

    const expectedSentences = family.paragraphs.flatMap(splitSentences);
    const missingSentences = expectedSentences.filter(
      (sentence) => !text.includes(normalizeWhitespace(sentence)),
    );

    console.log(`  title: ${family.title}`);
    console.log(`  img count: ${imgCount}`);
    console.log(
      `  priced rows: expected ${family.priced.length}, found ${pricedFoundCount}` +
        (missingPriced.length
          ? ` (missing: ${missingPriced.map((r) => `${r.slug} "${r.name}"`).join(", ")})`
          : ""),
    );
    console.log(`  wa.me links: ${waLinksCount}`);
    console.log(`  held/review row names present: ${uniqueHeldOrReview.length}`);
    if (uniqueHeldOrReview.length) console.log(`    ${uniqueHeldOrReview.join(", ")}`);
    console.log(`  forbidden words present: ${uniqueForbidden.length}`);
    if (uniqueForbidden.length) console.log(`    ${uniqueForbidden.join(", ")}`);
    console.log(
      `  description sentences: ${expectedSentences.length - missingSentences.length}/${expectedSentences.length} found`,
    );
    if (missingSentences.length) {
      console.log(`    missing:`);
      for (const s of missingSentences) console.log(`      - ${s}`);
    }
    console.log("");

    if (missingPriced.length > 0) {
      problems.push(
        `${family.slug}: priced row(s) not found: ${missingPriced.map((r) => r.slug).join(", ")}`,
      );
    }
    if (uniqueHeldOrReview.length > 0) {
      problems.push(`${family.slug}: held/review row name(s) present: ${uniqueHeldOrReview.join(", ")}`);
    }
    if (uniqueForbidden.length > 0) {
      problems.push(`${family.slug}: forbidden word(s) present: ${uniqueForbidden.join(", ")}`);
    }
    if (missingSentences.length > 0) {
      problems.push(`${family.slug}: description sentence(s) missing from built HTML`);
    }
  }

  console.log(`pages checked: ${pagesChecked}`);

  // Retired families: out/treatments/<slug>/index.html must be a redirect stub to the
  // story (written by scripts/build-redirect-stubs.mjs), with no page markup.
  const unknownRetired = [...retiredTargets.keys()].filter((slug) => !families.some((f) => f.slug === slug));
  for (const slug of unknownRetired) problems.push(`${slug}: in internal-redirects.json but not a family in lib/families.ts`);
  let retiredOk = 0;
  for (const r of retiredFamilies) {
    const htmlPath = path.join(outDir, "treatments", r.slug, "index.html");
    if (!existsSync(htmlPath)) {
      problems.push(`${r.slug}: retired family has no redirect stub at ${htmlPath} (run scripts/build-redirect-stubs.mjs)`);
      continue;
    }
    const html = readText(htmlPath);
    if (!html.includes("<!-- pweb-redirect-stub Q28 -->") || !html.includes(`content="0; url=${r.target}"`)) {
      problems.push(`${r.slug}: ${htmlPath} is not a redirect stub to ${r.target}`);
      continue;
    }
    if (/application\/ld\+json/.test(html)) {
      problems.push(`${r.slug}: redirect stub carries JSON-LD`);
      continue;
    }
    retiredOk++;
  }
  console.log(`retired families (redirect stubs): ${retiredFamilies.length}, stubs ok ${retiredOk}`);

  // PEL brief section 34 condition 1: nothing approved is lost. Each retired family's title
  // (as an h3) and every sentence of its description appear on its story page.
  let descriptionsLanded = 0;
  for (const r of retiredFamilies) {
    const storyPath = path.join(outDir, r.target.replace(/^\/+|\/+$/g, ""), "index.html");
    if (!existsSync(storyPath)) {
      problems.push(`${r.slug}: story page ${storyPath} missing`);
      continue;
    }
    const storyText = toSearchableText(readText(storyPath));
    const sentences = r.paragraphs.flatMap(splitSentences);
    const missing = sentences.filter((s) => !storyText.includes(normalizeWhitespace(s)));
    const titleFound = storyText.includes(`>${r.title}</h3>`);
    console.log(
      `  - ${r.slug} -> ${r.target}: h3 "${r.title}" ${titleFound ? "found" : "MISSING"}, description sentences ${sentences.length - missing.length}/${sentences.length}`,
    );
    for (const s of missing) console.log(`      missing: ${s}`);
    if (!titleFound) problems.push(`${r.slug}: h3 "${r.title}" not on ${r.target}`);
    if (missing.length > 0) problems.push(`${r.slug}: ${missing.length} description sentence(s) not on ${r.target}`);
    if (titleFound && missing.length === 0) descriptionsLanded++;
  }
  console.log(`retired descriptions found whole on their story: ${descriptionsLanded}/${retiredFamilies.length}`);

  // Queue row Q36: every id on /treatments/ is unique. Groups "body" and "laser" share their
  // names with categories, so category blocks and chips use "cat-<category>".
  const treatmentsPath = path.join(outDir, "treatments", "index.html");
  if (!existsSync(treatmentsPath)) {
    problems.push(`${treatmentsPath} missing`);
  } else {
    const ids = [...readText(treatmentsPath).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const counts = new Map();
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    const duplicates = [...counts].filter(([, n]) => n > 1);
    console.log(`/treatments/ ids: ${ids.length}, duplicated: ${duplicates.length}${duplicates.length ? ` ${JSON.stringify(duplicates)}` : ""}`);
    if (duplicates.length > 0) problems.push(`/treatments/ has duplicate id(s): ${duplicates.map(([id]) => id).join(", ")}`);
    for (const group of ["face", "body", "laser", "wellness"]) {
      if (!ids.includes(group)) problems.push(`/treatments/ group anchor #${group} missing`);
    }
  }

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
