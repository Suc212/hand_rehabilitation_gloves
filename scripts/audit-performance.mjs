import { spawnSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const [lighthouseCli, label, url = "http://localhost:3100/products/hand-rehabilitation-glove"] = process.argv.slice(2)
if (!lighthouseCli || !/^[a-z0-9-]+$/.test(label || "")) throw new Error("Usage: node scripts/audit-performance.mjs <lighthouse-cli> <label> [url]")
const directory = resolve(".performance", label)
mkdirSync(directory, { recursive: true })
const results = []
for (let run = 1; run <= 3; run++) {
  const output = join(directory, `mobile-${run}`)
  const audit = spawnSync(process.execPath, [lighthouseCli, url,
    `--chrome-path=${process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"}`,
    "--chrome-flags=--headless --disable-gpu --no-first-run",
    "--only-categories=performance", "--form-factor=mobile", "--throttling-method=simulate",
    "--throttling.cpuSlowdownMultiplier=4", "--throttling.rttMs=150", "--throttling.throughputKbps=1638.4",
    "--screenEmulation.width=412", "--screenEmulation.height=823", "--screenEmulation.deviceScaleFactor=1.75",
    "--output=json", "--output=html", `--output-path=${output}`, "--quiet",
  ], { stdio: "inherit", windowsHide: true })
  if (audit.status !== 0) throw new Error(`Lighthouse run ${run} failed`)
  const report = JSON.parse(readFileSync(`${output}.report.json`, "utf8"))
  if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError))
  const a = report.audits
  const requests = a["network-requests"].details.items
  const bytes = (type) => requests.filter((item) => item.resourceType === type).reduce((sum, item) => sum + item.transferSize, 0)
  const result = {
    run, score: report.categories.performance.score * 100,
    lcp: a["largest-contentful-paint"].numericValue, fcp: a["first-contentful-paint"].numericValue,
    tbt: a["total-blocking-time"].numericValue, cls: a["cumulative-layout-shift"].numericValue,
    imageBytes: bytes("Image"), cssBytes: bytes("Stylesheet"), jsBytes: bytes("Script"),
    lcpElement: a["largest-contentful-paint-element"]?.details,
    warnings: report.runWarnings,
  }
  results.push(result)
  console.log(JSON.stringify({ ...result, lcpElement: undefined }))
}
const median = (values) => [...values].sort((a, b) => a - b)[1]
const medians = Object.fromEntries(["score", "lcp", "fcp", "tbt", "cls", "imageBytes", "cssBytes", "jsBytes"].map((key) => [key, median(results.map((r) => r[key]))]))
writeFileSync(join(directory, "summary.json"), JSON.stringify({ url, lighthouseVersion: JSON.parse(readFileSync(join(directory, "mobile-1.report.json"), "utf8")).lighthouseVersion, medians, results }, null, 2))
console.log("MEDIANS", JSON.stringify(medians))
