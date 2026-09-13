#!/usr/bin/env node
// Dependency-free validator for data/services.json (Node 22, no npm packages, no ajv).
// Checks the rules in data/services.schema.json by hand, plus slug uniqueness and
// category cross-references, then prints counts. Exit 0 when clean, exit 1 otherwise
// with every problem listed.
//
// Usage: node scripts/validate-services.mjs [path-to-json]   (default data/services.json)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REQUIRED_TOP_KEYS = ["_about", "currency", "categories", "services"];
const REQUIRED_CATEGORY_KEYS = ["id", "title"];
const REQUIRED_SERVICE_KEYS = [
  "slug",
  "name",
  "category",
  "status",
  "price_gbp",
  "price_from",
  "duration",
  "source",
  "note",
];
const STATUS_ENUM = ["live", "held", "review"];
// The "held" sentinel is not one of the 11 real category ids in `categories`, but every
// held-status row in the real file uses it as its category (verified 2026-09-13: all 59
// held rows, no exception) instead of a real category id. Treated as always-valid here
// so the real file validates; see the $comment in data/services.schema.json.
const HELD_SENTINEL = "held";

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function main() {
  const inputPath = process.argv[2] ?? "data/services.json";
  const problems = [];

  let raw;
  try {
    raw = readFileSync(inputPath, "utf8");
  } catch (err) {
    console.error(`Cannot read ${inputPath}: ${err.message}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`JSON syntax error in ${inputPath}: ${err.message}`);
    process.exit(1);
  }

  // --- top level ---
  if (!isPlainObject(data)) {
    problems.push("top level: must be an object");
    report(problems);
    return;
  }

  for (const key of REQUIRED_TOP_KEYS) {
    if (!(key in data)) problems.push(`top level: missing required key "${key}"`);
  }
  for (const key of Object.keys(data)) {
    if (!REQUIRED_TOP_KEYS.includes(key)) {
      problems.push(`top level: unknown key "${key}" (additionalProperties: false)`);
    }
  }
  if ("_about" in data && typeof data._about !== "string") {
    problems.push("top level: _about must be a string");
  }
  if ("currency" in data && typeof data.currency !== "string") {
    problems.push("top level: currency must be a string");
  }

  const categories = Array.isArray(data.categories) ? data.categories : [];
  if (!Array.isArray(data.categories)) {
    problems.push("top level: categories must be an array");
  }
  const services = Array.isArray(data.services) ? data.services : [];
  if (!Array.isArray(data.services)) {
    problems.push("top level: services must be an array");
  }

  // --- categories ---
  const categoryIds = new Set();
  categories.forEach((cat, i) => {
    const where = `categories[${i}]`;
    if (!isPlainObject(cat)) {
      problems.push(`${where}: must be an object`);
      return;
    }
    for (const key of REQUIRED_CATEGORY_KEYS) {
      if (!(key in cat)) problems.push(`${where}: missing required key "${key}"`);
    }
    for (const key of Object.keys(cat)) {
      if (!REQUIRED_CATEGORY_KEYS.includes(key)) {
        problems.push(`${where}: unknown key "${key}" (additionalProperties: false)`);
      }
    }
    if ("id" in cat && typeof cat.id !== "string") problems.push(`${where}: id must be a string`);
    if ("title" in cat && typeof cat.title !== "string") {
      problems.push(`${where}: title must be a string`);
    }
    if (typeof cat.id === "string") categoryIds.add(cat.id);
  });

  const validCategoryIds = new Set([...categoryIds, HELD_SENTINEL]);

  // --- services ---
  const slugCounts = new Map();
  let liveCount = 0;
  let heldCount = 0;
  let reviewCount = 0;
  let livePricedCount = 0;
  let liveNoPriceCount = 0;

  services.forEach((svc, i) => {
    const where = `services[${i}]`;
    if (!isPlainObject(svc)) {
      problems.push(`${where}: must be an object`);
      return;
    }

    for (const key of REQUIRED_SERVICE_KEYS) {
      if (!(key in svc)) problems.push(`${where} (${svc.slug ?? "?"}): missing required key "${key}"`);
    }
    for (const key of Object.keys(svc)) {
      if (!REQUIRED_SERVICE_KEYS.includes(key)) {
        problems.push(`${where} (${svc.slug ?? "?"}): unknown key "${key}" (additionalProperties: false)`);
      }
    }

    const tag = svc.slug ?? `${where}`;

    if ("slug" in svc) {
      if (typeof svc.slug !== "string") {
        problems.push(`${where}: slug must be a string`);
      } else {
        slugCounts.set(svc.slug, (slugCounts.get(svc.slug) ?? 0) + 1);
      }
    }
    if ("name" in svc && typeof svc.name !== "string") {
      problems.push(`${tag}: name must be a string`);
    }
    if ("category" in svc) {
      if (typeof svc.category !== "string") {
        problems.push(`${tag}: category must be a string`);
      } else if (!validCategoryIds.has(svc.category)) {
        problems.push(
          `${tag}: category "${svc.category}" is not one of the categories ids (or "held")`,
        );
      }
    }
    if ("status" in svc) {
      if (typeof svc.status !== "string" || !STATUS_ENUM.includes(svc.status)) {
        problems.push(`${tag}: status must be one of ${STATUS_ENUM.join(", ")}`);
      }
    }
    if ("price_gbp" in svc && svc.price_gbp !== null && typeof svc.price_gbp !== "number") {
      problems.push(`${tag}: price_gbp must be a number or null`);
    }
    if ("price_from" in svc && typeof svc.price_from !== "boolean") {
      problems.push(`${tag}: price_from must be a boolean`);
    }
    if ("duration" in svc && svc.duration !== null && typeof svc.duration !== "string") {
      problems.push(`${tag}: duration must be a string or null`);
    }
    if ("source" in svc && typeof svc.source !== "string") {
      problems.push(`${tag}: source must be a string`);
    }
    if ("note" in svc && typeof svc.note !== "string") {
      problems.push(`${tag}: note must be a string`);
    }

    if (svc.status === "live") {
      liveCount++;
      if (svc.price_gbp === null || svc.price_gbp === undefined) {
        liveNoPriceCount++;
      } else {
        livePricedCount++;
      }
    } else if (svc.status === "held") {
      heldCount++;
    } else if (svc.status === "review") {
      reviewCount++;
    }
  });

  for (const [slug, count] of slugCounts) {
    if (count > 1) problems.push(`duplicate slug "${slug}": appears ${count} times`);
  }

  console.log(`total ${services.length}`);
  console.log(`live ${liveCount}`);
  console.log(`held ${heldCount}`);
  console.log(`review ${reviewCount}`);
  console.log(`live priced ${livePricedCount}`);
  console.log(`live without price ${liveNoPriceCount}`);

  report(problems);
}

function report(problems) {
  if (problems.length === 0) {
    console.log("OK: no problems found");
    process.exit(0);
  }
  console.error(`${problems.length} problem(s) found:`);
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}

// Only run when executed directly (not when imported), so it stays a plain module too.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
