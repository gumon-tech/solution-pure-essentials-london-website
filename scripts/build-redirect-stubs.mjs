#!/usr/bin/env node
// Queue row Q28: writes a static redirect stub for every old Wix URL in
// scripts/redirects.json that has a target. GitHub Pages cannot send 301s, so each old
// path gets out/<path>/index.html with a 0-second meta refresh, an absolute canonical,
// noindex and a plain visible link.
//
// Runs AFTER `next build`, straight into out/, so the stubs never enter Next's route
// tree or app/sitemap.ts. Dependency-free (Node 22, no npm packages).
//
// Refuses to overwrite: if a stub directory already holds an index.html that is not a
// stub from this script, or holds Next's index.txt, or out/<path>.html exists, it
// fails loudly and writes nothing. Re-running over its own stubs is allowed.
//
// Usage: node scripts/build-redirect-stubs.mjs [out-dir]   (default "out")

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const STUB_MARKER = "<!-- pweb-redirect-stub Q28 -->";

/** SITE.url from lib/site.ts, read as text (the one origin constant). */
export function siteOrigin() {
  const src = readFileSync("lib/site.ts", "utf8");
  const m = src.match(/url:\s*"(https:\/\/[^"]+)"/);
  if (!m) throw new Error("lib/site.ts: SITE.url not found");
  return m[1].replace(/\/+$/, "");
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function stubHtml(target, origin) {
  const t = escapeAttr(target);
  const abs = escapeAttr(origin + target);
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
${STUB_MARKER}
<title>Page moved | Pure Essentials London</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${t}">
<link rel="canonical" href="${abs}">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<p>This page has moved to <a href="${t}">${abs}</a>.</p>
</body>
</html>
`;
}

function main() {
  const outDir = process.argv[2] ?? "out";
  const map = JSON.parse(readFileSync("scripts/redirects.json", "utf8"));
  const origin = siteOrigin();
  const problems = [];
  const writes = [];

  if (!existsSync(path.join(outDir, "index.html"))) {
    problems.push(`${outDir}/index.html missing: run next build first`);
  }

  for (const e of map.entries) {
    if (!e.target) continue;
    if (!/^\/([^\s"<>]*\/)?$/.test(e.target)) {
      problems.push(`${e.old}: target "${e.target}" is not a site-relative path with a trailing slash`);
      continue;
    }
    const targetFile = path.join(outDir, e.target, "index.html");
    if (!existsSync(targetFile)) {
      problems.push(`${e.old}: target ${e.target} has no ${targetFile}`);
      continue;
    }
    if (!Array.isArray(e.stub_paths) || e.stub_paths.length === 0) {
      problems.push(`${e.old}: no stub_paths`);
      continue;
    }
    for (const sp of e.stub_paths) {
      const rel = sp.replace(/^\/+|\/+$/g, "");
      if (rel === "" || rel.split("/").some((seg) => seg === "" || seg === "." || seg === "..")) {
        problems.push(`${e.old}: unsafe stub path "${sp}"`);
        continue;
      }
      const dir = path.join(outDir, rel);
      const file = path.join(dir, "index.html");
      if (existsSync(path.join(dir, "index.txt"))) {
        problems.push(`${e.old}: ${dir} is a Next-built route (index.txt present); refusing to overwrite`);
        continue;
      }
      if (existsSync(`${dir}.html`)) {
        problems.push(`${e.old}: ${dir}.html exists; refusing to shadow it`);
        continue;
      }
      if (existsSync(file) && !readFileSync(file, "utf8").includes(STUB_MARKER)) {
        problems.push(`${e.old}: ${file} exists and is not a redirect stub; refusing to overwrite`);
        continue;
      }
      writes.push({ dir, file, html: stubHtml(e.target, origin), old: e.old, target: e.target });
    }
  }

  if (problems.length > 0) {
    console.error(`${problems.length} problem(s), 0 stubs written:`);
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
  }
  if (writes.length === 0) {
    console.error("0 stubs to write");
    process.exit(1);
  }

  for (const w of writes) {
    mkdirSync(w.dir, { recursive: true });
    writeFileSync(w.file, w.html);
  }
  const byRule = {};
  for (const e of map.entries) if (e.target) byRule[e.rule] = (byRule[e.rule] ?? 0) + 1;
  console.log(`origin: ${origin}`);
  console.log(`entries with a target: ${Object.values(byRule).reduce((a, b) => a + b, 0)} (by rule: ${JSON.stringify(byRule)})`);
  console.log(`stub files written: ${writes.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
