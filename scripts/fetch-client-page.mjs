#!/usr/bin/env node
// Fetch one page of the clinic's live website, politely, and record the result.
//
// Why this exists: on 2026-09-13 an executor fetched 13 of the clinic's live Wix pages in
// parallel, against the rule of one request at a time with a pause (Q-PEL-020). A rule written
// only in a brief can be skipped; this script enforces it for every caller on this machine.
//
// Usage: node scripts/fetch-client-page.mjs <url> [outfile]
// Rules enforced here:
//   1 only hosts on the allow list below
//   2 one request at a time across all processes (a lock file)
//   3 at least MIN_GAP_MS between the end of one request and the start of the next
//   4 HTTP status printed on every call; 429 and 5xx exit 2 so a caller cannot read them as clean
//   5 every call appended to a log with time, url, status, bytes

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ALLOWED_HOSTS = new Set(["www.pureessentialslondon.com", "pureessentialslondon.com"]);
const MIN_GAP_MS = 3000;
const DIR = path.join(os.tmpdir(), "pweb-client-fetch");
const LOCK = path.join(DIR, "lock");
const STAMP = path.join(DIR, "last-end");
const LOG = path.join(DIR, "fetch-log.tsv");

const [url, outfile] = process.argv.slice(2);
if (!url) {
  console.error("usage: node scripts/fetch-client-page.mjs <url> [outfile]");
  process.exit(64);
}
const host = new URL(url).host;
if (!ALLOWED_HOSTS.has(host)) {
  console.error(`refused: ${host} is not on the allow list`);
  process.exit(64);
}

fs.mkdirSync(DIR, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function acquire() {
  for (let i = 0; i < 600; i++) {
    try {
      fs.writeFileSync(LOCK, String(process.pid), { flag: "wx" });
      return;
    } catch {
      const holder = Number(fs.readFileSync(LOCK, "utf8") || 0);
      let alive = false;
      try {
        process.kill(holder, 0);
        alive = true;
      } catch {
        alive = false;
      }
      if (!alive) fs.rmSync(LOCK, { force: true });
      await sleep(500);
    }
  }
  console.error("refused: waited 300 s for another fetch to finish");
  process.exit(75);
}

await acquire();
try {
  const last = fs.existsSync(STAMP) ? Number(fs.readFileSync(STAMP, "utf8")) : 0;
  const wait = last + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);

  const started = Date.now();
  let status = 0;
  let bytes = 0;
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (PWEB polite fetch)" } });
    status = res.status;
    const body = Buffer.from(await res.arrayBuffer());
    bytes = body.length;
    if (outfile) fs.writeFileSync(outfile, body);
  } catch (err) {
    console.error(`fetch error: ${err.message}`);
  }
  const ms = Date.now() - started;
  fs.writeFileSync(STAMP, String(Date.now()));
  fs.appendFileSync(LOG, `${new Date().toISOString()}\t${url}\t${status}\t${bytes}\t${ms}\n`);
  console.log(`status ${status} bytes ${bytes} ms ${ms}`);
  if (status === 429 || status >= 500 || status === 0) process.exit(2);
} finally {
  fs.rmSync(LOCK, { force: true });
}
