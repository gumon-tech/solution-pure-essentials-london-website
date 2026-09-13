#!/usr/bin/env node
// Post-build check for queue row Q28 (redirect stubs for old Wix URLs). Dependency-free
// (Node 22, no npm packages). Run after `next build` and scripts/build-redirect-stubs.mjs.
// Deliberately does not import the build script: it re-derives what a stub must contain.
//
// Asserts:
//   - every map entry with a target has out/<stub_path>index.html holding exactly
//     <meta http-equiv="refresh" content="0; url=TARGET">,
//     <link rel="canonical" href="<SITE.url>TARGET">, <meta name="robots" content="noindex">,
//     a <title> and <a href="TARGET">
//   - the target is a real built page (out/TARGET/index.html, not itself a stub)
//   - a stub directory is not a Next-built route (no index.txt) and is not in sitemap.xml
//   - rule cross-checks against data/services.json: service-page and CMS entries have a
//     target only when their row is live; product, shop and consent entries never do
//   - entries with no stub have no out/<path>/index.html, except "same-path" entries,
//     which must be Next-built pages
//   - the number of stub files found anywhere in out/ equals the number expected
// Exits 1 on any failure, and exits 1 if 0 stubs were checked.
//
// Usage: node scripts/check-redirect-stubs.mjs [out-dir]   (default "out")

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const MARKER = "<!-- pweb-redirect-stub Q28 -->";

function siteOrigin() {
  const m = readFileSync("lib/site.ts", "utf8").match(/url:\s*"(https:\/\/[^"]+)"/);
  if (!m) throw new Error("lib/site.ts: SITE.url not found");
  return m[1].replace(/\/+$/, "");
}

function relDir(p) {
  return p.replace(/^\/+|\/+$/g, "");
}

function candidateDirs(old) {
  const dirs = new Set([relDir(old)]);
  if (/%2F/i.test(old)) dirs.add(relDir(old.replace(/%2F/gi, "/")));
  return [...dirs];
}

function walkStubs(dir, found) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== "_next") walkStubs(full, found);
    } else if (ent.name === "index.html" && readFileSync(full, "utf8").includes(MARKER)) {
      found.push(full);
    }
  }
}

function main() {
  const outDir = process.argv[2] ?? "out";
  const origin = siteOrigin();
  const map = JSON.parse(readFileSync("scripts/redirects.json", "utf8"));
  const services = new Map(JSON.parse(readFileSync("data/services.json", "utf8")).services.map((s) => [s.slug, s]));
  const problems = [];

  const sitemapPath = path.join(outDir, "sitemap.xml");
  const sitemapPaths = new Set();
  if (!existsSync(sitemapPath)) {
    problems.push(`${sitemapPath} missing`);
  } else {
    for (const m of readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapPaths.add(relDir(new URL(m[1]).pathname));
    }
  }

  const stubsByRule = {};
  const noStubByKind = {};
  let stubFilesChecked = 0;

  for (const e of map.entries) {
    const segs = e.old.split("/").filter(Boolean);

    // Rule cross-checks against the data file.
    if (segs[0] === "service-page" || ["aesthetics-1", "aesthetics-body", "facials-1", "injections"].includes(segs[0])) {
      const row = services.get(e.row_slug);
      if (!row) {
        problems.push(`${e.old}: row_slug "${e.row_slug}" not in data/services.json`);
      } else if ((row.status === "live") !== Boolean(e.target)) {
        problems.push(`${e.old}: row ${e.row_slug} status ${row.status} but target ${e.target}`);
      }
    }
    if ((segs[0] === "product-page" || e.old === "/shop" || /consent-form/.test(e.old)) && e.target) {
      problems.push(`${e.old}: product, shop or consent path must have no stub`);
    }

    if (!e.target) {
      noStubByKind[e.no_stub] = (noStubByKind[e.no_stub] ?? 0) + 1;
      for (const d of candidateDirs(e.old)) {
        const f = path.join(outDir, d, "index.html");
        if (e.no_stub === "same-path") {
          if (!existsSync(f) || readFileSync(f, "utf8").includes(MARKER)) {
            problems.push(`${e.old}: same-path entry but ${f} is not a Next-built page`);
          }
        } else if (existsSync(f)) {
          problems.push(`${e.old}: no stub expected (${e.no_stub}) but ${f} exists`);
        }
      }
      continue;
    }

    stubsByRule[e.rule] = (stubsByRule[e.rule] ?? 0) + 1;
    const targetFile = path.join(outDir, relDir(e.target), "index.html");
    if (!/^\/([^\s"<>]*\/)?$/.test(e.target)) problems.push(`${e.old}: target "${e.target}" lacks a leading and trailing slash`);
    if (!existsSync(targetFile)) {
      problems.push(`${e.old}: target ${e.target} not built (${targetFile} missing)`);
    } else if (readFileSync(targetFile, "utf8").includes(MARKER)) {
      problems.push(`${e.old}: target ${e.target} is itself a redirect stub`);
    }

    const expectedDirs = candidateDirs(e.old);
    if (JSON.stringify([...(e.stub_paths ?? [])].map(relDir).sort()) !== JSON.stringify([...expectedDirs].sort())) {
      problems.push(`${e.old}: stub_paths ${JSON.stringify(e.stub_paths)} do not match expected ${JSON.stringify(expectedDirs)}`);
    }

    const refresh = `<meta http-equiv="refresh" content="0; url=${e.target}">`;
    const canonical = `<link rel="canonical" href="${origin}${e.target}">`;
    for (const d of expectedDirs) {
      const dir = path.join(outDir, d);
      const f = path.join(dir, "index.html");
      if (!existsSync(f)) {
        problems.push(`${e.old}: ${f} missing`);
        continue;
      }
      stubFilesChecked++;
      const html = readFileSync(f, "utf8");
      if (!html.includes(MARKER)) problems.push(`${f}: not a redirect stub (marker missing)`);
      if ((html.match(/http-equiv="refresh"/g) ?? []).length !== 1 || !html.includes(refresh)) {
        problems.push(`${f}: expected exactly ${refresh}`);
      }
      if ((html.match(/rel="canonical"/g) ?? []).length !== 1 || !html.includes(canonical)) {
        problems.push(`${f}: expected exactly ${canonical}`);
      }
      if (!html.includes('<meta name="robots" content="noindex">')) problems.push(`${f}: noindex missing`);
      if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${f}: title missing`);
      if (!html.includes(`<a href="${e.target}">`)) problems.push(`${f}: visible fallback link missing`);
      if (/<script/i.test(html)) problems.push(`${f}: contains a script`);
      if (existsSync(path.join(dir, "index.txt"))) problems.push(`${e.old}: ${dir} is a Next-built route (index.txt)`);
      if (sitemapPaths.has(d)) problems.push(`${e.old}: stub path ${d} is in sitemap.xml`);
    }
  }

  const found = [];
  if (existsSync(outDir)) walkStubs(outDir, found);
  if (found.length !== stubFilesChecked) {
    problems.push(`stub files in ${outDir}: ${found.length}, expected ${stubFilesChecked} (orphan or missing stubs)`);
  }
  const sitemapStubHits = [...sitemapPaths].filter((p) =>
    map.entries.some((e) => e.target && (e.stub_paths ?? []).some((sp) => relDir(sp) === p)),
  ).length;

  const stubEntries = Object.values(stubsByRule).reduce((a, b) => a + b, 0);
  console.log(`origin: ${origin}`);
  console.log(`map entries: ${map.entries.length}`);
  console.log(`entries with a stub: ${stubEntries} by rule ${JSON.stringify(stubsByRule)}`);
  console.log(`stub files checked: ${stubFilesChecked}; stub files found in ${outDir}: ${found.length}`);
  console.log(`entries with no stub: ${map.entries.length - stubEntries} by reason ${JSON.stringify(noStubByKind)}`);
  console.log(`sitemap.xml URLs: ${sitemapPaths.size}; stub paths in sitemap: ${sitemapStubHits}`);

  if (stubFilesChecked === 0) problems.push("0 stubs checked");
  if (problems.length > 0) {
    console.error(`${problems.length} problem(s) found:`);
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
  }
  console.log("OK: no problems found");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
