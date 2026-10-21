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
  const baseUrl = process.env.AUDIT_URL || "http://localhost:3100"
  const productPath = "/products/hand-rehabilitation-glove"
  let failOrder = true
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on("request", async (request) => {
    if (new URL(request.url()).pathname === "/api/orders") {
      const order = JSON.parse(request.postData())
      orders.push(order)
      if (failOrder) {
        await request.respond({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Test submission failed. Please try again." }) })
        return
      }
      const receipt = encodeURIComponent(JSON.stringify({ orderId: "test-order-123", productId: order.productId, quantity: Number(order.quantity), totalPrice: Number(order.totalPrice) }))
      await request.respond({
        status: 200,
        contentType: "application/json",
        // NextResponse serializes the encoded receipt value into a cookie.
        headers: { "set-cookie": `korret_order_receipt=${encodeURIComponent(receipt)}; Path=/order-success; HttpOnly; SameSite=Lax; Max-Age=3600` },
        body: JSON.stringify({ success: true, orderId: "test-order-123" }),
      })
    } else {
      await request.continue()
    }
  })
  await page.goto(`${baseUrl}/order-success`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /No recent order/)
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
  await page.type("#firstName", "Test")
  await page.type("#lastName", "Customer")
  await page.type("#phone", "0200000000")
  await page.type("#whatsapp", "0200000000")
  await page.type("#address", "Test address")
  await page.click('button[type="submit"]')
  await page.waitForSelector('[role="alert"]')
  assert.equal(new URL(page.url()).pathname, productPath)
  assert.match(await page.$eval('[role="alert"]', (alert) => alert.textContent), /Test submission failed/)
  assert.equal(await page.$eval('button[type="submit"]', (button) => button.disabled), false)
  failOrder = false
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ])
  assert.equal(new URL(page.url()).pathname, "/order-success")
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
  assert.equal(await page.$eval("[data-order-reference]", (reference) => reference.textContent), "test-order-123")
  assert.equal(orders.length, 2, "Refreshing confirmation must not resubmit the order")
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: "networkidle0" })
  await page.screenshot({ path: join(screenshotDirectory, "product-desktop.png"), fullPage: true })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)

  const helperPath = "/products/rehab-helper-gloves"
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
  await page.goto(`${baseUrl}${helperPath}`, { waitUntil: "networkidle0" })
  assert.match(await page.$eval("h1", (heading) => heading.textContent), /Help Them Take the Next Small Step/)
  assert.match(await page.$eval("main", (main) => main.textContent), /For Families & Caregivers/)
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
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ])
  assert.equal(new URL(page.url()).pathname, "/order-success")
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
  assert.equal(await page.$eval("[data-order-product]", (product) => product.textContent), "Rehab Helper Gloves")
  assert.equal(orders.length, 3)
  await Promise.all([
    page.waitForFunction((path) => location.pathname === path, {}, helperPath),
    page.click(`a[href="${helperPath}#order"]`),
  ])
  await page.waitForSelector('button[type="submit"]')
  assert.deepEqual(errors, [])
  console.log("PASS: homepage blocked, no header/breadcrumb/home links, mobile/desktop layout, both audience variants, order source IDs, variant-specific receipts and return links, failed-order recovery, refresh without resubmission, and no browser errors")
} finally {
  await browser.close()
}
