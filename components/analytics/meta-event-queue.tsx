"use client"

import { useEffect } from "react"
import { flushPendingMetaEvents } from "@/lib/meta-pixel"

export function MetaEventQueue() {
  useEffect(() => {
    window.addEventListener("meta-pixel-ready", flushPendingMetaEvents)
    flushPendingMetaEvents()
    return () => window.removeEventListener("meta-pixel-ready", flushPendingMetaEvents)
  }, [])

  return null
}
