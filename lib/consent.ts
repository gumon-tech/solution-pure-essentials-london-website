// Consent Mode v2 storage and signalling helpers for the cookie banner.
//
// Storing the visitor's choice in localStorage is the only storage this site
// writes (strictly necessary to remember the answer, so it needs no consent
// of its own). No Google tag is loaded by this module or by anything it
// calls: it only pushes entries onto window.dataLayer via window.gtag, the
// same stub function the inline default script in ConsentScript.tsx defines.
// The Google Ads tag itself is loaded by components/AdsTag.tsx, and only after
// CONSENT_GRANTED_EVENT fires or a stored "granted" choice is found.

export const CONSENT_STORAGE_KEY = "pel-consent";

// Fired on window whenever the stored choice is cleared (by the footer
// "Cookie Settings" button) so the banner can reopen itself.
export const CONSENT_RESET_EVENT = "pel-consent-reset";

// Fired on window when the visitor presses Accept, so AdsTag can load the tag
// in the same page view without a reload.
export const CONSENT_GRANTED_EVENT = "pel-consent-granted";

export type ConsentChoice = "granted" | "denied";

export type ConsentRecord = {
  v: 1;
  choice: ConsentChoice;
  at: string;
};

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.v === 1 &&
    (record.choice === "granted" || record.choice === "denied") &&
    typeof record.at === "string"
  );
}

/** Reads the stored choice, or null if there is none (or it is unreadable). */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isConsentRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Stores the visitor's choice. This is the only storage the site writes. */
export function writeConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = { v: 1, choice, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode, blocked storage): the choice
    // cannot persist, but the banner still hides for the rest of this page
    // view since the caller updates its own state regardless.
  }
  return record;
}

/** Clears the stored choice and tells any mounted banner to reopen. */
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/**
 * Pushes a consent update onto dataLayer via window.gtag, the stub defined
 * by the inline default script. Only called on Accept: Reject leaves the
 * "denied" defaults already set by that script in place and calls nothing
 * else, per spec.
 */
export function pushConsentGrantedUpdate(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
}

/**
 * Pushes a consent update back to "denied". Only needed when a visitor who
 * accepted earlier reopens Cookie Settings and presses Reject: the tag may
 * already be loaded in this page view, and this tells it to stop using
 * advertising storage straight away.
 */
export function pushConsentDeniedUpdate(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}
