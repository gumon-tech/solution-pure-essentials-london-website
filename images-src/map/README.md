# Contact page map image: sources

The map on the contact page is a still image, not a Google map. It is made from OpenStreetMap
tiles saved in this folder, so it can be rebuilt without fetching anything again.

The image is made on a local machine only, never in CI.

## What is here

| File | What it is |
|---|---|
| `geocode.json` | The Nominatim search response for the clinic address, saved as returned |
| `postcode.json` | The postcodes.io centre point for WC1X 9BN (the previous pin) |
| `google-place.json` | The clinic's Google Maps business listing coordinates, which set the pin |
| `tiles/<z>-<x>-<y>.png` | The 9 OpenStreetMap standard tiles used for the image |

The output is `public/img/map/clinic-map.avif`, `.webp` and `.jpg`, 768 by 512 pixels.

## How it was made

- Date: 2026-09-13
- Address searched: 155 King's Cross Road, London WC1X 9BN
- Geocode request: `https://nominatim.openstreetmap.org/search?format=json&q=155+King%27s+Cross+Road,+London+WC1X+9BN`
- Pin: latitude 51.530049, longitude -0.116807, the centre point of postcode WC1X 9BN from
  `https://api.postcodes.io/postcodes/WC1X9BN` (1 request, 2026-09-13, saved as `postcode.json`).
  Nominatim has no house number 155 on this road; its first result (51.5299512, -0.1161387,
  postcode WC1X 9BJ) was a point on the carriageway about 47 metres east. The first build used
  it; the Lead moved the pin to the postcode point. Both points fall in the same 9 tiles, so no
  tile was fetched again.
- Pin moved again the same day to the clinic's Google Maps business listing (latitude 51.5300551,
  longitude -0.1166754), from the listing link the owner supplied (`google-place.json`). It is about
  9 metres from the postcode point, and Google Street View shows the shopfront at 155 King's Cross Road.
- Zoom: 17
- Tiles: a 3 by 3 grid, 9 tiles, 256 pixels each, cropped to 768 by 512
- User-Agent sent: `PWEB-static-map/1.0 (pel.gumon.io)`
- Requests go one at a time, at least 1 second apart.

Tile URLs:

1. https://tile.openstreetmap.org/17/65492/43570.png
2. https://tile.openstreetmap.org/17/65493/43570.png
3. https://tile.openstreetmap.org/17/65494/43570.png
4. https://tile.openstreetmap.org/17/65492/43571.png
5. https://tile.openstreetmap.org/17/65493/43571.png
6. https://tile.openstreetmap.org/17/65494/43571.png
7. https://tile.openstreetmap.org/17/65492/43572.png
8. https://tile.openstreetmap.org/17/65493/43572.png
9. https://tile.openstreetmap.org/17/65494/43572.png

Request count on 2026-09-13: 21 in total, including 1 postcodes.io request by the Lead. The first build made 10 requests (1 geocode by
`curl`, then 9 tiles) without saving the files. The saved files come from a second run with
`--fetch`, which made 10 more requests (1 geocode, 9 tiles).

## Commands

Run from the site repo root.

Fetch again and build (only if the saved files must be replaced):

```bash
node scripts/build-static-map.mjs --fetch
```

Build from the saved files, with no network:

```bash
node scripts/build-static-map.mjs
```

## Licence

Map data © OpenStreetMap contributors, available under the Open Database Licence (ODbL).
The map tiles are licensed CC BY-SA. The contact page shows the credit
"Map data © OpenStreetMap contributors" under the map, linking to
https://www.openstreetmap.org/copyright.
