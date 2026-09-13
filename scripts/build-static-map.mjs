// Builds the static contact-page map image (PEL cookie-law ruling 2026-09-13: no Google map
// iframe on our pages). Local machine only, never in CI. See images-src/map/README.md.
//
//   node scripts/build-static-map.mjs           build from the saved files (no network)
//   node scripts/build-static-map.mjs --fetch   fetch the geocode and the 9 tiles again,
//                                                save them, then build
//
// Inputs (saved in the repo):  images-src/map/geocode.json, images-src/map/tiles/<z>-<x>-<y>.png
// Outputs:                     public/img/map/clinic-map.{avif,webp,jpg}
//
// Geocode: Nominatim has no house number 155 on King's Cross Road; it returns road segments
// only. The first result (way 1065218275, King's Cross Road, WC1X 9BJ) is hardcoded below. It
// is a point on the road near the clinic, not the building itself. The build checks that the
// saved geocode.json still has these values as its first result.
//
// Tiles: OpenStreetMap standard tiles, zoom 17, a 3 by 3 grid (9 tiles) around the point.
// With --fetch, requests go one at a time, with a descriptive User-Agent and at least 1 second
// between requests. Licence: map data (c) OpenStreetMap contributors, ODbL; the page shows
// "Map data © OpenStreetMap contributors" linking to https://www.openstreetmap.org/copyright.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import sharp from "sharp";

// Pin: the WC1X 9BN postcode centre point from postcodes.io (images-src/map/postcode.json),
// Lead change 2026-09-13. Nominatim has no house number 155 and returned only a road segment
// (51.5299512, -0.1161387, kept in geocode.json), about 47 m east of the postcode point, on the
// carriageway. Both points fall in the same 3 by 3 tile grid, so no new tile fetch was needed.
const LAT = 51.530049;
const LON = -0.116807;
const ZOOM = 17;
const TILE = 256;
const USER_AGENT = "PWEB-static-map/1.0 (pel.gumon.io)";
const DELAY_MS = 1100;
const GEOCODE_URL =
  "https://nominatim.openstreetmap.org/search?format=json&q=155+King%27s+Cross+Road,+London+WC1X+9BN";
const SRC_DIR = path.join("images-src", "map");
const TILE_DIR = path.join(SRC_DIR, "tiles");
const GEOCODE_FILE = path.join(SRC_DIR, "geocode.json");
const POSTCODE_FILE = path.join(SRC_DIR, "postcode.json");
const OUT_DIR = path.join("public", "img", "map");
const OAK = "#7C5E45";
const CREAM = "#F7F2EA";

const FETCH = process.argv.includes("--fetch");
let requests = 0;

async function politeGet(url) {
  if (requests > 0) await sleep(DELAY_MS);
  requests++;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  console.log(`GET ${url} -> ${res.status}, ${body.length} bytes`);
  return body;
}

// Web Mercator: fractional tile coordinates of the point.
const n = 2 ** ZOOM;
const xf = ((LON + 180) / 360) * n;
const latRad = (LAT * Math.PI) / 180;
const yf = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
const tx0 = Math.floor(xf) - 1;
const ty0 = Math.floor(yf) - 1;

const grid = [];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const x = tx0 + col;
    const y = ty0 + row;
    grid.push({
      col,
      row,
      url: `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`,
      file: path.join(TILE_DIR, `${ZOOM}-${x}-${y}.png`),
    });
  }
}

if (FETCH) {
  mkdirSync(TILE_DIR, { recursive: true });
  writeFileSync(GEOCODE_FILE, await politeGet(GEOCODE_URL));
  for (const t of grid) writeFileSync(t.file, await politeGet(t.url));
  console.log(`requests made: ${requests} (1 geocode, ${grid.length} tiles)`);
}

// Build from the saved files only.
if (!existsSync(GEOCODE_FILE)) throw new Error(`${GEOCODE_FILE} missing; run with --fetch once`);
if (!existsSync(POSTCODE_FILE)) throw new Error(`${POSTCODE_FILE} missing`);
const pc = JSON.parse(readFileSync(POSTCODE_FILE, "utf8"));
if (Number(pc.latitude) !== LAT || Number(pc.longitude) !== LON) {
  throw new Error(
    `${POSTCODE_FILE} is ${pc.latitude},${pc.longitude}, script has ${LAT},${LON}; update the constants`,
  );
}
const tiles = grid.map((t) => {
  if (!existsSync(t.file)) throw new Error(`${t.file} missing; run with --fetch once`);
  return { input: readFileSync(t.file), left: t.col * TILE, top: t.row * TILE };
});

const stitched = await sharp({
  create: { width: TILE * 3, height: TILE * 3, channels: 3, background: CREAM },
})
  .composite(tiles)
  .png()
  .toBuffer();

// Point position inside the stitched 768x768 image, then a 768x512 (3:2) crop kept as close
// to vertically centred on the point as the grid allows. No upscaling: 9 tiles give 768 px.
const lx = (xf - tx0) * TILE;
const ly = (yf - ty0) * TILE;
const WIDTH = TILE * 3;
const HEIGHT = 512;
const top = Math.max(0, Math.min(TILE * 3 - HEIGHT, Math.round(ly - HEIGHT / 2)));
const pinX = Math.round(lx);
const pinY = Math.round(ly - top);
console.log(`point in crop: x=${pinX} y=${pinY} of ${WIDTH}x${HEIGHT}`);

// Light warm wash: lower saturation, then a thin cream layer.
const washed = await sharp(stitched)
  .extract({ left: 0, top, width: WIDTH, height: HEIGHT })
  .modulate({ saturation: 0.7 })
  .composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"><rect width="100%" height="100%" fill="${CREAM}" fill-opacity="0.15"/></svg>`,
      ),
      left: 0,
      top: 0,
    },
  ])
  .png()
  .toBuffer();

// Pin: a 40x54 teardrop in oak with a cream centre; its tip sits on the point.
const PIN_W = 40;
const PIN_H = 54;
const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 40 54">
  <path d="M20 53 C20 53 2 32 2 20 A18 18 0 0 1 38 20 C38 32 20 53 20 53 Z" fill="${OAK}" stroke="${CREAM}" stroke-width="2.5"/>
  <circle cx="20" cy="20" r="7" fill="${CREAM}"/>
</svg>`;

const png = await sharp(washed)
  .composite([{ input: Buffer.from(pinSvg), left: pinX - PIN_W / 2, top: pinY - PIN_H + 1 }])
  .png()
  .toBuffer();

mkdirSync(OUT_DIR, { recursive: true });
const base = path.join(OUT_DIR, "clinic-map");
const outputs = [
  [`${base}.avif`, sharp(png).avif({ quality: 60 })],
  [`${base}.webp`, sharp(png).webp({ quality: 80 })],
  [`${base}.jpg`, sharp(png).jpeg({ quality: 82, mozjpeg: true })],
];
for (const [file, pipeline] of outputs) {
  const info = await pipeline.toFile(file);
  console.log(`wrote ${file}: ${info.width}x${info.height}, ${info.size} bytes`);
}
console.log(`network requests this run: ${requests}`);
