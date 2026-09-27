# Q44: motion for buttons and elements, fitted to a premium clinic

Owner, 2026-09-28: research animation for buttons and other elements that suits this business,
and decorate the site with it. Built on komphet-air (room KPEL), deployed on the owner's standing
order of 2026-09-27 to put the client's changes live.

## What the research says (sources read 2026-09-28)

- High-end aesthetic brands: restraint is the signal. A slow fade as sections enter and a gentle
  hover on the booking button read as craft; bouncing and aggressive parallax read as gimmicky.
  (smply.studio aesthetic clinic design guide; colorlib and flamingo med spa examples)
- Timing: about 200 to 300 ms for UI changes, exits faster than entrances, ease-out for things
  arriving, never linear for UI; one set of easing tokens site-wide; a reduced-motion variant for
  every effect; touch has no hover, so hover effects must not carry meaning.
  (nngroup.com/articles/animation-duration)
- Image entrances that feel expensive: a clip-path "curtain" reveal combined with a settle from a
  slight scale, driven by `animation-timeline: view()` so it follows the visitor's own scroll.
  (utilitybend clip paths on scroll; emilkowal.ski clip-path; codefronts curtain reveal)

## What was added (on top of Q34's motion, same token --ease-soft)

| Element | Effect | Where the rule is |
|---|---|---|
| Every pill button | lifts 2 px on hover; press still scales to 0.98 | globals.css `.pill:hover` |
| Filled pill buttons | one soft band of light crosses the button once on hover (900 ms) | `.pill::after` |
| WhatsApp icon | tilts 10 degrees on hover of its link | `.wa-icon` (WhatsAppIcon.tsx) |
| Read more text links | underline eases from 4 to 7 px away as the arrow moves | `.group/rm:not(.pill)` |
| Price rows on /treatments/ | a linen band under the row the pointer is on | `.price-row` (PriceList.tsx) |
| Revealed images | arch rises from its base (clip-path 35% to 0) while the photo settles from 1.06 | `img.reveal` keyframe `unveil` |
| Section ornament | a small arch outline above How It Works, The Clinic, Ready When You Are; draws its line as it enters | ArchOrnament.tsx, keyframe `draw-line` |

Guards: hover effects only under `(hover: hover) and (prefers-reduced-motion: no-preference)`;
scroll effects only inside `@supports (animation-timeline: view())` and no-preference; the base
state of every element is its final visible state, so no browser, no JavaScript and reduced motion
all show everything. The hero image is not unveiled (it is the LCP element).

## Checks (2026-09-28)

All 11 steps exit 0. In the browser at 1440: hover on the hero WhatsApp pill measured
transform translateY(-2px) and the light band at translateX(271px) after the sweep; the CTA
image measured clip-path inset(18%) and opacity 0.68 mid-entry, inset(0) and 1 once entered; the
3 ornaments measured stroke-dashoffset 1 before entry and 0 after.
