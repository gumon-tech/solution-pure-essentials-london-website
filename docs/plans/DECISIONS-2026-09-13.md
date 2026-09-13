# Owner decisions, 2026-09-13, room PWEB

Recorded verbatim before any work that depends on them. Source: the owner's message in room PWEB
after reading `docs/research/00-direction.md` and the presentation page.

## Owner verbatim

> "เคาะทั้งหมดเลยครับ เราเริ่มงานกันได้
> ข้อควรระวังคือ อย่าให้เว็บมีแค่ตัวอักษรมากเกินไป สิ่งที่ได้เรียนรู้จากการทำเว็บ Taitam-D คือ เว็บกลายเป็นที่แสดงข้อความขนาดใหญ่ เวลามีภาพประกอบก็เลี่ยงคน กลายเหมือนเว็บขายเฟอนิเจอร์มากกว่าคลินิกความสวยงามอะครับ ยังไงดูเรื่องภาพประกอบให้เยอะๆ และดูดีด้วยนะ ถามเรื่องนี้กับห้องเว็บของ Taitam-D ได้ (SHOP)
> เรามีทั้งภาพที่ลูกค้าส่งให้ และมี Gemini ให้ Generate ภาพนะครับ ถามวิธีการกับ WS ได้นะ ใช้ตามความเหมาะสม ถ้าภาพลูกค้าให้มามันไม่สวยหรือไม่เหมาะ ผมอนุญาตให้คุณปรับภาพได้ตามความเหมาะสมได้เลยนะครับ
> อีกเรื่องคือ เว็บเราต้องมี Story telling หลายๆ ตัวด้วยนะ เหมือนของ Taitam-D อะครับ ฝากเพิ่มในแผนให้ด้วยนะ"

## Effect

| # | Decision in 00-direction section 7 | Result |
|---|---|---|
| 1 | Structure | Option A: 4 groups, 11 categories, 24 family pages, 91 prices |
| 2 | Typography | Cormorant Garamond display with Jost body |
| 3 | Hero image on Monday | warm wood room, graded (now superseded in spirit by rule A below: people first) |
| 4 | Rows without a price | shown as "Ask for a quote" with the WhatsApp link |
| 5 | Treatwell rating on Monday | already closed by PEL: omitted |
| 6 | Editing tool | JSON in the GitHub editor with the CI guard and a prompt guide |

New rules from the same message, binding on every page:

- **A. Image-led, people-led.** The site must not be a wall of large text. Imagery must be
  plentiful and beautiful, and it must show people being made beautiful, not empty rooms. The
  failure to avoid, in the owner's words: the TTD site became large text with images that avoid
  people, "like a furniture shop more than a beauty clinic". Ask SHOP for the lessons.
- **B. Generated images are allowed.** Gemini image generation may be used where suitable; the
  method comes from WS. Client photos may be edited (grade, crop, retouch, extend) when they are
  not beautiful or not suitable.
- **C. Many storytelling pages**, like the TTD site's landing pages. Added to the plan as a phase.

Rules that still bind images (unchanged): no needle in any image, no before-and-after, no
certificate wall with readable names, no real client faces without written permission, no
medicine names in alt text or file names. Generated images must not be presented as a real
client's result.

## Later the same day: Treatwell as the backup booking channel, widget and map load straight away

Owner message (verbatim, the staff member's name replaced by the initial F):

> ผมเช็คแล้วครับ ใช้ได้เลยนะ เดี๋ยวผมส่งให้ทางคลินิกตรวจสอบ
> ลูกค้าเน้นย้ำเรื่องช่องทางสำรองในการจอง Treatwell ครับ ประเด็นคือคนตอบ Whatsapp ของร้านได้มีคนเดียวคือคุณ F
> ทีนี้ ถ้าตอบช้า อาจเสียลูกค้า เลยอยากให้มีอะไรชัดเจนนิดนึง ซึ่งจะต่างกับของ Taitam-D ครับ เราตั้งใจซ่อนไว้เพราะเรามีทีมตอบน่ะ
> จริงๆ เราน่าจะเอา Widget ใส่เข้าไปในเว็บได้นะครับ
> แผนที่กับ Widget ไม่จำเป็นต้องให้กดโชว์อีกทีนะครับ เปิดได้เลย

Result:

- The owner approved the live preview and will send it to the clinic.
- **D. Treatwell is a visible second booking route**, not hidden: a "Book online" button in the header, the mobile sticky bar and the home call to action, and a /book-online/ page with the Treatwell booking widget (venue 256278). Site copy never says how many people answer WhatsApp or how fast.
- **E. The map and the widget load straight away.** No "tap to show" step. This replaces the earlier plan in the privacy notice ("The map will not load until you choose to show it"), so the notice must be rewritten before deploy (queue row Q32). Measured 2026-09-13: the widget sets 2 Treatwell cookies (fe20-flipper-id, growthbook_id, 2-year expiry).
