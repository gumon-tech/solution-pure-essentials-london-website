# Definition of done for the Pure Essentials London website

Written 2026-09-13 by PWEB. A row in `docs/plans/QUEUE.md` is done only when every acceptance item
on the row has been re-run by the Lead and the raw output is on the row or in the commit message.
Three states only: DONE (measured), PART (which part, measured), OPEN. There is no fourth state.

## Site-level gates that apply to every deploy

| # | Gate | How it is measured | Threshold |
|---|---|---|---|
| 1 | Builds and serves | `npm run build` exit 0, then `curl -sI https://pel.gumon.io/<path>/ | head -1` | HTTP 200 for every page in the sitemap |
| 2 | Only live rows render | script counts service names in `out/` against `data/services.json` rows with status live | 0 held or review names in `out/` |
| 3 | No medicine wording | `grep -rioE 'botox|botulinum|anti-?[ -]?wrinkle|wrinkle relax' out/` | 0 hits |
| 4 | Every price matches the data file | script compares each rendered price with `price_gbp` | 0 mismatches |
| 5 | Every service CTA opens WhatsApp with the name and Ref | count of `wa.me/447767496803?text=` links in `out/` equals live rows rendered | equal |
| 6 | Image weight | every file under `public/images/` | under 300 kB, width 1600 px or less |
| 7 | Lint | `npm run lint` | 0 warnings (max-warnings=0) |
| 8 | No client names | `grep -rn` for the two real names in the repo | 0 hits |
| 9 | Accessibility minimum | Lighthouse accessibility on home, services, contact | 90 or above |
| 10 | Performance | Lighthouse mobile on home | LCP under 2.5 s, CLS under 0.1 |

## What is out of scope until PEL or the owner rules

Held and review rows (Q-PEL-023), medicine-adjacent consultation pages, testimonials, before-and-
after imagery, the clinic's own domain switch, the Google tag before the consent banner exists.
