export const SITE = {
  name: "Pure Essentials London",
  url: "https://pel.gumon.io",
  address: "155 King's Cross Road, London WC1X 9BN",
  email: "info@pureessentialslondon.com",
  // Clinic landline (PEL ruling 2026-09-13, queue row Q29): 0207 278 5812 written in
  // standard UK grouping for display, E.164 for the tel: link, international form for
  // JSON-LD. The old mobile number is not used anywhere.
  phoneDisplay: "020 7278 5812",
  phoneHref: "tel:+442072785812",
  phoneSchema: "+44 20 7278 5812",
  instagram: "https://www.instagram.com/pureessentialslondon/",
  treatwell: "https://www.treatwell.co.uk/place/pure-essentials/",
  whatsappNumber: "447767496803",
  hours: [
    { days: "Monday to Saturday", time: "10:00 to 20:00" },
    { days: "Sunday", time: "11:00 to 20:00" },
    { days: "Bank Holidays", time: "11:00 to 20:00" },
  ],
  company: {
    legalName: "PURE ESSENTIALS (LONDON) LTD",
    number: "09500632",
    jurisdiction: "England and Wales",
    registeredOffice: "129 Station Road, London NW4 4NJ",
  },
} as const;

export function waSite(ref: string, text?: string): string {
  const message = `Hi Pure Essentials, I'd like to ask about ${
    text ?? "a treatment"
  }.\n\nRef: ${ref}`;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
