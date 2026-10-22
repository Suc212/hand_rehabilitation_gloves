import type { Metadata } from "next"
import { ProductLandingPage } from "@/components/landing/product-page"

export const metadata: Metadata = {
  title: "Rehab Helper Gloves | Support for Families & Caregivers",
  description: "Help someone you care for build a short hand movement routine at home. Explore Rehab Helper Gloves and bundles, with free delivery across Ghana.",
}

export default function StrokeRecoveryPage() {
  return <ProductLandingPage productId="stroke-recovery-gloves" />
}
