import type { TreatmentRow } from "@/lib/treatments-view";

/** The priced-or-quote rows for 1 category, each ending in a WhatsApp link. */
export default function PriceList({ rows }: { rows: TreatmentRow[] }) {
  return (
    <ul className="divide-y divide-beige">
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
              className="inline-block whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm text-oak"
            >
              Ask on WhatsApp
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
