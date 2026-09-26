#!/usr/bin/env node
// Post-build check for queue row Q42 section C (owner's order 2026-09-26): every heading,
// button, menu item and button-styled link on the built site is in Title Case.
// Dependency-free (Node 22, no npm packages), in the style of the other check scripts.
//
// For every out/**/*.html it collects the visible text of:
//   - h1 to h6, button and summary elements
//   - every link inside a nav element (header and footer menus)
//   - every link styled as a button (class contains "pill", the site's one button class)
// and fails on any string that is not already in Title Case under the rule below. Strings
// over 90 characters are ignored (they are sentences, not labels). <script>, <style> and
// <svg> content is stripped first.
//
// The rule is an independent copy of lib/titleCase.ts (the function the site renders
// with); a disagreement between the two shows up here as a failure. Keep them in step.
//
// Usage: node scripts/check-title-case.mjs [out-dir]   (default "out")
//        node scripts/check-title-case.mjs --count [out-dir]   (print counts, always exit 0)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const MAX_LENGTH = 90;

// --- the rule (copy of lib/titleCase.ts) ----------------------------------------------

const MINOR_WORDS = new Set([
  "a", "an", "the", "and", "or", "nor", "but", "of", "in", "on", "at", "to", "for", "by",
  "with", "per", "from", "via", "vs", "as",
]);
const UNITS = new Set(["mins", "min", "minutes", "hr", "hrs", "hour", "hours", "ml", "cm", "mm", "nm"]);
const KEPT_SPELLINGS = { "q-switch": "Q-switch" };
const LEADING = /^[("'“‘[]+/;
const TRAILING = /[)"'”’\],.:;?!]+$/;

function hasLetter(s) {
  return /[A-Za-z]/.test(s);
}

function formatPart(part, isEdge) {
  if (!hasLetter(part)) return part;
  if (/^\d/.test(part)) return part;
  if (/[A-Z]/.test(part.slice(1))) return part;
  const lower = part.toLowerCase();
  if (UNITS.has(lower) && part === lower) return part;
  if (!isEdge && MINOR_WORDS.has(lower)) return lower;
  return part.slice(0, 1).toUpperCase() + part.slice(1);
}

function formatCore(core, isFirst, isLast) {
  const kept = KEPT_SPELLINGS[core.toLowerCase()];
  if (kept) return kept;
  const pieces = core.split(/([-/])/);
  const partIdx = pieces.map((p, i) => (i % 2 === 0 && hasLetter(p) ? i : -1)).filter((i) => i >= 0);
  const firstPart = partIdx[0];
  const lastPart = partIdx[partIdx.length - 1];
  return pieces
    .map((p, i) => {
      if (i % 2 === 1) return p;
      const edge = (isFirst && i === firstPart) || (isLast && i === lastPart);
      return formatPart(p, edge);
    })
    .join("");
}

export function titleCase(input) {
  const tokens = input.split(/(\s+)/);
  const wordIdx = tokens.map((t, i) => (i % 2 === 0 && hasLetter(t) ? i : -1)).filter((i) => i >= 0);
  if (wordIdx.length === 0) return input;
  const lastWord = wordIdx[wordIdx.length - 1];
  let startsPhrase = true;
  return tokens
    .map((token, i) => {
      if (i % 2 === 1 || token === "") return token;
      if (!hasLetter(token)) {
        if (/^[-–—:]$/.test(token)) startsPhrase = true;
        return token;
      }
      const lead = LEADING.exec(token)?.[0] ?? "";
      const rest = token.slice(lead.length);
      const trail = TRAILING.exec(rest)?.[0] ?? "";
      const core = rest.slice(0, rest.length - trail.length);
      const out = lead + formatCore(core, startsPhrase, i === lastWord) + trail;
      startsPhrase = /:$/.test(trail);
      return out;
    })
    .join("");
}

// --- HTML -----------------------------------------------------------------------------

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
};

function decodeEntities(s) {
  return s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITY_MAP[m] ?? m);
}

function visible(fragment) {
  return decodeEntities(fragment.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function clean(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");
}

/** Every label string on one page, with the kind of element it came from. */
function labelsOf(rawHtml) {
  const html = clean(rawHtml);
  const out = [];
  for (const m of html.matchAll(/<(h[1-6]|button|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    out.push({ kind: m[1].toLowerCase(), text: visible(m[2]) });
  }
  for (const nav of html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)) {
    for (const a of nav[1].matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
      out.push({ kind: "nav a", text: visible(a[1]) });
    }
  }
  for (const a of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const cls = /\sclass="([^"]*)"/.exec(a[1])?.[1] ?? "";
    if (/(^|\s)pill(\s|$)/.test(cls)) out.push({ kind: "button link", text: visible(a[2]) });
  }
  return out.filter((l) => hasLetter(l.text) && l.text.length <= MAX_LENGTH);
}

function htmlFiles(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) files.push(...htmlFiles(p));
    else if (name.endsWith(".html")) files.push(p);
  }
  return files.sort();
}

function main() {
  const args = process.argv.slice(2);
  const countOnly = args.includes("--count");
  const outDir = args.find((a) => !a.startsWith("--")) ?? "out";
  if (!existsSync(outDir)) {
    console.error(`${outDir} not found: run next build first`);
    process.exit(1);
  }

  const files = htmlFiles(outDir);
  const all = new Set();
  const bad = new Map(); // text -> { expected, pages:Set, kinds:Set }
  for (const file of files) {
    const page = "/" + path.relative(outDir, file).replace(/index\.html$/, "");
    for (const { kind, text } of labelsOf(readFileSync(file, "utf8"))) {
      all.add(text);
      const expected = titleCase(text);
      if (expected === text) continue;
      const entry = bad.get(text) ?? { expected, pages: new Set(), kinds: new Set() };
      entry.pages.add(page);
      entry.kinds.add(kind);
      bad.set(text, entry);
    }
  }

  console.log(`html files: ${files.length}`);
  console.log(`distinct heading, button and menu strings: ${all.size}`);
  console.log(`not in Title Case: ${bad.size}`);
  for (const [text, e] of [...bad].sort((a, b) => a[0].localeCompare(b[0]))) {
    const pages = [...e.pages];
    console.log(
      `  - [${[...e.kinds].join(", ")}] "${text}" -> "${e.expected}" (${pages.length} page(s), e.g. ${pages[0]})`,
    );
  }

  if (files.length === 0) {
    console.error("0 html files checked");
    process.exit(1);
  }
  if (!countOnly && bad.size > 0) {
    console.error(`${bad.size} string(s) not in Title Case`);
    process.exit(1);
  }
  if (!countOnly) console.log("OK: no problems found");
  process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
