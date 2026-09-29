# Q45: client feedback of 2026-09-29 (F, WhatsApp)

Source: F's messages of 2026-09-29 19:10 to 21:55 UK in the clinic's WhatsApp group with Gumon,
passed on by the owner as 7 screenshots (the owner's Downloads folder) with the order "please
change as shown". Built on komphet-air (room KPEL). Follows the Q42 rules: a new row gets a new
slug, a removed row gets `status: "removed"` with a note (never rendered, kept for history), a
rename sets `display_name`.

## A. Rows (data/services.json, story price tables, lib/families.ts)

| # | F | Change |
|---|---|---|
| A1 | 21:00 | HIFU: remove both "Full Face" rows (full_face £450, full_face_1 £300) |
| A2 | 21:00 | HIFU: new rows "Cheek, Jawline & Neck" £550 1 hr, "Eyes" £200 30 min, "Smile Line" £150 30 min |
| A3 | 21:17 | remove half_face_with_led_and_mask and aesthetics_1_skymedic_chemical_peels (row, family, description, story sentence) |
| A4 | 21:42 | new row "Swedish Massage" £65 1 hr. F wrote "£65 ?(1h)"; 1 hr confirmed by the owner |
| A5 | 21:49 | ladies_waxing_upper_leg_strip_wax £20 to £26 |
| A6 | 21:51 | "(Hot Wax)" added to Bikini, Brazilian, G-String and Hollywood |
| A7 | 21:54 | new rows "Men's Waxing Half Back" £28 and "Men's Waxing Full Back" £35, no duration given (shown without one, owner confirmed) |

Prose that A1 to A7 made untrue was rewritten from the rows: HIFU now runs from £150 and 30 min
(was £280 and 45 min); hot wax now covers the bikini, Brazilian, G-String and Hollywood; men's
waxing now covers the back. Removed rows' old URLs get no stub (Q42 precedent).

## B. Text

- B1 (19:10) Treatment names on the main pages start with capitals: the home hero and meta
  description, the 4 group lines on home and /treatments/ ("Body Contouring", "Skin Boosters",
  "Japanese Head Spa", ...). Story body text is unchanged.
- B2 (19:10) "155" and "Road" removed where the address is used in a sentence
  ("... at King's Cross, 7 days a week"). Full postal addresses with the postcode are kept
  (contact block, footer, map, FAQ "Where is the clinic?", legal pages, structured data), because
  maps and search need them. Ask F if she wants those changed too.

## Acceptance

1. every A row on /treatments/ and its story page with the new name and price; removed rows and
   "Skymedic" appear nowhere in out/
2. no "155 King's Cross Road" in out/ unless followed by the postcode
3. validate, build, lint, redirect stubs and the 5 check scripts all exit 0
4. live on https://pel.gumon.io after deploy, read from outside

## Open for PEL

- data/services.json now 205 rows / 122 live; the lead repo file differs on purpose (Q42, Q45)
- Swedish Massage 1 hr and the 2 back waxing rows without a duration: confirmed by the owner 2026-09-29

## B1 extended to every page (owner 2026-09-29, after the first deploy)

Owner: "fix it on every page", and "the rest as you judge". Treatment names in body text on every
story page and in the family descriptions now start with capitals (Body Contouring,
Cryoelectrolipolysis, Laser Hair Removal, Dermal Fillers, Ladies' Waxing, Hot Wax, ...), as do the
category titles in data/services.json. Measured on out/: 67 lower-case treatment names before,
21 after. The 21 kept on purpose: equipment ("a laser that works with ultra-short pulses", "a
microdermabrasion wand") and steps inside the clinic's head spa ritual texts ("scalp massage").
B2 judged: full postal addresses with the postcode stay as they are, for maps and search.
