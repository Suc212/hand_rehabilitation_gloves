# Rehab Helper Gloves production-build audit

## Method and measured results

Next.js 16.0.10 App Router with Turbopack, React 19.2.0, Tailwind 4.1.18.
Measured URL: http://localhost:3100/products/rehab-helper-gloves. Lighthouse 12.8.2; Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/155.0.0.0 Safari/537.36.
Three sequential runs per production build, fresh browser profiles/cache resets,
412 × 823 CSS pixels, DPR 1.75, simulated mobile throttling: 150 ms RTT,
1638.4 Kbps throughput, CPU slowdown multiplier 4. Real Meta and Clarity scripts
remained enabled and were not blocked or replaced during performance runs.
Server image-optimizer caches were retained; the LCP uses a direct static AVIF.
No build or browser verification ran concurrently with the audit loop.

| Metric (three-run median) | Before | After |
|---|---:|---:|
| FCP | 1.383 s | 1.262 s |
| LCP | 3.387 s | 2.331 s |
| TBT | 850.5 ms | 2925.5 ms |
| CLS | 0 | 0 |
| Lighthouse performance score | 72 | 68 |
| Font transfer | 131.16 KiB | 47.59 KiB |
| External CSS transfer | 7.77 KiB | 7.04 KiB |
| HTML transfer (includes inline styles) | 25.21 KiB | 27.38 KiB |
| First-party JS transfer | 144.03 KiB | 142.53 KiB |
| Meta JS transfer | 271.84 KiB | 271.79 KiB |
| Host CPU benchmark (higher is faster) | 1743.5 | 1264 |

The original baseline is retained as the primary before column to avoid
selecting the slower repeated baseline as a more favorable comparison.
The repeated baseline medians were FCP 1.705 s,
LCP 3.758 s, TBT 3774.1 ms,
CLS 0, CPU benchmark 976.
FCP/LCP improve against the original baseline, but **TBT regresses**. Against
the repeated baseline, TBT is lower. These conflicting TBT comparisons and
changing CPU benchmarks do not establish a reliable main-thread speed gain.

| Build/run | FCP | LCP | TBT | CLS | Host CPU benchmark |
|---|---:|---:|---:|---:|---:|
| rehab-baseline/1 | 1.407 s | 3.387 s | 1325.0 ms | 0 | 1707.5 |
| rehab-baseline/2 | 1.381 s | 3.348 s | 850.5 ms | 0 | 1799.5 |
| rehab-baseline/3 | 1.383 s | 3.411 s | 708.0 ms | 0 | 1743.5 |
| rehab-baseline-retest/1 | 1.705 s | 2.309 s | 3774.1 ms | 0 | 1046 |
| rehab-baseline-retest/2 | 2.810 s | 4.375 s | 2454.2 ms | 0 | 976 |
| rehab-baseline-retest/3 | 1.547 s | 3.758 s | 4137.9 ms | 0 | 874.5 |
| rehab-decoded-final/1 | 1.262 s | 2.331 s | 3964.0 ms | 0 | 1264 |
| rehab-decoded-final/2 | 1.138 s | 2.223 s | 2925.5 ms | 0 | 1350 |
| rehab-decoded-final/3 | 2.166 s | 3.537 s | 2682.8 ms | 0 | 854.5 |

Raw JSON/HTML, DevTools logs and performance traces are under
`.performance/rehab-baseline/` and `.performance/rehab-decoded-final/`.
The machine-readable comparison, including pre-LCP trace work and warnings, is
`.performance/rehab-comparison.json`. These large artifacts are gitignored.
Reproduce using `node scripts/audit-performance.mjs <installed-lighthouse-cli> <label> http://localhost:3100/products/rehab-helper-gloves` after `npm run build` and `next start -p 3100`.

## Trace diagnosis

The LCP is the hero image, alt “Close-up of hands practising a grip”, displayed
at 388 × 388 CSS pixels at the audited viewport. It is server-rendered, eagerly
loaded, preloaded and has high fetch priority. Its network discovery was already
early; reducing its bytes was not the main opportunity in this audit.

The following are medians of **recorded trace** phases. Lighthouse's simulated
FCP/LCP above use a different timing model: do not sum these into those metrics.

| LCP phase | Before | After |
|---|---:|---:|
| timeToFirstByte | 17.3 ms | 38.6 ms |
| resourceLoadDelay | 19.3 ms | 55.0 ms |
| resourceLoadDuration | 33.3 ms | 53.0 ms |
| elementRenderDelay | 1155.8 ms | 345.3 ms |

The baseline has HTML → blocking CSS → Latin Extended WOFF2 on its critical
dependency tree. The extra font is requested for U+20B5 (₵), including pricing
below the fold; the Latin file is independently preloaded. The trace also shows
layout, framework evaluation and repeated inline RSC script compilation before
the first paint. Meta's library/config evaluation dominates third-party long
tasks and TBT. Stylesheet opportunity estimates do not describe all of this
render delay, and no per-change millisecond savings are claimed.

## Implementation

- Register only the existing unmodified Latin variable Inter file with
  `next/font/local`, covering declared weights 400–700, one essential preload,
  `font-display: swap`, and Arial metric overrides calculated by Next. Keep
  its SIL license with the file. A variable font avoids four static weight
  downloads; declaring a weight range does not subset the binary. Missing
  glyphs such as ₵ use platform fallback rather than fetching Latin Extended.
- Keep Tailwind's explicit source scanning and restrict app scanning to TSX
  templates so bundled font documentation/licenses do not generate utilities.
  Remove unused chart/sidebar theme
  tokens: no routed app, landing or analytics component uses them. The duplicate
  `styles/globals.css` is not imported, so it contributes no production bytes;
  no animation stylesheet is imported by the active layout. Remaining CSS has
  no substantial removable rule set identified by Lighthouse; responsive,
  validation, focus, hover and first-screen styles are retained.
- Test and reject the installed framework's `experimental.inlineCss`
  implementation. Inlining removed the stylesheet request, but enlarged HTML
  and duplicated CSS in the RSC payload. With the corrected Pixel scheduling,
  the three-run inline median was FCP 2.201 s, LCP 3.725 s, TBT 1724 ms and
  CLS 0, versus repeated baseline FCP 1.705 s and LCP 3.758 s. This did not
  justify enabling the global experimental option. Keep the smaller stylesheet
  render-blocking, early in the head and independently cacheable. No generated
  chunks were edited and no CSS-onload or wholesale deferral was introduced.
  The option was confirmed in installed config types/schema and App Router
  production output; see
  [Next documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss).
- Static images use server-rendered `getImageProps` attributes with the same
  responsive optimizer URLs, dimensions and lazy loading. Move the order image
  and three icons to server-rendered slots; send only the selected product's
  name/path to the form, instead of all product marketing data. Keep the
  interactive quantity/submission code on the client and all hero content in
  the initial HTML. The public Next image export still contributes shared
  framework code, so this is not claimed to remove that entire library.
- One Pixel bootstrap exists, ID 4632254820337295. Switch it from
  `lazyOnload` (load/idle scheduling) to `afterInteractive`: async loading
  after hydration, critical-image decode and two animation frames, giving the
  browser a rendering opportunity before the async vendor download starts.
  A failed decode still starts analytics; hidden documents start immediately
  and a visibility listener prevents frame suspension from losing PageView.
  The small critical hero requests synchronous presentation; lower-page images
  retain async decoding. There is no interaction
  requirement, idle gate or arbitrary timer. An intermediate build starting
  Meta immediately after hydration regressed LCP; its trace showed both vendor
  scripts executing before the hero painted, so that schedule was corrected.
  Clarity keeps its existing scheduling. No existing
  consent gate is present or changed. Preserve PageView, AddToCart, Purchase,
  commerce parameters, readiness queue, purchase deduplication, full-document
  route tracking, and the noscript pixel. No Meta-downloaded script was modified.
- The flagged ~66 KiB first-party chunk is Next's App Router/bootstrap/error
  runtime, not an unused app dependency. Unused UI catalogue dependencies are
  not imported by this page. No optional feature justified adding a dynamic
  loading waterfall. The runtime still contains framework-owned compatibility
  code; the separate nomodule script is not executed by modern Chrome. There
  is no app-owned core-js import or custom polyfill to remove. Next's installed
  default browser floor is Chrome/Edge/Firefox 111 and Safari 16.4; it was not
  narrowed. TypeScript's ES6 target is not the browser polyfill policy.
- Re-enable build-time TypeScript checking. Merge submit-button styles on the
  server so `whitespace-normal` overrides the shared button's nowrap style.

## Verification and limitations

`npm run build` includes TypeScript validation. The browser check is
`node scripts/verify-rehab-performance.mjs <installed-puppeteer-core-esm-entry>`.
It checks 375/412/768/1280 px layouts and screenshots, image loading, one font
download/preload, heading weight, button wrapping, all three prices, keyboard
quantity selection, native required validation, failed submission/retry, an
accepted receipt and success-page total, Purchase deduplication on refresh,
queued AddToCart readiness, Pixel ID/single bootstrap, event names/parameters,
existing full-document route PageView, and no-JS initial hero content. Orders
and analytics are intercepted only for this functional check; no real order
or verification tracking event is sent. Evidence is in
`.performance/rehab-verification/`.

These are local production-build lab results, not measurements of the deployed
domain or field users. The supplied hashed CSS filename differs from this
build. There were substantial host CPU changes during the session. The original
`rehab-baseline` is the primary before measurement; `rehab-baseline-retest`
is disclosed separately. Exploratory `rehab-inline` and rejected immediate-Pixel
`rehab-final`, rejected inline-CSS `rehab-after-paint`, and intermediate
`rehab-external-final` sets were not used as the final comparison pair.
Even the repeated tests can be affected by host load,
external network/script variation, and Lighthouse's CPU warnings. Keep the
individual runs and CPU benchmarks above when interpreting medians; a lower
TBT is not proof that unchanged Meta code became faster. Confirm on a stable
runner and deployed URL before treating the deltas as a production guarantee.
Pixel's vendor configuration/legacy code and Next's shared runtime remain
material costs. No Lighthouse estimate is presented as measured savings.
