"use client"

import { useEffect } from "react"
import type { OrderReceipt } from "@/lib/order-receipt"
import { commerceParameters, flushPendingMetaEvents, isMetaPixelReady } from "@/lib/meta-pixel"

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
      if (!isMetaPixelReady()) return
      flushPendingMetaEvents()
      if (!claimEvent(key, cookieName)) return
      try {
        window.fbq!("track", "Purchase", {
          ...commerceParameters({ productId, productName, productPath, quantity, totalPrice }),
          order_id: orderId,
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
