import Picture from "@/components/Picture";
import ReadMoreLink from "@/components/ReadMoreLink";
import { SITE } from "@/lib/site";

// Verbatim from content/home.md's "## the-clinic" section.
const SENTENCE =
  "Pure Essentials London is a salon and clinic at 155 King's Cross Road, WC1X 9BN. Open Monday to Saturday 10:00 to 20:00, Sunday and bank holidays 11:00 to 20:00. Consultations are free.";

export default function Clinic() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Picture
          slot="room-trolley"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="reveal rounded-arch w-full object-cover"
        />

        <div className="reveal">
          <h2 className="font-display text-4xl text-espresso">The clinic</h2>
          <p className="mt-4 max-w-prose text-cocoa">{SENTENCE}</p>

          <table className="mt-6 text-cocoa">
            <tbody>
              {SITE.hours.map((row) => (
                <tr key={row.days}>
                  <th scope="row" className="pr-6 py-1 text-left font-normal">
                    {row.days}
                  </th>
                  <td className="py-1 tabular-nums">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <ReadMoreLink href="/our-clinic-kings-cross/">Read about our clinic</ReadMoreLink>
          </div>
        </div>
      </div>
    </section>
  );
}
