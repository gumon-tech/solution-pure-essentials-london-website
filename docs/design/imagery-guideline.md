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
   allowed. Used for every people image until the clinic's own photo shoot exists.
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
| story-laser-hair | pending attempts c to e | a and b: REJECT, fabricated brand text on the handpiece |
