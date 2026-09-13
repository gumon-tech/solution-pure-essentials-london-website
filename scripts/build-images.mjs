#!/usr/bin/env node
// Q5 part 3: build web-ready AVIF/WebP/JPEG images from images-src/manifest.json into
// public/img/gen, and generate the typed image map in lib/images.ts.
//
// Not run in CI: sources live on OneDrive and only exist on this machine. The outputs
// this script writes to public/img/gen are what gets committed.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const MANIFEST_PATH = path.join(ROOT, "images-src", "manifest.json");
const OUT_DIR = path.join(ROOT, "public", "img", "gen");
const LIB_PATH = path.join(ROOT, "lib", "images.ts");

const WIDTHS = [480, 800, 1200, 1600];
const NARROW_WIDTHS = new Set([480, 800]);
const WIDE_WIDTHS = new Set([1200, 1600]);

const NARROW_BUDGET_BYTES = 90 * 1024; // 480/800 outputs
const WIDE_BUDGET_BYTES = 200 * 1024; // 1200/1600 outputs

const FORMATS = [
  {
    ext: "avif",
    startQuality: 50,
    minQuality: 35,
    encode: (img, quality) => img.avif({ quality }),
  },
  {
    ext: "webp",
    startQuality: 72,
    minQuality: 55,
    encode: (img, quality) => img.webp({ quality }),
  },
  {
    ext: "jpg",
    startQuality: 78,
    minQuality: 60,
    encode: (img, quality) =>
      img.jpeg({ quality, progressive: true, mozjpeg: true }),
  },
];

function expandHome(p) {
  if (p.startsWith("$HOME")) {
    const home = process.env.HOME;
    if (!home) throw new Error("$HOME is not set in the environment");
    return home + p.slice("$HOME".length);
  }
  return p;
}

function budgetFor(width) {
  if (WIDE_WIDTHS.has(width)) return WIDE_BUDGET_BYTES;
  if (NARROW_WIDTHS.has(width)) return NARROW_BUDGET_BYTES;
  return null;
}

async function encodeToBudget(baseImage, format, width) {
  const budget = budgetFor(width);
  let quality = format.startQuality;
  let buffer = await format.encode(baseImage.clone(), quality).toBuffer();

  if (budget === null) return { buffer, quality };

  while (buffer.length > budget && quality - 5 >= format.minQuality) {
    quality -= 5;
    buffer = await format.encode(baseImage.clone(), quality).toBuffer();
  }

  return { buffer, quality, overBudget: buffer.length > budget, budget };
}

async function main() {
  const manifestRaw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  await mkdir(OUT_DIR, { recursive: true });

  const rows = [];
  const budgetProblems = [];
  const imagesEntries = {};

  for (const entry of manifest) {
    const { slot, source, crop, ratio, alt } = entry;
    const sourcePath = expandHome(source);

    if (!existsSync(sourcePath)) {
      throw new Error(`Source for slot "${slot}" not found: ${sourcePath}`);
    }

    let pipeline = sharp(sourcePath).rotate(); // rotate() normalizes EXIF orientation
    const meta = await sharp(sourcePath).metadata();
    let srcWidth = meta.width;
    let srcHeight = meta.height;

    if (crop && typeof crop.topPct === "number") {
      const topCut = Math.round(srcHeight * (crop.topPct / 100));
      const remainingHeight = srcHeight - topCut;
      const [rw, rh] = (crop.ratio ?? ratio).split(":").map(Number);
      const targetWidthForHeight = Math.round((remainingHeight * rw) / rh);
      let cropWidth = Math.min(targetWidthForHeight, srcWidth);
      let cropLeft = Math.round((srcWidth - cropWidth) / 2);
      pipeline = pipeline.extract({
        left: cropLeft,
        top: topCut,
        width: cropWidth,
        height: remainingHeight,
      });
      srcWidth = cropWidth;
      srcHeight = remainingHeight;
    } else {
      // No explicit crop: ensure the source matches the declared ratio by centre-cropping
      // the shorter dimension out (only trims, never invents pixels).
      const [rw, rh] = ratio.split(":").map(Number);
      const targetHeightForWidth = Math.round((srcWidth * rh) / rw);
      if (targetHeightForWidth <= srcHeight) {
        const top = Math.round((srcHeight - targetHeightForWidth) / 2);
        pipeline = pipeline.extract({
          left: 0,
          top,
          width: srcWidth,
          height: targetHeightForWidth,
        });
        srcHeight = targetHeightForWidth;
      } else {
        const targetWidthForHeight = Math.round((srcHeight * rw) / rh);
        const left = Math.round((srcWidth - targetWidthForHeight) / 2);
        pipeline = pipeline.extract({
          left,
          top: 0,
          width: targetWidthForHeight,
          height: srcHeight,
        });
        srcWidth = targetWidthForHeight;
      }
    }

    // Materialize the cropped base once so every width/format resize starts from the same
    // pixels.
    const croppedBuffer = await pipeline.toBuffer();
    const croppedMeta = await sharp(croppedBuffer).metadata();
    const fullWidth = croppedMeta.width;
    const fullHeight = croppedMeta.height;

    const widthsToEmit = WIDTHS.filter((w) => w <= fullWidth);

    let largestWidth = 0;
    let largestHeight = 0;
    const srcset = { avif: [], webp: [], jpg: [] };

    for (const width of widthsToEmit) {
      const height = Math.round((width / fullWidth) * fullHeight);
      if (width > largestWidth) {
        largestWidth = width;
        largestHeight = height;
      }

      for (const format of FORMATS) {
        const base = sharp(croppedBuffer).resize({
          width,
          height,
          fit: "fill",
        });
        // Strip all metadata (sharp does not carry EXIF/ICC into the output by default
        // unless withMetadata() is called, so we deliberately never call it).
        const { buffer, quality, overBudget, budget } = await encodeToBudget(
          base,
          format,
          width
        );

        const filename = `${slot}-${width}.${format.ext}`;
        const outPath = path.join(OUT_DIR, filename);
        await writeFile(outPath, buffer);

        rows.push({
          slot,
          width,
          ext: format.ext,
          bytes: buffer.length,
          quality,
        });

        if (overBudget) {
          budgetProblems.push({
            slot,
            width,
            ext: format.ext,
            bytes: buffer.length,
            budget,
            finalQuality: quality,
            minQuality: format.minQuality,
          });
        }

        srcset[format.ext].push(`/img/gen/${filename} ${width}w`);
      }
    }

    imagesEntries[slot] = {
      alt,
      ratio,
      width: largestWidth,
      height: largestHeight,
      srcset: {
        avif: srcset.avif.join(", "),
        webp: srcset.webp.join(", "),
        jpg: srcset.jpg.join(", "),
      },
      fallback: `/img/gen/${slot}-800.jpg`,
    };
  }

  // Print the table: slot, width, ext, bytes
  const colWidths = {
    slot: Math.max(4, ...rows.map((r) => r.slot.length)),
    width: 5,
    ext: 3,
    bytes: Math.max(5, ...rows.map((r) => String(r.bytes).length)),
  };
  const pad = (s, n) => String(s).padEnd(n, " ");
  console.log(
    `${pad("slot", colWidths.slot)}  ${pad("width", colWidths.width)}  ${pad(
      "ext",
      colWidths.ext
    )}  ${pad("bytes", colWidths.bytes)}`
  );
  for (const r of rows) {
    console.log(
      `${pad(r.slot, colWidths.slot)}  ${pad(r.width, colWidths.width)}  ${pad(
        r.ext,
        colWidths.ext
      )}  ${pad(r.bytes, colWidths.bytes)}`
    );
  }

  if (budgetProblems.length > 0) {
    console.log("\nBudget problems (after lowering quality to the floor):");
    for (const p of budgetProblems) {
      console.log(
        `  ${p.slot}-${p.width}.${p.ext}: ${p.bytes} bytes > ${p.budget} byte budget ` +
          `(quality lowered to floor ${p.finalQuality}, minimum allowed ${p.minQuality})`
      );
    }
  }

  // Write lib/images.ts
  const tsLines = [];
  tsLines.push("// Generated by scripts/build-images.mjs. Do not hand-edit.");
  tsLines.push("// Source of truth: images-src/manifest.json");
  tsLines.push("");
  tsLines.push("export interface ImageSrcset {");
  tsLines.push("  avif: string;");
  tsLines.push("  webp: string;");
  tsLines.push("  jpg: string;");
  tsLines.push("}");
  tsLines.push("");
  tsLines.push("export interface ImageEntry {");
  tsLines.push("  alt: string;");
  tsLines.push("  ratio: string;");
  tsLines.push("  width: number;");
  tsLines.push("  height: number;");
  tsLines.push("  srcset: ImageSrcset;");
  tsLines.push("  fallback: string;");
  tsLines.push("}");
  tsLines.push("");
  const slotNames = manifest.map((e) => e.slot);
  tsLines.push(
    `export type ImageSlot = ${slotNames.map((s) => `"${s}"`).join(" | ")};`
  );
  tsLines.push("");
  tsLines.push("export const IMAGES: Record<ImageSlot, ImageEntry> = {");
  for (const slot of slotNames) {
    const entry = imagesEntries[slot];
    tsLines.push(`  "${slot}": {`);
    tsLines.push(`    alt: ${JSON.stringify(entry.alt)},`);
    tsLines.push(`    ratio: ${JSON.stringify(entry.ratio)},`);
    tsLines.push(`    width: ${entry.width},`);
    tsLines.push(`    height: ${entry.height},`);
    tsLines.push(`    srcset: {`);
    tsLines.push(`      avif: ${JSON.stringify(entry.srcset.avif)},`);
    tsLines.push(`      webp: ${JSON.stringify(entry.srcset.webp)},`);
    tsLines.push(`      jpg: ${JSON.stringify(entry.srcset.jpg)},`);
    tsLines.push(`    },`);
    tsLines.push(`    fallback: ${JSON.stringify(entry.fallback)},`);
    tsLines.push(`  },`);
  }
  tsLines.push("};");
  tsLines.push("");

  await writeFile(LIB_PATH, tsLines.join("\n"), "utf8");

  if (budgetProblems.length > 0) {
    console.log(
      `\n${budgetProblems.length} output(s) remained over budget even at floor quality.`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
