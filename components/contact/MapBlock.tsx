// Owner decision 2026-09-13 (queue row Q37): a live Google map embedded on the contact page,
// the same pattern as the Taitam-D site (maps?q=...&output=embed, no API key). It loads when
// the section scrolls into view, so Google receives the visitor's IP address then; the
// privacy notice says so (PEL wording). The search includes the business name so the embed
// shows the clinic's listing card and pin, not only the address.
const EMBED_SRC =
  "https://www.google.com/maps?q=Pure+Essentials+London,+155+King%27s+Cross+Road,+London+WC1X+9BN&output=embed";

// Google Maps URLs search with the business name and address: Google resolves it to the
// clinic's listing on its own servers. The earlier place URL with a feature id opened an empty
// place in the owner's browser (2026-09-13); this form opened the listing in the Lead's test.
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Pure+Essentials+London%2C+155+King%27s+Cross+Road%2C+London+WC1X+9BN";

const LINK_CLASS =
  "text-cocoa underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm";

export default function MapBlock() {
  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-beige bg-sand sm:aspect-[16/9]">
        <iframe
          src={EMBED_SRC}
          title="Map showing Pure Essentials London at 155 King's Cross Road, London WC1X 9BN"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-cocoa">
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener" className={LINK_CLASS}>
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
