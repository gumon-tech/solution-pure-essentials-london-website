export interface ChipItem {
  id: string;
  title: string;
}

/** Sticky, horizontally-scrollable anchor chips for the 11 categories. */
export default function CategoryChips({ items }: { items: ChipItem[] }) {
  return (
    <nav
      aria-label="Jump to a treatment category"
      // top-[72px]: sits right below the site header (components/Header.tsx is a fixed
      // h-[72px] sticky bar of its own); without this offset both stick to the
      // viewport's top edge and this nav renders hidden behind the header.
      className="sticky top-[72px] z-10 border-b border-beige bg-cream/95 backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto whitespace-nowrap px-4 py-3 md:px-6">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-block rounded-full border border-beige px-4 py-2 text-sm text-cocoa hover:border-oak hover:text-oak"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
