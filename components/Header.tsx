"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
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

const NAV_LINK_CLASS =
  "font-body uppercase tracking-[0.12em] text-sm text-cocoa transition-colors hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-beige bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waSite("SITE-HEADER")}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-oak px-4 py-2 text-sm font-body text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-beige p-2 text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:hidden"
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

      {isOpen && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-[72px] w-full border-b border-beige bg-cream px-4 py-6 shadow-soft lg:hidden"
        >
          <nav aria-label="Primary" className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={NAV_LINK_CLASS}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waSite("SITE-HEADER")}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-oak px-4 py-2 text-sm font-body text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
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
