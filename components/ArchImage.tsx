import { IMAGES, type ImageSlot } from "@/lib/images";

export interface ArchImageProps {
  slot: ImageSlot;
  /** Above-the-fold image: skips lazy loading. Defaults to lazy. */
  priority?: boolean;
  className?: string;
  /** img/source sizes attribute. */
  sizes?: string;
  "aria-hidden"?: boolean;
}

/** An arch-masked, art-directed image slot: a <picture> serving avif, then webp,
 * then a jpg <img> fallback, all from the srcset/fallback in lib/images.ts for the
 * given slot. Alt, width and height come from that same entry. */
export default function ArchImage({
  slot,
  priority = false,
  className = "",
  sizes = "(min-width: 768px) 320px, 100vw",
  ...rest
}: ArchImageProps) {
  const entry = IMAGES[slot];
  const loadingProps = priority
    ? {}
    : { loading: "lazy" as const, decoding: "async" as const };

  return (
    <picture>
      <source type="image/avif" srcSet={entry.srcset.avif} sizes={sizes} />
      <source type="image/webp" srcSet={entry.srcset.webp} sizes={sizes} />
      <img
        src={entry.fallback}
        srcSet={entry.srcset.jpg}
        sizes={sizes}
        alt={entry.alt}
        width={entry.width}
        height={entry.height}
        className={`rounded-arch object-cover ${className}`.trim()}
        {...loadingProps}
        {...rest}
      />
    </picture>
  );
}
