// Consent Mode v2 defaults, as a plain inline script (not next/script's
// beforeInteractive strategy, which eslint-config-next flags outside a Pages
// Router _document.js — the App Router has no equivalent, and the spec this
// implements explicitly allows "a plain inline script in layout" instead).
// Rendered first in <body>, this inline script runs synchronously as soon as
// the browser parses it, before hydration and before any later script on the
// page. It sets no cookie and no storage: window.dataLayer is a plain
// in-memory array and window.gtag a plain function that pushes onto it. No
// script tag to googletagmanager.com or any other host is loaded here or
// anywhere else in this row — the Google tag itself is a later row.
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

export default function ConsentScript() {
  return (
    <script
      id="consent-mode-default"
      dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
    />
  );
}
