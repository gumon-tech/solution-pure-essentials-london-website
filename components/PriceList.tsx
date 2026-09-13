import type { TreatmentRow } from "@/lib/treatments-view";

/** Shared row layout for every price list (this component on /treatments/, and the price
 * tables on the story pages). Queue row Q41: 1 layout whatever the name length. Name and
 * duration on the left, the price on the name's line at the right, and the WhatsApp button
 * on its own line below at the right; from md up, the button joins the same line. */
export const PRICE_ROW_CLASS =
  "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-x-6";

export const PRICE_BUTTON_CLASS =
  "pill col-span-2 inline-flex min-h-[44px] items-center justify-self-end whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm text-oak hover:bg-oak hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:col-span-1";

/** The priced-or-quote rows for 1 category, each ending in a WhatsApp link. Row names
 * are plain text, never links (queue row Q36: the price list is for looking up prices
 * and asking; the category's "Read about" button leads to its story). */
export default function PriceList({ rows }: { rows: TreatmentRow[] }) {
  return (
    <ul className="reveal divide-y divide-beige">
      {rows.map((row) => (
        <li key={row.slug} className={PRICE_ROW_CLASS}>
          <div className="min-w-0">
            <p className="text-espresso">{row.name}</p>
            {row.duration ? <p className="text-walnut text-sm">{row.duration}</p> : null}
          </div>
          {row.priceGbp !== null ? (
            <span className="tabular whitespace-nowrap text-right text-espresso">
              {`${row.priceFrom ? "From " : ""}£${row.priceGbp}`}
            </span>
          ) : (
            <span className="whitespace-nowrap text-right text-walnut">Ask for a quote</span>
          )}
          <a
            href={row.waHref}
            target="_blank"
            rel="noopener"
            aria-label={row.waAriaLabel}
            className={PRICE_BUTTON_CLASS}
          >
            Ask on WhatsApp
          </a>
        </li>
      ))}
    </ul>
  );
}
