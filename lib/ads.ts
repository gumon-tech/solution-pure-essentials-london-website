// Google Ads conversion tag for the clinic's account (Q17). The ID and labels
// were read from the Ads account by KPEL on 2026-10-16 (lead repo register
// entry 082). They are public by design: every page that runs the tag sends
// them to Google in the clear.

export const ADS_TAG_ID = "AW-18389689043";

export type ConversionKind = "whatsapp" | "treatwell" | "email" | "phone";

export const CONVERSION_SEND_TO: Record<ConversionKind, string> = {
  treatwell: "AW-18389689043/JEZOCLn-jJ4dENPF8cBE",
  whatsapp: "AW-18389689043/34EeCLz-jJ4dENPF8cBE",
  email: "AW-18389689043/z6DRCL_-jJ4dENPF8cBE",
  phone: "AW-18389689043/GjEnCML-jJ4dENPF8cBE",
};

/** Which conversion a link click counts as, or null for any other link. */
export function conversionForHref(href: string): ConversionKind | null {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  try {
    const host = new URL(href).hostname;
    if (host === "wa.me" || host.endsWith(".whatsapp.com") || host === "whatsapp.com") {
      return "whatsapp";
    }
    if (host === "treatwell.co.uk" || host.endsWith(".treatwell.co.uk")) return "treatwell";
  } catch {
    // relative or malformed href: an internal link, not a conversion
  }
  return null;
}
