# Research 03: local SEO, structured data, Next.js static export, images, consent, editing

Gathered 2026-09-13 by an executor of room PWEB (general-purpose agent, 60 tool uses). Raw
findings; the Lead's conclusions are in `docs/research/00-direction.md`. Scope: Next.js 15 App
Router, React 19, Tailwind, `output: 'export'`, GitHub Pages via Actions on a custom domain, about
115 priced services in 11 categories, WhatsApp click-to-chat as the booking CTA, one JSON data file
edited by the clinic in the GitHub web editor.

## 1. Local SEO and structured data

### Page architecture

For a single-location clinic the Google Business Profile (GBP) is the highest-return asset; the
website's job is to corroborate it. Recommended structure, 3 tiers:

| Tier | URL pattern | Purpose |
|---|---|---|
| Home | `/` | Brand and location intent, primary category, NAP, hours, map, WhatsApp CTA |
| Category hubs (11) | `/treatments/<category>/` | One page per category, every service in it with price, links down to service pages |
| Service pages | `/treatments/<category>/<service>/` | One page per service family: what it is, who it suits, duration, price, aftercare, related services, CTA |
| Support pages | `/about/`, `/contact/`, `/pricing/`, `/faq/`, `/privacy/` | Trust, location signals, full price list in one place |

Clinic SEO guides consistently recommend specific treatment pages rather than one generic
services page. Very thin services (a small add-on) should be grouped into the parent service page
rather than given their own URL. Rule: give a service its own page only if it has a distinct search
intent and at least 150 to 250 words of original content; otherwise render it as a row on the
category page with an anchor.

### Title and H1 patterns

Google's title-link guidance: descriptive and concise, no boilerplate repetition, brand once.
Local practice: service and location first, brand last, 30 to 60 characters. H1 near-equal to the
title.

- Home: `Aesthetics and Beauty Clinic in King's Cross, London | <Brand>`
- Category: `Facials in King's Cross | <Brand>` (H1 `Facials in King's Cross`)
- Service: `<Service> from GBP X in King's Cross | <Brand>` (H1 without brand)

One location phrase per title; do not stack London, King's Cross and the postcode in every title.

### Internal linking and GBP alignment

- Every service page links up to its hub and sideways to 2 to 4 related services; every hub links
  to all its services; home links to all hubs. Breadcrumbs on every page.
- Same service names on the site as in the GBP Services section; 1 primary GBP category with at
  most 1 or 2 secondaries; granular treatments as GBP Services, not categories.
- Identical NAP string in footer, contact page and GBP. GBP short URL and Maps embed on contact.

### schema.org types

Hierarchy: LocalBusiness > HealthAndBeautyBusiness > {BeautySalon, DaySpa, ...}; LocalBusiness >
MedicalBusiness > MedicalClinic. Google accepts any LocalBusiness subtype and asks for the most
specific. A clinic that does aesthetics alongside beauty can declare an array type:

```json
{
  "@context": "https://schema.org",
  "@type": ["HealthAndBeautyBusiness", "MedicalBusiness"],
  "@id": "https://pel.gumon.io/#clinic",
  "name": "Pure Essentials London",
  "url": "https://pel.gumon.io/",
  "telephone": "+44...",
  "priceRange": "GBP 10 to 1300",
  "address": { "@type": "PostalAddress", "streetAddress": "155 King's Cross Road", "addressLocality": "London", "postalCode": "WC1X 9BN", "addressCountry": "GB" },
  "geo": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "10:00", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "11:00", "closes": "20:00" }
  ],
  "sameAs": ["https://www.instagram.com/pureessentialslondon"],
  "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Treatments", "itemListElement": [
    { "@type": "Offer", "price": "70.00", "priceCurrency": "GBP", "itemOffered": { "@type": "Service", "name": "Hydrating facial", "url": "https://pel.gumon.io/treatments/facials/hydrating/" } } ] }
}
```

On each service page emit a `Service` node with `provider` pointing at the `@id` above, plus
`offers` with price and `priceCurrency`, plus a `BreadcrumbList`.

Google's current stance, verified against Search Central docs in September 2026:

- LocalBusiness: supported. Required `name`, `address`; recommended `geo` (5 or more decimals),
  `openingHoursSpecification`, `telephone`, `url`, `priceRange` (max 100 characters), `image`.
- Price on services: no rich result for Service or Offer prices. Product markup is for goods and
  using it for a treatment breaches the "markup must reflect the page" policy. Keep Offer inside
  Service for machine readability; expect no price display in results. The only price signal for a
  LocalBusiness is `priceRange`.
- FAQPage: the FAQ rich result stopped appearing on 2026-05-07 and the documentation was removed
  on 2026-06-15; existing markup is harmless but earns nothing. Write FAQs as normal content.
- BreadcrumbList: supported. At least 2 ListItem with position, name, item.
- Do not mark up content that is not visible on the page.

## 2. Next.js 15 static export on GitHub Pages

Verified against the Next.js docs and the official nextjs/deploy-github-pages template.

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath unset: a custom domain serves from '/'
}
```

1. basePath only for user.github.io/repo; with a custom domain leave it empty. Known bugs with
   basePath plus trailingSlash false (issue 73427) and unoptimized images ignoring basePath
   (issue 68498) do not apply once basePath is empty.
2. Images: the default next/image loader is unsupported under export. Either unoptimized true and
   ship pre-resized files, or a custom loaderFile that maps to pre-generated files.
3. Unsupported: middleware, redirects, rewrites, headers, ISR, server actions, dynamic routes
   without generateStaticParams. Redirects as meta refresh pages.
4. Dynamic routes from JSON: `export const dynamicParams = false` plus generateStaticParams that
   filters status live and maps category and slug.
5. 404: next build emits out/404.html; GitHub Pages serves it.
6. app/sitemap.ts and app/robots.ts work under export; add `export const dynamic = 'force-static'`
   if the build complains. Import the same JSON so the sitemap and generateStaticParams cannot
   drift.
7. Metadata: set `metadataBase` in the root layout; opengraph-image.tsx works at build time.
8. Custom domain with Actions: GitHub docs say a CNAME file is ignored and not required; set the
   domain in Settings then Pages. DNS for a subdomain: CNAME to the org's github.io (already done
   for pel.gumon.io). Enforce HTTPS can take up to 24 hours.
9. Add public/.nojekyll so `_next/` is never filtered.
10. Workflow from the template: checkout, setup-node (Node 22), configure-pages, cache on
    .next/cache, next build, upload-pages-artifact with path ./out, deploy-pages; permissions
    contents read, pages write, id-token write; concurrency group pages. (The TTD site's workflow
    is this template with 2 extra check steps.)

## 3. Image pipeline

- AVIF first (about 95 percent support), WebP fallback, JPEG last. AVIF is 15 to 30 percent
  smaller than WebP for photos.
- Generate at build time with sharp, widths 480, 768, 1080, 1440, 1920, from an `images-src/`
  folder into `public/img/`. Render with picture or a custom next/image loader and a real sizes
  attribute. The ready-made alternative is next-image-export-optimizer.
- Budgets: hero 100 to 200 kB AVIF at 1440 to 1920 px, under 120 kB for the 768 px variant; cards
  20 to 60 kB; first-viewport image bytes under about 300 kB on mobile.
- LCP: hero img with fetchpriority high, never lazy; discoverable in the initial HTML (no CSS
  background image, or preload it); everything below the fold lazy and decoding async; always set
  width and height.

## 4. Core Web Vitals and fonts

Thresholds (web.dev): LCP 2.5 s, INP 200 ms, CLS 0.1, at the 75th percentile per device type. A
static site with no third-party scripts before consent passes INP easily; risks are hero weight
(LCP) and fonts or late banners (CLS).

Fonts: next/font/google downloads at build time and self-hosts in `_next/static`; the browser makes
no request to Google, and the size-adjust fallback removes layout shift. This also removes the
GDPR exposure from the Munich Regional Court ruling of 2022-01-20 on dynamically loaded Google
Fonts. At most 2 families, display swap, subsets latin. A Chinese variant should use a system font
stack; CJK web fonts are multi-megabyte.

## 5. Consent and tagging

Google enforces its EU User Consent Policy through Consent Mode v2 for EEA, UK and Swiss traffic
since March 2024; without `ad_user_data` and `ad_personalization` signals Google Ads measurement
and remarketing degrade or stop. UK PECR still requires consent before analytics cookies are set.

Order matters: defaults are set before the Google tag loads. Pattern for a static site without
GTM: an inline script that pushes `consent default` with all 4 signals denied and
`wait_for_update` 500; a banner that on accept stores the choice, pushes `consent update` granted,
and only then injects the gtag script; on reject stores denied and loads nothing. This is basic
consent mode (tag not loaded until consent), the most defensible under UK PECR. Advanced mode
(cookieless pings before consent) needs a certified CMP. Wrap it in a small client component; no
library needed, though vanilla-cookieconsent (MIT, about 3 kB) has a documented Consent Mode v2
recipe. Offer Reject with equal prominence and a footer link to reopen the banner.

WhatsApp: wa.me with a text parameter is a plain anchor; it sets no cookies and loads no script.
Keep it that way: no WhatsApp widget or SDK, target blank with rel noopener; if click counts are
wanted, fire an analytics event only when analytics storage is granted. Pre-fill the treatment
name from the JSON so the clinic knows which page the enquiry came from.

## 6. Non-technical editing on GitHub

Workflow for the clinic: open the file on github.com, click the pencil, edit, Commit changes,
commit directly to main. Every push triggers the deploy; the site updates in 1 to 3 minutes.

Protecting against broken JSON:

1. Make the deploy job depend on a validate step. If the JSON is invalid the build fails, the
   previous deployment stays live, and GitHub emails the committer. Simpler than branch
   protection, which would force the clinic through pull requests.
2. Validate with a JSON Schema using ajv in a 10-line Node script: unique slug, category from the
   enum of 11, price as number or null, status from the enum, no unknown keys
   (additionalProperties false) so a typo in a key is caught. Also check referenced images exist.
3. Put the schema and 2 example rows in the README so ChatGPT prompts have something to copy.

Format choice: JSON is the strictest for humans (no comments, no trailing commas, quoted keys).
YAML is friendlier to read but has silent type traps (10:30 becomes a number, yes becomes true).
CSV is the friendliest for a flat price list because the clinic can edit in Excel or Google Sheets
and paste back; it cannot nest and needs quoting for commas. Practical recommendation: keep JSON
as the build input with the CI check; if the clinic struggles, switch the price list to CSV parsed
at build time, keeping long descriptions in per-service Markdown.

Git-based CMS options (all commit to the repo, all work with GitHub Pages):

| Option | Pros | Cons for 1 non-technical editor |
|---|---|---|
| Decap CMS | Free, mature, supports JSON file collections | Dated UI, slow maintenance; needs an external OAuth proxy on GitHub Pages |
| Sveltia CMS | Modern rewrite of Decap, same config, fast | Also needs a GitHub OAuth app plus authenticator worker; younger project |
| Pages CMS | Hosted with GitHub App sign-in, no proxy to run, datagrid view over a JSON file | Hosted dependency; pricing page could not be fetched, verify free tier |
| Tina CMS | Visual editing, typed content | Needs TinaCloud or self-hosted backend; heavier setup |

For this project Pages CMS is the lowest-friction fit, Sveltia the self-hosted choice. Either can
be added later without changing the data file.

## 7. Multilingual

Under static export there is no middleware, so locale detection is impossible; use explicit
subpaths: `/` for English and `/zh/` for Chinese via generateStaticParams. Subdirectories on one
domain keep authority on one host. hreflang: zh-Hans or zh-Hant, never bare region codes; every
page lists every alternate including itself; x-default points to English. Next.js emits the link
tags from metadata alternates languages and the sitemap entries since 14.2. Only publish /zh/
pages that are fully translated. Translate the JSON by adding name_zh and summary_zh fields so the
clinic keeps one editing workflow.

## Sources

- https://schema.org/HealthAndBeautyBusiness
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://boutiqueseo.co.uk/aesthetics-clinic-schema/
- https://rankwebsolution.com/local-seo-for-single-location-clinics/
- https://www.sterlingsky.ca/services-in-google-business-profile-impact-ranking/
- https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/
- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/getting-started/fonts
- https://github.com/nextjs/deploy-github-pages
- https://github.com/vercel/next.js/issues/68498
- https://github.com/vercel/next.js/issues/73427
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files
- https://github.com/Niels-IO/next-image-export-optimizer
- https://web.dev/articles/vitals
- https://web.dev/articles/optimize-lcp
- https://usercentrics.com/knowledge-hub/google-fonts-gdpr-compliant/
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/google-ads/answer/13695607?hl=en
- https://consentmodehq.com/vanilla-cookieconsent-google-consent-mode-v2/
- https://plausible.io/cookieless-web-analytics
- https://github.com/marketplace/actions/json-schema-validate
- https://pagescms.org/docs/configuration/content/
- https://github.com/sveltia/sveltia-cms
- https://next-intl.dev/docs/routing/configuration

Verification gaps: the Sveltia authentication docs and the Pages CMS pricing page returned 404
during the session; confirm before committing to either tool.
