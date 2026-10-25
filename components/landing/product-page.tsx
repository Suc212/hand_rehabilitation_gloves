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
import { OrderContactFields } from "@/components/landing/order-contact-fields"
import { StaticImage } from "@/components/landing/static-image"
import { buttonVariants } from "@/components/ui/button"
import { Footer } from "@/components/landing/footer"
import { products, type ProductId } from "@/lib/products"
import { Banknote, Package, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProductLandingPage({ productId }: { productId: ProductId }) {
  return (
    <>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <HeroSection productId={productId} />
        <TrustBadges />
        {productId === "rehab-helper-gloves" || productId === "stroke-recovery-gloves" ? <CaregiverSupport recoveryFocused={productId === "stroke-recovery-gloves"} /> : <><ProblemSolution /><Benefits /></>}
        <Reviews />
        <ProductVideo />
        <Specifications />
        <OrderProcess />
        <DeliveryPayment />
        <FAQ />
        <OrderForm
          productId={productId}
          product={{ name: products[productId].name, path: products[productId].path }}
          trustBadges={<>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Banknote className="h-4 w-4" />
              <span>Accra Payment on Delivery</span>
            </div>
          </>}
          submitIcon={<Package className="mr-2 h-5 w-5" />}
          contactFields={<OrderContactFields />}
          packageImage={<StaticImage
            src="/images/Img 10.avif"
            width={800}
            height={800}
            sizes="(min-width: 1024px) 320px, 1px"
            alt={`${products[productId].name} product package`}
            className="aspect-square w-full object-contain p-4"
          />}
          submitClassName={cn(buttonVariants({ size: "lg" }), "w-full min-h-14 h-auto whitespace-normal py-3 text-sm sm:text-base font-semibold")}
        />
      </main>
      <Footer productPath={products[productId].path} />
    </>
  )
}
