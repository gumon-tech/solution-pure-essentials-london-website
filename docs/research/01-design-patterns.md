# Research 01: website design patterns for an independent aesthetics clinic

Gathered 2026-09-13 by an executor of room PWEB (general-purpose agent, 16 searches, 25 page
fetches). Raw findings; the Lead's conclusions are in `docs/research/00-direction.md`. Site
descriptions come from fetched page content and agency write-ups, not pixel inspection. Where a
site does something this brief forbids (before-and-after, testimonials) it is flagged so the
pattern is borrowed without the content.

## 1. Reference sites (2025-2026)

| # | Site | Why it is relevant |
|---|---|---|
| 1 | Formula Fig, formulafig.com | Closest to the brief's mood: cream, white, soft grey with muted green, editorial sans with italic accents, treatment cards with image, 1-line description, Book Now and Learn More, member and regular price on the card. Order: promo bar, hero (positioning line), injectables block, treatments gallery (11 cards), bestsellers, locations, press, team, memberships, offer capture, footer. Short nav (Book, Shop, Memberships, Gift Cards) with a Treatments dropdown. Premium comes from restraint, precise copy and architecture photography. |
| 2 | Ever/Body, everbody.com | Cream and white base, gold and earth accents, large sans. Nav by treatment type (Facials and Peels, Lasers, Injectables, Body, Hair) plus a homepage "browse by concern" browser (Fine Lines, Hyperpigmentation, Tone and Texture, Hydration, Acne). Order: hero, first-visit offer, philosophy with 3 differentiators, concern browser, provider credentials, differentiators, testimonials (not for us), press, consultation CTA, FAQ, footer. Two-axis IA is the pattern to copy. |
| 3 | Peachy Studio, peachystudio.com | Neutral and peach palette, generous whitespace, rounded image treatments. Sells on "flat fee, no surprises" with the price on each service card. Transparent pricing as the premium signal. |
| 4 | Heyday, heydayskincare.com | White and soft grey minimal, bold sans. Trust block uses numbers not quotes: share of 5-star reviews, facials performed, training hours, returning-client rate. |
| 5 | Glowbar, glowbar.com | Neutral base with 1 accent, sharp edges, air. Pricing as a side-by-side comparison with "no add-ons ever". |
| 6 | Minimale Skin, minimaleskin.com | Ultra-minimal editorial grid, neutral with brushed gold, 3 category tiles. Interiors photographed as the proof of quality, which suits a clinic that cannot use before-and-after. |
| 7 | The Perfect Secret, itstheperfectsecret.com | Explicit quiet luxury: ivory, black, gold, refined serif with italic emphasis. Nav: Home, Your Experience, Our Philosophy, Services and Treatments, Journal, Contact. Persistent top-right Book Your Appointment. Relies on case studies (not allowed for us). |
| 8 | Milk + Honey, milkandhoneyspa.com | Serif typography, double header, full treatment list in a boxed layout, Book repeated. A long menu shown calmly. |
| 9 | VIO Med Spa, viomedspa.com | Hundreds of treatments in a 4-pillar taxonomy (Injectables, Skin, Body, Wellness) with a mega-menu and a Skin Quiz entry. Prices withheld until consultation, which we do not copy. |
| 10 | Aesthetics Lab, London, aestheticslab.co.uk | UK reference: nav by Face, Injectables, Body, Male, Conditions; prices as a PDF (weak); phone top right, WhatsApp widget on mobile, "Book your consultation" primary. Trust: press logos, Tatler badge, Trustpilot, "10+ years". |
| 11 | Health and Aesthetics, Surrey, healthandaesthetics.co.uk | Best UK example of an honest price page: grouped by treatment type, "from" pricing throughout, consultation fee stated and redeemable, CQC, GMC, BCAM badges, "4.9/5, 292 reviews". Bullet-text format, which we improve on. |
| 12 | Therapie Clinic, therapieclinic.com | The opposite end: promotional, red accents, lightning deals. Useful only for its 6-card category grid and stat bar. Avoid its tone. |

Also noted: Young LDN (4 top-level groups Facial, Body, Beauty, Wellness; black, white, gold; phone plus WhatsApp at the foot). Self London (neutral, medical vs aesthetic split, pricing on a separate page). SoVous (Ivar Fine plus Gotham, mega-menu). Skinney (flip cards). Sanjiva (Playfair Display and gold). From Colorlib's esthetician list, the warm-neutral examples are TRU Esthetics (background #f9f5f2, accent #eb9d77), Kristen Marie Skin (beige and brown serif) and Stephanie Schuh Beauty (Cormorant Garamond, cream, rose, black).

Common homepage skeleton across the premium set: (1) short nav plus persistent Book CTA, (2) hero with 1 positioning line, (3) 3 differentiators, (4) treatment category cards, (5) proof block, (6) team or credentials, (7) location and hours, (8) FAQ, (9) final CTA, (10) footer with contact. Only Aesthetics Lab and Young LDN used more than 6 top-level nav items.

## 2. Design trends for premium wellness and aesthetic sites

Typography in use: Cormorant Garamond headings (Stephanie Schuh Beauty; several 2025 pairing guides), Playfair Display with gold (Sanjiva), Didot Display (Shani Darden), Montserrat plus Lato (Willow), Ivar Fine plus Gotham (SoVous). Fontfabric and Designity report that expressive display serifs such as Fraunces and Cormorant Garamond have replaced Playfair as the default luxury serif. Google Fonts pairings with recorded use in this sector (Heather Jones, FontPair):

- Cormorant Garamond + Manrope (editorial, elegant; slight letter-spacing on headings)
- Cormorant Garamond + DM Sans (FontPair: "walking into a high-end spa")
- Fraunces + Manrope (modern editorial; large headline sizes)
- Cormorant Infant + Manrope (soft luxury; warm neutrals and oversized imagery)
- Instrument Serif + Inter (minimal luxury)
- Prata + Work Sans (quiet luxury)
- Cormorant Garamond + Jost (geometric contrast)

Layout devices: arched image masks (border-radius 999px 999px 0 0, or clip-path), generous whitespace, editorial asymmetric grids (Japandi guidance: no 3 equal columns, max-width 1280 px), stacked modular blocks, sticky header with a single CTA, interiors and texture photography (boucle, wood, linen) instead of faces.

Motion restraint: fade plus 8 to 16 px translate on scroll, 200 to 420 ms ease-out with 80 ms stagger, hover 200 ms, shadows no heavier than 0 2px 8px rgba(0,0,0,0.05), prefers-reduced-motion collapses to a plain fade. No parallax, no autoplay video with sound, no cursor effects.

Colour tokens. Reference values seen: Japandi system Warm Sand #D4C5A9, Soft White #F5F2ED, Natural Wood #A0845C, Charcoal #3A3A3A, Stone Grey #9E9E94; TRU Esthetics #f9f5f2; named Sand #C2B280 (2.11:1 on white, surface only). Proposed palette with WCAG contrast computed 2026-09-13:

| Token | Hex | Role | Contrast |
|---|---|---|---|
| cream | #F7F2EA | page background | base |
| linen | #F3EDE3 | alternate section | 1.16 vs cream (separate by spacing or hairline, not contrast) |
| sand | #EDE4D6 | cards, price rows | 1.13 vs cream |
| beige | #E3D6C3 | borders, arch fills | 1.28 vs cream |
| espresso | #2B2420 | headings, body | 13.70 on cream, 10.66 on beige (AAA) |
| cocoa | #4A3F35 | secondary text | 9.18 on cream (AAA) |
| walnut | #6B5A4A | captions, meta | 5.91 on cream, 4.60 on beige (AA) |
| oak | #8A6A4E | primary button fill, warm accent | white on oak 4.94 (AA); as text on cream 4.43 (large text only) |
| wood | #A67B5B | decorative lines, icons | 3.36 on cream, not for body text |
| taupe | #8C7B6A | disabled, hairlines | 3.65 on cream, large text only |

Rule from these numbers: text must be cocoa or darker; light-wood tones are for surfaces, rules and large display only; white-on-wood buttons pass only at #8A6A4E or darker.

## 3. Information architecture for 100 or more services

Grouping. Sites with large menus use 4 to 6 top-level groups by area or modality, then a second axis by concern on the page (Ever/Body's concern browser; Aesthetics Lab's Conditions menu). Agency guidance (Aesthetic Launch Lab, Boutique SEO, Cosmetic Digital) is unanimous that every treatment family needs its own page for search and conversion, and that the top menu stays short. For 115 services: top nav of Face, Body, Laser and Hair Removal, Wellness (massage, waxing), plus Prices, About, Contact; a "by concern" strip on the homepage and on each category page; 1 page per treatment family, not per price line.

Price presentation. Aesthetic Launch Lab: at minimum show "from" prices; hiding prices creates friction and attracts price-shoppers. Health and Aesthetics uses "from" plus a consultation fee redeemable against treatment; Peachy and Glowbar make the price the trust signal. NN/G and Smashing recommend accordions on mobile when a table exceeds 5 to 6 rows and users read one section at a time, which fits a 115-line list. Pattern: category accordion, inside it a 2-column row (service name and duration left, price right-aligned in tabular figures), with a per-row "Ask about this" link. Avoid a PDF price list and avoid narrative bullet text.

Per-service booking without an engine. Young LDN and Aesthetics Lab put a WhatsApp widget or link beside the phone number; Pfeffer Sal uses "Contact us" plus 1 "Book a treatment" button. For this site: each price row and each treatment page carries a wa.me link whose prefilled text names the service, and a secondary "Book on Treatwell" text link.

Trust without testimonials or before-and-after, all seen in the wild: practitioner names and qualifications with photos; regulator and insurer badges (CQC, GMC, BCAM); aggregate review counts as numbers rather than quotes; years and volume; consultation-first wording; device certification; price transparency itself; hygiene and aftercare policy pages; awards; clinic interior photography. DubSEO and Creative Tweed note that named clinicians, professional memberships and "what the first session looks like" convert better than generic award graphics.

Compliance note for the no-medicine rule: CAP Code 12.12 prohibits advertising prescription-only medicines to the public; ASA guidance says do not name the brand or the active substance and do not use before-and-after for them. Lead with the consultation, which the ASA's narrow exception permits when the focus is a multi-option consultation (JCCP, ASA, CAP).

## 4. WhatsApp-first conversion patterns

Patterns: a sticky bottom bar on mobile with 2 buttons (WhatsApp primary, Call secondary), a floating round WhatsApp button on desktop, and contextual WhatsApp links next to each price and on every treatment page (Qualimero, Elfsight, U2L: sticky corner button plus contextual buttons at decision points). Link format wa.me/44XXXXXXXXXX?text=<url-encoded>; write the message from the customer's side and include the service name so it tags the source. Use wa.me rather than api.whatsapp.com. Add a source tag in the message body since WhatsApp gives no analytics.

Evidence, vendor-reported, treat as directional: WhatsApp open rates near 98 percent and click rates of 45 to 60 percent versus 2 to 5 percent for email (Chatarmin, AISensy); click-to-chat conversion of 5 to 15 percent versus 1 to 4 percent for web forms (Qualimero); cost per lead reduced 30 percent when landing-page funnels were replaced with click-to-WhatsApp (Gupshup). Two cautions: a button with no one answering is worse than no button, so set hours and an auto-reply; UK GDPR requires a privacy note where WhatsApp is the intake channel (BossBot UK).

## 5. Anti-patterns to avoid

1. Stock photography presented as the clinic; photograph the actual rooms, textures and team.
2. Hidden prices or PDF price lists; use "from" pricing.
3. Entry pop-ups: Google penalises mobile interstitials over 30 percent of the screen on load; more than 2 pop-ups per session raises bounce about 40 percent (Sleeknote via Popupsmart).
4. Wall-of-text treatment pages.
5. Promotional clutter (lightning deals, emoji icons, "was" pricing) as on Therapie.
6. Deep nav with 7 or more top-level items and duplicated mega-menu entries.
7. Slow pages: 53 percent of mobile users abandon after 3 seconds; over 70 percent of clinic traffic is mobile.
8. Heavy motion: parallax, autoplay hero video, cursor effects.
9. Naming prescription medicines or brands anywhere on the site.
10. Low-contrast beige-on-cream text: light-wood and sand tones fail AA for text (2.6 to 3.7:1); reserve them for surfaces.

## Sources

- https://boutiqueseo.co.uk/aesthetics-clinic-websites/
- https://aestheticlaunchlab.com/blog/aesthetic-clinic-website-design-guide
- https://wolfable.com/aesthetic-clinic-website-design-best-practices/
- https://cosmeticdigital.co.uk/pages/aesthetic-websites
- https://smply.studio/2026-web-design-trends-wellness/
- https://smply.studio/aesthetic-clinic-website-design-guide/
- https://www.omnicoreagency.com/best-medspa-website-examples/
- https://www.flamingoagency.com/blog/best-medical-spa-websites/
- https://colorlib.com/wp/med-spa-website-examples/
- https://colorlib.com/wp/esthetician-website-examples/
- https://formulafig.com/
- http://everbody.com/
- https://www.peachystudio.com/
- https://www.heydayskincare.com/
- https://www.glowbar.com/
- https://minimaleskin.com/
- https://itstheperfectsecret.com/
- https://milkandhoneyspa.com/
- https://www.viomedspa.com/
- https://aestheticslab.co.uk/
- https://www.healthandaesthetics.co.uk/about/treatment-prices/
- https://www.therapieclinic.com/
- https://www.youngldn.com/
- https://www.selflondon.com/
- https://www.pfeffersal.com/
- https://heather-jones.com/luxury-google-font-pairings/
- https://www.fontpair.co/pairings/cormorant-garamond-dm-sans
- https://fontalternatives.com/pairings/cormorant-garamond-and-jost/
- https://www.fontfabric.com/blog/top-typography-trends-2025/
- https://www.designity.com/blog/typography-trends
- https://designmd.app/library/japandi
- https://www.applet.studio/blog/arch-shaped-images-squarespace
- https://colorcode.tools/color/sand
- https://wiseowlmarketing.com/accessible-website-colors-that-pass-wcag
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/
- https://www.nngroup.com/articles/mobile-accordions/
- https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/
- https://qualimero.com/en/blog/whatsapp-button-website
- https://u2l.ai/blog/whatsapp-click-to-chat-link
- https://elfsight.com/blog/how-to-integrate-whatsapp-in-your-website/
- https://chatarmin.com/en/blog/whats-app-kpi
- https://m.aisensy.com/blog/whatsapp-statistics-for-businesses/
- https://www.gupshup.ai/resources/blog/click-to-chat-ads-conversions/
- https://bossbot.uk/blog/whatsapp-automation-beauty-salon-uk
- https://popupsmart.com/blog/seo-popup
- https://www.dubseo.co.uk/insights/healthcare-credibility-patient-choice-what-drives-trust-in-2026
- https://creativetweed.co.uk/healthcare-website-design-what-patients-need-uk-clinics/
- https://www.asa.org.uk/resource/cosmetic-interventions.html
- https://www.jccp.org.uk/NewsEvent/new-asa-guidance-updated-advertising-rules-for-botox-and-non-surgical-cosmetic-treatments-1

Not reachable during research: sofiepavitt.com (empty render), adoniamedicalclinic.co.uk (403), illuminateskinclinic.co.uk (401), skinlaundry.com (cart shell only), skinmatters.co.uk (maintenance page).
