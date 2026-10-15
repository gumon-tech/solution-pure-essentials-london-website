"use client";

import { useEffect } from "react";
import { ADS_TAG_ID, CONVERSION_SEND_TO, conversionForHref } from "@/lib/ads";
import { CONSENT_GRANTED_EVENT, readConsent } from "@/lib/consent";

// The Google Ads tag (Q17). Nothing here touches the network or storage until
// the visitor has pressed Accept: before that the component only waits.
// window.gtag is the stub from ConsentScript.tsx, so calls made here queue on
// dataLayer and gtag.js replays them in order once it has loaded.

const SCRIPT_ID = "google-ads-tag";

function loadTag(): void {
  if (document.getElementById(SCRIPT_ID) || typeof window.gtag !== "function") return;
  window.gtag("js", new Date());
  window.gtag("config", ADS_TAG_ID);
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_TAG_ID}`;
  document.head.appendChild(script);
}

function onClick(event: MouseEvent): void {
  if (readConsent()?.choice !== "granted" || typeof window.gtag !== "function") return;
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!link) return;
  const kind = conversionForHref(link.getAttribute("href") ?? "");
  if (!kind) return;
  window.gtag("event", "conversion", { send_to: CONVERSION_SEND_TO[kind] });
}

export default function AdsTag() {
  useEffect(() => {
    if (readConsent()?.choice === "granted") loadTag();
    window.addEventListener(CONSENT_GRANTED_EVENT, loadTag);
    // Capture phase, so the event is queued before a new tab or app opens.
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(CONSENT_GRANTED_EVENT, loadTag);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
