# Q6 report: vector logo, recoloured, PEL clinic

Row: Q6, vector version of the clinic's real logo, recoloured to the site palette.
Model: sonnet-5.

## Source

`$HOME/Library/CloudStorage/OneDrive-GumonTechnology 2/10-Work/PEL-Pure-Essentials-London/logo/pel-logo-full-wix-original.png`

Confirmed size and mode before tracing:

```
python3 -c "from PIL import Image; im = Image.open('/Users/komphet.me/Library/CloudStorage/OneDrive-GumonTechnology 2/10-Work/PEL-Pure-Essentials-London/logo/pel-logo-full-wix-original.png'); print(im.size, im.mode)"
(629, 289) RGB
```

Matches the brief: 629 x 289, black diamond mark plus PURE ESSENTIALS / LONDON wordmark.
`NOT-CLINIC-LOGO-eberlin-brand-480.png` and `pel-og-image-wix-original.png` were not read or used.

## Tooling check (run first)

```
which potrace
/opt/homebrew/bin/potrace
which rsvg-convert
/opt/homebrew/bin/rsvg-convert
which qlmanage
/usr/bin/qlmanage
python3 -c "import PIL; print('PIL', PIL.__version__)"
PIL 11.3.0
python3 -c "import cairosvg; print('cairosvg ok')"
ModuleNotFoundError: No module named 'cairosvg'
```

potrace, rsvg-convert, qlmanage and PIL were already installed. No `brew install` was needed.
cairosvg is absent and was not installed; rsvg-convert covered the render/verify step instead.

## Method used: preferred (upscale + threshold + potrace), not the redraw alternative

1. Loaded the source PNG with PIL, converted to grayscale.
2. Upscaled 4x with `Image.LANCZOS` (629x289 -> 2516x1156) for the full logo; for the mark-only
   file, cropped the diamond's ink bounding box (rows 29-139, cols 255-376 at 1x, found by a
   row/column dark-pixel-count profile), padded 12 px, then padded the shorter side so the crop
   is square (146x146 at 1x) before the same 4x upscale (584x584).
3. Thresholded each upscaled image to 1-bit at pixel value 128 and saved as PBM.
4. Traced with `potrace -s -o out.svg in.pbm -a 0.6 -O 0.2 -t 2` (SVG backend, alphamax 0.6,
   opttolerance 0.2, turdsize 2 to drop speckles). No `--tight` flag, so the output viewBox stays
   proportional to the fed-in canvas (2516x1156 for the full logo, matching the source's 629:289
   aspect ratio exactly; 584x584, square, for the mark).
5. Post-processed potrace's raw SVG output with a small script: kept the traced `<path>` data and
   its `transform`, dropped potrace's DOCTYPE/metadata/pt-unit width-height, wrote a clean
   `<svg viewBox="0 0 W H"><g transform="..." fill="#RRGGBB" stroke="none">...</g></svg>` with the
   target fill colour swapped in. No shapes were added, removed, or reflowed — only the fill
   colour and file wrapper changed.

This traces the real letterforms and the real mark geometry (both interlocking squares and the
tail) rather than reconstructing them as new polygons, per the "no redrawing" rule.

## Files changed (all new; sizes from `wc -c`)

```
wc -c public/logo/pel-logo-full-espresso.svg public/logo/pel-logo-full-oak.svg public/logo/pel-logo-full-cream.svg public/logo/pel-mark-oak.svg
   10670 public/logo/pel-logo-full-espresso.svg
   10670 public/logo/pel-logo-full-oak.svg
   10670 public/logo/pel-logo-full-cream.svg
    1582 public/logo/pel-mark-oak.svg
   33592 total
```

Colours used: espresso `#2B2420`, oak `#8A6A4E`, cream `#F7F2EA` (full logo, for dark photo
overlays), mark oak `#8A6A4E` (mark only, square viewBox).

`git status --porcelain` at the end of the task shows only the new `public/` directory as
untracked; nothing under `data/`, `docs/research/`, `docs/plans/QUEUE.md`, `HANDOFF.md`,
`hooks/`, or the OneDrive originals was touched.

## Acceptance checks

### 1. Each SVG under 20 kB

Sizes above: 10670, 10670, 10670, 1582 bytes. All under 20000 bytes.

### 2. viewBox present, no embedded raster, no `<text>`

```
grep -c 'viewBox' public/logo/pel-logo-full-espresso.svg public/logo/pel-logo-full-oak.svg public/logo/pel-logo-full-cream.svg public/logo/pel-mark-oak.svg
public/logo/pel-logo-full-espresso.svg:1
public/logo/pel-logo-full-oak.svg:1
public/logo/pel-logo-full-cream.svg:1
public/logo/pel-mark-oak.svg:1

grep -c '<image' public/logo/pel-logo-full-espresso.svg public/logo/pel-logo-full-oak.svg public/logo/pel-logo-full-cream.svg public/logo/pel-mark-oak.svg
public/logo/pel-logo-full-espresso.svg:0
public/logo/pel-logo-full-oak.svg:0
public/logo/pel-logo-full-cream.svg:0
public/logo/pel-mark-oak.svg:0

grep -c '<text' public/logo/pel-logo-full-espresso.svg public/logo/pel-logo-full-oak.svg public/logo/pel-logo-full-cream.svg public/logo/pel-mark-oak.svg
public/logo/pel-logo-full-espresso.svg:0
public/logo/pel-logo-full-oak.svg:0
public/logo/pel-logo-full-cream.svg:0
public/logo/pel-mark-oak.svg:0
```

`pel-logo-full-*.svg` viewBox: `0 0 2516 1156` (same aspect ratio as the 629x289 raster).
`pel-mark-oak.svg` viewBox: `0 0 584 584` (square, as required).

### 3. Render + pixel diff for the espresso full logo

Rendered with `rsvg-convert` (chosen over `qlmanage -t` / cairosvg since it was already
installed and cairosvg is not):

```
rsvg-convert -w 629 -o /tmp/pweb-q6-preview/pel-logo-full-espresso.png public/logo/pel-logo-full-espresso.svg
REAL_EXIT=0
```

Rendered PNG size: 629 x 289 (matches the raster's width and, because the SVG viewBox keeps the
source's exact aspect ratio, its height too).

Diff method: composited the rendered PNG (transparent background, espresso ink) onto white,
converted to grayscale, thresholded both the render and the original raster to black/white at
pixel value 128, then compared per-pixel.

```
python3 diff.py
orig size (629, 289) rend mode RGBA rend size (629, 289)
total pixels 181781 differing 353
pixel diff percent: 0.194%
```

0.194% differing pixels, against a target of under 3%.

### 4. Side-by-side comparison PNG

`/tmp/pweb-q6-preview/compare.png` (2636 x 785 px, 109314 bytes) — top row: original raster,
espresso SVG render, oak SVG render, cream SVG render on a dark ground; second row: the
oak mark-only SVG render. No captions were added (kept to rule 2, no text beyond the logo's own
words).

## Mismatches with the brief

None found. `potrace`, `rsvg-convert`, `qlmanage` and PIL were all pre-installed, so no
`brew install potrace` was needed (the brief allowed for it if missing). No Next.js `package.json`,
`app/`, or `components/` files were created.

## Partial completion

None — all four SVGs, the preview PNGs, `compare.png`, and this report were completed and verified.
