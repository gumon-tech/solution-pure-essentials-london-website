#!/usr/bin/env node
// Proves the Google Ads tag (Q17) in a real browser against a static export
// already served (e.g. `npx -y serve out -l 4737`). Exits 1 on any mismatch.
//
//   1 fresh visit, plain and with ?gclid=TEST: no request to any Google tag
//     host and no cookie, before a choice
//   2 Reject: still no tag request and no cookie
//   3 Accept: gtag.js loads, and the cookies it creates are listed (the
//     privacy notice is written from this list, so print it whole)
//   4 after Accept, a click on a WhatsApp, Treatwell, email and phone link
//     each sends one conversion with its own label
//
// Conversion pings are intercepted and aborted, so a test run never reaches
// the clinic's Ads account. gtag.js itself is allowed to load.
//
// Usage: CHECK_ADS_URL=http://localhost:4737 node scripts/check-ads-tag.mjs

import { chromium } from "playwright";
import { readFileSync } from "node:fs";

// Labels are read from lib/ads.ts so the check cannot drift from the code.
const LABELS = Object.fromEntries(
  [...readFileSync(new URL("../lib/ads.ts", import.meta.url), "utf8").matchAll(/^\s+(\w+): "(AW-\d+\/[\w-]+)"/gm)].map(
    (m) => [m[1], m[2]],
  ),
);

const BASE_URL = process.env.CHECK_ADS_URL || "http://localhost:4737";
const GOOGLE_HOST = /googletagmanager\.com|googleadservices\.com|doubleclick\.net|google\.com\/(pagead|ccm)/;
const CONVERSION_PING = /googleadservices\.com\/pagead\/conversion|google\.com\/pagead\/1p-conversion|doubleclick\.net\/pagead\/viewthroughconversion/;

let failed = false;
const fail = (m) => {
  console.error(`MISMATCH: ${m}`);
  failed = true;
};

async function newPage(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const requests = [];
  await context.route(CONVERSION_PING, (route) => {
    requests.push({ url: route.request().url(), aborted: true });
    return route.abort();
  });
  const page = await context.newPage();
  page.on("request", (r) => {
    if (GOOGLE_HOST.test(r.url())) requests.push({ url: r.url(), aborted: false });
  });
  // Links open new tabs or apps; keep the test on the page.
  await page.addInitScript(() => {
    window.addEventListener(
      "click",
      (e) => {
        const a = e.target?.closest?.("a[href]");
        if (a) e.preventDefault();
      },
      false,
    );
  });
  return { context, page, requests };
}

const cookieNames = async (context) => (await context.cookies()).map((c) => `${c.name}@${c.domain} (${Math.round((c.expires - Date.now() / 1000) / 86400)}d)`);

const browser = await chromium.launch();
try {
  for (const path of ["/", "/?gclid=TEST"]) {
    const { context, page, requests } = await newPage(browser);
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    const cookies = await cookieNames(context);
    console.log(`fresh ${path}: google requests ${requests.length}, cookies ${JSON.stringify(cookies)}`);
    if (requests.length) fail(`Google request before a choice on ${path}: ${requests[0].url}`);
    if (cookies.length) fail(`cookie before a choice on ${path}`);

    await page.getByRole("button", { name: "Reject" }).click();
    await page.waitForTimeout(1500);
    const afterReject = await cookieNames(context);
    console.log(`after Reject ${path}: google requests ${requests.length}, cookies ${JSON.stringify(afterReject)}`);
    if (requests.length) fail(`Google request after Reject on ${path}`);
    if (afterReject.length) fail(`cookie after Reject on ${path}`);
    await context.close();
  }

  for (const path of ["/", "/?gclid=TEST"]) {
    const { context, page, requests } = await newPage(browser);
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Accept" }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const tagLoaded = requests.some((r) => r.url.includes("googletagmanager.com/gtag/js"));
    console.log(`after Accept ${path}: gtag.js loaded ${tagLoaded}`);
    console.log(`after Accept ${path}: cookies ${JSON.stringify(await cookieNames(context))}`);
    if (!tagLoaded) fail(`gtag.js did not load after Accept on ${path}`);
    await context.close();
  }

  // Each conversion kind: a fresh accepted page, one click, one ping.
  const targets = {
    whatsapp: 'a[href^="https://wa.me/"]',
    treatwell: 'a[href*="treatwell.co.uk"]',
    email: 'a[href^="mailto:"]',
    phone: 'a[href^="tel:"]',
  };
  for (const [kind, selector] of Object.entries(targets)) {
    const { context, page, requests } = await newPage(browser);
    await page.goto(BASE_URL + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Accept" }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const before = requests.filter((r) => CONVERSION_PING.test(r.url)).length;
    const link = page.locator(selector).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForTimeout(2500);
    const pings = requests.filter((r) => CONVERSION_PING.test(r.url)).slice(before);
    const label = LABELS[kind].split("/")[1];
    const matched = pings.filter((r) => r.url.includes(label));
    console.log(`click ${kind}: conversion pings ${pings.length}, with label ${label}: ${matched.length}`);
    if (!matched.length) fail(`no conversion ping with the ${kind} label`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
process.exit(failed ? 1 : 0);
