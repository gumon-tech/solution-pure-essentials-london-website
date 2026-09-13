// Types and accessors over data/services.json.
//
// This file matches the JSON shape exactly (see data/services.schema.json for the
// machine-checked version of the same rules). One thing the schema documents that a
// plain TypeScript type cannot: every "held" status row carries category "held" as a
// sentinel value instead of one of the 11 real category ids (verified against the
// live file 2026-09-13: all 59 held rows, zero exceptions). CategoryId below includes
// it for that reason.
import data from "@/data/services.json";

export type ServiceStatus = "live" | "held" | "review";

/** The 11 real category ids, plus the "held" sentinel used only on held-status rows. */
export type CategoryId =
  | "hifu"
  | "laser"
  | "skin"
  | "skinboosters"
  | "carboxy"
  | "body"
  | "hair"
  | "facials"
  | "massage"
  | "waxing-ladies"
  | "waxing-men"
  | "held";

export interface Category {
  id: string;
  title: string;
}

export interface Service {
  slug: string;
  name: string;
  category: CategoryId;
  status: ServiceStatus;
  price_gbp: number | null;
  price_from: boolean;
  duration: string | null;
  source: string;
  note: string;
}

export interface ServicesFile {
  _about: string;
  currency: string;
  categories: Category[];
  services: Service[];
}

const file = data as unknown as ServicesFile;

/** Live rows only. Held and review rows never appear here. */
export function liveServices(): Service[] {
  return file.services.filter((s) => s.status === "live");
}

/** Live rows grouped by their real category id (the "held" sentinel never appears). */
export function servicesByCategory(): Record<string, Service[]> {
  const out: Record<string, Service[]> = {};
  for (const cat of file.categories) out[cat.id] = [];
  for (const s of liveServices()) {
    if (!out[s.category]) out[s.category] = [];
    out[s.category].push(s);
  }
  return out;
}

/** WhatsApp deep link with a prefilled enquiry message for one service. */
export function waLink(name: string, slug: string): string {
  const message = `Hi Pure Essentials, I'd like to ask about ${name}.\n\nRef: ${slug.toUpperCase()}`;
  return `https://wa.me/447767496803?text=${encodeURIComponent(message)}`;
}
