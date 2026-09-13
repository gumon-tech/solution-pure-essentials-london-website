"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Logo from "./Logo";
import WhatsAppIcon from "./WhatsAppIcon";
import { waSite } from "@/lib/site";

const NAV_LINKS = [
  { label: "Face", href: "/treatments/#face" },
  { label: "Body", href: "/treatments/#body" },
  { label: "Laser and hair removal", href: "/treatments/#laser" },
  { label: "Wellness", href: "/treatments/#wellness" },
  { label: "Prices", href: "/treatments/" },
  { label: "Contact", href: "/contact/" },
];

// Desktop nav at lg (1024 px) is tight with 2 header buttons: no wrapping, and a little less
// letter spacing and size until xl. The ::after line is the hover and focus underline that
// grows from the left (queue row Q34).
const NAV_LINK_CLASS =
  "relative whitespace-nowrap font-body uppercase tracking-[0.12em] text-sm lg:tracking-[0.06em] lg:text-[13px] xl:tracking-[0.12em] xl:text-sm text-cocoa transition-colors duration-300 ease-out hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-oak after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

// Must match the menu-out animation length in app/globals.css.
const MENU_CLOSE_MS = 200;

type MenuPhase = "closed" | "open" | "closing";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Header() {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();
  const isOpen = phase === "open";

  function openMenu() {
    window.clearTimeout(closeTimer.current);
    setPhase("open");
  }

  const closeMenu = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    if (prefersReducedMotion()) {
      setPhase("closed");
      return;
    }
    setPhase("closing");
    closeTimer.current = window.setTimeout(() => setPhase("closed"), MENU_CLOSE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Escape closes the menu.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeMenu]);

  // The page behind the open menu does not scroll.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  // A soft shadow appears once the page has scrolled. Passive listener, one read per frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 4);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] border-b border-beige bg-cream/90 backdrop-blur transition-shadow duration-300 ease-out ${
        isScrolled ? "shadow-[0_8px_24px_-16px_rgba(43,36,32,0.35)]" : ""
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:gap-3 lg:px-6 xl:gap-4 xl:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-3 lg:flex xl:gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/book-online/"
            className="pill hidden items-center whitespace-nowrap rounded-full border border-oak px-4 py-2 text-sm font-body text-espresso hover:bg-oak hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:inline-flex"
          >
            Book online
          </Link>
          <a
            href={waSite("SITE-HEADER")}
            target="_blank"
            rel="noopener"
            className="pill hidden items-center gap-2 whitespace-nowrap rounded-full border border-oak bg-oak px-4 py-2 text-sm font-body text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            className="pill inline-flex items-center justify-center rounded-full border border-beige p-2 text-cocoa hover:border-oak focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:hidden"
          >
            <span className="sr-only">
              {isOpen ? "Close menu" : "Open menu"}
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {phase !== "closed" && (
        <div
          id={panelId}
          className={`absolute inset-x-0 top-[72px] w-full border-b border-beige bg-cream px-4 py-6 shadow-soft lg:hidden ${
            phase === "closing" ? "menu-out" : "menu-in"
          }`}
        >
          <nav aria-label="Primary" className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`self-start ${NAV_LINK_CLASS}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book-online/"
              onClick={closeMenu}
              className="pill inline-flex items-center justify-center rounded-full border border-oak px-4 py-2 text-sm font-body text-espresso hover:bg-oak hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Book online
            </Link>
            <a
              href={waSite("SITE-HEADER")}
              target="_blank"
              rel="noopener"
              className="pill inline-flex items-center justify-center gap-2 rounded-full border border-oak bg-oak px-4 py-2 text-sm font-body text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
