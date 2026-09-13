import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { SITE, waSite } from "@/lib/site";

const LINK_CLASS =
  "text-cocoa underline-offset-4 hover:text-espresso hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-sand rounded-sm";

export default function InfoPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 rounded-2xl bg-sand p-6 sm:p-10 md:grid-cols-3">
        <div>
          <h2 className="font-body text-xs uppercase tracking-[0.12em] text-walnut">Address</h2>
          <p className="mt-3 text-cocoa">{SITE.address}</p>
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-[0.12em] text-walnut">Hours</h2>
          <table className="mt-3 text-cocoa">
            <tbody>
              {SITE.hours.map((row) => (
                <tr key={row.days}>
                  <th scope="row" className="pr-4 py-0.5 text-left font-normal">
                    {row.days}
                  </th>
                  <td className="py-0.5 tabular-nums">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-[0.12em] text-walnut">Get in touch</h2>
          <ul className="mt-3 flex flex-col gap-3">
            <li>
              <a
                href={waSite("SITE-CONTACT")}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-oak px-5 py-2.5 font-body text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Message us
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
              <a href={SITE.treatwell} target="_blank" rel="noopener" className={LINK_CLASS}>
                Book on Treatwell
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
