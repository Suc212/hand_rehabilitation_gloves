import { PRODUCT_PATH, REHAB_HELPER_PATH } from "@/lib/routes"

export const PRODUCT_IDS = ["hand-rehabilitation-glove", "rehab-helper-gloves"] as const
export type ProductId = (typeof PRODUCT_IDS)[number]
export const DEFAULT_PRODUCT_ID: ProductId = "hand-rehabilitation-glove"

export const products = {
  "hand-rehabilitation-glove": {
    name: "Hand Rehabilitation Glove",
    path: PRODUCT_PATH,
    badge: "Wearable Hand Recovery Support",
    headline: "Regain Control of Your Hands",
    headlineAccent: "At Your Own Pace",
    description: "A wearable rehab tool designed to support grip strength, finger mobility, and daily independence for stroke recovery, post-surgery healing, and chronic hand conditions.",
    benefits: [
      "Supports grip strength and finger mobility",
      "Built for stroke recovery and post-surgery healing",
      "Helps with short, frequent home therapy sessions",
      "Designed for daily independence and confidence",
      "Free delivery in Ghana",
    ],
  },
  "rehab-helper-gloves": {
    name: "Rehab Helper Gloves",
    path: REHAB_HELPER_PATH,
    badge: "",
    headline: "The Hands are the fastest route to",
    headlineAccent: "stroke recovery",
    description: "Support someone you care for with assisted hand movement practice at home. Adjustable settings and guided finger opening and closing make it easier to build a short, regular routine alongside professional guidance.",
    benefits: [
      "Assists finger opening and closing",
      "Adjustable settings for comfortable practice",
      "Fits short, caregiver-supported sessions",
      "Single units and family bundles available",
      "Free delivery in Ghana",
    ],
  },
} satisfies Record<ProductId, { name: string; path: string; badge: string; headline: string; headlineAccent: string; description: string; benefits: string[] }>
