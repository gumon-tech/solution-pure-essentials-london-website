#!/usr/bin/env node
// Proves the cookie consent banner and Consent Mode v2 default behaviour in
// a real browser against a static export already served (e.g.
// `npx -y serve out -l 4737`). Exits 1 on any mismatch.
//
// Usage: CHECK_CONSENT_URL=http://localhost:4737 node scripts/check-consent.mjs

import { chromium } from "playwright";

const BASE_URL = process.env.CHECK_CONSENT_URL || "http://localhost:4737";

let hadMismatch = false;

function fail(message) {
  console.error(`MISMATCH: ${message}`);
  hadMismatch = true;
}

function log(label, value) {
  console.log(`${label}: ${JSON.stringify(value)}`);
}

async function readStorage(page) {
  return page.evaluate(async () => {
    let cookieStoreEntries = null;
    if ("cookieStore" in window) {
      try {
        cookieStoreEntries = await window.cookieStore.getAll();
      } catch (err) {
        cookieStoreEntries = `error: ${String(err)}`;
      }
    }
    return {
      documentCookie: document.cookie,
      cookieStoreEntries,
      localStorageKeys: Object.keys(window.localStorage),
      sessionStorageKeys: Object.keys(window.sessionStorage),
    };
  });
}

function storageIsEmpty(storage) {
  const cookieStoreEmpty =
    storage.cookieStoreEntries === null || // API not available in this browser
    (Array.isArray(storage.cookieStoreEntries) && storage.cookieStoreEntries.length === 0);
  return (
    storage.documentCookie === "" &&
    storage.localStorageKeys.length === 0 &&
    storage.sessionStorageKeys.length === 0 &&
    cookieStoreEmpty
  );
}

async function bannerVisible(page) {
  return page
    .getByRole("dialog", { name: "Cookies" })
    .isVisible()
    .catch(() => false);
}

async function checkFreshContextIsEmpty(browser, path) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
  const storage = await readStorage(page);
  log(`fresh ${path} storage before any click`, storage);
  if (!storageIsEmpty(storage)) {
    fail(`storage not empty on fresh load of ${path}`);
  }
  await context.close();
  return storage;
}

async function main() {
  const browser = await chromium.launch();

  // --- 1: fresh context on / (storage empty, banner visible) ---
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE_URL + "/", { waitUntil: "networkidle" });

  const beforeChoice = await readStorage(page);
  log("fresh / storage before any click", beforeChoice);
  if (!storageIsEmpty(beforeChoice)) {
    fail("storage not empty on fresh load of /");
  }

  const visibleOnLoad = await bannerVisible(page);
  log("banner visible on fresh load", visibleOnLoad);
  if (!visibleOnLoad) {
    fail("banner not visible on fresh load with no stored choice");
  }

  // --- 2: click Reject ---
  await page.getByRole("button", { name: "Reject" }).click();
  await page.waitForTimeout(200);

  const afterReject = await readStorage(page);
  log("storage after Reject", afterReject);
  const rejectKeysOk =
    afterReject.localStorageKeys.length === 1 &&
    afterReject.localStorageKeys[0] === "pel-consent";
  if (!rejectKeysOk) {
    fail(
      `after Reject, localStorage keys should be exactly ["pel-consent"], got ${JSON.stringify(afterReject.localStorageKeys)}`
    );
  }
  if (afterReject.documentCookie !== "") {
    fail(`after Reject, cookies should be empty, got "${afterReject.documentCookie}"`);
  }

  const consentAfterReject = await page.evaluate(() =>
    window.localStorage.getItem("pel-consent")
  );
  log("pel-consent value after Reject", consentAfterReject);
  const rejectRecord = consentAfterReject ? JSON.parse(consentAfterReject) : null;
  if (!rejectRecord || rejectRecord.choice !== "denied") {
    fail(`pel-consent choice after Reject should be "denied", got ${JSON.stringify(rejectRecord)}`);
  }

  const visibleAfterReject = await bannerVisible(page);
  log("banner visible after Reject", visibleAfterReject);
  if (visibleAfterReject) {
    fail("banner still visible immediately after Reject");
  }

  // --- 3: reload -> banner stays hidden ---
  await page.reload({ waitUntil: "networkidle" });
  const visibleAfterReloadPostReject = await bannerVisible(page);
  log("banner visible after reload (post-reject)", visibleAfterReloadPostReject);
  if (visibleAfterReloadPostReject) {
    fail("banner reappeared after reload despite a stored reject choice");
  }

  // --- 4: clear stored choice, click Accept ---
  await page.evaluate(() => window.localStorage.removeItem("pel-consent"));
  await page.reload({ waitUntil: "networkidle" });
  const visibleAfterClear = await bannerVisible(page);
  log("banner visible after clearing stored choice and reload", visibleAfterClear);
  if (!visibleAfterClear) {
    fail("banner did not reappear after the stored choice was cleared");
  }

  await page.getByRole("button", { name: "Accept" }).click();
  await page.waitForTimeout(200);

  const afterAccept = await readStorage(page);
  log("storage after Accept", afterAccept);
  if (afterAccept.documentCookie !== "") {
    fail(
      `after Accept, cookies should still be empty (no tag loaded), got "${afterAccept.documentCookie}"`
    );
  }

  const consentAfterAccept = await page.evaluate(() =>
    window.localStorage.getItem("pel-consent")
  );
  log("pel-consent value after Accept", consentAfterAccept);
  const acceptRecord = consentAfterAccept ? JSON.parse(consentAfterAccept) : null;
  if (!acceptRecord || acceptRecord.choice !== "granted") {
    fail(`pel-consent choice after Accept should be "granted", got ${JSON.stringify(acceptRecord)}`);
  }

  const dataLayerAfterAccept = await page.evaluate(() => window.dataLayer || []);
  log("dataLayer after Accept", dataLayerAfterAccept);
  const hasConsentUpdate = dataLayerAfterAccept.some(
    (entry) => entry && entry[0] === "consent" && entry[1] === "update"
  );
  if (!hasConsentUpdate) {
    fail("window.dataLayer does not contain a consent update entry after Accept");
  }

  const visibleAfterAccept = await bannerVisible(page);
  log("banner visible after Accept", visibleAfterAccept);
  if (visibleAfterAccept) {
    fail("banner still visible immediately after Accept");
  }

  // --- 5: footer Cookie settings reopens the banner ---
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.waitForTimeout(200);
  const visibleAfterSettings = await bannerVisible(page);
  log("banner visible after footer Cookie settings click", visibleAfterSettings);
  if (!visibleAfterSettings) {
    fail("banner did not reopen after clicking footer Cookie settings");
  }

  await context.close();

  // --- 6: fresh context on /?gclid=TEST, storage still empty before choice ---
  await checkFreshContextIsEmpty(browser, "/?gclid=TEST");

  // --- 7: screenshots at 390 and 1440, and button-equality check ---
  {
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE_URL + "/", { waitUntil: "networkidle" });
    await mobilePage.screenshot({ path: "/tmp/pweb-q16-390.png" });

    const acceptBox390 = await mobilePage.getByRole("button", { name: "Accept" }).boundingBox();
    const rejectBox390 = await mobilePage.getByRole("button", { name: "Reject" }).boundingBox();
    log("390 Accept button box", acceptBox390);
    log("390 Reject button box", rejectBox390);
    const equalAt390 =
      acceptBox390 &&
      rejectBox390 &&
      Math.abs(acceptBox390.width - rejectBox390.width) < 1 &&
      Math.abs(acceptBox390.height - rejectBox390.height) < 1;
    console.log(`buttons equal size at 390: ${equalAt390}`);

    // The home page has more than one "Message us on WhatsApp" link (Hero,
    // CallToAction), so identify the sticky one by its fixed positioning
    // rather than by an ambiguous accessible name.
    const stickyBarVisible = await mobilePage.evaluate(() => {
      const link = Array.from(document.querySelectorAll("a")).find((a) => {
        if (!a.textContent?.trim().startsWith("Message us on WhatsApp")) return false;
        for (let el = a; el; el = el.parentElement) {
          if (getComputedStyle(el).position === "fixed") return true;
        }
        return false;
      });
      if (!link) return false;
      const style = getComputedStyle(link);
      const rect = link.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    console.log(`sticky WhatsApp bar visible at 390: ${stickyBarVisible}`);

    await mobileContext.close();
  }

  {
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(BASE_URL + "/", { waitUntil: "networkidle" });
    await desktopPage.screenshot({ path: "/tmp/pweb-q16-1440.png" });

    const acceptBox1440 = await desktopPage.getByRole("button", { name: "Accept" }).boundingBox();
    const rejectBox1440 = await desktopPage.getByRole("button", { name: "Reject" }).boundingBox();
    log("1440 Accept button box", acceptBox1440);
    log("1440 Reject button box", rejectBox1440);
    const equalAt1440 =
      acceptBox1440 &&
      rejectBox1440 &&
      Math.abs(acceptBox1440.width - rejectBox1440.width) < 1 &&
      Math.abs(acceptBox1440.height - rejectBox1440.height) < 1;
    console.log(`buttons equal size at 1440: ${equalAt1440}`);

    await desktopContext.close();
  }

  await browser.close();

  if (hadMismatch) {
    console.error("RESULT: FAIL");
    process.exit(1);
  }
  console.log("RESULT: PASS");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
