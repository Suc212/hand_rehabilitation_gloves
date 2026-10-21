"use client"

import { useEffect } from "react"
import type { OrderReceipt } from "@/lib/order-receipt"

type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void }

declare global {
  interface Window {
    fbq?: Pixel
  }
}

function hasCookie(name: string) {
  return document.cookie.split(";").some((cookie) => cookie.trim() === `${name}=1`)
}

// Persist the order ID before sending, so refreshes and React remounts cannot
// submit another Purchase. A first-party cookie covers unavailable localStorage.
function claimEvent(key: string, cookieName: string) {
  try {
    if (window.localStorage.getItem(key)) return false
  } catch {}
  try {
    if (hasCookie(cookieName)) return false
  } catch {}

  let persisted = false
  try {
    window.localStorage.setItem(key, "1")
    persisted = window.localStorage.getItem(key) === "1"
  } catch {}
  try {
    document.cookie = `${cookieName}=1; Path=/order-success; Max-Age=3600; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
    persisted = hasCookie(cookieName) || persisted
  } catch {}
  // If neither store is available, do not emit an event we cannot deduplicate.
  return persisted
}

export function PurchaseEvent({ receipt, productName, productPath }: {
  receipt: OrderReceipt
  productName: string
  productPath: string
}) {
  const { orderId, productId, quantity, totalPrice } = receipt

  useEffect(() => {
    const eventId = `purchase_${orderId}`
    const key = `korret:meta:${eventId}`
    const cookieName = encodeURIComponent(key)

    const track = () => {
      // The base pixel loads lazily. Wait until its library can process events.
      if (typeof window.fbq !== "function" || typeof window.fbq.callMethod !== "function") return
      if (!claimEvent(key, cookieName)) return
      try {
        window.fbq("track", "Purchase", {
          value: totalPrice,
          currency: "GHS",
          content_type: "product",
          content_ids: [productId],
          content_name: productName,
          contents: [{ id: productId, quantity, item_price: totalPrice / quantity }],
          num_items: quantity,
          order_id: orderId,
          landing_page: productPath,
        }, { eventID: eventId })
      } catch {
        // Allow a future attempt if the pixel call itself failed.
        try { window.localStorage.removeItem(key) } catch {}
        try { document.cookie = `${cookieName}=; Path=/order-success; Max-Age=0; SameSite=Lax` } catch {}
      }
    }

    window.addEventListener("meta-pixel-ready", track)
    track()
    return () => window.removeEventListener("meta-pixel-ready", track)
  }, [orderId, productId, quantity, totalPrice, productName, productPath])

  return null
}
