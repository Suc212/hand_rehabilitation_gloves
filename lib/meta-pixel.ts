export type CommerceEvent = {
  productId: string
  productName: string
  productPath: string
  quantity: number
  totalPrice: number
}

type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void }
type PendingEvent = {
  id: string
  createdAt: number
  parameters: ReturnType<typeof commerceParameters>
}

declare global {
  interface Window {
    fbq?: Pixel
    __korretMetaEvents?: PendingEvent[]
  }
}

const PENDING_KEY = "korret:meta:pending"

export function commerceParameters({ productId, productName, productPath, quantity, totalPrice }: CommerceEvent) {
  return {
    value: totalPrice,
    currency: "GHS",
    content_type: "product",
    content_ids: [productId],
    content_name: productName,
    contents: [{ id: productId, quantity, item_price: totalPrice / quantity }],
    num_items: quantity,
    landing_page: productPath,
  }
}

export function isMetaPixelReady() {
  return typeof window.fbq === "function" && typeof window.fbq.callMethod === "function"
}

function pendingEvents(): PendingEvent[] {
  let stored: PendingEvent[] = []
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(PENDING_KEY) || "[]")
    if (Array.isArray(parsed)) stored = parsed
  } catch {}
  const events = [...stored, ...(window.__korretMetaEvents || [])].filter((event) =>
    event && typeof event.id === "string" && typeof event.createdAt === "number" &&
    Date.now() - event.createdAt < 60 * 60 * 1000 && event.parameters &&
    typeof event.parameters.value === "number",
  )
  return Array.from(new Map(events.map((event) => [event.id, event])).values())
}

function savePendingEvents(events: PendingEvent[]) {
  window.__korretMetaEvents = events
  try {
    if (events.length) window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(events))
    else window.sessionStorage.removeItem(PENDING_KEY)
  } catch {}
}

export function flushPendingMetaEvents() {
  if (!isMetaPixelReady()) return
  let events = pendingEvents()
  for (const event of events) {
    try {
      window.fbq!("track", "AddToCart", event.parameters, { eventID: event.id })
    } catch {
      break
    }
    events = events.filter((pending) => pending.id !== event.id)
    savePendingEvents(events)
  }
}

export function trackAddToCart(data: CommerceEvent) {
  // Keep clicks across the full-page success redirect if the async pixel has not
  // loaded yet. Ready pixels send immediately; analytics never block checkout.
  try {
    const events = pendingEvents()
    const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`
    events.push({ id: `add_to_cart_${id}`, createdAt: Date.now(), parameters: commerceParameters(data) })
    savePendingEvents(events)
    flushPendingMetaEvents()
  } catch {}
}
