// PEL cookie-law ruling 2026-09-13: no Google request from our pages. The map is a static
// image built once by scripts/build-static-map.mjs from OpenStreetMap tiles, shown straight
// away; tapping it opens Google Maps in a new tab.
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=155+King%27s+Cross+Road,+London+WC1X+9BN";

const LINK_CLASS =
  "text-cocoa underline underline-offset-4 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm";

export default function MapBlock() {
  return (
    <div>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener"
        className="block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:aspect-[16/9]"
      >
        <picture>
          <source type="image/avif" srcSet="/img/map/clinic-map.avif" />
          <source type="image/webp" srcSet="/img/map/clinic-map.webp" />
          <img
            src="/img/map/clinic-map.jpg"
            alt="Map showing Pure Essentials London at 155 King's Cross Road, London WC1X 9BN"
            width={768}
            height={512}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <span className="sr-only">Opens Google Maps in a new tab</span>
      </a>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-cocoa">
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener" className={LINK_CLASS}>
          Open in Google Maps
        </a>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          className={LINK_CLASS}
        >
          Map data © OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}
