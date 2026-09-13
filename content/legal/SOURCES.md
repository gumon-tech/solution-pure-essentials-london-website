# Sources for content/legal/privacy.md and content/legal/terms.md

Drafted by PWEB for Q15 under standing order A7. Worktree base commit 30fda41. Build measured
2026-09-13: `npm ci && npm run build` exit 0, Next.js 15.5.25, pages built: /, /_not-found,
/treatments. No /contact, /privacy or /terms page exists in this build.

Grep commands (run inside `out/`) are listed once here and cited by letter below.

```
G1  grep -rhoE '<script[^>]*src="[^"]*"' --include='*.html' . | grep -oE 'src="[^"]*"' | sort | uniq -c
    -> 8 distinct src values, all /_next/static/chunks/... (same origin). 0 external.
G2  grep -rhoE 'https?://[A-Za-z0-9.-]+' --include='*.html' --include='*.js' --include='*.css' --include='*.txt' . | sort | uniq -c
    -> wa.me 355, www.instagram.com 10, www.treatwell.co.uk 10 (link hrefs);
       pel.gumon.io 3 (canonical); nextjs.org 13, react.dev 4, github.com 2, tailwindcss.com 1,
       www.w3.org 37 (error-message strings, licence comment, SVG namespace; no request);
       a, f, n, x (minified code fragments).
G3  grep -rliE 'googletagmanager' .            -> 0 files
G4  grep -rliE 'gtag' .                        -> 2 files, all matches are "toStringTag" (core-js / webpack)
G5  grep -rliE 'analytics' .                   -> 0 files
G6  grep -rliE 'cookie' .                      -> 1 file (chunk 255): Next.js router internal field
                                                  names (revalidated cookie flag, NEXT_HMR_REFRESH_HASH_COOKIE); no document.cookie
G7  grep -rlE 'document\.cookie' .             -> 0 files
G8  grep -rliE 'localStorage' .                -> 0 files
G9  grep -rliE 'sessionStorage' .              -> 0 files
G10 grep -rliE 'iframe' .                      -> 4 files: Tailwind CSS reset selector, React DOM
                                                  element handling, core-js polyfill; no <iframe> in HTML
G11 grep -rliE 'fonts\.googleapis|fonts\.gstatic' .   -> 0 files
G12 grep -rliE 'maps' .                        -> 0 files
G13 grep -rhoE '<link[^>]*>' --include='*.html' . | sort | uniq -c
    -> fonts, CSS, script, logo and image preloads all same-origin /_next/... or /logo/... or /img/...;
       only absolute URL is canonical https://pel.gumon.io/treatments/
G14 grep -hoE 'url\([^)]*\)' _next/static/css/*.css | sort | uniq -c
    -> 13 url(/_next/static/media/*.woff2), all same-origin
G15 grep -rlE '<form|<input|<textarea' --include='*.html' .   -> 0 files
G16 grep -rlE 'sendBeacon' .                   -> 0 files
G17 grep -rhoE 'https://wa\.me/[^"]*' treatments/index.html | head -3
    -> text=Hi Pure Essentials, I'd like to ask about a treatment.\n\nRef: SITE-HEADER
       text=... ask about Half Face.\n\nRef: HALF_FACE
```

Other measurements:

```
M1  dig +short MX pureessentialslondon.com (2026-09-13)
    -> aspmx.l.google.com and alt1 to alt4.aspmx.l.google.com
```

## privacy.md

| Sentence | Source |
|---|---|
| Last updated placeholder | Q15 spec |
| Run by PURE ESSENTIALS (LONDON) LTD, England and Wales, 09500632, 129 Station Road, London NW4 4NJ | lib/site.ts `SITE.company`; PEL brief section 7 item 2 (Companies House, read 2026-09-13) |
| We are the controller | Research 02 section 4 (controller for chat content); Q15 spec |
| Contact info@pureessentialslondon.com | lib/site.ts `SITE.email` |
| Does not ask for any information; no forms, no account | G15; app/ has only page.tsx, treatments/page.tsx, layout.tsx |
| Does not use cookies | G6, G7 |
| Does not save information in browser storage | G8, G9 |
| No analytics, no advertising tags | G3, G4, G5 |
| Loads no scripts from other companies | G1, G13 |
| Fonts stored on the website itself | app/layout.tsx uses next/font/google (self-hosted at build); G11, G14 |
| WhatsApp, email, Instagram, Treatwell are ordinary links; nothing sent until click | components/Header.tsx, Footer.tsx, StickyBar.tsx, PriceList.tsx are plain `<a href>`; G1, G2, G16; research 03 section 5 (wa.me sets no cookie, loads no script) |
| Hosted by GitHub Pages | .github/workflows/nextjs.yml (actions/deploy-pages); PEL brief section 8 (`server GitHub.com`, gh api pages cname pel.gumon.io) |
| GitHub receives IP address and logs it for security purposes | Research 02 section 4 |
| GitHub handles logs under its own privacy statement; we do not receive them | Inference: no analytics or log access configured in repo (workflow has no log step). PEL to check the wording |
| Each contact service run by another company under its own terms | Research 02 section 4 (Meta processes metadata); Q15 spec |
| WhatsApp run by Meta; Meta processes message and metadata | Research 02 section 4 |
| Pre-filled message names treatment or part of site plus reference code; editable | G17; lib/site.ts `waSite`; lib/services.ts `waLink` via lib/treatments-view.ts line 107 |
| We read and keep the chat to answer and arrange appointment | Research 02 section 4 (clinic is controller for chat content); Q15 spec purposes |
| Email: we receive address, name if given, message | Nature of email; Q15 spec |
| Email delivered through Google's email service | M1 |
| Treatwell: you give details to Treatwell under its own terms; Treatwell passes booking details | lib/site.ts `SITE.treatwell` link; research 02 section 6; Q15 spec. Data-sharing detail not measured (Partner Terms returned 403, research 02 section 6) |
| Instagram link opens our page; DMs handled by Meta | lib/site.ts `SITE.instagram`; Footer.tsx |
| Treatment question can include health information; share only what is needed | Research 02 section 4 (special category data); Q15 spec |
| Detailed health questions covered at consultation | app/treatments/page.tsx ("Every treatment starts with a consultation"); research 02 section 4 (keep medical questions to the consultation) |
| Purposes and lawful bases table | Q15 spec; research 02 section 4 (Article 9(2)(a) explicit consent) |
| Withdraw consent any time; does not affect earlier use | UK GDPR Article 7(3); research 02 section 4 (withdrawal of consent) |
| Recipients GitHub, Meta, Google, Treatwell | Research 02 section 4 (recipients list); M1 for Google as email; Google as tag recipient moved to the future section because G3 to G5 show no tag today |
| Transfers outside the UK including the United States | Research 02 section 4 lists transfers as a required item. Company locations (GitHub, Meta, Google US-headquartered) are general knowledge, not measured here. PEL to check |
| Retention placeholders | Q15 spec: do not invent a period |
| Rights list | Q15 spec; research 02 section 4 (Article 13 items) |
| Right to complain to the ICO, ico.org.uk | Q15 spec; research 02 section 4 |
| When we add cookies: ask first, nothing before choice, Reject as easy as Accept, reopen link, notice will list cookies | Research 02 section 4 (banner design); research 03 section 5 (basic consent mode, footer reopen link); docs/plans/QUEUE.md Q16 acceptance 1 to 3 and Q17 acceptance 1 |
| Contact page with Google map, loads only when you choose | docs/plans/QUEUE.md Q9 ("map iframe not in the HTML until clicked", status running, not in this build: G12); content/contact.md line 37. Kept in the future section because the code is not in this worktree |
| Google receives IP and may set cookies when map shown | General behaviour of an embedded Google Maps iframe; not measured, because the map is not built. Re-measure when Q9 lands |

## terms.md

| Sentence | Source |
|---|---|
| Company details and email | lib/site.ts `SITE.company`, `SITE.email`; PEL brief section 7 item 2 |
| Clinic address 155 King's Cross Road, London WC1X 9BN | lib/site.ts `SITE.address` |
| The price shown is the price you pay; "from" = lowest option, consultation confirms | app/treatments/page.tsx intro text; PEL brief section 9 ruling 5 |
| Price confirmed when you book | Q15 spec |
| Website does not take bookings or payments | G15 (no forms); no payment script (G1, G2) |
| Availability and bookings confirmed by the clinic on WhatsApp or through Treatwell | Q15 spec; lib/site.ts `waSite`, `SITE.treatwell` |
| Treatwell booking also covered by Treatwell's terms | Research 02 section 6 |
| Cancellation placeholder | Q15 spec |
| Every treatment starts with a consultation; suitability decided there; will not recommend unsuitable treatment | app/treatments/page.tsx closing section |
| Aesthetic treatments are for adults aged 18 and over | app/treatments/page.tsx closing section; research 02 section 1.4 |
| General information, not medical advice | Q15 spec |
| Some images on this site are illustrative. | components/Footer.tsx; PEL brief section 10 condition |
| Links to WhatsApp, Treatwell, Instagram | G2; lib/site.ts |
| Governed by the law of England and Wales | Q15 spec; lib/site.ts `jurisdiction` |
| WhatsApp from any page | app/layout.tsx renders Header, Footer and StickyBar on every page, each with a WhatsApp link |
