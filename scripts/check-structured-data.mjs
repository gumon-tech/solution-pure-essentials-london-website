#!/usr/bin/env node
// Post-build check for queue row Q18 part 1 (site-level clinic JSON-LD on the home
// and contact pages). Dependency-free (Node 22, no npm packages), in the style of
// scripts/check-family-pages.mjs: re-derives the expected address, opening hours,
// email and price range straight from lib/site.ts and data/services.json (parsed as
// plain text/JSON here, not by importing lib/structured-data.ts, which is a
// TypeScript module built as part of the Next.js app, not a plain Node script), then
// checks every application/ld+json block found in the built HTML against that.
//
// For each of out/index.html and out/contact/index.html: parses every
// application/ld+json block, prints @type, name, address fields, opening hours
// entries, priceRange and identifier, and fails on a JSON parse error or on any key
// named telephone/geo/aggregateRating/review anywhere in the block. Across both
// pages, fails if 0 blocks were found, or if address parts / hours / email / price
// range min and max do not match the site's own source files. Also counts
// application/ld+json blocks in out/treatments/aesthetics_1_hifu/index.html and
// expects exactly 2 (unchanged family-page markup: BreadcrumbList + Service).
//
// Usage: node scripts/check-structured-data.mjs [out-dir]   (default "out")

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const FORBIDDEN_KEYS = new Set(["telephone", "geo", "aggregaterating", "review"]);

function readText(p) {
  return readFileSync(p, "utf8");
}

// --- lib/site.ts (read-only for this row: parsed as text, not imported, since this
// is a plain Node script with no TypeScript loader) -------------------------------

function stringField(src, name) {
  const m = new RegExp(`${name}:\\s*"([^"]*)"`).exec(src);
  if (!m) throw new Error(`lib/site.ts: field "${name}" not found`);
  return m[1];
}

function loadSite() {
  const src = readText("lib/site.ts");

  const address = stringField(src, "address");
  const email = stringField(src, "email");

  const hoursBlockMatch = /hours:\s*\[([\s\S]*?)\n\s*\],/.exec(src);
  if (!hoursBlockMatch) throw new Error("lib/site.ts: hours array not found");
  const hours = [...hoursBlockMatch[1].matchAll(/\{\s*days:\s*"([^"]*)",\s*time:\s*"([^"]*)"\s*\}/g)].map(
    (m) => ({ days: m[1], time: m[2] }),
  );

  const companyBlockMatch = /company:\s*\{([\s\S]*?)\n\s*\},/.exec(src);
  if (!companyBlockMatch) throw new Error("lib/site.ts: company block not found");
  const companyBlock = companyBlockMatch[1];
  const legalName = stringField(companyBlock, "legalName");
  const number = stringField(companyBlock, "number");

  return { address, email, hours, company: { legalName, number } };
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const UK_POSTCODE_RE = /([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})\s*$/i;

function expandDays(days) {
  if (ALL_DAYS.includes(days)) return [days];
  const rangeMatch = /^(\w+) to (\w+)$/.exec(days);
  if (rangeMatch) {
    const startIndex = ALL_DAYS.indexOf(rangeMatch[1]);
    const endIndex = ALL_DAYS.indexOf(rangeMatch[2]);
    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      return ALL_DAYS.slice(startIndex, endIndex + 1);
    }
  }
  throw new Error(`lib/site.ts: day range "${days}" not recognised`);
}

// Expected values, derived from lib/site.ts's own text -- independent re-derivation
// of the same rules lib/structured-data.ts implements.
function expectedFromSite(site) {
  const [streetAddress, localityAndPostcode] = site.address.split(",").map((p) => p.trim());
  const postcodeMatch = UK_POSTCODE_RE.exec(localityAndPostcode);
  if (!postcodeMatch) throw new Error(`SITE.address "${site.address}": no UK postcode found`);
  const postalCode = postcodeMatch[1];
  const addressLocality = localityAndPostcode.slice(0, postcodeMatch.index).trim();

  const openingHours = site.hours
    .filter((row) => !/bank holiday/i.test(row.days))
    .map((row) => {
      const [opens, closes] = row.time.split(" to ").map((t) => t.trim());
      const days = expandDays(row.days);
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days.length === 1 ? days[0] : days,
        opens,
        closes,
      };
    });

  return {
    streetAddress,
    addressLocality,
    postalCode,
    addressCountry: "GB",
    email: site.email,
    openingHours,
    legalName: site.company.legalName,
    identifierValue: site.company.number,
  };
}

// --- data/services.json ----------------------------------------------------------

function loadPriceRange() {
  const data = JSON.parse(readText("data/services.json"));
  const live = data.services.filter((s) => s.status === "live" && typeof s.price_gbp === "number");
  if (live.length === 0) throw new Error("data/services.json: no live, priced services found");
  let min = live[0];
  let max = live[0];
  for (const s of live) {
    if (s.price_gbp < min.price_gbp) min = s;
    if (s.price_gbp > max.price_gbp) max = s;
  }
  const format = (n) => `£${n.toLocaleString("en-GB")}`;
  return {
    priceRange: `${format(min.price_gbp)} to ${format(max.price_gbp)}`,
    min,
    max,
  };
}

// --- HTML: extract every application/ld+json block --------------------------------

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(m[1]);
  }
  return blocks;
}

// Recursively collects lowercase key names anywhere in a parsed JSON-LD object.
function collectKeys(node, out) {
  if (node && typeof node === "object") {
    if (Array.isArray(node)) {
      for (const item of node) collectKeys(item, out);
    } else {
      for (const [key, value] of Object.entries(node)) {
        out.add(key.toLowerCase());
        collectKeys(value, out);
      }
    }
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function main() {
  const outDir = process.argv[2] ?? "out";
  const problems = [];

  const site = loadSite();
  const expected = expectedFromSite(site);
  const priceExpected = loadPriceRange();

  console.log("== expected (from lib/site.ts and data/services.json) ==");
  console.log(`  address: streetAddress="${expected.streetAddress}", addressLocality="${expected.addressLocality}", postalCode="${expected.postalCode}", addressCountry="${expected.addressCountry}"`);
  console.log(`  email: ${expected.email}`);
  console.log(`  opening hours: ${JSON.stringify(expected.openingHours)}`);
  console.log(`  priceRange: ${priceExpected.priceRange} (min slug: ${priceExpected.min.slug} £${priceExpected.min.price_gbp}, max slug: ${priceExpected.max.slug} £${priceExpected.max.price_gbp})`);
  console.log(`  legalName: ${expected.legalName}`);
  console.log(`  identifier value (Companies House number): ${expected.identifierValue}`);
  console.log("");

  const pages = [
    { name: "home", html: path.join(outDir, "index.html") },
    { name: "contact", html: path.join(outDir, "contact", "index.html") },
  ];

  let totalBlocks = 0;

  for (const page of pages) {
    console.log(`== ${page.name} (${page.html}) ==`);
    if (!existsSync(page.html)) {
      console.log(`  MISSING BUILD OUTPUT: ${page.html}`);
      problems.push(`${page.name}: built file missing at ${page.html}`);
      continue;
    }
    const html = readText(page.html);
    const rawBlocks = extractJsonLdBlocks(html);
    console.log(`  application/ld+json blocks found: ${rawBlocks.length}`);
    totalBlocks += rawBlocks.length;

    if (rawBlocks.length === 0) {
      problems.push(`${page.name}: 0 application/ld+json blocks found`);
      continue;
    }

    rawBlocks.forEach((raw, i) => {
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        console.log(`  BLOCK ${i}: JSON PARSE ERROR: ${err.message}`);
        problems.push(`${page.name} block ${i}: JSON parse error: ${err.message}`);
        return;
      }

      console.log(`  -- block ${i} --`);
      console.log(`    @type: ${JSON.stringify(parsed["@type"])}`);
      console.log(`    name: ${JSON.stringify(parsed.name)}`);
      console.log(`    address: ${JSON.stringify(parsed.address)}`);
      console.log(`    openingHoursSpecification: ${JSON.stringify(parsed.openingHoursSpecification)}`);
      console.log(`    priceRange: ${JSON.stringify(parsed.priceRange)}`);
      console.log(`    identifier: ${JSON.stringify(parsed.identifier)}`);

      const foundKeys = new Set();
      collectKeys(parsed, foundKeys);
      const forbiddenFound = [...foundKeys].filter((k) => FORBIDDEN_KEYS.has(k));
      if (forbiddenFound.length > 0) {
        console.log(`    FAIL: forbidden key(s) present: ${forbiddenFound.join(", ")}`);
        problems.push(`${page.name} block ${i}: forbidden key(s) present: ${forbiddenFound.join(", ")}`);
      }

      // Only the clinic block (has an "address" field) is checked against
      // lib/site.ts / data/services.json below; other blocks (there should be none
      // on these two pages) are reported but not compared.
      if (!parsed.address) return;

      const addr = parsed.address;
      if (
        addr.streetAddress !== expected.streetAddress ||
        addr.addressLocality !== expected.addressLocality ||
        addr.postalCode !== expected.postalCode ||
        addr.addressCountry !== expected.addressCountry
      ) {
        problems.push(
          `${page.name} block ${i}: address mismatch (expected ${JSON.stringify(expected)}, got ${JSON.stringify(addr)})`,
        );
      }
      if (parsed.email !== expected.email) {
        problems.push(`${page.name} block ${i}: email mismatch (expected "${expected.email}", got "${JSON.stringify(parsed.email)}")`);
      }
      if (!deepEqual(parsed.openingHoursSpecification, expected.openingHours)) {
        problems.push(
          `${page.name} block ${i}: openingHoursSpecification mismatch (expected ${JSON.stringify(expected.openingHours)}, got ${JSON.stringify(parsed.openingHoursSpecification)})`,
        );
      }
      if (parsed.priceRange !== priceExpected.priceRange) {
        problems.push(
          `${page.name} block ${i}: priceRange mismatch (expected "${priceExpected.priceRange}", got "${JSON.stringify(parsed.priceRange)}")`,
        );
      }
      if (parsed.legalName !== expected.legalName) {
        problems.push(`${page.name} block ${i}: legalName mismatch (expected "${expected.legalName}", got "${JSON.stringify(parsed.legalName)}")`);
      }
      if (!parsed.identifier || parsed.identifier.value !== expected.identifierValue || parsed.identifier.propertyID !== "Companies House") {
        problems.push(
          `${page.name} block ${i}: identifier mismatch (expected {propertyID: "Companies House", value: "${expected.identifierValue}"}, got ${JSON.stringify(parsed.identifier)})`,
        );
      }
    });
    console.log("");
  }

  console.log(`total application/ld+json blocks (home + contact): ${totalBlocks}`);
  if (totalBlocks === 0) {
    problems.push("0 application/ld+json blocks found across home and contact");
  }
  console.log("");

  // Family page markup must be unchanged: still exactly 2 blocks (BreadcrumbList +
  // Service), per components/FamilyPage.tsx.
  const familyHtmlPath = path.join(outDir, "treatments", "aesthetics_1_hifu", "index.html");
  console.log(`== family page unchanged check (${familyHtmlPath}) ==`);
  if (!existsSync(familyHtmlPath)) {
    console.log(`  MISSING BUILD OUTPUT: ${familyHtmlPath}`);
    problems.push(`family page missing: ${familyHtmlPath}`);
  } else {
    const familyHtml = readText(familyHtmlPath);
    const familyBlocks = extractJsonLdBlocks(familyHtml);
    console.log(`  application/ld+json blocks found: ${familyBlocks.length} (expected 2)`);
    if (familyBlocks.length !== 2) {
      problems.push(`aesthetics_1_hifu: expected 2 application/ld+json blocks, found ${familyBlocks.length}`);
    }
  }
  console.log("");

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
