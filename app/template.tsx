"use client";

import { useEffect } from "react";

// Soft route change (queue row Q34). A template re-mounts on every client-side
// navigation, so the fade plays between pages. It never plays on the very first load:
// the static HTML and the hydration render carry no animation class, so the hero image
// (the LCP element) is painted at full opacity straight away. Opacity only: a transform
// here would break the sticky chip bar on /treatments/ and the fixed mobile bar.
let hasMountedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const fade = hasMountedOnce;

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return <div className={fade ? "route-fade" : undefined}>{children}</div>;
}
