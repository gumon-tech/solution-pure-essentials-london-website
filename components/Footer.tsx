import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { SITE, waSite } from "@/lib/site";

const LINK_CLASS =
  "text-cocoa underline-offset-4 hover:text-espresso hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-sand rounded-sm";

export default function Footer() {
  return (
    <footer className="bg-sand text-cocoa">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-display text-lg text-espresso">Visit</h2>
            <p className="mt-3 text-sm">{SITE.address}</p>
            <p className="mt-2 text-sm">
              <Link href="/contact/" className={LINK_CLASS}>
                Contact and map
              </Link>
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-espresso">Hours</h2>
            <table className="mt-3 text-sm">
              <tbody>
                {SITE.hours.map((row) => (
                  <tr key={row.days}>
                    <th scope="row" className="pr-4 text-left font-normal text-cocoa">
                      {row.days}
                    </th>
                    <td className="tabular-nums">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="font-display text-lg text-espresso">Contact</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={waSite("SITE-FOOTER")}
                  target="_blank"
                  rel="noopener"
                  className={`inline-flex items-center gap-2 ${LINK_CLASS}`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className={`inline-flex items-center gap-2 ${LINK_CLASS}`}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className={LINK_CLASS}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener"
                  className={LINK_CLASS}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SITE.treatwell}
                  target="_blank"
                  rel="noopener"
                  className={LINK_CLASS}
                >
                  Book on Treatwell
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-beige pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs text-walnut">
            {SITE.company.legalName}, registered in {SITE.company.jurisdiction}, company number{" "}
            {SITE.company.number}. Registered office: {SITE.company.registeredOffice}.{" "}
            <Link href="/privacy/" className="underline hover:text-cocoa">
              Privacy
            </Link>
            {" · "}<Link href="/terms/" className="underline hover:text-cocoa">Terms</Link>
            <br />
            Some images on this site are illustrative.
          </p>
          <Image
            src="/logo/pel-mark-oak.svg"
            alt=""
            aria-hidden="true"
            unoptimized
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
        </div>
      </div>
    </footer>
  );
}
