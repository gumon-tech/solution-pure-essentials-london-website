import type { TreatmentRow } from "@/lib/treatments-view";

/** The priced-or-quote rows for 1 category, each ending in a WhatsApp link. Row names
 * are plain text, never links (queue row Q36: the price list is for looking up prices
 * and asking; the category's "Read about" button leads to its story). */
export default function PriceList({ rows }: { rows: TreatmentRow[] }) {
  return (
    <ul className="reveal divide-y divide-beige">
      {rows.map((row) => (
        <li
          key={row.slug}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4"
        >
          <div className="min-w-0">
            <p className="text-espresso">{row.name}</p>
            {row.duration ? <p className="text-walnut text-sm">{row.duration}</p> : null}
          </div>
          <div className="flex items-center gap-4">
            {row.priceGbp !== null ? (
              <span className="tabular text-espresso whitespace-nowrap">
                {`${row.priceFrom ? "From " : ""}£${row.priceGbp}`}
              </span>
            ) : (
              <span className="text-walnut whitespace-nowrap">Ask for a quote</span>
            )}
            <a
              href={row.waHref}
              target="_blank"
              rel="noopener"
              aria-label={row.waAriaLabel}
              className="pill inline-block whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm text-oak hover:bg-oak hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Ask on WhatsApp
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
