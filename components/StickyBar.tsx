import WhatsAppIcon from "./WhatsAppIcon";
import { waSite } from "@/lib/site";

export default function StickyBar() {
  return (
    <>
      {/* Spacer: keeps page content, including the footer, from being hidden
          behind the fixed bar below on phones. */}
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{ height: "calc(64px + env(safe-area-inset-bottom, 0px))" }}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-beige bg-cream px-4 pt-3 md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <a
          href={waSite("SITE-STICKY")}
          target="_blank"
          rel="noopener"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-4 py-3 text-sm font-body text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Message us on WhatsApp
        </a>
      </div>
    </>
  );
}
