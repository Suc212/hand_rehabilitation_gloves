import type { Metadata } from "next"
import { ProductLandingPage } from "@/components/landing/product-page"

export const metadata: Metadata = {
  title: "Hand Rehabilitation Glove | Korret Stores",
  description: "Explore our assisted hand rehabilitation glove, compare bundles, and order with free delivery across Ghana.",
}

export default function ProductPage() {
  return <ProductLandingPage productId="hand-rehabilitation-glove" />
}
