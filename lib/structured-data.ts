// Site-level structured data (JSON-LD) for the clinic, rendered once each on the
// home and contact pages (queue row Q18 part 1). Built only from facts already on
// the site: lib/site.ts (SITE) and lib/images.ts (the home hero image). No geo
// coordinates (not measured), no telephone (not published on the site), no
// aggregateRating/review (not allowed), and no service offers -- those are carried
// per-family by components/FamilyPage.tsx's own JSON-LD blocks.
import { SITE } from "@/lib/site";
import { IMAGES } from "@/lib/images";
import { liveServices } from "@/lib/services";
import type { FamilyPage } from "@/lib/family-pages";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// UK postcode pattern (e.g. "WC1X 9BN"), used to split SITE.address's second
// comma-separated part into locality and postcode.
const UK_POSTCODE_RE = /([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})\s*$/i;

interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
}

/** Parses SITE.address (e.g. "155 King's Cross Road, London WC1X 9BN") into a
 * schema.org PostalAddress. addressCountry is not present in that string -- it is
 * a fixed constant ("GB") because the clinic has one, UK-only location. */
function parseAddress(address: string): PostalAddress {
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length !== 2) {
    throw new Error(`SITE.address "${address}" is not in the expected "<street>, <locality> <postcode>" shape`);
  }
  const [streetAddress, localityAndPostcode] = parts;
  const postcodeMatch = UK_POSTCODE_RE.exec(localityAndPostcode);
  if (!postcodeMatch) {
    throw new Error(`SITE.address "${address}" has no recognisable UK postcode in "${localityAndPostcode}"`);
  }
  const postalCode = postcodeMatch[1];
  const addressLocality = localityAndPostcode.slice(0, postcodeMatch.index).trim();
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    postalCode,
    addressCountry: "GB",
  };
}

interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

/** Expands a SITE.hours "days" field ("Monday to Saturday", "Sunday", ...) into an
 * ordered list of day names. Throws on a shape it does not recognise. */
function expandDays(days: string): string[] {
  const singleMatch = ALL_DAYS.find((d) => d === days);
  if (singleMatch) return [singleMatch];

  const rangeMatch = /^(\w+) to (\w+)$/.exec(days);
  if (rangeMatch) {
    const [, startDay, endDay] = rangeMatch;
    const startIndex = ALL_DAYS.indexOf(startDay as (typeof ALL_DAYS)[number]);
    const endIndex = ALL_DAYS.indexOf(endDay as (typeof ALL_DAYS)[number]);
    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      return ALL_DAYS.slice(startIndex, endIndex + 1);
    }
  }
  throw new Error(`SITE.hours day range "${days}" is not a recognised single day or "X to Y" range`);
}

/** Builds openingHoursSpecification from SITE.hours, skipping any row whose days
 * mention "Bank Holiday" -- Bank Holidays is not one of schema.org's dayOfWeek
 * values, so that row is not a schema day (per the Q18 brief). */
function openingHoursSpecification(): OpeningHoursSpecification[] {
  return SITE.hours
    .filter((row) => !/bank holiday/i.test(row.days))
    .map((row) => {
      const [opens, closes] = row.time.split(" to ").map((t) => t.trim());
      if (!opens || !closes) {
        throw new Error(`SITE.hours time "${row.time}" is not in the expected "<opens> to <closes>" shape`);
      }
      const days = expandDays(row.days);
      return {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: days.length === 1 ? days[0] : days,
        opens,
        closes,
      };
    });
}

/** "£10 to £1,300": the lowest and highest live price_gbp in data/services.json,
 * formatted with a thousands separator. Computed at build time so it always
 * reflects the current live rows -- never hand-typed. */
function priceRange(): string {
  const prices = liveServices()
    .map((s) => s.price_gbp)
    .filter((p): p is number => typeof p === "number");
  if (prices.length === 0) {
    throw new Error("no live, priced services found in data/services.json");
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const format = (n: number) => `£${n.toLocaleString("en-GB")}`;
  return `${format(min)} to ${format(max)}`;
}

/** A Service node for a family whose page was retired into its story (queue row Q36, PEL
 * brief section 34 condition 2), rendered on that story by components/StoryPage.tsx.
 * provider points at the clinic node's @id; Offers only for the family's live rows that
 * have a price. No rating and no review. */
export function familyServiceJsonLd(family: FamilyPage) {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: family.title,
    provider: {
      "@type": "HealthAndBeautyBusiness",
      "@id": `${SITE.url}/#clinic`,
      name: SITE.name,
    },
    areaServed: "King's Cross, London",
  };
  const offers = family.priced
    .filter((row) => row.priceGbp !== null)
    .map((row) => ({
      "@type": "Offer",
      name: row.name,
      price: row.priceGbp,
      priceCurrency: "GBP",
    }));
  if (offers.length > 0) json.offers = offers;
  return json;
}

/** Site-level JSON-LD for the clinic itself, rendered once each on the home and
 * contact pages via components/JsonLd.tsx. */
export function clinicJsonLd() {
  const homeHero = IMAGES["home-hero"];
  return {
    "@context": "https://schema.org",
    "@type": ["HealthAndBeautyBusiness", "MedicalBusiness"],
    "@id": `${SITE.url}/#clinic`,
    name: SITE.name,
    legalName: SITE.company.legalName,
    url: `${SITE.url}/`,
    email: SITE.email,
    telephone: SITE.phoneSchema,
    image: `${SITE.url}${homeHero.fallback}`,
    address: parseAddress(SITE.address),
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [SITE.instagram],
    priceRange: priceRange(),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Companies House",
      value: SITE.company.number,
    },
  };
}
