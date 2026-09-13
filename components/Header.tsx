"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Logo from "./Logo";
import WhatsAppIcon from "./WhatsAppIcon";
import { waSite } from "@/lib/site";
import type { NavMenu, NavMenuItem } from "@/lib/story-map";

// Face, Body, Laser and hair removal and Wellness are menus of their stories plus a prices
// link (queue row Q36, built in lib/nav.ts). Prices and Contact stay direct links.
const DIRECT_LINKS = [
  { label: "Prices", href: "/treatments/" },
  { label: "Contact", href: "/contact/" },
];

// Desktop nav at lg (1024 px) is tight with 2 header buttons: no wrapping, and a little less
// letter spacing and size until xl. The ::after line is the hover and focus underline that
// grows from the left (queue row Q34).
const NAV_LINK_CLASS =
  "relative whitespace-nowrap font-body uppercase tracking-[0.12em] text-sm lg:tracking-[0.06em] lg:text-[13px] xl:tracking-[0.12em] xl:text-sm text-cocoa transition-colors duration-300 ease-out hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-oak after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

const ITEM_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

// Must match the menu-out animation length in app/globals.css.
const MENU_CLOSE_MS = 200;
// Moving the pointer from the trigger into the panel crosses a small gap.
const HOVER_CLOSE_MS = 150;

type MenuPhase = "closed" | "open" | "closing";
type OpenedBy = "hover" | "focus" | "click";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MenuItemLink({
  item,
  onNavigate,
  desktop,
}: {
  item: NavMenuItem;
  onNavigate: () => void;
  desktop: boolean;
}) {
  if (item.kind === "story") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={
          desktop
            ? `block whitespace-nowrap rounded-xl px-4 py-2.5 font-body text-sm text-espresso transition-colors duration-200 hover:bg-sand ${ITEM_FOCUS}`
            : `inline-block rounded-sm font-body text-base text-espresso hover:text-oak ${ITEM_FOCUS}`
        }
      >
        {item.label}
      </Link>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group/rm inline-flex items-center gap-1.5 whitespace-nowrap font-body text-sm text-oak transition-colors duration-200 hover:text-espresso ${
        desktop ? "w-full rounded-xl px-4 py-2.5 hover:bg-sand" : "rounded-sm"
      } ${ITEM_FOCUS}`}
    >
      <span>{item.label}</span>
      <ArrowRight
        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover/rm:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function Header({ menus }: { menus: NavMenu[] }) {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [desktopOpen, setDesktopOpenState] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverTimer = useRef<number | undefined>(undefined);
  const desktopOpenRef = useRef<string | null>(null);
  const openedBy = useRef<OpenedBy>("click");
  const skipFocusOpen = useRef(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const baseId = useId();
  const panelId = `${baseId}-mobile`;
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

  // --- desktop menus -------------------------------------------------------------
  // Hover opens and leaving closes; focus opens and focus leaving closes; a click pins a
  // menu open (or closes a pinned one). Escape and a click outside close any of them.

  const setDesktopOpen = useCallback((id: string | null) => {
    desktopOpenRef.current = id;
    setDesktopOpenState(id);
  }, []);

  const hideDesktop = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    setDesktopOpen(null);
  }, [setDesktopOpen]);

  function showDesktop(id: string, by: OpenedBy) {
    window.clearTimeout(hoverTimer.current);
    if (desktopOpenRef.current !== id) {
      openedBy.current = by;
      setDesktopOpen(id);
    } else if (by === "click") {
      openedBy.current = "click";
    }
  }

  function onTriggerClick(id: string) {
    if (desktopOpenRef.current === id && openedBy.current === "click") {
      hideDesktop();
    } else {
      showDesktop(id, "click");
    }
  }

  function onTriggerFocus(id: string) {
    if (skipFocusOpen.current) {
      skipFocusOpen.current = false;
      return;
    }
    showDesktop(id, "focus");
  }

  function onMenuMouseLeave(id: string) {
    if (desktopOpenRef.current !== id || openedBy.current !== "hover") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(hideDesktop, HOVER_CLOSE_MS);
  }

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(hoverTimer.current);
    },
    [],
  );

  // Escape closes whichever menu is open; the desktop menu hands focus back to its trigger.
  useEffect(() => {
    if (!isOpen && !desktopOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const openId = desktopOpenRef.current;
      if (openId) {
        hideDesktop();
        const trigger = triggerRefs.current.get(openId);
        if (trigger && document.activeElement !== trigger) {
          skipFocusOpen.current = true;
          trigger.focus();
        }
      }
      if (isOpen) closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, desktopOpen, closeMenu, hideDesktop]);

  // A click or tap outside the desktop nav closes its open menu.
  useEffect(() => {
    if (!desktopOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!desktopNavRef.current?.contains(event.target as Node)) hideDesktop();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [desktopOpen, hideDesktop]);

  // The page behind the open mobile menu does not scroll.
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

        <nav ref={desktopNavRef} aria-label="Primary" className="hidden items-center gap-3 lg:flex xl:gap-6">
          {menus.map((menu) => {
            const open = desktopOpen === menu.id;
            const menuPanelId = `${baseId}-menu-${menu.id}`;
            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => showDesktop(menu.id, "hover")}
                onMouseLeave={() => onMenuMouseLeave(menu.id)}
                onBlur={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (desktopOpenRef.current === menu.id && !event.currentTarget.contains(next)) {
                    hideDesktop();
                  }
                }}
              >
                <button
                  ref={(el) => {
                    if (el) triggerRefs.current.set(menu.id, el);
                    else triggerRefs.current.delete(menu.id);
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={menuPanelId}
                  onFocus={() => onTriggerFocus(menu.id)}
                  onClick={() => onTriggerClick(menu.id)}
                  className={`${NAV_LINK_CLASS} inline-flex items-center gap-1`}
                >
                  {menu.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Always in the HTML, hidden until opened: the story links are then present
                    on every page for crawlers and without JavaScript, but not visible and not
                    in the tab order while closed. No display utility on this div, so the
                    hidden attribute wins. */}
                <div id={menuPanelId} hidden={!open} className="absolute left-0 top-full z-50 pt-3">
                  <ul className="menu-in min-w-[15rem] rounded-2xl border border-beige bg-cream p-2 shadow-[0_16px_40px_-20px_rgba(43,36,32,0.45)]">
                    {menu.items.map((item, i) => (
                      <li
                        key={item.label}
                        className={
                          item.kind === "link" && menu.items[i - 1]?.kind === "story"
                            ? "mt-1 border-t border-beige pt-1"
                            : undefined
                        }
                      >
                        <MenuItemLink item={item} onNavigate={hideDesktop} desktop />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          {DIRECT_LINKS.map((link) => (
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
          className={`absolute inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] w-full overflow-y-auto border-b border-beige bg-cream px-4 py-6 shadow-soft lg:hidden ${
            phase === "closing" ? "menu-out" : "menu-in"
          }`}
        >
          <nav aria-label="Primary" className="flex flex-col gap-5">
            {menus.map((menu) => {
              const expanded = mobileSection === menu.id;
              const sectionId = `${baseId}-section-${menu.id}`;
              return (
                <div key={menu.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={sectionId}
                    onClick={() => setMobileSection(expanded ? null : menu.id)}
                    className={`${NAV_LINK_CLASS} inline-flex items-center gap-2`}
                  >
                    {menu.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded ? (
                    <ul id={sectionId} className="mt-4 flex flex-col items-start gap-4 border-l border-beige pl-4">
                      {menu.items.map((item) => (
                        <li key={item.label}>
                          <MenuItemLink item={item} onNavigate={closeMenu} desktop={false} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            {DIRECT_LINKS.map((link) => (
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
