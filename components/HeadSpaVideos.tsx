"use client";

import { useEffect, useRef } from "react";
import { IMAGES, type ImageSlot } from "@/lib/images";

// Queue row Q43: the clinic's own head spa videos (F, 2026-09-21), shown under the
// Japanese Head Spa prices. Muted, no sound track in the files, and each clip only plays
// while it is on screen. With reduced motion the clips stay on their poster and show
// controls, so nothing moves unless the visitor presses play. The fourth clip the clinic
// sent shows the client's face and is not used until the clinic confirms consent.
const CLIPS: { src: string; poster: ImageSlot; caption: string }[] = [
  { src: "/video/head-spa-2.mp4", poster: "headspa-halo", caption: "Halo Water Ritual" },
  { src: "/video/head-spa-1.mp4", poster: "headspa-wash", caption: "Scalp Massage and Wash" },
  { src: "/video/head-spa-3.mp4", poster: "headspa-shampoo", caption: "Double Shampoo Cleanse" },
];

function Clip({ src, poster, caption }: (typeof CLIPS)[number]) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch((error: DOMException) => {
            // A fast scroll pauses before play() settles (AbortError): not a failure.
            // Only a browser that refuses autoplay gets the controls.
            if (error.name === "NotAllowedError") video.controls = true;
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure>
      <video
        ref={ref}
        src={src}
        poster={IMAGES[poster].fallback}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${caption}, a Japanese Head Spa at Pure Essentials London`}
        className="aspect-[9/16] w-full rounded-arch bg-linen object-cover"
      />
      <figcaption className="mt-3 text-center font-display text-lg text-espresso">{caption}</figcaption>
    </figure>
  );
}

export default function HeadSpaVideos() {
  return (
    <div className="reveal mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
      {CLIPS.map((clip) => (
        <Clip key={clip.src} {...clip} />
      ))}
    </div>
  );
}
