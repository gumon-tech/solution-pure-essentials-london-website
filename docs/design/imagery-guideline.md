# Imagery guideline for the Pure Essentials London website

Queue row Q23. Written 2026-09-13 by the PWEB Lead, before any picture is chosen. Sources: the
owner's decision of 2026-09-13 (`docs/plans/DECISIONS-2026-09-13.md`), the TTD shop site's
guideline (`~/dev/solutions-taitamd-shop-website/docs/design/imagery-guideline.md`, read in full
2026-09-13) and its hand lesson (TTD commit 660c083), the workspace Gemini tool
(`~/dev/gumon-workspace/docs/ask-gemini.md`), and 1 test image generated and checked 2026-09-13.
Answers from SHOP and WS are added in section 9 when they arrive.

## 1. The rule that decides every picture

**A page shows a person being made beautiful, not the room it happens in.**

The owner, 2026-09-13: the TTD site became large text with images that avoid people, "like a
furniture shop more than a beauty clinic". The TTD owner said the same on 2026-09-12: a treatment
page that shows only a bed looks like it is selling beds.

Test for every image: open it and ask what it sells. Bed, lamp, towel, bottle, plaster wall means
it fails as a main image. A facial, a massage, laser hair removal, a relaxed client means it
passes. Room photos are allowed only as secondary images next to a people image.

## 2. How much imagery

The site is image-led. Minimums per built page, measured on `out/` HTML and on screenshots at 390
and 1440 px wide:

| Page type | Minimum |
|---|---|
| Home | a people image in the first viewport; at least 1 image per viewport height after that; each of the 4 groups has its own people image |
| Treatments list | a people image per category header (11) |
| Storytelling page | a people hero plus 3 to 5 in-page images |
| Contact | at least 3 real room photos, edited warm, plus 1 reception or welcome image with a person |

No section of more than 1 viewport height of text without an image or a clear visual break.
Headings stay at the type scale; no giant text used as decoration in place of a picture.

## 3. Sources, in order

1. **Client photos, edited.** The owner allows grading, cropping, retouching and extending when a
   photo is not beautiful or not suitable. Real rooms may be described as the clinic's rooms.
   - Usable: the warm wood-slat room, the Valmont room (crop so the brand sign is not the
     subject), the 5 white rooms after a warm grade.
   - Not usable: the certificate wall (readable names) unless blurred; never as a hero.
   - Editing keeps the room true: warmth, exposure, crop, removing clutter such as cables or a
     bin is fine; inventing furniture, windows or equipment the room does not have is not.
2. **Generated with Gemini** through `~/dev/gumon-workspace/bin/ask-gemini --image-out`
   (default image model `gemini-3.1-flash-image`, key check passed 2026-09-13). People and faces
   allowed. Used for every people image. Owner decision 2026-09-13 (PEL commit a9e5a76): these AI
   images are the production images, not placeholders; no clinic photo shoot is planned.
3. Stock photography is not used.

## 4. What alt text and captions may say

- Real client photos of the rooms: may say "a treatment room at Pure Essentials London".
- Generated images: describe what is seen, never claim it is our room, our therapist, or a real
  client. Allowed: "A facial in progress, the client relaxed with eyes closed". Not allowed:
  "Our therapist with a client at Pure Essentials".
- No medicine name, brand of medicine, or "anti-wrinkle" wording in alt text, captions or file
  names.

## 5. Hard limits on content

- No needle, syringe, cannula or injection in any image, generated or real.
- No before-and-after pairs, no "result" framing.
- No text, logos or watermarks inside generated images (the prompt says so every time).
- No real client faces without written permission.
- No image of a person who looks under 18.
- Devices may appear (HIFU handpiece, laser handpiece, microneedling pen held away from skin is
  still a needle: avoid), but the picture is about the person, not the machine.

## 6. Prompt: fixed opening, shot line, fixed anatomy block

Every generated image uses the same opening so the set looks like one clinic.

```
A photograph for a London aesthetics and beauty clinic website. Warm, bright and airy: soft indirect light from a hidden cove in a curved plaster ceiling, walls in warm cream and sand, a soft plaster arch behind the subject, light oak wood details, a boucle cushion. The palette is cream, beige, sand and light wood only, no grey and no stark white. Realistic editorial photography, not illustration, shallow depth of field, natural skin texture. Horizontal 3:2 composition. No text, no logos, no watermarks anywhere in the image.
```

Then 1 shot line from section 7. Then always:

```
Anatomy requirements, follow exactly. Every hand has exactly four fingers and one thumb, five digits in total, each separate and countable, with natural length and natural joints. No sixth finger, no missing thumb, no fused fingers, no fingers merging into another person's hand, no floating or detached hands, no duplicated or branching limbs. Each hand connects to exactly one wrist and one forearm.
```

Change "Horizontal 3:2" to "Vertical 4:5" for arch-masked images. Fewer hands in frame means
fewer ways to fail: put the client's hands out of frame unless the shot needs them.

Test result 2026-09-13 with this opening and the facial shot line: 1264 x 848 JPEG, 809,290 bytes,
11.2 s, cream and sand palette as asked, arch and cove light present, 1 therapist hand visible;
the therapist's chin entered the frame although the line said face out of frame. Brightness and
the finger count are recorded on queue row Q24.

## 7. Shot list for the Monday preview and set 1 of the storytelling pages

| Where | Shot line (what must be seen) | Ratio |
|---|---|---|
| Home hero | A woman in her thirties lies back on a couch under a sand-coloured waffle blanket, eyes closed, face relaxed and visible, cream headband; a therapist's hands apply cream along her cheek and jaw. Therapist's face out of frame. | 3:2 |
| Group card Face | Close view of a client's face and neck, eyes closed, a therapist's fingertips lifting along the cheekbone during a facial massage. | 4:5 |
| Group card Body | A client lying face down under a cream towel, a therapist's hands working along the lower back and waist, calm and warm. No device. | 4:5 |
| Group card Laser and hair removal | A client in a cream robe seated, protective eyewear on, a therapist in cream gloves holding a smooth handheld laser device just above the client's forearm. No beam, no redness. | 4:5 |
| Group card Wellness | A therapist's hands pressing across a client's shoulders during a massage, the client face down, a folded cream towel, warm light. | 4:5 |
| How it works 1 Message | A woman's hands holding a phone in a softly lit cafe or at home, the screen not readable, relaxed. | 4:5 |
| How it works 2 Consultation | A woman seated in a boucle armchair talking with a therapist who holds a notebook, both smiling slightly, arch behind. | 4:5 |
| How it works 3 Treatment | A therapist placing warm stones or a warm towel on a client's back, face out of frame. | 4:5 |
| How it works 4 Aftercare | A woman in a cream robe holding a cup of tea in a warm lounge, face visible, calm. | 4:5 |
| Contact welcome | A receptionist in cream smiling across a curved light-oak desk to a client arriving, warm light. | 3:2 |
| Story HIFU | A client lying back, eyes closed, a therapist gliding a smooth ultrasound handpiece along the jawline. No redness, no marks. | 3:2 |
| Story laser hair removal | A therapist in cream gloves moving a laser handpiece along a client's lower leg, both wearing protective eyewear, client's face out of frame. | 3:2 |
| Story facials | A therapist applying a creamy mask with a soft brush to a relaxed client's cheek. | 3:2 |
| Story body contouring | A client in a cream robe standing, a therapist beside her pointing gently at a treatment plan on a tablet with the screen not readable. | 3:2 |

## 8. Checklist before an image enters the repo

```
1  What does it sell: a treatment or a relaxed person, not furniture
2  Count every finger of every hand at full size: 4 fingers and 1 thumb, one wrist, one forearm, no merging between people
3  No needle, no text, no logo, no watermark, no readable screen, no under-18 look
4  Brightness on the 24x24 averaged scale: 55 or more on 0 to 100 (aim high: a cream site with dark pictures loses its lightness)
5  File size after conversion: hero under 200 kB, cards under 60 kB (Q5 budgets)
6  A sidecar <file>.prompt.txt with the full prompt, model and date sits next to every generated source in images-src/
7  alt text follows section 4
8  The Lead looks at the full-size image before merge; an executor never passes its own image
```

## 9. Answers from SHOP and WS (2026-09-13)

### From SHOP (TTD shop site, read at their HEAD 58ccd2e)

- There is no measured image-to-text ratio or images-per-viewport figure on the TTD site. What they
  measure is lit cells (brightness probe, must not drop) and the count of img tags in `out/`, never
  in the source (the source reports the TTD home page as 0 images while the build has 26). Our
  section 2 minimums are therefore our own rule, measured on `out/` and on screenshots.
- No page effectiveness was measured. Facts: 6 landing pages got people-doing-treatment images;
  the owner objected only to the waxing image (wrong hand). Still "furniture shop" on TTD: their
  home hero (a massage room with nobody in it) and the 6 empty-room service cards. Do not copy
  their hero.
- Prompt lessons: a dark brand colour asked for as the wall made images too dark (brightness 26
  to 34); keep dark colours as accents and light surfaces as the ground (our palette is light, so
  aim 55 or more). Fewer hands in frame; for 3-hand shots ask for fingers separated and resting
  flat, expect up to 3 attempts.
- Text over images measured 2.86 to 3.51 contrast and failed AA; text sits on its own solid
  ground, never on a gradient over a photo.
- People images: half-figure or hands-and-skin shots carry fewer hands to get wrong.
- Scripts worth copying later (only versions after TTD commits fca793f and 58ccd2e, earlier
  versions left Chrome running for 8 hours): brightness-probe.js, brightness-run.mjs,
  contrast-probe.mjs (must print control values 7.17 and 7.78 before its results are trusted),
  screenshot.mjs, visual-gate-report.mjs.

### From WS

- The only tool is `~/dev/gumon-workspace/bin/ask-gemini --image-out`, with `-i source.jpg` to edit
  or extend an image. Default model `gemini-3.1-flash-image`; `gemini-3-pro-image` is available
  with `-m` for higher quality. Output is often JPEG whatever the extension; check the file type.
- Rooms and their executors may call it without a ticket. No daily cap is set; use it sensibly,
  one image at a time with a look at each result. Never print the key.
- No central ruling on SynthID or C2PA (C2PA paused under Q-ACAD-287; Gemini embeds SynthID).
  Keep a register of prompt, model, date and source file (when `-i` is used). Here: the
  `.prompt.txt` sidecars on OneDrive plus a register table in this file once images are chosen.
- Client room photos may be edited with `-i`: light, colour, crop, removing clutter. If an edit
  adds or changes objects in the room (equipment, people, signs), the result counts as an AI
  illustration and follows the alt rules in section 4.
- Originals stay on OneDrive (standing order A2); selected copies enter the repo. The repo is
  public: no real faces without consent, no clinic customer data in any image.
- **PEL decides which images go on the site.** PWEB proposes a set with the checklist results; PEL
  approves before deploy.

## 10. Image register (chosen images and their provenance)

Lead check 2026-09-13: every image below was viewed on a contact sheet and its hands at full-size crop;
each visible hand has 4 fingers and 1 thumb on one wrist, no merging between people, no needle, no
readable text, brightness 55 or more on the 24x24 scale (measured by the executor, 55.5 to 68.6).
Sources and prompt sidecars are on OneDrive `10-Work/PEL-Pure-Essentials-London/site-images/generated-2026-09-13/`.
Model for all: gemini-3.1-flash-image via bin/ask-gemini, generated 2026-09-13. All are AI images: alt text
follows section 4. Approval before deploy: PEL.

| Slot | Chosen file | Rejected alternative and why |
|---|---|---|
| home-hero | home-hero-a.jpg (crop top edge) | none generated |
| face-card | face-card-b.jpg | a: fine, b has the cleaner hand line |
| body-card | body-card-a.jpg | b: fine, a is warmer |
| laser-card | laser-card-a.jpg | b: REJECT, the word LASER printed on the device |
| wellness-card | wellness-card-b.jpg | a: fine |
| step-1-message | step-1-message-b.jpg | a: fine |
| step-2-consultation | step-2-consultation-a.jpg | b: fine |
| step-3-treatment | step-3-treatment-b.jpg | a: fine; both show the therapist's face, accepted (generated person) |
| step-4-aftercare | step-4-aftercare-b.jpg | a: fine, b smiles |
| contact-welcome | contact-welcome-a.jpg | b: fine |
| story-hifu | story-hifu-b.jpg | a: fine, b has fewer hands |
| story-facials | story-facials-b.jpg | a: fine |
| story-body-contouring | story-body-contouring-b.jpg | a: tablet shows an unreadable body diagram, b keeps the screen out of view |
| story-laser-hair | story-laser-hair-c.jpg (plain device, 2 gloved hands counted 4 plus 1 each, client blurred behind) | a and b: REJECT, fabricated brand text; d: client face in profile; e: client in a black top off palette and the leg sits far from her body |

### Real room photos, edited with Gemini (Lead check 2026-09-13)

Sources on OneDrive `site-images/edited-client-2026-09-13/gemini/`, compare sheets in `_compare/`. First pass
with PIL was rejected by eye (cold and washed out) although it met the numbers. Second pass numbers: brightness
61 to 78, R minus B 40 to 79 (outside the 8 to 25 band the brief set); judged by eye instead, as the band came
from the rejected pass.

| Slot | Chosen | Edit class | alt rule | Rejected |
|---|---|---|---|---|
| room-warm | room-07.jpg from the PIL pass (parent folder edited-client-2026-09-13/) | light and colour only | may say a treatment room at Pure Essentials London | contact-room-a-a and a-b: REJECT by PEL 2026-09-13, the gold walls became cream (a material change) |
| room-trolley | room-02.jpg from the PIL pass (wall lettering cropped out; product bottles keep their brand, grey towel stays grey) | light, colour and crop only | may say a treatment room at Pure Essentials London | contact-room-b-a and b-b: REJECT by PEL 2026-09-13, towel recoloured, wood edge added, labels blurred |
| room-analyser | contact-room-c-a.jpg (cabinet room with the skin analyser) | light and colour only | may say a treatment room at Pure Essentials London | c-b: fine, flatter |
| room-couch | contact-room-d-a.jpg (small room with rolled towels) | light and colour only | may say a treatment room at Pure Essentials London | d-b: REJECT, trolley and cabinet turned to wood grain |

PEL rule 2026-09-13 (lead repo brief section 11): a photo of the clinic must remain the clinic. Only light, white balance, brightness and crop may change; never surface colour, material, objects or lettering. There is no "AI-edited room" class. Room photos stay secondary (contact page and the clinic story), never a page's main image (section 1).

### Category header images (Lead check 2026-09-13)

Sources in `generated-2026-09-13/`, all AI images (section 4 alt rule). Hands checked at full-size crops: 4 fingers
and 1 thumb per visible hand. Brightness 60.0 to 71.1. Approval before deploy: PEL.

| Slot | Chosen | Crop | Rejected alternative and why |
|---|---|---|---|
| cat-laser-skin | cat-laser-skin-a.jpg | none | b: dark navy goggles against the palette |
| cat-skin | cat-skin-a.jpg | trim the right 12 percent (therapist's chin) | b: therapist's chin, mirror of a |
| cat-skinboosters | cat-skinboosters-b.jpg | none | a: client in black trousers |
| cat-carboxy | cat-carboxy-a.jpg | keep the top 72 percent (removes the practitioner's black trousers), 4:5 by side trim | b: black trousers in the upper frame too |
| cat-waxing-ladies | cat-waxing-ladies-b.jpg | none | a: fine, b hands clearer |
| cat-waxing-men | cat-waxing-men-a.jpg | none | b: therapist's mouth and chin enter the frame |

PEL approved all 6 category images 2026-09-13 after viewing each at full size (lead repo brief section 14, commit 431b710), under the existing illustrative-images footer line.

### Family page images (executor check 2026-09-13, awaiting Lead and PEL review)

Why: the owner saw the same picture 2 to 4 times on one family page, because the hero and every "You may also like"
card used the category slot. Each of the 21 family pages now has its own slot, used as its hero and as its card on other
family pages (`FAMILY_IMAGE_SLOT` in `components/FamilyPage.tsx`; a family with no entry falls back to its category slot).
Shots follow PEL's rules in the lead repo brief section 32. Sources and `fam-<name>.prompt.txt` sidecars (every attempt's
full prompt) are on OneDrive `site-images/generated-2026-09-13/`. Model: gemini-3.1-flash-image via bin/ask-gemini, 2026-09-13,
Vertical 4:5, 928 x 1152. All are AI images: alt text follows section 4. Hands were checked on full-size crops at 2x;
"occluded" means a finger or thumb is hidden behind an object or the other hand, with no extra finger visible. Brightness is
the 24x24 average luminance on 0 to 100. Approval before deploy: PEL, at full size.

| Slot | Family | Chosen | Brightness | Hands counted | Rejected alternative and why |
|---|---|---|---|---|---|
| fam-hifu-face | HIFU (face) | fam-hifu-face-a.jpg | 59.4 | 1 gloved hand: thumb and fingers wrap the device, rest occluded | b: fine, near mirror of a |
| fam-cryotherapy | pen-sized cold device | fam-cryotherapy-a.jpg | 62.9 | 1 gloved hand thumb and 2 fingers, 2 occluded; client hand 4 fingers, thumb under palm | b: therapist's chin and lips at the top edge |
| fam-light-platform | light platform | fam-light-platform-b.jpg | 69.0 | 2 therapist hands, 4 fingers and 1 thumb each | a: black console screen facing the camera, off palette |
| fam-ipl | IPL | fam-ipl-a.jpg | 61.2 | 2 gloved hands: 4 fingers each, thumbs visible or occluded | b: REJECT, 1 therapist with 3 gloved hands |
| fam-pico-laser | pico laser | fam-pico-laser-b.jpg | 69.6 | 1 gloved hand, thumb on top and 4 fingers | a: 2 hands fine, but the large head sits over the brow and repeats the IPL look |
| fam-tattoo-removal | tattoo removal | fam-tattoo-removal-a.jpg | 63.3 | therapist 2 gloved hands; client 2 hands, 4 fingers each, thumbs occluded | b: therapist's lower gloved hand is a shapeless fist, fingers not countable |
| fam-gold-microneedling | gold microneedling | fam-gold-microneedling-a.jpg | 59.8 | 1 gloved hand around the pen, no tip visible | b: a second, ungloved arm behind the pillow |
| fam-microneedling | microneedling | fam-microneedling-c.jpg, crop topKeepPct 72 (removes a small capped cylinder that reads as a vial) | 65.9 on the crop | 1 gloved hand: thumb and 4 fingers; lower hand cropped out | a: metal tip touching the nose, bare hands; b: metal tip at the temple, bare hands; c uncropped: vial-like object by the lower hand; d: pen end at the upper lip and the therapist's face in frame |
| fam-chemical-peel | chemical peel | fam-chemical-peel-a.jpg | 70.0 | 1 gloved hand, thumb and 4 fingers | b: glistening liquid patch on the cheek, second arm behind the pillow |
| fam-radiofrequency | radiofrequency (back) | fam-radiofrequency-b.jpg | 61.4 | 1 gloved hand, 4 fingers and 1 thumb | a: therapist's chin at the top edge, client in a crop top |
| fam-skin-booster-body | skin booster, body (consultation) | fam-skin-booster-body-a.jpg | 70.3 | client 2 hands stacked; therapist 2 hands, 4 fingers and 1 thumb each | b: fine, a green plant off palette |
| fam-skin-booster-face | skin booster, face (consultation) | fam-skin-booster-face-b.jpg | 57.3 | therapist 2 hands on the tablet (thumbs visible); client 1 hand, 4 fingers | a: therapist in black trousers |
| fam-skin-booster-hydration | skin booster (consultation) | fam-skin-booster-hydration-b.jpg | 64.4 | client glass hand 4 fingers and 1 thumb; therapist 2 hands stacked; client lap hand soft | a: client in black trousers |
| fam-fat-reduction | body device pad (thigh) | fam-fat-reduction-b.jpg | 63.3 | 1 gloved hand, thumb and 4 fingers; client hand 4 fingers, thumb occluded | a: therapist's chin and mouth at the top edge |
| fam-muscle-toning | body device pad (abdomen) | fam-muscle-toning-a.jpg | 66.1 | client 1 hand, 4 fingers, thumb occluded | b: fine, reclined chair |
| fam-hifu-body | HIFU body | fam-hifu-body-a.jpg | 65.6 | 1 gloved hand, thumb and 3 fingers, 1 occluded | b: client's pose unclear, arm and head position ambiguous |
| fam-laser-hair | laser hair removal | fam-laser-hair-b.jpg | 62.6 | 2 gloved hands, 4 fingers each; raised client hand behind the head | a: therapist's full face in profile without eyewear |
| fam-hydrating-facial | hydro facial | fam-hydrating-facial-a.jpg | 64.6 | 2 bare hands, 4 fingers and 1 thumb each | b: therapist's face in profile, wet sheen on the skin |
| fam-sensitive-skin-facial | sensitive skin facial | fam-sensitive-skin-facial-b.jpg | 61.1 | no hands in frame | a: fine, wider and the face smaller |
| fam-microdermabrasion | microdermabrasion (warm cloth) | fam-microdermabrasion-b.jpg | 66.5 | 2 gloved hands, 4 fingers each, thumbs occluded | a: therapist's chin at the top edge |
| fam-botanical-facial | facial | fam-botanical-facial-b.jpg | 67.8 | 2 therapist hands on the shoulders, 4 fingers each | a: dark amber jars on the shelf, off palette |

Generated: 44 images (2 per family, plus microneedling c and d). Not generated, as PEL ruled: aesthetics_1_emsculpt and
carboxytherapy have no family page and keep their fallback. Our clinic page: the call-to-action image changed from
contact-welcome to step-4-aftercare, so contact-welcome appears once.
