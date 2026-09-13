# Photo shot list for a real photo session at the clinic

> **Cancelled 2026-09-13.** Owner decision (PEL commit a9e5a76 in the lead repo): the 20 AI people
> images are the production images, not placeholders, and no photos will be requested from the
> clinic. This list is kept as a record only. The footer line "Some images on this site are
> illustrative." stays.

Queue row Q19 (PWEB part). Written 2026-09-13. Sources: `docs/design/imagery-guideline.md`
(sections 1, 2, 4, 5, 7 and 10), `lib/images.ts`, the 2 pages and 11 story files in `content/`,
and `docs/pel-website-move-brief.md` (sections 10, 11 and 14) in the clinic repo. This list goes
to PEL, who turns it into the photo brief sent to the clinic through the owner.

## 1. Why this list exists

Every people image on the site today is an AI illustration, not a photograph of the clinic or
its clients. The footer says so on every page: "Some images on this site are illustrative." The
imagery guideline (section 3) sets AI images as the second choice, used "for every people image
until the clinic's own photo shoot exists". A real photo session can replace each of the 20 AI
slots one at a time, without changing the page layout, because each replacement keeps the same
ratio and crop the slot already has.

The 20 AI slots in `lib/images.ts` (the other 4 slots are real clinic rooms, already photographs,
covered in section 3 below):

home-hero, face-card, body-card, laser-card, wellness-card, step-1-message, step-2-consultation,
step-3-treatment, step-4-aftercare, contact-welcome, story-hifu, story-facials,
story-body-contouring, story-laser-hair, cat-laser-skin, cat-skin, cat-skinboosters, cat-carboxy,
cat-waxing-ladies, cat-waxing-men.

## 2. Shots, ordered by how many pages use the slot

Counted with a script over `content/home.md`, `content/contact.md` and the 11 files in
`content/stories/` (script output and page names are in the executor's report). Two of the 20
slots, cat-laser-skin and cat-carboxy, are category-header images for the treatments list and do
not appear in any of these 13 files, so they are listed last with a count of 0 for this count.

| Shot id | Where it appears (pages) | What must be seen | Orientation and ratio | Minimum pixel size | Must not appear |
|---|---|---|---|---|---|
| step-2-consultation | 10 pages: Home; Body contouring story; Facials story; First visit guide; HIFU story; Laser hair removal story; Microneedling and peels story; Our clinic story; Skin boosters story; Your visit | A client and a staff member in conversation during a consultation, both smiling naturally; the staff member holds a notebook and pen. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| step-4-aftercare | 9 pages: Home; Body contouring story; Facials story; First visit guide; HIFU story; Laser hair removal story; Massage story; Skin boosters story; Your visit | A client in a robe, face visible and relaxed, holding a cup of tea in a warm lounge setting. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| contact-welcome | 9 pages: Home; Contact; Body contouring story; Facials story; First visit guide; HIFU story; Laser hair removal story; Our clinic story; Your visit | A staff member smiling across the reception desk to a client arriving, warm light. | Landscape, 3:2 | 1896 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| step-3-treatment | 8 pages: Home; Body contouring story; Facials story; First visit guide; HIFU story; Laser hair removal story; Massage story; Your visit | A staff member placing a warm stone or warm towel along a client's back during treatment, the staff member's face out of frame. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| step-1-message | 5 pages: Home; First visit guide; Our clinic story; Waxing story; Your visit | Hands holding a phone in a softly lit setting, the screen not readable, relaxed. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| home-hero | 4 pages: Home; First visit guide; Our clinic story; Your visit | A client lying back, eyes closed, face relaxed and visible, as a therapist's hands apply cream along her cheek and jaw; the therapist's face out of frame. | Landscape, 3:2 | 1755 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| face-card | 4 pages: Home; First visit guide; Microneedling and peels story; Our clinic story | Close view of a client's face and neck, eyes closed, a therapist's fingertips lifting along the cheekbone during a facial massage. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| wellness-card | 3 pages: Home; Massage story; Our clinic story | A therapist's hands pressing across a client's shoulders during a massage, the client face down, a folded towel, warm light. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| body-card | 3 pages: Home; Massage story; Our clinic story | A client lying face down under a towel, a therapist's hands working along the lower back and waist, calm and warm. No device in view. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| laser-card | 2 pages: Home; Our clinic story | A client seated in a robe, protective eyewear on, a therapist in gloves holding a smooth handheld device just above the client's forearm. No beam effect, no redness. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| story-laser-hair | 1 page: Laser hair removal story | A therapist in gloves moving a handheld device along a client's lower leg, both wearing protective eyewear, client's face out of frame. | Landscape, 3:2 | 1896 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| story-hifu | 1 page: HIFU story | A client lying back, eyes closed, a therapist gliding a smooth handheld device along the jawline. No redness, no marks. | Landscape, 3:2 | 1896 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| story-facials | 1 page: Facials story | A therapist applying a creamy mask with a soft brush to a relaxed, smiling client's cheek. | Landscape, 3:2 | 1896 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| story-body-contouring | 1 page: Body contouring story | A client standing, a staff member beside her pointing gently at a treatment plan on a tablet, the screen not readable. | Landscape, 3:2 | 1896 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-waxing-ladies | 1 page: Waxing story | Gloved hands pressing a wax strip against a client's lower leg. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-waxing-men | 1 page: Waxing story | Gloved hands applying a wax strip along a client's bare back, face out of frame. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-skinboosters | 1 page: Skin boosters story | Two people seated during a consultation, one holding a hand mirror, the other writing in a notebook. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-skin | 1 page: Microneedling and peels story | A client lying back, eyes closed, a gloved hand holding a handheld device to her cheek. | Portrait, 4:5 | 1226 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-laser-skin | 0 pages in these 13 files (a treatments category header) | A client lying back in protective eyewear as gloved hands hold a handheld device near her cheek. | Portrait, 4:5 | 1383 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |
| cat-carboxy | 0 pages in these 13 files (a treatments category header) | Two people smiling, looking together at pages in an open folder or book, during a consultation. | Portrait, 4:5 | 995 px on the long edge | Needle; readable screens; certificate names; before-and-after framing; identifiable clients unless they sign consent |

## 3. Room photos: what a reshoot would improve

The 4 real room slots (room-warm, room-trolley, room-analyser, room-couch) already use real
clinic photographs and are usable now. A reshoot of each, based only on what the imagery
guideline's image register (section 10) records about the edits already tried and rejected:

- **room-warm**: 2 edited attempts that turned the room's gold-toned wall to cream were rejected
  as a material change. A reshoot in warm natural light could let the true gold wall read warm
  without any colour edit.
- **room-trolley**: the chosen photo already needs the wall lettering cropped out of frame, and a
  rejected edit recoloured the grey towel and blurred the product labels. A reshoot with a cream
  towel in place of the grey one, framed so the wall lettering is not in shot, would need no crop
  or further edit; the product labels can stay as the clinic's own brands.
- **room-analyser**: the chosen frame was picked over an alternative recorded as "fine, flatter".
  A reshoot with more directional, warmer light would carry that improvement through rather than
  depending on which frame happened to catch better light.
- **room-couch**: a rejected edit had turned the trolley and cabinet to a wood finish they do not
  have, to make the small room look bigger. A reshoot from a wider angle would let the room and
  the rolled towels read comfortably without needing any such edit.

## 4. Practical notes for the day

- Use natural or warm light for every shot; the site's whole palette is cream, beige, sand and
  light wood, never grey or stark white.
- Use cream and sand textiles (towels, robes, cushions) if the clinic has them, so real photos
  sit next to the existing AI images without a visible colour clash.
- Get a written consent form signed by any staff member or model whose face will be identifiable,
  and by any client whose face could be identifiable; no real client face is used without one.
- Keep nails clean on any hands in frame; several shots put hands in close view.
- No jewellery that reads as a brand; the same rule that keeps logos and brand names out of the
  existing images applies to anything worn on camera.
- For every treatment shot, capture both a wide version and a close version, so PWEB can choose
  the crop that works for the slot's ratio without asking for a reshoot.

## 5. Delivery

Send all originals, unedited, to the OneDrive folder PEL names. Do not edit, crop or retouch
before sending. PWEB grades the chosen photographs afterwards with light, white balance,
brightness and crop only, the same rule already set for the clinic's existing room photos:
surfaces, colours of surfaces, materials, objects and text do not change.
