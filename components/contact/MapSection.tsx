import MapBlock from "@/components/contact/MapBlock";

export default function MapSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl text-espresso">Find us on the map</h2>
      <div className="mt-4">
        <MapBlock />
      </div>
    </section>
  );
}
