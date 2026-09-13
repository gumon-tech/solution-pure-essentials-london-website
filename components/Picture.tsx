import { IMAGES, type ImageSlot } from "@/lib/images";

export interface PictureProps {
  /** Key into lib/images.ts IMAGES; supplies alt, ratio, width, height and srcset. */
  slot: ImageSlot;
  /** Required `sizes` attribute for the srcset. */
  sizes: string;
  /** Above-the-fold image: fetchPriority high, loading eager. Defaults to lazy. */
  priority?: boolean;
  /** e.g. "rounded-arch" for an arch mask. */
  className?: string;
  "aria-hidden"?: boolean;
}

/**
 * Plain <picture> element built from an IMAGES slot: AVIF source, WebP source,
 * then an <img> carrying the JPEG srcset and a single-file fallback `src`.
 * No next/image -- this is a static export and the images are pre-optimised
 * by scripts/build-images.mjs into lib/images.ts's srcset already.
 */
export default function Picture({
  slot,
  sizes,
  priority = false,
  className = "",
  ...rest
}: PictureProps) {
  const entry = IMAGES[slot];

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
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
        {...rest}
      />
    </picture>
  );
}
