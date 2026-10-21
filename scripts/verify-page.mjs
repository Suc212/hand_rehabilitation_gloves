import assert from "node:assert/strict"
import { pathToFileURL } from "node:url"

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
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on("request", async (request) => {
    if (new URL(request.url()).pathname === "/api/orders") {
      orders.push(JSON.parse(request.postData()))
      await request.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    } else {
      await request.continue()
    }
  })
  await page.goto(process.env.AUDIT_URL || "http://localhost:3100", { waitUntil: "networkidle0" })
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
  await page.waitForFunction(() => document.querySelector("#order h2")?.textContent === "Order Confirmed!")
  assert.equal(orders.length, 1)
  assert.equal(orders[0].quantity, "1")
  assert.equal(orders[0].firstName, "Test")
  assert.equal(orders[0].totalPrice, String(await page.$eval("#order", (section) => {
    const price = section.textContent.match(/Pay GH₵([\d,]+)/)
    return price ? Number(price[1].replaceAll(",", "")) : NaN
  })))
  await page.click("#order button")
  await page.waitForSelector('button[type="submit"]')
  assert.deepEqual(errors, [])
  console.log("PASS: quantity defaults, keyboard and label selection, intercepted order payload, confirmation, reset, and no browser errors")
} finally {
  await browser.close()
}
