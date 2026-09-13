import Image from "next/image";

export interface ArchImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Above-the-fold image: skips lazy loading. Defaults to lazy. */
  priority?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
}

/** An arch-masked image slot. Unoptimized (next.config.mjs already sets
 * images.unoptimized for the static export; passed again here per the Q8 spec). */
export default function ArchImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  ...rest
}: ArchImageProps) {
  const imageProps = priority
    ? { priority: true as const }
    : { loading: "lazy" as const };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      className={`rounded-arch object-cover ${className}`.trim()}
      {...imageProps}
      {...rest}
    />
  );
}
