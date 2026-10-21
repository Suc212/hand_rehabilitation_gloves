# Product-page LCP verification

## Method

Production builds of Next.js 16.0.10 at `http://localhost:3100/products/hand-rehabilitation-glove`, before and after changes. Lighthouse 12.8.2, Chrome headless, 412 × 823 CSS pixels, DPR 1.75, simulated mobile throttling (150 ms RTT, 1638.4 Kbps, 4× CPU). Three sequential runs per build, with Lighthouse's default browser-cache/storage reset. Meta and Clarity remained enabled during performance audits; no orders were submitted. Timing is a local lab measurement, not a measurement of the deployed Vercel domain.

Raw JSON/HTML reports are in `.performance/baseline/` and `.performance/final/`; the ignored `.performance/optimized/` reports are an intermediate image implementation, not the final results. All medians below use only baseline versus final. Source/configuration changes did not alter ad events or submission processing.

## Three-run medians

| Metric | Before | After |
|---|---:|---:|
| LCP | 3.652 s | 2.122 s |
| FCP | 1.539 s | 1.020 s |
| TBT | 505.0 ms | 510.0 ms |
| CLS | 0 | 0 |
| Performance score | 76 | 86 |
| Image transfer (including tracking pixels) | 40.4 KiB | 39.0 KiB |
| Hero image encoded size | 39.9 KiB | 38.3 KiB |
| CSS transfer | 21.5 KiB | 8.0 KiB |
| JavaScript transfer | 459.9 KiB | 446.6 KiB |
| Font transfer | 154.0 KiB | 131.2 KiB |

LCP change: -41.9%. TBT is reported independently; reduced CSS and JavaScript bytes do not guarantee reduced main-thread blocking.

Individual LCP runs (ms): before 3662.4, 2451.2, 3651.8; after 3193.6, 2121.6, 2117.0. Individual TBT runs (ms): before 505.0, 451.0, 514.5; after 557.5, 441.5, 510.0.

## LCP diagnosis

The actual LCP element is the hero product image. At this viewport it renders at 380 × 390 CSS pixels, not the 665 × 683 shown in the supplied screenshot. Its 1.75× DPR candidate is 672 pixels wide. The dominant baseline bottleneck was element render delay; discovery was already early and fetch priority already high.

These are median **recorded trace** phases from Lighthouse's LCP-breakdown insight. They are not the simulated-throttling LCP above, so do not add them to the simulated metrics or to opportunity savings.

| Trace phase | Before | After |
|---|---:|---:|
| timeToFirstByte | 13.3 ms | 17.3 ms |
| resourceLoadDelay | 17.9 ms | 17.5 ms |
| resourceLoadDuration | 22.6 ms | 26.6 ms |
| elementRenderDelay | 1151.8 ms | 167.5 ms |

The first intermediate optimizer request took about 439 ms including a cold transcode, versus about 26–30 ms once cached. The final mobile candidate uses that same optimizer URL and cache. Production/CDN cache misses and device/network differences can change results.

## Changes

- Tailwind now explicitly scans application sources and the four shared UI files actually used. Saved Lighthouse HTML and unused UI components cannot generate production utility CSS. Removed the unused animation stylesheet; interactive transitions and visible styling remain.
- Inter remains unchanged and self-hosted. Geist Mono is scoped to the success page that uses it, removing its unused preload from product pages.
- The hero uses Next.js `getImageProps` on the server, with accurate `sizes`, DPR-aware optimized candidates, eager loading, high priority, and explicit 935 × 960 dimensions. React/native discovery produces at most one image preload/request. Other product images remain lazy-loaded.
- Default quality stays at 75. Measurements showed a 384w AVIF of 20.8 KB and a 672w AVIF of 39.3 KB; an 896w re-encode grew to 54.3 KB. The responsive ladder therefore uses smaller framework variants plus the unchanged 40.8 KB/935w original for high-DPR displays. It does not force every screen to 665 pixels or enlarge the source.
- The static hero no longer hydrates an image component. Static form fields and style merging run on the server, removing their runtime styling library from the form's browser bundle. The client retains quantity changes, validation, submission, and tracking; no essential form is deferred or hidden. The native submit button uses the same shared styles and handlers, and footer links use native anchors.
- No experimental blanket CSS inlining, CSS-onload switching, new browser-support restrictions, or removal of framework/Meta polyfills. No extra delay or interaction requirement was added to Meta or Clarity.

## Checks and limits

- Production build and TypeScript checks.
- Browser image matrix: 360px/1×, 412px/1.75×, 768px/2×, 1440px/2×; aspect ratio, intrinsic dimensions, correct candidate, one hero download, at most one preload, and lazy below-fold images. Details: `.performance/image-delivery.json`.
- Mocked checkout regression on both product variants: validation, failed-order retry, redirect, correct receipt/price, AddToCart before Purchase even with delayed pixel loading, refresh deduplication, and storage fallback. Meta network requests are blocked in these functional checks, so no test conversion events or real orders are created.
- The submission API was not modified. This checkout contains Firebase and Resend integration, but no Google Sheets submission code; any external Sheets synchronization cannot be verified here.

Remaining: Meta/Clarity and React/Next.js execution still consume main-thread time. The median third-party blocking diagnostic was 390.2 ms before and 344.7 ms after; this diagnostic is not identical to TBT. The legacy-JS estimate remains about 26.0 KiB, largely framework and Meta code. Browser compatibility and tracking were preserved. The screenshot's opportunity estimates were not treated as guaranteed or additive savings.

## Reproduce

Run a production build and start it on port 3100. With a Lighthouse 12.8.2 installation, run:

```text
node scripts/audit-performance.mjs <path-to-lighthouse/cli/index.js> baseline
# Apply changes, rebuild, restart the same URL, then:
node scripts/audit-performance.mjs <path-to-lighthouse/cli/index.js> final
node scripts/summarize-performance.mjs
node scripts/verify-image-delivery.mjs <path-to-puppeteer-core.js>
node scripts/verify-page.mjs <path-to-puppeteer-core.js>
```

Set `CHROME_PATH` if Chrome is installed elsewhere; the scripts default to the Windows Chrome location on this workstation. Do not run competing browser/CPU workloads during the performance runs.
