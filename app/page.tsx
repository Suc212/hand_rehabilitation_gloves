import { HeroSection } from "@/components/landing/hero-section"
import { FreeDeliveryBanner } from "@/components/landing/free-delivery-banner"
import { TrustBadges } from "@/components/landing/trust-badges"
import { OrderProcess } from "@/components/landing/order-process"
import { ProblemSolution } from "@/components/landing/problem-solution"
import { Specifications } from "@/components/landing/specifications"
import { Benefits } from "@/components/landing/benefits"
import { ProductVideo } from "@/components/landing/product-video"
import { Reviews } from "@/components/landing/reviews"
import { DeliveryPayment } from "@/components/landing/delivery-payment"
import { FAQ } from "@/components/landing/faq"
import { OrderForm } from "@/components/landing/order-form"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <FreeDeliveryBanner />
      <HeroSection />
      <TrustBadges />
      <OrderProcess />
      <ProductVideo />
      <Reviews />
      <ProblemSolution />
      <Benefits />
      <Specifications />
      <DeliveryPayment />
      <FAQ />
      <OrderForm />
      <Footer />
    </main>
  )
}
