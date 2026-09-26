// Row descriptions and category steps for /treatments/ (queue row Q42 A22: the Japanese
// Head Spa rows carry the clinic's own description, and the category its steps list).
//
// Read at build time from the `## row-descriptions` section at the end of
// content/treatment-descriptions.md:
//   ### <row slug>            1 paragraph, shown under that row's name
//   ### steps: <category id>  a numbered list ("1. ...", "2. ..."), shown under the category
// Anything else in the section is a build error, so a typo never silently drops text.
import fs from "node:fs";
import path from "node:path";

const MD_PATH = path.join(process.cwd(), "content", "treatment-descriptions.md");
const SECTION = "## row-descriptions";

export interface RowDescriptions {
  /** Row slug -> description paragraph. */
  rows: Map<string, string>;
  /** Category id -> ordered steps. */
  steps: Map<string, string[]>;
}

let cache: RowDescriptions | null = null;

export function getRowDescriptions(): RowDescriptions {
  if (cache) return cache;
  const raw = fs.readFileSync(MD_PATH, "utf8");
  const start = raw.indexOf(`\n${SECTION}\n`);
  const rows = new Map<string, string>();
  const steps = new Map<string, string[]>();
  if (start === -1) {
    cache = { rows, steps };
    return cache;
  }
  const lines = raw.slice(start + SECTION.length + 2).split("\n");
  let i = 0;
  // Skip the section's own intro paragraph, up to the first "### " heading.
  while (i < lines.length && !lines[i].startsWith("### ")) {
    if (lines[i].startsWith("## ")) break;
    i++;
  }
  while (i < lines.length && !lines[i].startsWith("## ")) {
    const heading = /^### (.+)$/.exec(lines[i]);
    if (!heading) {
      if (lines[i].trim() !== "") {
        throw new Error(`content/treatment-descriptions.md row-descriptions: line not recognised: ${JSON.stringify(lines[i])}`);
      }
      i++;
      continue;
    }
    i++;
    const body: string[] = [];
    while (i < lines.length && !lines[i].startsWith("### ") && !lines[i].startsWith("## ")) {
      if (lines[i].trim() !== "") body.push(lines[i].trim());
      i++;
    }
    const stepsKey = /^steps:\s*(\S+)$/.exec(heading[1].trim());
    if (stepsKey) {
      const items = body.map((line, n) => {
        const m = new RegExp(`^${n + 1}\\.\\s+(.+)$`).exec(line);
        if (!m) {
          throw new Error(`row-descriptions steps ${stepsKey[1]}: item ${n + 1} not recognised: ${JSON.stringify(line)}`);
        }
        return m[1];
      });
      steps.set(stepsKey[1], items);
    } else {
      const slug = heading[1].trim();
      if (!/^[A-Za-z0-9_]+$/.test(slug)) throw new Error(`row-descriptions: bad row slug ${JSON.stringify(slug)}`);
      rows.set(slug, body.join(" "));
    }
  }
  cache = { rows, steps };
  return cache;
}
