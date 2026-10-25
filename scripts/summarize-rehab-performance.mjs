import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const [beforeLabel = "rehab-baseline", afterLabel = "rehab-decoded-final"] = process.argv.slice(2)
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
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
      .sort((a, b) => b.dur - a.dur).slice(0, 12)
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
      cssBytes: bytes((request) => request.resourceType === "Stylesheet"),
      documentBytes: bytes((request) => request.resourceType === "Document"),
      firstPartyJsBytes: bytes((request) => request.resourceType === "Script" && request.url.startsWith("http://localhost")),
      metaBytes: bytes((request) => request.resourceType === "Script" && new URL(request.url).hostname === "connect.facebook.net"),
      phases,
      lcpElement: audits["lcp-breakdown-insight"].details.items[1],
      preLcpWork,
      thirdParties: audits["third-party-summary"].details.items.map(({ entity, blockingTime }) => ({ entity, blockingTime })),
      warnings: report.runWarnings,
    }
  })
  const keys = ["fcp", "lcp", "tbt", "cls", "score", "cpuBenchmark", "fontBytes", "cssBytes", "documentBytes", "firstPartyJsBytes", "metaBytes"]
  return {
    label, url: reports[0].finalDisplayedUrl, lighthouse: reports[0].lighthouseVersion,
    browser: reports[0].environment.hostUserAgent, settings: reports[0].configSettings,
    medians: Object.fromEntries(keys.map((key) => [key, median(runs.map((run) => run[key]))])),
    phaseMedians: Object.fromEntries(Object.keys(runs[0].phases).map((key) => [key, median(runs.map((run) => run.phases[key]))])),
    runs,
  }
}
const before = summarize(beforeLabel)
const after = summarize(afterLabel)
const baselineRetest = summarize("rehab-baseline-retest")
const comparison = { before, baselineRetest, after }
writeFileSync(".performance/rehab-comparison.json", JSON.stringify(comparison, null, 2))
const ms = (value) => `${value.toFixed(1)} ms`
const seconds = (value) => `${(value / 1000).toFixed(3)} s`
const kib = (value) => `${(value / 1024).toFixed(2)} KiB`
const rows = [
  ["FCP", seconds(before.medians.fcp), seconds(after.medians.fcp)],
  ["LCP", seconds(before.medians.lcp), seconds(after.medians.lcp)],
  ["TBT", ms(before.medians.tbt), ms(after.medians.tbt)],
  ["CLS", before.medians.cls, after.medians.cls],
  ["Lighthouse performance score", before.medians.score, after.medians.score],
  ["Font transfer", kib(before.medians.fontBytes), kib(after.medians.fontBytes)],
  ["External CSS transfer", kib(before.medians.cssBytes), kib(after.medians.cssBytes)],
  ["HTML transfer (includes inline styles)", kib(before.medians.documentBytes), kib(after.medians.documentBytes)],
  ["First-party JS transfer", kib(before.medians.firstPartyJsBytes), kib(after.medians.firstPartyJsBytes)],
  ["Meta JS transfer", kib(before.medians.metaBytes), kib(after.medians.metaBytes)],
  ["Host CPU benchmark (higher is faster)", before.medians.cpuBenchmark, after.medians.cpuBenchmark],
]
mkdirSync("docs", { recursive: true })
writeFileSync("docs/rehab-helper-performance.md", `# Rehab Helper Gloves production-build audit

## Method and measured results

Next.js 16.0.10 App Router with Turbopack, React 19.2.0, Tailwind 4.1.18.
Measured URL: ${after.url}. Lighthouse ${after.lighthouse}; ${after.browser}.
Three sequential runs per production build, fresh browser profiles/cache resets,
412 × 823 CSS pixels, DPR 1.75, simulated mobile throttling: 150 ms RTT,
1638.4 Kbps throughput, CPU slowdown multiplier 4. Real Meta and Clarity scripts
remained enabled and were not blocked or replaced during performance runs.
Server image-optimizer caches were retained; the LCP uses a direct static AVIF.
No build or browser verification ran concurrently with the audit loop.

| Metric (three-run median) | Before | After |
|---|---:|---:|
${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

The original baseline is retained as the primary before column to avoid
selecting the slower repeated baseline as a more favorable comparison.
The repeated baseline medians were FCP ${seconds(baselineRetest.medians.fcp)},
LCP ${seconds(baselineRetest.medians.lcp)}, TBT ${ms(baselineRetest.medians.tbt)},
CLS ${baselineRetest.medians.cls}, CPU benchmark ${baselineRetest.medians.cpuBenchmark}.
FCP/LCP improve against the original baseline, but **TBT regresses**. Against
the repeated baseline, TBT is lower. These conflicting TBT comparisons and
changing CPU benchmarks do not establish a reliable main-thread speed gain.

| Build/run | FCP | LCP | TBT | CLS | Host CPU benchmark |
|---|---:|---:|---:|---:|---:|
${[before, baselineRetest, after].flatMap((build) => build.runs.map((run) => `| ${build.label}/${run.run} | ${seconds(run.fcp)} | ${seconds(run.lcp)} | ${ms(run.tbt)} | ${run.cls} | ${run.cpuBenchmark} |`)).join("\n")}

Raw JSON/HTML, DevTools logs and performance traces are under
\`.performance/${before.label}/\` and \`.performance/${after.label}/\`.
The machine-readable comparison, including pre-LCP trace work and warnings, is
\`.performance/rehab-comparison.json\`. These large artifacts are gitignored.
Reproduce using \`node scripts/audit-performance.mjs <installed-lighthouse-cli> <label> http://localhost:3100/products/rehab-helper-gloves\` after \`npm run build\` and \`next start -p 3100\`.

## Trace diagnosis

The LCP is the hero image, alt “Close-up of hands practising a grip”, displayed
at 388 × 388 CSS pixels at the audited viewport. It is server-rendered, eagerly
loaded, preloaded and has high fetch priority. Its network discovery was already
early; reducing its bytes was not the main opportunity in this audit.

The following are medians of **recorded trace** phases. Lighthouse's simulated
FCP/LCP above use a different timing model: do not sum these into those metrics.

| LCP phase | Before | After |
|---|---:|---:|
${Object.keys(before.phaseMedians).map((key) => `| ${key} | ${ms(before.phaseMedians[key])} | ${ms(after.phaseMedians[key])} |`).join("\n")}

The baseline has HTML → blocking CSS → Latin Extended WOFF2 on its critical
dependency tree. The extra font is requested for U+20B5 (₵), including pricing
below the fold; the Latin file is independently preloaded. The trace also shows
layout, framework evaluation and repeated inline RSC script compilation before
the first paint. Meta's library/config evaluation dominates third-party long
tasks and TBT. Stylesheet opportunity estimates do not describe all of this
render delay, and no per-change millisecond savings are claimed.

## Implementation

- Register only the existing unmodified Latin variable Inter file with
  \`next/font/local\`, covering declared weights 400–700, one essential preload,
  \`font-display: swap\`, and Arial metric overrides calculated by Next. Keep
  its SIL license with the file. A variable font avoids four static weight
  downloads; declaring a weight range does not subset the binary. Missing
  glyphs such as ₵ use platform fallback rather than fetching Latin Extended.
- Keep Tailwind's explicit source scanning and restrict app scanning to TSX
  templates so bundled font documentation/licenses do not generate utilities.
  Remove unused chart/sidebar theme
  tokens: no routed app, landing or analytics component uses them. The duplicate
  \`styles/globals.css\` is not imported, so it contributes no production bytes;
  no animation stylesheet is imported by the active layout. Remaining CSS has
  no substantial removable rule set identified by Lighthouse; responsive,
  validation, focus, hover and first-screen styles are retained.
- Test and reject the installed framework's \`experimental.inlineCss\`
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
- Static images use server-rendered \`getImageProps\` attributes with the same
  responsive optimizer URLs, dimensions and lazy loading. Move the order image
  and three icons to server-rendered slots; send only the selected product's
  name/path to the form, instead of all product marketing data. Keep the
  interactive quantity/submission code on the client and all hero content in
  the initial HTML. The public Next image export still contributes shared
  framework code, so this is not claimed to remove that entire library.
- One Pixel bootstrap exists, ID 4632254820337295. Switch it from
  \`lazyOnload\` (load/idle scheduling) to \`afterInteractive\`: async loading
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
  server so \`whitespace-normal\` overrides the shared button's nowrap style.

## Verification and limitations

\`npm run build\` includes TypeScript validation. The browser check is
\`node scripts/verify-rehab-performance.mjs <installed-puppeteer-core-esm-entry>\`.
It checks 375/412/768/1280 px layouts and screenshots, image loading, one font
download/preload, heading weight, button wrapping, all three prices, keyboard
quantity selection, native required validation, failed submission/retry, an
accepted receipt and success-page total, Purchase deduplication on refresh,
queued AddToCart readiness, Pixel ID/single bootstrap, event names/parameters,
existing full-document route PageView, and no-JS initial hero content. Orders
and analytics are intercepted only for this functional check; no real order
or verification tracking event is sent. Evidence is in
\`.performance/rehab-verification/\`.

These are local production-build lab results, not measurements of the deployed
domain or field users. The supplied hashed CSS filename differs from this
build. There were substantial host CPU changes during the session. The original
\`rehab-baseline\` is the primary before measurement; \`rehab-baseline-retest\`
is disclosed separately. Exploratory \`rehab-inline\` and rejected immediate-Pixel
\`rehab-final\`, rejected inline-CSS \`rehab-after-paint\`, and intermediate
\`rehab-external-final\` sets were not used as the final comparison pair.
Even the repeated tests can be affected by host load,
external network/script variation, and Lighthouse's CPU warnings. Keep the
individual runs and CPU benchmarks above when interpreting medians; a lower
TBT is not proof that unchanged Meta code became faster. Confirm on a stable
runner and deployed URL before treating the deltas as a production guarantee.
Pixel's vendor configuration/legacy code and Next's shared runtime remain
material costs. No Lighthouse estimate is presented as measured savings.
`)
console.log(JSON.stringify({ before: before.medians, after: after.medians }, null, 2))
