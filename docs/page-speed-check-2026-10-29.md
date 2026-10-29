# Product-page speed check - 2026-10-29

Verdict: first paint and layout stability are good in these mobile lab runs. All three median LCP values need improvement, and all three median total blocking times are slow.

## Method

Fresh Next.js 16.0.10 production build with TypeScript validation, served at http://localhost:3100. Lighthouse 12.8.2. Browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/155.0.0.0 Safari/537.36. Three sequential runs per page, browser-cache/storage reset per run, 412 x 823 viewport, DPR 1.75, simulated 150 ms RTT, 1638.4 Kbps and 4x CPU slowdown. Meta and Clarity remained enabled. No builds or functional browser checks ran concurrently with the audits. No application behavior was changed during this speed check.

## Three-run medians

| Product page | Score /100 | FCP | LCP | Speed Index | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Hand rehabilitation | 75 | 0.925 s | 2.796 s | 2.513 s | 903 ms | 0 |
| Rehab helper | 76 | 0.926 s | 2.570 s | 1.057 s | 848 ms | 0 |
| Stroke recovery | 76 | 0.920 s | 2.724 s | 1.084 s | 1017 ms | 0 |

Good reference targets: [FCP <=1.8 s](https://web.dev/articles/fcp), [LCP <=2.5 s](https://web.dev/articles/lcp), [mobile TBT <=200 ms](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time), [CLS <=0.1](https://web.dev/articles/cls), and [mobile Speed Index <=3.4 s](https://developer.chrome.com/docs/lighthouse/performance/speed-index). These lab medians do not establish a field Core Web Vitals pass.

## LCP and script diagnostics

The LCP element on each route is its hero image. Trace phases below are recorded timing breakdowns, distinct from the simulated LCP metrics above; do not sum them into those simulated results.

| Page | TTFB | Image load delay | Image download | Render delay | Facebook blocking | Clarity blocking |
|---|---:|---:|---:|---:|---:|---:|
| Hand rehabilitation | 17 ms | 25 ms | 28 ms | 1134 ms | 435 ms | 216 ms |
| Rehab helper | 20 ms | 23 ms | 25 ms | 118 ms | 469 ms | 153 ms |
| Stroke recovery | 15 ms | 28 ms | 25 ms | 134 ms | 394 ms | 248 ms |

Third-party execution, particularly the Meta library/configuration, remains a substantial blocking cost. Rendering work and the shared framework runtime also remain. Opportunity estimates are not measured savings, and no metric deltas are attributed to the new affected-hand field.

## Individual runs

| Page/run | Score | FCP | LCP | TBT | CLS | CPU benchmark |
|---|---:|---:|---:|---:|---:|---:|
| Hand rehabilitation/1 | 75 | 0.936 s | 2.800 s | 861 ms | 0 | 1792 |
| Hand rehabilitation/2 | 75 | 0.925 s | 2.796 s | 903 ms | 0 | 1806.5 |
| Hand rehabilitation/3 | 72 | 0.924 s | 2.783 s | 1130 ms | 0 | 1718.5 |
| Rehab helper/1 | 75 | 0.926 s | 2.568 s | 1050 ms | 0 | 1810.5 |
| Rehab helper/2 | 76 | 0.926 s | 2.779 s | 848 ms | 0 | 1755.5 |
| Rehab helper/3 | 81 | 0.919 s | 2.570 s | 629 ms | 0 | 1921.5 |
| Stroke recovery/1 | 74 | 0.919 s | 2.761 s | 1017 ms | 0 | 1803 |
| Stroke recovery/2 | 76 | 0.921 s | 2.724 s | 907 ms | 0 | 1797 |
| Stroke recovery/3 | 77 | 0.920 s | 2.120 s | 1042 ms | 0 | 1674 |

## Limits and evidence

These measurements cover the local production build, not live hosting/CDN latency, real mobile hardware or field-user INP. CPU load and third-party responses can vary between runs. Browser warnings, benchmarks, raw JSON/HTML reports, DevTools logs and performance traces are saved under .performance/speed-20261029-{hand,rehab,stroke}/. The machine-readable summary is .performance/speed-20261029-summary.json. The large raw artifacts are gitignored.
