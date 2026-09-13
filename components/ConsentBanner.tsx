"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_RESET_EVENT,
  clearConsent,
  pushConsentGrantedUpdate,
  readConsent,
  writeConsent,
} from "@/lib/consent";

// A grid with two equal columns (rather than flex, which sizes each button
// to its own text) guarantees Accept and Reject render at identical width
// regardless of glyph metrics, matching the equal-prominence requirement.
const BUTTON_CLASS =
  "rounded-full bg-espresso px-6 py-3 text-center text-sm font-body text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Decide on mount only: this runs client-side, after hydration, so it
  // never disagrees with server-rendered markup.
  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  useEffect(() => {
    function onReset() {
      setVisible(true);
    }
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  useEffect(() => {
    if (visible) {
      panelRef.current?.focus();
    }
  }, [visible]);

  if (!visible) return null;

  function handleAccept() {
    writeConsent("granted");
    pushConsentGrantedUpdate();
    setVisible(false);
  }

  function handleReject() {
    writeConsent("denied");
    setVisible(false);
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-banner-heading"
      aria-describedby="consent-banner-text"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom,0px))] z-40 border-t border-beige bg-cream px-4 py-4 shadow-soft focus:outline-none md:bottom-0"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="consent-banner-heading" className="font-display text-lg text-espresso">
            Cookies
          </h2>
          <p id="consent-banner-text" className="mt-1 text-sm text-cocoa">
            We would like to use cookies to measure visits and the performance of our adverts. We
            only do this if you accept. You can change your choice at any time with Cookie
            settings at the bottom of every page.{" "}
            <Link
              href="/privacy/"
              className="underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm"
            >
              Privacy notice
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-72">
          <button type="button" onClick={handleAccept} className={BUTTON_CLASS}>
            Accept
          </button>
          <button type="button" onClick={handleReject} className={BUTTON_CLASS}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer "Cookie settings" button: clears the stored choice and lets the
 * mounted ConsentBanner reopen itself via the reset event.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={clearConsent} className={className}>
      Cookie settings
    </button>
  );
}
