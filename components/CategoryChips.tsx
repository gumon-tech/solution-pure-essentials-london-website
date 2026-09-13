"use client";

import { useEffect, useRef, useState } from "react";

export interface ChipItem {
  /** The id of the category block on the page (lib/story-map.ts categoryAnchor). */
  id: string;
  title: string;
}

// Height of the sticky site header (components/Header.tsx, h-[72px]).
const HEADER_HEIGHT = 72;
// The active band ends at this share of the viewport height.
const BAND_END = 0.45;

/** Scrolls the chip bar so chip `id` sits in its centre; does nothing when the bar does not
 * scroll or the chip is already within 2 px of the centre. */
function centreChip(list: HTMLUListElement | null, id: string | null, smooth: boolean) {
  if (!id || !list || list.scrollWidth <= list.clientWidth) return;
  const chip = list.querySelector<HTMLElement>(`[data-chip="${id}"]`);
  if (!chip) return;
  const listRect = list.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const offset = chipRect.left - listRect.left - (listRect.width - chipRect.width) / 2;
  if (Math.abs(offset) < 2) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  list.scrollTo({ left: list.scrollLeft + offset, behavior: smooth && !reduced ? "smooth" : "auto" });
}

/** Sticky, horizontally-scrollable anchor chips for the 11 categories. The chip of the
 * category currently in view is highlighted (scroll-spy) and scrolled into view inside
 * the bar (queue row Q34). The active chip is worked out on load, on hashchange, on scroll
 * and on resize (queue row Q36), so a landing on /treatments/#cat-<category> from another
 * page highlights its chip too. Without JavaScript the chips are plain anchor links. */
export default function CategoryChips({ items }: { items: ChipItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // The band starts right under the header plus this bar and ends at 45% of the viewport.
    function evaluate() {
      const bandTop = HEADER_HEIGHT + (navRef.current?.offsetHeight ?? 63);
      const bandBottom = window.innerHeight * BAND_END;

      // A category named in the URL hash wins while its heading sits in the band: the last
      // categories cannot scroll up to the band's top, so position alone would pick another.
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      const hashTarget = targets.find((t) => t.id === hashId);
      if (hashTarget) {
        const top = hashTarget.getBoundingClientRect().top;
        if (top >= bandTop - 8 && top < bandBottom) {
          setActiveId(hashTarget.id);
          return;
        }
      }

      const inBand = targets.find((t) => {
        const r = t.getBoundingClientRect();
        return r.bottom > bandTop && r.top < bandBottom;
      });
      if (inBand) {
        setActiveId(inBand.id);
      } else if (targets[0].getBoundingClientRect().top > bandTop) {
        // Scrolled back above the first category: nothing is active.
        setActiveId(null);
      }
    }

    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          evaluate();
        });
      }
    };

    evaluate();
    // Next.js scrolls to the hash after this component mounts; check again once it has.
    const settle = window.setTimeout(evaluate, 400);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("load", schedule);
    return () => {
      window.clearTimeout(settle);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [items]);

  // Keep the active chip centred inside the bar, without moving the page itself. A smooth
  // scroll of the bar can be cancelled while the page is still smooth-scrolling to a hash,
  // so the chip is centred again, instantly, once the page has settled.
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    activeRef.current = activeId;
    centreChip(listRef.current, activeId, true);
  }, [activeId]);

  useEffect(() => {
    const recentre = () => centreChip(listRef.current, activeRef.current, false);
    const timers = [900, 1800].map((ms) => window.setTimeout(recentre, ms));
    window.addEventListener("scrollend", recentre);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scrollend", recentre);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Jump to a treatment category"
      // top-[72px]: sits right below the site header (components/Header.tsx is a fixed
      // h-[72px] sticky bar of its own); without this offset both stick to the
      // viewport's top edge and this nav renders hidden behind the header.
      className="sticky top-[72px] z-10 border-b border-beige bg-cream/95 backdrop-blur-sm"
    >
      <ul
        ref={listRef}
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto whitespace-nowrap px-4 py-3 md:px-6"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                data-chip={item.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(item.id)}
                className={`pill inline-block rounded-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                  isActive
                    ? "border-oak bg-sand text-espresso"
                    : "border-beige text-cocoa hover:border-oak hover:text-oak"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
