import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const median = (values) => [...values].sort((a, b) => a - b)[1]
const products = [
  { id: "hand-rehabilitation-glove", label: "hand" },
  { id: "stroke-recovery-gloves", label: "stroke" },
]
function summarize(label) {
  const reports = [1, 2, 3].map((run) => JSON.parse(readFileSync(`.performance/${label}/mobile-${run}.report.json`, "utf8")))
  const runs = reports.map((report, index) => {
    const audits = report.audits
    const requests = audits["network-requests"].details.items
    const bytes = (predicate) => requests.filter(predicate).reduce((sum, request) => sum + request.transferSize, 0)
    const phases = Object.fromEntries(audits["lcp-breakdown-insight"].details.items[0].items.map((item) => [item.subpart, item.duration]))
    const trace = JSON.parse(readFileSync(`.performance/${label}/mobile-${index + 1}-0.trace.json`, "utf8")).traceEvents
    const navigation = trace.find((event) => event.name === "navigationStart" && event.args?.data?.isOutermostMainFrame)
    const lcp = trace.filter((event) => event.name === "largestContentfulPaint::Candidate").at(-1)
    const preLcpWork = trace.filter((event) => event.pid === navigation.pid && event.tid === navigation.tid && event.ts >= navigation.ts && event.ts <= lcp.ts && event.dur >= 10000 && ["Layout", "EvaluateScript", "ParseHTML", "UpdateLayoutTree", "v8.compile"].includes(event.name))
      .sort((a, b) => b.dur - a.dur).slice(0, 10)
      .map((event) => ({ name: event.name, startMs: (event.ts - navigation.ts) / 1000, durationMs: event.dur / 1000, url: event.args?.data?.url }))
    return {
      run: index + 1,
      fcp: audits["first-contentful-paint"].numericValue,
      lcp: audits["largest-contentful-paint"].numericValue,
      tbt: audits["total-blocking-time"].numericValue,
      cls: audits["cumulative-layout-shift"].numericValue,
      score: report.categories.performance.score * 100,
      cpuBenchmark: report.environment.benchmarkIndex,
      fontBytes: bytes((request) => request.resourceType === "Font"),
      imageBytes: bytes((request) => request.resourceType === "Image"),
      cssBytes: bytes((request) => request.resourceType === "Stylesheet"),
      documentBytes: bytes((request) => request.resourceType === "Document"),
      firstPartyJsBytes: bytes((request) => request.resourceType === "Script" && new URL(request.url).hostname === "localhost"),
      phases,
      lcpElement: audits["lcp-breakdown-insight"].details.items[1],
      networkDependencyTree: audits["network-dependency-tree-insight"]?.details.items[0],
      preLcpWork,
      thirdParties: audits["third-party-summary"].details.items.map(({ entity, blockingTime }) => ({ entity, blockingTime })),
      warnings: report.runWarnings,
    }
  })
  const keys = ["fcp", "lcp", "tbt", "cls", "score", "cpuBenchmark", "fontBytes", "imageBytes", "cssBytes", "documentBytes", "firstPartyJsBytes"]
  return {
    label, url: reports[0].finalDisplayedUrl, lighthouse: reports[0].lighthouseVersion,
    browser: reports[0].environment.hostUserAgent,
    medians: Object.fromEntries(keys.map((key) => [key, median(runs.map((run) => run[key]))])),
    phaseMedians: Object.fromEntries(Object.keys(runs[0].phases).map((key) => [key, median(runs.map((run) => run.phases[key]))])),
    runs,
  }
}
const results = products.map((product) => ({ ...product, before: summarize(`other-${product.label}-baseline`), after: summarize(`other-${product.label}-final`) }))
writeFileSync(".performance/other-products-comparison.json", JSON.stringify(results, null, 2))
const seconds = (value) => `${(value / 1000).toFixed(3)} s`
const ms = (value) => `${value.toFixed(1)} ms`
const kib = (value) => `${(value / 1024).toFixed(2)} KiB`
mkdirSync("docs", { recursive: true })
writeFileSync("docs/other-product-pages-performance.md", `# Remaining product-page performance audits

## Scope and method

Individually measured the hand-rehabilitation-glove and stroke-recovery-gloves
routes. The baseline is the current shared optimization from the earlier
rehab-helper audit, not the historical unoptimized site. Next.js 16.0.10 App
Router/Turbopack, React 19.2.0, Tailwind 4.1.18; Lighthouse ${results[0].before.lighthouse}.
Browser: ${results[0].before.browser}.

Three sequential mobile Lighthouse runs per page per build, using fresh browser
profiles/cache resets, 412 × 823 CSS pixels, DPR 1.75, simulated 150 ms RTT,
1638.4 Kbps throughput and 4× CPU slowdown. Meta and Clarity remained enabled;
verification and builds did not run concurrently with the measurement loops.
Image-optimizer server caches were retained. Host CPU and third-party responses
can vary: all individual results, benchmarks and warnings are retained.

## Three-run medians

| Page | Metric | Before | After |
|---|---|---:|---:|
${results.flatMap(({ id, before, after }) => [
  ["FCP", seconds(before.medians.fcp), seconds(after.medians.fcp)],
  ["LCP", seconds(before.medians.lcp), seconds(after.medians.lcp)],
  ["TBT", ms(before.medians.tbt), ms(after.medians.tbt)],
  ["CLS", before.medians.cls, after.medians.cls],
  ["Score", before.medians.score, after.medians.score],
  ["Host CPU benchmark", before.medians.cpuBenchmark, after.medians.cpuBenchmark],
  ["Font transfer", kib(before.medians.fontBytes), kib(after.medians.fontBytes)],
  ["Image transfer (including tracking pixels)", kib(before.medians.imageBytes), kib(after.medians.imageBytes)],
  ["CSS transfer", kib(before.medians.cssBytes), kib(after.medians.cssBytes)],
  ["First-party JS transfer", kib(before.medians.firstPartyJsBytes), kib(after.medians.firstPartyJsBytes)],
].map((row) => `| ${id} | ${row.join(" | ")} |`)).join("\n")}

${results.map(({ id, before, after }) => `## ${id}

Measured URL: ${after.url}.

Baseline LCP: ${before.runs[0].lcpElement.nodeLabel}; final LCP:
${after.runs[0].lcpElement.nodeLabel}. Dimensions and selectors for each run
are included in the machine-readable comparison.

Recorded trace phase medians below are separate from Lighthouse's simulated
LCP metric; do not add them to the simulated metric or opportunity estimates.

| LCP phase | Before | After |
|---|---:|---:|
${Object.keys(before.phaseMedians).map((key) => `| ${key} | ${ms(before.phaseMedians[key])} | ${ms(after.phaseMedians[key])} |`).join("\n")}

| Build/run | FCP | LCP | TBT | CLS | CPU benchmark |
|---|---:|---:|---:|---:|---:|
${[before, after].flatMap((build) => build.runs.map((run) => `| ${build.label}/${run.run} | ${seconds(run.fcp)} | ${seconds(run.lcp)} | ${ms(run.tbt)} | ${run.cls} | ${run.cpuBenchmark} |`)).join("\n")}
`).join("\n")}

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
fully laid out. \`content-visibility: auto\` skips offscreen layout/paint until
content is near the viewport; \`contain-intrinsic-size: auto 900px\` reserves
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
\`.performance/other-{hand,stroke}-{baseline,final}/\`. The comparison with
pre-LCP trace work, network dependency trees and per-run warnings is
\`.performance/other-products-comparison.json\`. Browser screenshots/results
are under \`.performance/verification-<product-id>/\`.

These are local production-build measurements, not deployed-domain or field
measurements. Timing and TBT changes can reflect host CPU variation and vendor
responses; no Lighthouse estimated saving is claimed as a measured gain.
No per-change millisecond savings are attributed to the preload versus
containment independently. Live email/database order delivery
is not exercised by intercepted checkout verification.

Reproduce after \`npm run build\` and starting production on port 3100:

\`node scripts/audit-performance.mjs <installed-lighthouse-cli> <label> <product-url>\`

\`node scripts/verify-rehab-performance.mjs <installed-puppeteer-core-esm-entry> <product-id>\`

\`node scripts/summarize-other-products.mjs\`
`)
console.log(JSON.stringify(results.map(({ id, before, after }) => ({ id, before: before.medians, after: after.medians })), null, 2))
