// The one Title Case rule for the site (queue row Q42 section C, owner's order 2026-09-26):
// headings, buttons, button-styled links, menu items, category and family titles, service
// names, section eyebrows and FAQ questions are in Title Case; body text is not touched.
//
// Rule: capitalise every word except the minor words below when they are neither the first
// nor the last word. A word that already carries capitals past its first letter, or is
// all capitals (HIFU, IPL, CryoPen, mL, INDIBA, WhatsApp), is kept as written. Units stay
// lower case (mins, min, hr, ml, cm). Each part of a hyphenated or slashed word follows the
// same rule (Face-to-Face), except the product spellings in KEPT_SPELLINGS (Q-switch).
// A word after a colon or a standalone dash starts a new phrase and is capitalised.
//
// Service names from data/services.json go through this at render time, so a future edit
// of that file comes out right without anyone remembering the rule.
// scripts/check-title-case.mjs holds its own copy of this rule (independent on purpose, in
// the style of the other check scripts): keep the two in step.

const MINOR_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "nor",
  "but",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "by",
  "with",
  "per",
  "from",
  "via",
  "vs",
  "as",
]);

const UNITS = new Set(["mins", "min", "minutes", "hr", "hrs", "hour", "hours", "ml", "cm", "mm", "nm"]);

/** Product spellings that break the hyphen rule, keyed by their lower-case form. */
const KEPT_SPELLINGS: Record<string, string> = {
  "q-switch": "Q-switch",
};

const LEADING = /^[("'“‘[]+/;
const TRAILING = /[)"'”’\],.:;?!]+$/;

function hasLetter(s: string): boolean {
  return /[A-Za-z]/.test(s);
}

function formatPart(part: string, isEdge: boolean): string {
  if (!hasLetter(part)) return part;
  if (/^\d/.test(part)) return part; // 1mL, 3D, 0.55ml
  if (/[A-Z]/.test(part.slice(1))) return part; // HIFU, CryoPen, WhatsApp
  const lower = part.toLowerCase();
  if (UNITS.has(lower) && part === lower) return part;
  if (!isEdge && MINOR_WORDS.has(lower)) return lower;
  return part.slice(0, 1).toUpperCase() + part.slice(1);
}

function formatCore(core: string, isFirst: boolean, isLast: boolean): string {
  const kept = KEPT_SPELLINGS[core.toLowerCase()];
  if (kept) return kept;
  // Split on hyphens and slashes, keeping the separators.
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

/** Title Case for a heading, button, menu item or service name. */
export function titleCase(input: string): string {
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
