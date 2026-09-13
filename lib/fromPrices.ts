// Computes each home-page group's "From £X" figure at build time: the lowest
// live, priced service in the group's categories (lib/groups.ts), read from
// data/services.json via lib/services.ts. Home (Q7) is the only reader.
import { liveServices } from "@/lib/services";
import { GROUPS, type GroupId } from "@/lib/groups";

/** Lowest live price_gbp across a group's categories, or null if none priced. */
export function fromPriceFor(groupId: GroupId): number | null {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) return null;

  const prices = liveServices()
    .filter((s) => (group.categories as string[]).includes(s.category))
    .map((s) => s.price_gbp)
    .filter((p): p is number => typeof p === "number");

  if (prices.length === 0) return null;
  return Math.min(...prices);
}

/** All 4 groups' from-price figures, keyed by group id. */
export function fromPrices(): Record<GroupId, number | null> {
  const out = {} as Record<GroupId, number | null>;
  for (const group of GROUPS) {
    out[group.id] = fromPriceFor(group.id);
  }
  return out;
}
