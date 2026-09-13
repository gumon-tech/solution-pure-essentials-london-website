// Treatwell booking widget (owner decision 2026-09-13: Treatwell is the second booking
// route and must be visible, loaded straight away, no tap-to-show step). The src is the
// venue-id URL from Treatwell's partner docs; venue 256278 is Pure Essentials. It
// redirects to widget.treatwell.co.uk/place/pure-essentials/, which allows framing.
export const TREATWELL_WIDGET_SRC = "https://widget.treatwell.co.uk/place/256278/menu/";

export default function TreatwellWidget({
  loading = "lazy",
}: {
  loading?: "eager" | "lazy";
}) {
  return (
    <iframe
      src={TREATWELL_WIDGET_SRC}
      title="Book with Pure Essentials London on Treatwell"
      name="treatwell-booking-widget"
      loading={loading}
      // Heights: the widget scrolls inside its own frame. 900px on phones shows the
      // service menu plus a time picker without a nested scroll on a 390x844 screen held
      // below the sticky bar; 780px from md fits a 1440x900 laptop below the header.
      className="block h-[900px] w-full rounded-2xl border border-beige bg-white md:h-[780px]"
    />
  );
}
