import assert from "node:assert/strict"
import { pathToFileURL } from "node:url"
import { mkdirSync, writeFileSync } from "node:fs"

const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href)
const baseUrl = process.env.AUDIT_URL || "http://localhost:3100"
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true })
const results = []
try {
  for (const [width, dpr] of [[360, 1], [412, 1.75], [768, 2], [1440, 2]]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900, deviceScaleFactor: dpr })
    const heroRequests = []
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      if (!request.url().startsWith(baseUrl)) return request.abort()
      const url = new URL(request.url())
      if ((url.pathname === "/_next/image" && url.searchParams.get("url") === "/images/Img 1.avif") || url.pathname === "/images/Img%201.avif") heroRequests.push(request.url())
      return request.continue()
    })
    const response = await page.goto(`${baseUrl}/products/hand-rehabilitation-glove`, { waitUntil: "networkidle0" })
    const html = await response.text()
    assert.match(html, /alt="Hand Rehabilitation Glove product view"/)
    const image = await page.$("main section img")
    await page.waitForFunction(() => document.querySelector("main section img")?.complete)
    const result = await image.evaluate((image) => {
      const rect = image.getBoundingClientRect()
      const entry = performance.getEntriesByName(image.currentSrc)[0]
      return {
        viewport: innerWidth, dpr: devicePixelRatio, cssWidth: rect.width, cssHeight: rect.height,
        currentSrc: image.currentSrc, sizes: image.sizes, srcset: image.srcset,
        loading: image.loading, fetchPriority: image.fetchPriority,
        width: image.getAttribute("width"), height: image.getAttribute("height"),
        imagePreloads: document.querySelectorAll('link[rel="preload"][as="image"]').length,
        encodedBytes: entry?.encodedBodySize, transferBytes: entry?.transferSize,
        duration: entry?.duration,
      }
    })
    const candidate = Number(new URL(result.currentSrc).searchParams.get("w") || 935)
    const expectedCssWidth = width < 640 ? Math.min(width - 32, 384) : 448
    assert.equal(result.cssWidth, expectedCssWidth)
    assert.ok(Math.abs(result.cssWidth / result.cssHeight - 935 / 960) < 0.002)
    assert.equal(result.width, "935")
    assert.equal(result.height, "960")
    assert.equal(result.loading, "eager")
    assert.equal(result.fetchPriority, "high")
    assert.ok(result.srcset.includes("320w") && result.srcset.includes("935w"))
    assert.ok(candidate >= expectedCssWidth * dpr)
    assert.ok(candidate < expectedCssWidth * dpr * 1.35)
    assert.ok(result.imagePreloads <= 1)
    assert.equal(heroRequests.length, 1, "Hero must be downloaded only once")
    assert.ok(await page.$('img[loading="lazy"]'))
    results.push({ ...result, candidate })
    await page.close()
  }
} finally {
  await browser.close()
}
mkdirSync(".performance", { recursive: true })
writeFileSync(".performance/image-delivery.json", JSON.stringify(results, null, 2))
console.log(JSON.stringify(results.map(({ viewport, dpr, cssWidth, candidate, encodedBytes, duration }) => ({ viewport, dpr, cssWidth, candidate, encodedBytes, duration })), null, 2))
console.log("PASS: responsive DPR-aware images, initial HTML, explicit aspect ratio, eager/high priority, lazy below-fold images, and no duplicate hero requests/preloads")
