import assert from "node:assert/strict"
import { pathToFileURL } from "node:url"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const screenshotDirectory = ".next/verification"
mkdirSync(screenshotDirectory, { recursive: true })

// Use an installed puppeteer-core module; no order reaches the real API.
const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href)
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
})

try {
  const page = await browser.newPage()
  const errors = []
  const orders = []
  const pixelCalls = []
  let acceptedOrders = 0
  const baseUrl = process.env.AUDIT_URL || "http://localhost:3100"
  const productPath = "/products/hand-rehabilitation-glove"
  let failOrder = true
  // Capture calls locally and never deliver verification events to Meta.
  await page.exposeFunction("__recordPixelCall", (args) => pixelCalls.push(args))
  await page.evaluateOnNewDocument(() => {
    window.__pixelCalls = []
    const pixel = (...args) => {
      window.__pixelCalls.push(args)
      window.__recordPixelCall(args)
    }
    window.fbq = pixel
    // Exercise the success component while the lazy pixel is not ready yet.
    window.addEventListener("load", () => {
      setTimeout(() => {
        pixel.callMethod = pixel
        window.dispatchEvent(new Event("meta-pixel-ready"))
      }, 1500)
    }, { once: true })
  })
  const purchases = () => pixelCalls.filter((args) => args[0] === "track" && args[1] === "Purchase")
  const carts = () => pixelCalls.filter((args) => args[0] === "track" && args[1] === "AddToCart")
  const waitForPixel = () => page.waitForFunction(() => typeof window.fbq?.callMethod === "function")
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on("request", async (request) => {
    if (/(^|\.)(facebook\.com|facebook\.net)$/.test(new URL(request.url()).hostname)) {
      await request.abort()
      return
    }
    if (new URL(request.url()).pathname === "/api/orders") {
      const order = JSON.parse(request.postData())
      orders.push(order)
      if (failOrder) {
        await request.respond({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Test submission failed. Please try again." }) })
        return
      }
      const orderId = `test-order-${123 + acceptedOrders++}`
      const receipt = encodeURIComponent(JSON.stringify({ orderId, productId: order.productId, quantity: Number(order.quantity), totalPrice: Number(order.totalPrice) }))
      await request.respond({
        status: 200,
        contentType: "application/json",
        // NextResponse serializes the encoded receipt value into a cookie.
        headers: { "set-cookie": `korret_order_receipt=${encodeURIComponent(receipt)}; Path=/order-success; HttpOnly; SameSite=Lax; Max-Age=3600` },
        body: JSON.stringify({ success: true, orderId }),
      })
    } else {
      await request.continue()
    }
  })
  await page.goto(`${baseUrl}/order-success`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /No recent order/)
  await waitForPixel()
  assert.equal(purchases().length, 0, "Opening success without an accepted order must not emit Purchase")
  assert.equal(carts().length, 0, "Opening a page must not emit AddToCart")
  assert.equal(await page.$('a[href="/"]'), null)
  await page.goto(baseUrl, { waitUntil: "networkidle0" })
  assert.equal(new URL(page.url()).pathname, productPath, "The unfinished homepage must redirect to the product")
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /Regain Control/)
  assert.equal(await page.$("#our-approach"), null)
  assert.equal(await page.$("header"), null)
  assert.equal(await page.$('nav[aria-label="Breadcrumb"]'), null)
  assert.equal(await page.$('a[href="/"]'), null)
  assert.match(await page.$eval("body", (body) => getComputedStyle(body).fontFamily), /Inter/)
  // Both sales pages must remain closed funnels on a narrow phone screen.
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
  await page.waitForSelector('input[name="quantity"]')
  await page.waitForFunction(() => document.querySelector('button[type="submit"]') && !document.querySelector('button[type="submit"]').disabled)
  assert.equal(await page.$$("main").then((items) => items.length), 1)
  assert.equal(await page.$$("footer").then((items) => items.length), 1)
  for (const id of ["order", "faq", "delivery"]) assert.ok(await page.$(`#${id}`))
  await page.screenshot({ path: join(screenshotDirectory, "product-mobile.png"), fullPage: true })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  assert.equal(await page.$eval('input[name="quantity"]:checked', (input) => input.value), "2")
  // Native keyboard navigation must update both the checked input and React state.
  await page.focus("#qty-2")
  await page.keyboard.press("ArrowRight")
  assert.equal(await page.$eval('input[name="quantity"]:checked', (input) => input.value), "3")
  await page.click('label[for="qty-1"]')
  assert.equal(await page.$eval('input[name="quantity"]:checked', (input) => input.value), "1")
  // The requested trigger is the button click, even if browser validation stops submission.
  await page.click('button[type="submit"]')
  await page.waitForFunction(() => window.__pixelCalls.some((args) => args[0] === "track" && args[1] === "AddToCart"))
  assert.equal(carts().length, 1)
  assert.equal(orders.length, 0)
  assert.equal(purchases().length, 0)
  assert.deepEqual(carts()[0][2], {
    value: 2000,
    currency: "GHS",
    content_type: "product",
    content_ids: ["hand-rehabilitation-glove"],
    content_name: "Hand Rehabilitation Glove",
    contents: [{ id: "hand-rehabilitation-glove", quantity: 1, item_price: 2000 }],
    num_items: 1,
    landing_page: productPath,
  })
  await page.type("#firstName", "Test")
  await page.type("#lastName", "Customer")
  await page.type("#phone", "0200000000")
  await page.type("#whatsapp", "0200000000")
  await page.type("#address", "Test address")
  await page.click('label[for="qty-2"]')
  assert.equal(await page.$eval("#firstName", (input) => input.value), "Test", "Quantity changes must preserve server-rendered contact inputs")
  await page.click('label[for="qty-1"]')
  await page.click('button[type="submit"]')
  await page.waitForSelector('[role="alert"]')
  assert.equal(new URL(page.url()).pathname, productPath)
  assert.match(await page.$eval('[role="alert"]', (alert) => alert.textContent), /Test submission failed/)
  assert.equal(await page.$eval('button[type="submit"]', (button) => button.disabled), false)
  assert.equal(purchases().length, 0, "A failed order must not emit Purchase")
  assert.equal(carts().length, 2, "Each submit-button click emits AddToCart, including failed submissions")
  failOrder = false
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ])
  assert.equal(new URL(page.url()).pathname, "/order-success")
  await page.waitForFunction(() => window.__pixelCalls.some((args) => args[0] === "track" && args[1] === "Purchase"))
  assert.equal(purchases().length, 1)
  assert.equal(carts().length, 3)
  assert.ok(pixelCalls.indexOf(carts()[2]) < pixelCalls.indexOf(purchases()[0]), "AddToCart precedes Purchase")
  assert.deepEqual(purchases()[0], ["track", "Purchase", {
    value: 2000,
    currency: "GHS",
    content_type: "product",
    content_ids: ["hand-rehabilitation-glove"],
    content_name: "Hand Rehabilitation Glove",
    contents: [{ id: "hand-rehabilitation-glove", quantity: 1, item_price: 2000 }],
    num_items: 1,
    order_id: "test-order-123",
    landing_page: productPath,
  }, { eventID: "purchase_test-order-123" }])
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /order has been received/)
  assert.equal(await page.$eval("[data-order-reference]", (reference) => reference.textContent), "test-order-123")
  assert.equal(await page.$eval("[data-order-total]", (total) => total.textContent), "GH₵2,000")
  assert.equal(await page.$("form"), null)
  assert.equal(orders.length, 2)
  assert.equal(orders[1].quantity, "1")
  assert.equal(orders[1].firstName, "Test")
  assert.equal(orders[1].totalPrice, "2000")
  assert.equal(orders[1].productId, "hand-rehabilitation-glove")
  assert.equal(await page.$eval("[data-order-product]", (product) => product.textContent), "Hand Rehabilitation Glove")
  assert.equal(await page.$('a[href="/"]'), null)
  assert.ok(await page.$(`a[href="${productPath}#order"]`))
  assert.equal(await page.evaluate(() => document.cookie.includes("korret_order_receipt")), false)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  await page.screenshot({ path: join(screenshotDirectory, "order-success-mobile.png"), fullPage: true })
  await page.reload({ waitUntil: "networkidle0" })
  await waitForPixel()
  assert.equal(purchases().length, 1, "Refreshing must not emit another Purchase")
  assert.equal(carts().length, 3, "Refreshing success must not emit AddToCart")
  assert.equal(await page.$eval("[data-order-reference]", (reference) => reference.textContent), "test-order-123")
  assert.equal(orders.length, 2, "Refreshing confirmation must not resubmit the order")
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: "networkidle0" })
  await page.screenshot({ path: join(screenshotDirectory, "product-desktop.png"), fullPage: true })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)

  const helperPath = "/products/rehab-helper-gloves"
  // For the second order, make localStorage unavailable for tracking markers.
  // Its cookie fallback must still prevent repeat events after a refresh.
  await page.evaluateOnNewDocument(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      const original = Storage.prototype[method]
      Storage.prototype[method] = function (key, ...args) {
        if (key.startsWith("korret:meta:purchase_")) throw new Error("Storage blocked for this test")
        return original.call(this, key, ...args)
      }
    }
  })
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
  await page.goto(`${baseUrl}${helperPath}`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /The Hands are the fastest route to stroke recovery/)
  assert.match(await page.$eval("main", (main) => main.textContent), /A clearer routine for the person you care for/)
  assert.equal(await page.$("header"), null)
  assert.equal(await page.$('nav[aria-label="Breadcrumb"]'), null)
  assert.equal(await page.$('a[href="/"]'), null)
  assert.equal(await page.$(`a[href^="${productPath}"]`), null, "Helper visitors must stay in the helper funnel")
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  await page.screenshot({ path: join(screenshotDirectory, "rehab-helper-mobile.png"), fullPage: true })
  await page.type("#firstName", "Test")
  await page.type("#lastName", "Caregiver")
  await page.type("#phone", "0200000000")
  await page.type("#whatsapp", "0200000000")
  await page.type("#address", "Test address")
  // Force a not-yet-ready pixel: this click must survive the full-page redirect.
  await page.evaluate(() => { delete window.fbq.callMethod })
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ])
  assert.equal(new URL(page.url()).pathname, "/order-success")
  await page.waitForFunction(() => window.__pixelCalls.some((args) => args[0] === "track" && args[1] === "Purchase"))
  assert.equal(purchases().length, 2, "A new order must emit its own Purchase")
  assert.equal(carts().length, 4, "The helper-page AddToCart must survive lazy loading and the redirect")
  assert.deepEqual(carts()[3][2], {
    value: 3600,
    currency: "GHS",
    content_type: "product",
    content_ids: ["rehab-helper-gloves"],
    content_name: "Rehab Helper Gloves",
    contents: [{ id: "rehab-helper-gloves", quantity: 2, item_price: 1800 }],
    num_items: 2,
    landing_page: helperPath,
  })
  assert.ok(pixelCalls.indexOf(carts()[3]) < pixelCalls.indexOf(purchases()[1]), "Queued AddToCart is flushed before Purchase")
  assert.equal(new Set(carts().map((event) => event[3].eventID)).size, 4)
  assert.equal(purchases()[1][2].value, 3600)
  assert.equal(purchases()[1][2].currency, "GHS")
  assert.deepEqual(purchases()[1][2].content_ids, ["rehab-helper-gloves"])
  assert.equal(purchases()[1][2].num_items, 2)
  assert.equal(purchases()[1][2].landing_page, helperPath)
  assert.equal(purchases()[1][3].eventID, "purchase_test-order-124")
  assert.equal(orders.length, 3)
  assert.equal(orders[2].productId, "rehab-helper-gloves")
  assert.equal(orders[2].quantity, "2")
  assert.equal(orders[2].totalPrice, "3600")
  assert.equal(await page.$eval("[data-order-product]", (product) => product.textContent), "Rehab Helper Gloves")
  assert.equal(await page.$eval("[data-order-total]", (total) => total.textContent), "GH₵3,600")
  assert.equal(await page.$('a[href="/"]'), null)
  assert.equal(await page.$(`a[href^="${productPath}"]`), null)
  assert.ok(await page.$(`a[href="${helperPath}#order"]`))
  await page.reload({ waitUntil: "networkidle0" })
  await waitForPixel()
  assert.equal(purchases().length, 2, "Cookie fallback must prevent a repeat Purchase when localStorage is blocked")
  assert.equal(carts().length, 4, "Flushed AddToCart must not replay on refresh")
  assert.equal(await page.$eval("[data-order-product]", (product) => product.textContent), "Rehab Helper Gloves")
  assert.equal(orders.length, 3)
  await Promise.all([
    page.waitForFunction((path) => location.pathname === path, {}, helperPath),
    page.click(`a[href="${helperPath}#order"]`),
  ])
  await page.waitForSelector('button[type="submit"]')

  const recoveryPath = "/products/stroke-recovery-gloves"
  await page.goto(`${baseUrl}${recoveryPath}`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /The Hands are the fastest route to stroke recovery/)
  const recoveryText = await page.$eval("main", (main) => main.textContent)
  assert.match(recoveryText, /A clear pathway to faster recovery/)
  assert.doesNotMatch(recoveryText, /A clearer routine for the person you care for/)
  assert.match(await page.$eval("main section img", (image) => image.currentSrc), /dark-hand-grip-square/)
  for (const [selector, value] of [["#firstName", "Test"], ["#lastName", "Recovery"], ["#phone", "0200000000"], ["#whatsapp", "0200000000"], ["#address", "Test address"]]) {
    await page.type(selector, value)
  }
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('button[type="submit"]')])
  await page.waitForFunction(() => window.__pixelCalls.some((args) => args[0] === "track" && args[1] === "Purchase"))
  assert.equal(orders.at(-1).productId, "stroke-recovery-gloves")
  assert.deepEqual(carts().at(-1)[2].content_ids, ["stroke-recovery-gloves"])
  assert.deepEqual(purchases().at(-1)[2].content_ids, ["stroke-recovery-gloves"])
  assert.equal(purchases().at(-1)[2].landing_page, recoveryPath)
  assert.equal(purchases().length, 3)
  assert.equal(carts().length, 5)
  assert.ok(await page.$(`a[href="${recoveryPath}#order"]`))
  await page.reload({ waitUntil: "networkidle0" })
  await waitForPixel()
  assert.equal(purchases().length, 3)
  assert.equal(carts().length, 5)
  assert.equal(orders.length, 4)
  assert.deepEqual(errors, [])
  console.log("PASS: all three product pages, distinct caregiver/recovery sections, shared checkout and correct variant events, redirects and refresh deduplication; no real orders or Meta events sent")
} finally {
  await browser.close()
}
