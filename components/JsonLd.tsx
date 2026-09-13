// Renders one application/ld+json <script> block for a given JSON-LD object.
// Used by the home and contact pages to render lib/structured-data.ts's
// clinicJsonLd() (queue row Q18 part 1). Family pages emit their own JSON-LD
// directly (components/FamilyPage.tsx) and are unaffected by this component.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
