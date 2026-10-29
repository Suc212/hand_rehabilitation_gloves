import assert from "node:assert/strict"
import { mkdirSync, writeFileSync } from "node:fs"
import { pathToFileURL } from "node:url"

// Pass the installed puppeteer-core ESM entry point. All order requests and
// tracking calls are intercepted: verification creates no real orders/events.
const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href)
const base = process.env.AUDIT_URL || "http://localhost:3100"
const productId = process.argv[3] || "rehab-helper-gloves"
assert.ok(["hand-rehabilitation-glove", "rehab-helper-gloves", "stroke-recovery-gloves"].includes(productId), "Unknown product")
const standardGlove = productId === "hand-rehabilitation-glove"
const productName = standardGlove ? "Hand Rehabilitation Glove" : "Rehab Helper Gloves"
const headline = standardGlove ? "Regain Control of Your Hands" : "The Hands are the fastest route to"
const heroSource = standardGlove ? "/images/Img 1.avif" : productId === "rehab-helper-gloves" ? "/images/Images SP/dark-hand-grip-square.avif" : "/images/Images SP/rehab-glove-square.avif"
const productPath = `/products/${productId}`
const directory = productId === "rehab-helper-gloves" ? ".performance/rehab-verification" : `.performance/verification-${productId}`
mkdirSync(directory, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
})

try {
  const page = await browser.newPage()
  const calls = []
  const orders = []
  const errors = []
  let rejectOrder = true
  let pixelDownloads = 0
  await page.exposeFunction("__recordPixel", (...args) => calls.push(args))
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on("request", async (request) => {
    const url = new URL(request.url())
    if (url.hostname === "connect.facebook.net" && url.pathname === "/en_US/fbevents.js") {
      pixelDownloads++
      // Exercise the real bootstrap and its queue, including a slow library.
      await new Promise((resolve) => setTimeout(resolve, 300))
      await request.respond({ status: 200, contentType: "application/javascript", body: `
        var pixel = window.fbq;
        pixel.callMethod = function () { window.__recordPixel.apply(null, arguments); };
        while (pixel.queue.length) pixel.callMethod.apply(pixel, pixel.queue.shift());
      ` })
      return
    }
    if (url.origin !== base) {
      await request.respond({ status: 200, contentType: "application/javascript", body: "" })
      return
    }
    if (url.pathname === "/api/orders") {
      const order = JSON.parse(request.postData())
      orders.push(order)
      if (rejectOrder) {
        await request.respond({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Verification: please retry." }) })
        return
      }
      const receipt = { orderId: "rehab-performance-verification", productId, quantity: Number(order.quantity), totalPrice: Number(order.totalPrice) }
      await request.respond({
        status: 200, contentType: "application/json",
        headers: { "set-cookie": `korret_order_receipt=${encodeURIComponent(encodeURIComponent(JSON.stringify(receipt)))}; Path=/order-success; HttpOnly; SameSite=Lax; Max-Age=3600` },
        body: JSON.stringify({ success: true, orderId: receipt.orderId }),
      })
      return
    }
    await request.continue()
  })
  const events = (name) => calls.filter((call) => call[0] === "track" && call[1] === name)
  const waitForPixel = () => page.waitForFunction(() => typeof window.fbq?.callMethod === "function")
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75 })
  const response = await page.goto(`${base}${productPath}`, { waitUntil: "networkidle0" })
  const html = await response.text()
  assert.ok(html.includes(headline), "Hero must be in initial HTML")
  assert.ok(html.includes(heroSource.split("/").at(-1)))
  const stylesheet = html.match(/<link[^>]+rel="stylesheet"[^>]*>/)
  assert.ok(stylesheet, "Keep the measured external stylesheet")
  assert.ok(stylesheet.index < html.indexOf("<main"), "First-screen styles must be discoverable before the content")
  const content = await page.evaluate(() => {
    const audience = [...document.querySelectorAll("h2")].find((heading) => heading.textContent.trim() === "Who It Is For")?.closest("section")
    const warranty = [...document.querySelectorAll("main p, main span")].filter((element) => element.textContent.trim() === "Warranty")
    return {
      audience: audience?.textContent,
      warrantyCount: warranty.length,
      warrantySection: warranty[0]?.closest("section")?.querySelector("h2")?.textContent,
      reviews: document.querySelector("#facebook-reviews .grid")?.textContent,
      reviewTags: document.querySelectorAll("#facebook-reviews .grid p.rounded-full").length,
      simulatedReviews: document.querySelector('#facebook-reviews [aria-label="Simulated stroke recovery reviews"]')?.children.length,
      delivery: document.querySelector("#delivery").textContent,
      faq: document.querySelector("#faq").textContent,
      order: document.querySelector("#order").textContent,
    }
  })
  assert.equal(content.warrantyCount, 1)
  assert.equal(content.warrantySection, "How It Works")
  assert.match(content.audience, /stroke/i)
  assert.doesNotMatch(content.audience, /arthritis|post-surg|Parkinson|neuropathy|multiple sclerosis/i)
  assert.equal(content.reviewTags, 0)
  assert.equal(content.simulatedReviews, 4)
  assert.doesNotMatch(content.reviews, /hand surgery|morning stiffness|arthritis/i)
  assert.match(content.delivery, /Accra and Kumasi/)
  assert.match(content.faq, /Accra and Kumasi/)
  assert.match(content.order, /Accra & Kumasi/)
  await waitForPixel()
  assert.equal(pixelDownloads, 1)
  assert.equal(calls.filter((call) => call[0] === "init" && call[1] === "4632254820337295").length, 1)
  assert.equal(events("PageView").length, 1)
  assert.equal(events("AddToCart").length, 0)
  assert.equal(events("Purchase").length, 0)
  const initialRendering = await page.evaluate(() => ({
    fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
    pixelRequest: performance.getEntriesByType("resource").find((entry) => entry.name.includes("/en_US/fbevents.js"))?.startTime,
  }))
  assert.ok(initialRendering.pixelRequest >= initialRendering.fcp, "Pixel download must start after the first rendering opportunity")
  const initialHeroRequests = await page.evaluate((source) => performance.getEntriesByType("resource").filter((entry) => {
    const url = new URL(entry.name)
    return decodeURIComponent(url.searchParams.get("url") || url.pathname) === source
  }).map((entry) => ({ url: entry.name, start: entry.startTime, end: entry.responseEnd })), heroSource)
  assert.equal(initialHeroRequests.length, 1, "Hero preload and image must select the same single resource")
  await page.evaluate(() => document.fonts.ready)
  const fonts = await page.evaluate(() => ({
    family: getComputedStyle(document.body).fontFamily,
    headingWeight: getComputedStyle(document.querySelector("h1")).fontWeight,
    files: performance.getEntriesByType("resource").filter((entry) => entry.name.endsWith(".woff2")).map((entry) => entry.name),
    preloads: [...document.querySelectorAll('link[as="font"]')].map((link) => link.href),
  }))
  assert.match(fonts.family, /inter/i)
  assert.equal(fonts.headingWeight, "700")
  assert.equal(fonts.files.length, 1, "No Latin Extended or duplicate font download")
  assert.equal(fonts.preloads.length, 1)
  const layouts = []
  for (const width of [375, 412, 768, 1280]) {
    await page.setViewport({ width, height: 823, deviceScaleFactor: 1 })
    await page.evaluate(() => window.scrollTo(0, 0))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Page overflow at ${width}px`)
    const hero = await page.$eval("main section img", (img) => ({ width: img.clientWidth, height: img.clientHeight, complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight }))
    assert.ok(hero.complete && hero.naturalWidth > 0)
    assert.ok(Math.abs(hero.width / hero.height - hero.naturalWidth / hero.naturalHeight) < 0.01, "Hero must retain its source aspect ratio")
    await page.screenshot({ path: `${directory}/hero-${width}.png` })
    layouts.push({ width, hero })
  }
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.click('a[href="#order"]')
  await page.waitForFunction(() => {
    const rect = document.querySelector("#order").getBoundingClientRect()
    return rect.top < innerHeight && rect.bottom > 0
  })
  // Exercise native containment activation and anchor navigation in both
  // directions, rather than only taking an initial-viewport screenshot.
  for (const sectionId of ["facebook-reviews", "faq", "delivery", "order"]) {
    await page.$eval(`#${sectionId}`, (element) => element.scrollIntoView())
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    assert.ok(await page.$eval(`#${sectionId}`, (element) => element.getBoundingClientRect().height > 0), `${sectionId} must render after scrolling`)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  }
  await page.$eval("#order", (element) => element.scrollIntoView())
  for (const [quantity, total] of [[1, 1600], [2, 3000], [3, 4320]]) {
    await page.click(`label[for="qty-${quantity}"]`)
    await page.waitForFunction((amount) => document.querySelector('button[type="submit"]').textContent.includes(amount.toLocaleString()), {}, total)
    assert.equal(await page.$eval('input[name="quantity"]:checked', (input) => Number(input.value)), quantity)
  }
  await page.focus("#qty-2")
  await page.keyboard.press("ArrowRight")
  assert.equal(await page.$eval('input[name="quantity"]:checked', (input) => input.value), "3")
  assert.equal(await page.$eval('button[type="submit"]', (button) => getComputedStyle(button).whiteSpace), "normal")
  assert.ok(await page.$eval('button[type="submit"]', (button) => button.scrollWidth <= button.clientWidth), "Order button text must fit on a narrow phone")
  await page.evaluate(() => {
    window.__pixelMethod = window.fbq.callMethod
    delete window.fbq.callMethod
  })
  await page.click('button[type="submit"]')
  await page.waitForFunction(() => document.querySelector(":invalid"))
  assert.equal(orders.length, 0, "Native required validation must stop the order")
  assert.equal(events("AddToCart").length, 0, "A not-yet-ready Pixel must queue the click")
  await page.evaluate(() => {
    window.fbq.callMethod = window.__pixelMethod
    window.dispatchEvent(new Event("meta-pixel-ready"))
  })
  await page.waitForFunction(() => !sessionStorage.getItem("korret:meta:pending"))
  await page.type("#firstName", "Performance")
  await page.type("#lastName", "Verification")
  await page.type("#phone", "0200000000")
  await page.type("#whatsapp", "0200000000")
  await page.type("#address", "Local intercepted verification only")
  assert.equal(await page.$eval('input[name="affectedHand"]', (input) => input.validity.valueMissing), true)
  await page.click('button[type="submit"]')
  assert.equal(orders.length, 0, "An affected hand is required before submission")
  await page.click('input[name="affectedHand"][value="left"]')
  await page.click('button[type="submit"]')
  await page.waitForFunction(() => document.querySelector("form").textContent.includes("Verification: please retry."))
  assert.equal(events("Purchase").length, 0)
  assert.equal(await page.$eval('button[type="submit"]', (button) => button.disabled), false)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: `${directory}/order-mobile.png` })
  rejectOrder = false
  await page.click('input[name="affectedHand"][value="right"]')
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ])
  await waitForPixel()
  await page.waitForFunction(() => document.querySelector("[data-order-total]"))
  assert.equal(new URL(page.url()).pathname, "/order-success")
  assert.match(await page.$eval("[data-order-total]", (element) => element.textContent), /4,320/)
  assert.equal(await page.$eval("[data-order-product]", (element) => element.textContent), productName)
  assert.match(await page.$eval("main", (element) => element.textContent), /Payment on delivery is available in Accra and Kumasi/)
  assert.equal(orders.length, 2)
  assert.equal(orders[1].productId, productId)
  assert.equal(orders[0].affectedHand, "left")
  assert.equal(orders[1].affectedHand, "right")
  assert.equal(orders[1].quantity, "3")
  assert.equal(orders[1].totalPrice, "4320")
  assert.equal(events("Purchase").length, 1)
  const parameters = {
    value: 4320, currency: "GHS", content_type: "product",
    content_ids: [productId], content_name: productName,
    contents: [{ id: productId, quantity: 3, item_price: 1440 }],
    num_items: 3, landing_page: productPath,
  }
  assert.ok(events("AddToCart").length >= 3)
  for (const call of events("AddToCart")) assert.deepEqual(call[2], parameters)
  assert.deepEqual(events("Purchase")[0][2], { ...parameters, order_id: "rehab-performance-verification" })
  assert.deepEqual(events("Purchase")[0][3], { eventID: "purchase_rehab-performance-verification" })
  await page.screenshot({ path: `${directory}/success-mobile.png` })
  await page.reload({ waitUntil: "networkidle0" })
  await waitForPixel()
  assert.equal(events("Purchase").length, 1, "Refreshing must not duplicate Purchase")
  // A footer link performs the existing full-document route tracking.
  const viewsBeforeNavigation = events("PageView").length
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click(`footer a[href="${productPath}"]`),
  ])
  await waitForPixel()
  assert.equal(events("PageView").length, viewsBeforeNavigation + 1)
  assert.equal(events("Purchase").length, 1)
  const client = await page.createCDPSession()
  await client.send("Network.clearBrowserCookies")
  await page.goto(`${base}/order-success`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (element) => element.textContent), /No recent order/)
  assert.equal(events("Purchase").length, 1)
  // First-screen layout and all sales copy remain available without JavaScript.
  await page.setJavaScriptEnabled(false)
  await page.goto(`${base}${productPath}`, { waitUntil: "networkidle0" })
  assert.ok((await page.$eval("h1", (element) => element.textContent)).includes(headline))
  assert.ok(await page.$('input[name="firstName"]'))
  assert.ok(await page.$('noscript img[src*="4632254820337295"]'))
  assert.deepEqual(errors, [])
  const result = { passed: true, productId, fonts, layouts, initialRendering, initialHeroRequests, interceptedOrders: orders.length, pixelDownloads, pageViews: events("PageView").length, addToCarts: events("AddToCart").length, purchases: events("Purchase").length, errors }
  writeFileSync(`${directory}/results.json`, JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}
