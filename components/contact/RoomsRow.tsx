import Picture from "@/components/Picture";
import type { ImageSlot } from "@/lib/images";

const ROOMS: ImageSlot[] = ["room-analyser", "room-couch", "room-trolley"];

export default function RoomsRow() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {ROOMS.map((slot) => (
          <Picture
            key={slot}
            slot={slot}
            sizes="(min-width: 640px) 33vw, 100vw"
            className="rounded-arch w-full object-cover"
          />
        ))}
      </div>
    </section>
  );
}
