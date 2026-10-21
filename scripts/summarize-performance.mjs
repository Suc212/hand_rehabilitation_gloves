import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
function summarize(label) {
  const reports = [1, 2, 3].map((run) => JSON.parse(readFileSync(join(".performance", label, `mobile-${run}.report.json`), "utf8")))
  const rows = reports.map((report) => {
    const a = report.audits
    const requests = a["network-requests"].details.items
    const bytes = (type) => requests.filter((r) => r.resourceType === type).reduce((sum, r) => sum + r.transferSize, 0)
    const phases = Object.fromEntries((a["lcp-breakdown-insight"]?.details.items[0].items || []).map((phase) => [phase.subpart, phase.duration]))
    const hero = requests.find((r) => {
      const url = new URL(r.url)
      return decodeURIComponent(url.searchParams.get("url") || url.pathname) === "/images/Img 1.avif"
    })
    return {
      lcp: a["largest-contentful-paint"].numericValue, fcp: a["first-contentful-paint"].numericValue,
      tbt: a["total-blocking-time"].numericValue, cls: a["cumulative-layout-shift"].numericValue,
      score: report.categories.performance.score * 100,
      imageBytes: bytes("Image"), cssBytes: bytes("Stylesheet"), jsBytes: bytes("Script"), fontBytes: bytes("Font"),
      heroBytes: hero.resourceSize,
      thirdPartyBlocking: a["third-party-summary"].details.summary.wastedMs,
      legacyBytes: a["legacy-javascript"].details.overallSavingsBytes,
      ...phases,
    }
  })
  return { medians: Object.fromEntries(Object.keys(rows[0]).map((key) => [key, median(rows.map((row) => row[key]))])), rows, version: reports[0].lighthouseVersion, browser: reports[0].environment.hostUserAgent, url: reports[0].finalDisplayedUrl }
}
const baseline = summarize("baseline")
const final = summarize("final")
const result = { baseline, final }
writeFileSync(".performance/comparison.json", JSON.stringify(result, null, 2))
const b = baseline.medians
const f = final.medians
const seconds = (value) => `${(value / 1000).toFixed(3)} s`
const kib = (value) => `${(value / 1024).toFixed(1)} KiB`
const metricRows = [
  ["LCP", seconds(b.lcp), seconds(f.lcp)], ["FCP", seconds(b.fcp), seconds(f.fcp)],
  ["TBT", `${b.tbt.toFixed(1)} ms`, `${f.tbt.toFixed(1)} ms`], ["CLS", b.cls, f.cls],
  ["Performance score", b.score, f.score],
  ["Image transfer (including tracking pixels)", kib(b.imageBytes), kib(f.imageBytes)],
  ["Hero image encoded size", kib(b.heroBytes), kib(f.heroBytes)],
  ["CSS transfer", kib(b.cssBytes), kib(f.cssBytes)], ["JavaScript transfer", kib(b.jsBytes), kib(f.jsBytes)],
  ["Font transfer", kib(b.fontBytes), kib(f.fontBytes)],
]
const phaseRows = ["timeToFirstByte", "resourceLoadDelay", "resourceLoadDuration", "elementRenderDelay"].map((key) => `| ${key} | ${b[key].toFixed(1)} ms | ${f[key].toFixed(1)} ms |`)
mkdirSync("docs", { recursive: true })
writeFileSync("docs/performance-lcp.md", `# Product-page LCP verification

## Method

Production builds of Next.js 16.0.10 at \`${baseline.url}\`, before and after changes. Lighthouse ${baseline.version}, Chrome headless, 412 × 823 CSS pixels, DPR 1.75, simulated mobile throttling (150 ms RTT, 1638.4 Kbps, 4× CPU). Three sequential runs per build, with Lighthouse's default browser-cache/storage reset. Meta and Clarity remained enabled during performance audits; no orders were submitted. Timing is a local lab measurement, not a measurement of the deployed Vercel domain.

Raw JSON/HTML reports are in \`.performance/baseline/\` and \`.performance/final/\`; the ignored \`.performance/optimized/\` reports are an intermediate image implementation, not the final results. All medians below use only baseline versus final. Source/configuration changes did not alter ad events or submission processing.

## Three-run medians

| Metric | Before | After |
|---|---:|---:|
${metricRows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

LCP change: ${((f.lcp / b.lcp - 1) * 100).toFixed(1)}%. TBT is reported independently; reduced CSS and JavaScript bytes do not guarantee reduced main-thread blocking.

Individual LCP runs (ms): before ${baseline.rows.map((r) => r.lcp.toFixed(1)).join(", ")}; after ${final.rows.map((r) => r.lcp.toFixed(1)).join(", ")}. Individual TBT runs (ms): before ${baseline.rows.map((r) => r.tbt.toFixed(1)).join(", ")}; after ${final.rows.map((r) => r.tbt.toFixed(1)).join(", ")}.

## LCP diagnosis

The actual LCP element is the hero product image. At this viewport it renders at 380 × 390 CSS pixels, not the 665 × 683 shown in the supplied screenshot. Its 1.75× DPR candidate is 672 pixels wide. The dominant baseline bottleneck was element render delay; discovery was already early and fetch priority already high.

These are median **recorded trace** phases from Lighthouse's LCP-breakdown insight. They are not the simulated-throttling LCP above, so do not add them to the simulated metrics or to opportunity savings.

| Trace phase | Before | After |
|---|---:|---:|
${phaseRows.join("\n")}

The first intermediate optimizer request took about 439 ms including a cold transcode, versus about 26–30 ms once cached. The final mobile candidate uses that same optimizer URL and cache. Production/CDN cache misses and device/network differences can change results.

## Changes

- Tailwind now explicitly scans application sources and the four shared UI files actually used. Saved Lighthouse HTML and unused UI components cannot generate production utility CSS. Removed the unused animation stylesheet; interactive transitions and visible styling remain.
- Inter remains unchanged and self-hosted. Geist Mono is scoped to the success page that uses it, removing its unused preload from product pages.
- The hero uses Next.js \`getImageProps\` on the server, with accurate \`sizes\`, DPR-aware optimized candidates, eager loading, high priority, and explicit 935 × 960 dimensions. React/native discovery produces at most one image preload/request. Other product images remain lazy-loaded.
- Default quality stays at 75. Measurements showed a 384w AVIF of 20.8 KB and a 672w AVIF of 39.3 KB; an 896w re-encode grew to 54.3 KB. The responsive ladder therefore uses smaller framework variants plus the unchanged 40.8 KB/935w original for high-DPR displays. It does not force every screen to 665 pixels or enlarge the source.
- The static hero no longer hydrates an image component. Static form fields and style merging run on the server, removing their runtime styling library from the form's browser bundle. The client retains quantity changes, validation, submission, and tracking; no essential form is deferred or hidden. The native submit button uses the same shared styles and handlers, and footer links use native anchors.
- No experimental blanket CSS inlining, CSS-onload switching, new browser-support restrictions, or removal of framework/Meta polyfills. No extra delay or interaction requirement was added to Meta or Clarity.

## Checks and limits

- Production build and TypeScript checks.
- Browser image matrix: 360px/1×, 412px/1.75×, 768px/2×, 1440px/2×; aspect ratio, intrinsic dimensions, correct candidate, one hero download, at most one preload, and lazy below-fold images. Details: \`.performance/image-delivery.json\`.
- Mocked checkout regression on both product variants: validation, failed-order retry, redirect, correct receipt/price, AddToCart before Purchase even with delayed pixel loading, refresh deduplication, and storage fallback. Meta network requests are blocked in these functional checks, so no test conversion events or real orders are created.
- The submission API was not modified. This checkout contains Firebase and Resend integration, but no Google Sheets submission code; any external Sheets synchronization cannot be verified here.

Remaining: Meta/Clarity and React/Next.js execution still consume main-thread time. The median third-party blocking diagnostic was ${b.thirdPartyBlocking.toFixed(1)} ms before and ${f.thirdPartyBlocking.toFixed(1)} ms after; this diagnostic is not identical to TBT. The legacy-JS estimate remains about ${kib(f.legacyBytes)}, largely framework and Meta code. Browser compatibility and tracking were preserved. The screenshot's opportunity estimates were not treated as guaranteed or additive savings.

## Reproduce

Run a production build and start it on port 3100. With a Lighthouse 12.8.2 installation, run:

\`\`\`text
node scripts/audit-performance.mjs <path-to-lighthouse/cli/index.js> baseline
# Apply changes, rebuild, restart the same URL, then:
node scripts/audit-performance.mjs <path-to-lighthouse/cli/index.js> final
node scripts/summarize-performance.mjs
node scripts/verify-image-delivery.mjs <path-to-puppeteer-core.js>
node scripts/verify-page.mjs <path-to-puppeteer-core.js>
\`\`\`

Set \`CHROME_PATH\` if Chrome is installed elsewhere; the scripts default to the Windows Chrome location on this workstation. Do not run competing browser/CPU workloads during the performance runs.
`.replaceAll("\\`", "`"))
console.log(JSON.stringify({ baseline: b, final: f }, null, 2))
