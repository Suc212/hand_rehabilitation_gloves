import { HeroSection } from "@/components/landing/hero-section"
import { TrustBadges } from "@/components/landing/trust-badges"
import { OrderProcess } from "@/components/landing/order-process"
import { ProblemSolution } from "@/components/landing/problem-solution"
import { Specifications } from "@/components/landing/specifications"
import { Benefits } from "@/components/landing/benefits"
import { CaregiverSupport } from "@/components/landing/caregiver-support"
import { ProductVideo } from "@/components/landing/product-video"
import { Reviews } from "@/components/landing/reviews"
import { DeliveryPayment } from "@/components/landing/delivery-payment"
import { FAQ } from "@/components/landing/faq"
import { OrderForm } from "@/components/landing/order-form"
import { Footer } from "@/components/landing/footer"
import { products, type ProductId } from "@/lib/products"

export function ProductLandingPage({ productId }: { productId: ProductId }) {
  return (
    <>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <HeroSection productId={productId} />
        <TrustBadges />
        {productId === "rehab-helper-gloves" ? <CaregiverSupport /> : <><ProblemSolution /><Benefits /></>}
        <Reviews />
        <ProductVideo />
        <Specifications />
        <OrderProcess />
        <DeliveryPayment />
        <FAQ />
        <OrderForm productId={productId} />
      </main>
      <Footer productPath={products[productId].path} />
    </>
  )
}
