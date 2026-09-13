"use client";

import { useEffect, useRef, useState } from "react";

export interface ChipItem {
  id: string;
  title: string;
}

// Height of the sticky site header (components/Header.tsx, h-[72px]).
const HEADER_HEIGHT = 72;

/** Sticky, horizontally-scrollable anchor chips for the 11 categories. The chip of the
 * category currently in view is highlighted (scroll-spy) and scrolled into view inside
 * the bar (queue row Q34). Without JavaScript the chips are plain anchor links. */
export default function CategoryChips({ items }: { items: ChipItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll-spy: the active category is the first one crossing a band that starts right
  // under the header plus this bar and ends at 45% of the viewport height.
  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0 || !("IntersectionObserver" in window)) return;

    const bandTop = HEADER_HEIGHT + (navRef.current?.offsetHeight ?? 63);
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((item) => visible.has(item.id));
        if (first) {
          setActiveId(first.id);
        } else if (targets[0].getBoundingClientRect().top > bandTop) {
          // Scrolled back above the first category: nothing is active.
          setActiveId(null);
        }
      },
      { rootMargin: `-${bandTop}px 0px -55% 0px` },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active chip centred inside the bar, without moving the page itself.
  useEffect(() => {
    const list = listRef.current;
    if (!activeId || !list || list.scrollWidth <= list.clientWidth) return;
    const chip = list.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!chip) return;
    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const left = list.scrollLeft + (chipRect.left - listRect.left) - (listRect.width - chipRect.width) / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [activeId]);

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
