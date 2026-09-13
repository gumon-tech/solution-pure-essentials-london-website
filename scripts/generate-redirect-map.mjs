// One-off generator for scripts/redirects.json (queue row Q28). Run from the site repo root
// after a fresh `npm run build` (it reads out/ to know which family pages are built):
//   node <this file> <urls.txt> <inventory.tsv> > scripts/redirects.json
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const [urlsFile, invFile] = process.argv.slice(2);
const ORIGIN = "https://www.pureessentialslondon.com";
const urls = readFileSync(urlsFile, "utf8").trim().split("\n").map((u) => u.trim());
const inv = readFileSync(invFile, "utf8").trim().split("\n").slice(1).map((l) => {
  const [source, slug, name] = l.split("\t");
  return { source, slug, name };
});
const data = JSON.parse(readFileSync("data/services.json", "utf8"));
const bySlug = new Map(data.services.map((s) => [s.slug, s]));
// A redirect stub (scripts/build-redirect-stubs.mjs) is not a built page. Queue row Q36
// retired 16 family pages into their category story, so an old URL must go straight to the
// story, never to the family stub (no double hop).
const STUB_MARKER = "<!-- pweb-redirect-stub Q28 -->";
const built = (p) => {
  const f = path.join("out", p, "index.html");
  return existsSync(f) && !readFileSync(f, "utf8").includes(STUB_MARKER);
};
const internalRedirects = new Map(
  JSON.parse(readFileSync("scripts/internal-redirects.json", "utf8")).entries.map((e) => [e.old, e.target]),
);

// lib/families.ts parsed as text: booking slug -> family slug (priced membership).
const famSrc = readFileSync("lib/families.ts", "utf8").slice(readFileSync("lib/families.ts", "utf8").indexOf("export const FAMILIES"));
const familyOfBooking = new Map();
for (const m of famSrc.matchAll(/slug:\s*"([^"]+)"[^}]*?priced:\s*\[([^\]]*)\]/g)) {
  for (const p of m[2].matchAll(/"([^"]+)"/g)) {
    if (familyOfBooking.has(p[1])) throw new Error("booking row in 2 families: " + p[1]);
    familyOfBooking.set(p[1], m[1]);
  }
}

// Category story pages for rule 3 rows without a family page (PEL ruling 2026-09-13).
// laser and carboxy have no story page and stay on /treatments/.
const CATEGORY_STORY = {
  "waxing-ladies": "/waxing-kings-cross/",
  "waxing-men": "/waxing-kings-cross/",
  massage: "/massage-kings-cross/",
  skin: "/microneedling-peels-kings-cross/",
  skinboosters: "/skin-boosters-kings-cross/",
  hifu: "/hifu-kings-cross/",
  hair: "/laser-hair-removal-kings-cross/",
  body: "/body-contouring-kings-cross/",
  facials: "/facials-kings-cross/",
};

const SHOP = "owner decision pending on the shop (gap report S3, question 5); PEL ruling Q28: no stub";
const CONSENT = "consent form, waiting for the clinic (gap report question 6); PEL ruling Q28 rule 4: no stub";
// docs/research/04-old-site-gap.md section 7, ordinary paths (rule 2). [target, note, no_stub_kind]
const STATIC = {
  "/": [null, "same path as the built home page out/index.html", "same-path"],
  "/contact": [null, "same path as the built page out/contact/index.html", "same-path"],
  "/about": ["/our-clinic-kings-cross/"],
  "/pricing": ["/treatments/"],
  "/services": ["/treatments/"],
  "/book-online": [null, "same path as the built page out/book-online/index.html (owner decision 2026-09-13: Treatwell widget page)", "same-path"],
  "/offers": ["/our-clinic-kings-cross/"],
  "/aesthetics": ["/treatments/"],
  "/face": ["/treatments/"],
  "/body": ["/body-contouring-kings-cross/"],
  "/injectables": ["/skin-boosters-kings-cross/"],
  "/facials": ["/facials-kings-cross/"],
  "/beauty": ["/treatments/"],
  "/massage": ["/massage-kings-cross/"],
  "/waxing": ["/waxing-kings-cross/"],
  "/slimming": ["/body-contouring-kings-cross/"],
  "/mens": ["/waxing-kings-cross/", "draft offered /waxing-kings-cross/ or a future men's page; PEL ruling Q28 chose /waxing-kings-cross/"],
  "/cleansing": ["/treatments/", "draft offered /treatments/ or 404; PEL ruling Q28 chose /treatments/"],
  "/eyes-ears": ["/treatments/", "draft offered /treatments/ or 404; PEL ruling Q28 chose /treatments/"],
  "/shop": [null, SHOP, "shop"],
  "/terms-of-use": ["/terms/"],
  "/privacy-policy": ["/privacy/"],
  "/consent-form": [null, CONSENT, "consent"],
  "/consent-form-1": [null, CONSENT, "consent"],
  "/aesthetics-consent-form": [null, CONSENT, "consent"],
  "/ipl-laser-consent-form": [null, CONSENT, "consent"],
};
// Section 7 story-page targets for CMS paths (used only when no family page is built).
const CMS_DRAFT = {
  "/aesthetics-1/hifu": "/hifu-kings-cross/",
  "/aesthetics-1/microneedling": "/microneedling-peels-kings-cross/",
  "/aesthetics-1/golden-micro-needling": "/microneedling-peels-kings-cross/",
  "/aesthetics-1/skymedic-chemical-peels": "/microneedling-peels-kings-cross/",
  "/aesthetics-1/hydro-facial": "/facials-kings-cross/",
  "/aesthetics-1/pico-laser": "/treatments/",
  "/aesthetics-1/ipl-(intense-pulsed-light)": "/treatments/",
  "/aesthetics-1/etherea-mx": "/treatments/",
  "/aesthetics-1/cryopen": "/treatments/",
  "/aesthetics-1/emsculpt": "/body-contouring-kings-cross/",
  "/aesthetics-body/emsculpt": "/body-contouring-kings-cross/",
  "/aesthetics-body/3d-lipo": "/body-contouring-kings-cross/",
  "/aesthetics-body/hifu-body": "/body-contouring-kings-cross/",
  "/aesthetics-body/laser-hair-removal-%2F-ipl": "/laser-hair-removal-kings-cross/",
  "/aesthetics-body/tattoo-removal-": "/treatments/",
  "/aesthetics-body/indiba-deep-beauty": "/microneedling-peels-kings-cross/",
  "/aesthetics-body/profhilo-body": "/skin-boosters-kings-cross/",
  "/injections/profhilo-skin-booster-": "/skin-boosters-kings-cross/",
  "/injections/restylane-skin-boosters": "/skin-boosters-kings-cross/",
  "/aesthetics-body/carboxytherapy": "/treatments/",
  "/facials-1/eberlin-facial": "/facials-kings-cross/",
  "/facials-1/age-defence-sensitive-skin-treatment-": "/facials-kings-cross/",
  "/facials-1/diamondtome-microdermabrasion": "/facials-kings-cross/",
};
const HELD_DRAFT = new Set([
  "/aesthetics-1/iv-therapy", "/aesthetics-1/mesotherapy-injection-gun", "/facials-1/mesotherapy-radio-frequency",
  "/facials-1/pro-lift-eye-treatment", "/injections/b12-injections", "/injections/collagen",
  "/injections/jalupro-skin-booster", "/injections/lipo-lap--fat-dissolve", "/injections/mesotherapy",
  "/injections/s-dna-skin-booster", "/injections/vitamin-c-injection",
]);

const norm = (s) => s.replace(/%2F/gi, "2F").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}
/** Directories a stub is written to for an old path. %2F gets 2: decoded and literal. */
function stubPaths(old) {
  if (/%2F/i.test(old)) return [old.replace(/%2F/gi, "/") + "/", old + "/"];
  return [old + "/"];
}

const entries = [];
for (const url of urls) {
  if (!url.startsWith(ORIGIN)) fail("unexpected origin: " + url);
  const old = url.slice(ORIGIN.length) || "/";
  const segs = old.split("/").filter(Boolean);
  let rule;
  let target = null;
  let rowSlug = null;
  let kind = null;
  let reason = null;
  let evidence;

  if (segs[0] === "service-page") {
    rule = 3;
    rowSlug = segs[1].replace(/-/g, "_");
    const row = bySlug.get(rowSlug);
    if (!row || row.source !== "booking") fail("no booking row for " + old);
    evidence = `service-page slug "${segs[1]}" with hyphens as underscores = data/services.json row "${rowSlug}" (source booking, name "${row.name}", status ${row.status}, category ${row.category})`;
    if (row.status !== "live") {
      kind = row.status;
      reason = `row status ${row.status}: no stub (rule 3)`;
    } else {
      const fam = familyOfBooking.get(rowSlug);
      if (fam && built(`treatments/${fam}`)) {
        target = `/treatments/${fam}/`;
        evidence += `; lib/families.ts lists "${rowSlug}" in the priced list of family "${fam}"; out/treatments/${fam}/index.html built`;
      } else if (CATEGORY_STORY[row.category] && built(CATEGORY_STORY[row.category].slice(1, -1))) {
        // PEL ruling 2026-09-13, rule 5 amended: a live row with no family page goes to its
        // category's story page, closer than /treatments/ for someone with a bookmark.
        target = CATEGORY_STORY[row.category];
        evidence += fam && internalRedirects.has(`/treatments/${fam}`)
          ? `; lib/families.ts lists "${rowSlug}" under family "${fam}", whose page was retired into its category story (queue row Q36, scripts/internal-redirects.json), so the story page of category "${row.category}"`
          : `; no family page lists this row, so the story page of category "${row.category}" per PEL ruling 2026-09-13 (rule 5 amended)`;
      } else {
        target = "/treatments/";
        evidence += fam ? `; family "${fam}" lists it but has no built page` : "; no family in lib/families.ts lists this row in its priced list";
      }
    }
  } else if (segs[0] === "product-page") {
    rule = 2;
    kind = "product";
    reason = SHOP;
    evidence = "path shape /product-page/<slug> (Wix Stores product, gap report section 2)";
  } else if (["aesthetics-1", "aesthetics-body", "facials-1", "injections"].includes(segs[0])) {
    rowSlug = norm(segs[0]) + "_" + norm(segs[1]);
    const invRow = inv.find((r) => r.source === "cms/" + segs[0] && r.slug === rowSlug);
    const row = bySlug.get(rowSlug);
    if (!invRow || !row) fail("no inventory or services row for " + old + " (tried " + rowSlug + ")");
    evidence = `PEL origin/main:data/pel-website-service-inventory.tsv row (source ${invRow.source}, slug ${invRow.slug}, name "${invRow.name}") = collection "${segs[0]}" + item slug "${segs[1]}" with non-alphanumerics as underscores (%2F kept as 2F); data/services.json status ${row.status}, category ${row.category}`;
    const notLive = row.status !== "live";
    if (notLive !== HELD_DRAFT.has(old)) fail("section 7 held list and services.json status disagree for " + old);
    if (notLive) {
      rule = 4;
      kind = row.status;
      reason = `held treatment page (gap report section 7 held list; row status ${row.status}): no stub`;
    } else if (built(`treatments/${rowSlug}`)) {
      rule = 1;
      target = `/treatments/${rowSlug}/`;
      evidence += `; out/treatments/${rowSlug}/index.html built`;
    } else {
      rule = 1;
      if (!CMS_DRAFT[old]) fail("no section 7 draft target for " + old);
      target = CMS_DRAFT[old];
      const retiredTo = internalRedirects.get(`/treatments/${rowSlug}`);
      if (retiredTo && retiredTo !== target) {
        fail(`section 7 draft target ${target} and scripts/internal-redirects.json target ${retiredTo} disagree for ${old}`);
      }
      evidence += retiredTo
        ? `; family page ${rowSlug} retired into its category story (queue row Q36, scripts/internal-redirects.json), which is also the section 7 draft target`
        : `; no family page built for ${rowSlug} (listed under held-back in content/treatment-descriptions.md), so the section 7 draft target`;
    }
  } else {
    const s = STATIC[old];
    if (!s) fail("unmapped ordinary path " + old);
    rule = s[2] === "consent" ? 4 : 2;
    target = s[0];
    if (target === null) {
      kind = s[2];
      reason = s[1];
      evidence = "gap report sections 2 and 7";
    } else {
      evidence = `gap report section 7 draft row for ${old}` + (s[1] ? "; " + s[1] : "");
    }
  }

  const e = { old, rule, target };
  if (target) e.stub_paths = stubPaths(old);
  if (rowSlug) e.row_slug = rowSlug;
  if (!target) {
    e.no_stub = kind;
    e.reason = reason;
  }
  e.evidence = evidence;
  entries.push(e);
}
if (entries.length !== 214) fail("expected 214 entries, got " + entries.length);

const result = {
  _about:
    "Old Wix URL to new-site redirect map (queue row Q28, PEL ruling). 1 entry per URL in PEL origin/main:data/pel-old-site-urls-2026-09-13.txt (214). target null = no stub; no_stub and reason say why. scripts/build-redirect-stubs.mjs writes out/<stub_path>index.html for every entry with a target, after next build; scripts/check-redirect-stubs.mjs verifies. Generated 2026-09-13 once from the URL list, PEL's inventory tsv, data/services.json, lib/families.ts and the built out/; edit by hand from here.",
  percent_2F_note:
    "UNVERIFIED until the Lead measures live. For /aesthetics-body/laser-hair-removal-%2F-ipl the stub is written to 2 directories: the decoded path /aesthetics-body/laser-hair-removal-/-ipl/ (what a static server that percent-decodes the request path, as nginx does, looks up on disk) and the literal name /aesthetics-body/laser-hair-removal-%2F-ipl/ (in case GitHub Pages does not decode %2F). Keep whichever answers 200 live and drop the other.",
  entries,
};
console.log(JSON.stringify(result, null, 2));
