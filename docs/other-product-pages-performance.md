# Remaining product-page performance audits

## Scope and method

Individually measured the hand-rehabilitation-glove and stroke-recovery-gloves
routes. The baseline is the current shared optimization from the earlier
rehab-helper audit, not the historical unoptimized site. Next.js 16.0.10 App
Router/Turbopack, React 19.2.0, Tailwind 4.1.18; Lighthouse 12.8.2.
Browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/155.0.0.0 Safari/537.36.

Three sequential mobile Lighthouse runs per page per build, using fresh browser
profiles/cache resets, 412 × 823 CSS pixels, DPR 1.75, simulated 150 ms RTT,
1638.4 Kbps throughput and 4× CPU slowdown. Meta and Clarity remained enabled;
verification and builds did not run concurrently with the measurement loops.
Image-optimizer server caches were retained. Host CPU and third-party responses
can vary: all individual results, benchmarks and warnings are retained.

## Three-run medians

| Page | Metric | Before | After |
|---|---|---:|---:|
| hand-rehabilitation-glove | FCP | 1.039 s | 0.919 s |
| hand-rehabilitation-glove | LCP | 2.749 s | 2.703 s |
| hand-rehabilitation-glove | TBT | 780.0 ms | 471.4 ms |
| hand-rehabilitation-glove | CLS | 0 | 0 |
| hand-rehabilitation-glove | Score | 77 | 85 |
| hand-rehabilitation-glove | Host CPU benchmark | 1753.5 | 2100 |
| hand-rehabilitation-glove | Font transfer | 47.59 KiB | 47.59 KiB |
| hand-rehabilitation-glove | Image transfer (including tracking pixels) | 40.87 KiB | 41.25 KiB |
| hand-rehabilitation-glove | CSS transfer | 7.04 KiB | 7.08 KiB |
| hand-rehabilitation-glove | First-party JS transfer | 142.52 KiB | 142.52 KiB |
| stroke-recovery-gloves | FCP | 1.355 s | 0.940 s |
| stroke-recovery-gloves | LCP | 3.026 s | 2.809 s |
| stroke-recovery-gloves | TBT | 740.0 ms | 684.8 ms |
| stroke-recovery-gloves | CLS | 0 | 0 |
| stroke-recovery-gloves | Score | 74 | 78 |
| stroke-recovery-gloves | Host CPU benchmark | 1567 | 2025 |
| stroke-recovery-gloves | Font transfer | 47.59 KiB | 47.59 KiB |
| stroke-recovery-gloves | Image transfer (including tracking pixels) | 84.05 KiB | 35.19 KiB |
| stroke-recovery-gloves | CSS transfer | 7.04 KiB | 7.08 KiB |
| stroke-recovery-gloves | First-party JS transfer | 142.52 KiB | 142.52 KiB |

## hand-rehabilitation-glove

Measured URL: http://localhost:3100/products/hand-rehabilitation-glove.

Baseline LCP: Hand Rehabilitation Glove product view; final LCP:
Hand Rehabilitation Glove product view. Dimensions and selectors for each run
are included in the machine-readable comparison.

Recorded trace phase medians below are separate from Lighthouse's simulated
LCP metric; do not add them to the simulated metric or opportunity estimates.

| LCP phase | Before | After |
|---|---:|---:|
| timeToFirstByte | 17.0 ms | 11.5 ms |
| resourceLoadDelay | 23.1 ms | 19.8 ms |
| resourceLoadDuration | 25.2 ms | 23.7 ms |
| elementRenderDelay | 1109.2 ms | 108.8 ms |

| Build/run | FCP | LCP | TBT | CLS | CPU benchmark |
|---|---:|---:|---:|---:|---:|
| other-hand-baseline/1 | 1.840 s | 3.269 s | 1613.5 ms | 0 | 1753.5 |
| other-hand-baseline/2 | 1.019 s | 2.744 s | 656.5 ms | 0 | 1968.5 |
| other-hand-baseline/3 | 1.039 s | 2.749 s | 780.0 ms | 0 | 1537.5 |
| other-hand-final/1 | 0.918 s | 2.703 s | 457.5 ms | 0 | 2112 |
| other-hand-final/2 | 0.919 s | 2.119 s | 471.4 ms | 0 | 2006.5 |
| other-hand-final/3 | 0.919 s | 2.705 s | 497.5 ms | 0 | 2100 |

## stroke-recovery-gloves

Measured URL: http://localhost:3100/products/stroke-recovery-gloves.

Baseline LCP: Rehabilitation glove for assisted hand movement practice; final LCP:
Rehabilitation glove for assisted hand movement practice. Dimensions and selectors for each run
are included in the machine-readable comparison.

Recorded trace phase medians below are separate from Lighthouse's simulated
LCP metric; do not add them to the simulated metric or opportunity estimates.

| LCP phase | Before | After |
|---|---:|---:|
| timeToFirstByte | 12.7 ms | 19.9 ms |
| resourceLoadDelay | 18.1 ms | 26.5 ms |
| resourceLoadDuration | 21.7 ms | 28.6 ms |
| elementRenderDelay | 1160.0 ms | 1118.9 ms |

| Build/run | FCP | LCP | TBT | CLS | CPU benchmark |
|---|---:|---:|---:|---:|---:|
| other-stroke-baseline/1 | 1.917 s | 3.026 s | 739.0 ms | 0 | 1135 |
| other-stroke-baseline/2 | 1.010 s | 2.915 s | 740.0 ms | 0 | 1694.5 |
| other-stroke-baseline/3 | 1.355 s | 3.268 s | 1928.0 ms | 0 | 1567 |
| other-stroke-final/1 | 0.969 s | 2.903 s | 2072.5 ms | 0 | 1208.5 |
| other-stroke-final/2 | 0.913 s | 2.678 s | 527.0 ms | 0 | 2025 |
| other-stroke-final/3 | 0.940 s | 2.809 s | 684.8 ms | 0 | 2043.5 |


## Changes and verification

The standard glove hero lacked the caregiver pages' early preload. Added a
responsive preload with exactly the same srcset/sizes as the rendered image,
using React DOM's supported preload API. This preserves the existing image
quality and responsive candidates, avoids upscaling, and prevents a duplicate
full-size download alongside the selected mobile candidate. The hero remains
server-rendered, high priority, eagerly loaded and dimensioned.
See [React's preload API](https://react.dev/reference/react-dom/preload).

Both pages now use native offscreen rendering containment for detail sections,
scoped to the product-page main element. The hero and compact trust strip stay
fully laid out. `content-visibility: auto` skips offscreen layout/paint until
content is near the viewport; `contain-intrinsic-size: auto 900px` reserves
space and remembers actual heights once rendered. All content stays in initial
HTML; unsupported browsers use normal rendering. This targets the layout work
observed before LCP, without deferring the first-screen stylesheet or adding JS.
See [Chrome's rendering guidance](https://web.dev/articles/content-visibility).

The stroke page already has a direct, preloaded 35 KB AVIF hero and the shared
font/CSS/client-component optimizations, which were retained.
No extra font, CSS deferral, vendor-script modification, browser-support
restriction or Pixel timing change was introduced for either page.

Both pages retain one Latin variable font/preload with swap display and metric
fallbacks. The stylesheet stays early and independently cacheable; experimental
CSS inlining remains disabled after the prior measured regression. The shared
framework runtime and Meta's configuration/compatibility code remain costs;
there are no new app-owned polyfills or optional features to dynamically load.

Generalized the existing browser verification to accept a product ID. For each
page it checks initial HTML/hero content, 375/412/768/1280 px layouts and source
aspect ratios, one critical-image download, fonts, required-field validation,
all three bundle totals, keyboard selection, submission error/retry, accepted
receipt/success total, correct product ID/name/landing-page event parameters,
PageView/AddToCart/Purchase and deduplication. Orders and vendor tracking are
intercepted during functional verification; no real verification order or
Purchase is sent. Production builds include TypeScript validation.

## Evidence and limitations

Raw JSON/HTML, traces and DevTools logs are in the gitignored directories
`.performance/other-{hand,stroke}-{baseline,final}/`. The comparison with
pre-LCP trace work, network dependency trees and per-run warnings is
`.performance/other-products-comparison.json`. Browser screenshots/results
are under `.performance/verification-<product-id>/`.

These are local production-build measurements, not deployed-domain or field
measurements. Timing and TBT changes can reflect host CPU variation and vendor
responses; no Lighthouse estimated saving is claimed as a measured gain.
No per-change millisecond savings are attributed to the preload versus
containment independently. Live email/database order delivery
is not exercised by intercepted checkout verification.

Reproduce after `npm run build` and starting production on port 3100:

`node scripts/audit-performance.mjs <installed-lighthouse-cli> <label> <product-url>`

`node scripts/verify-rehab-performance.mjs <installed-puppeteer-core-esm-entry> <product-id>`

`node scripts/summarize-other-products.mjs`
