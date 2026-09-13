import type { LegalBlock, LegalSegment } from "@/lib/legal";

const LINK_CLASS = "text-oak underline underline-offset-2 hover:text-espresso";

function Segments({ segments }: { segments: LegalSegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "link" ? (
          <a key={i} href={segment.href} className={LINK_CLASS}>
            {segment.value}
          </a>
        ) : (
          <span key={i}>{segment.value}</span>
        ),
      )}
    </>
  );
}

// Renders PEL-approved legal copy (privacy notice / website terms) verbatim.
// These are documents, not marketing pages: no images, just the text.
export default function LegalPage({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "h1":
              return (
                <h1 key={i} className="font-display text-4xl text-espresso md:text-5xl">
                  <Segments segments={block.segments} />
                </h1>
              );
            case "h2":
              return (
                <h2 key={i} className="font-display text-2xl text-espresso mt-10">
                  <Segments segments={block.segments} />
                </h2>
              );
            case "h3":
              return (
                <h3 key={i} className="font-display text-xl text-espresso mt-6">
                  <Segments segments={block.segments} />
                </h3>
              );
            case "p":
              return (
                <p key={i} className="font-body text-cocoa leading-relaxed mt-4">
                  <Segments segments={block.segments} />
                </p>
              );
            case "ul":
              return (
                <ul key={i} className="list-disc pl-6 font-body text-cocoa leading-relaxed mt-4 space-y-1">
                  {block.items.map((item, j) => (
                    <li key={j}>
                      <Segments segments={item} />
                    </li>
                  ))}
                </ul>
              );
            case "table":
              return (
                <div key={i} className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                    <thead>
                      <tr>
                        {block.header.map((cell, j) => (
                          <th
                            key={j}
                            scope="col"
                            className="border-b border-beige px-3 py-2 text-left font-body font-medium text-espresso"
                          >
                            <Segments segments={cell} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className="border-b border-beige px-3 py-2 align-top font-body text-cocoa"
                            >
                              <Segments segments={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
          }
        })}
      </article>
    </main>
  );
}
