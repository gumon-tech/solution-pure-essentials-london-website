"use client";

import { useState } from "react";

const MAP_SRC =
  "https://www.google.com/maps?q=155+King%27s+Cross+Road,+London+WC1X+9BN&output=embed";

// Note text verbatim from content/contact.md's "## map" section. The iframe
// itself is only rendered after a click, so it never appears in the static
// export HTML (no third-party request, no cookie, before consent).
const NOTE = "The map loads when you tap it.";

export default function MapBlock() {
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand sm:aspect-[16/9]">
        <iframe
          src={MAP_SRC}
          title="Map to Pure Essentials London"
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-sand px-6 py-16 text-center">
      <p className="text-cocoa">{NOTE}</p>
      <button
        type="button"
        onClick={() => setShown(true)}
        className="inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 font-body text-cream transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
      >
        Show map
      </button>
    </div>
  );
}
