"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "sweepbot_daily_order_count"
const MIN_DAILY_START = 27
const MAX_DAILY_START = 43
const MAX_DAILY_COUNT = 124

type StoredOrderCount = {
  date: string
  count: number
}

const getGhanaDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const getDailyStartCount = () => getRandomInt(MIN_DAILY_START, MAX_DAILY_START)

const readStoredCount = (): StoredOrderCount | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as StoredOrderCount) : null
  } catch {
    return null
  }
}

export function DynamicOrderCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const today = getGhanaDate()
    const stored = readStoredCount()
    const previousCount = stored?.date === today ? stored.count : getDailyStartCount()
    const increment = getRandomInt(1, 3)
    const nextCount = Math.min(previousCount + increment, MAX_DAILY_COUNT)

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: nextCount }))
    setCount(nextCount)
  }, [])

  return <>{count ?? 27}+ orders delivered in the last 24 hours</>
}
