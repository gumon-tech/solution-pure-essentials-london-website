import Link from "next/link";
import WhatsAppIcon from "./WhatsAppIcon";
import { waSite } from "@/lib/site";

const BUTTON_BASE =
  "pill flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-espresso px-4 py-3 text-sm font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function StickyBar() {
  return (
    <>
      {/* Spacer: keeps page content, including the footer, from being hidden
          behind the fixed bar below on phones. */}
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{ height: "calc(70px + env(safe-area-inset-bottom, 0px))" }}
      />
      <div
        // slide-up-once (app/globals.css): slides up once on first load; fixed, so no layout shift.
        className="slide-up-once fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-beige bg-cream px-4 pt-3 md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <a
          href={waSite("SITE-STICKY")}
          target="_blank"
          rel="noopener"
          className={`${BUTTON_BASE} bg-espresso text-cream hover:bg-cocoa`}
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
        <Link href="/book-online/" className={`${BUTTON_BASE} bg-cream text-espresso hover:bg-sand`}>
          Book online
        </Link>
      </div>
    </>
  );
}
