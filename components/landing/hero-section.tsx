import { ProductImage } from "@/components/landing/product-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { DynamicOrderCount } from "@/components/landing/dynamic-order-count"
import { priceTiers } from "@/lib/pricing"
import { CheckCircle2, Shield, Star } from "lucide-react"
import { DEFAULT_PRODUCT_ID, products, type ProductId } from "@/lib/products"

export function HeroSection({ productId = DEFAULT_PRODUCT_ID }: { productId?: ProductId }) {
  const product = products[productId]
  const caregiver = productId === "rehab-helper-gloves" || productId === "stroke-recovery-gloves"
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-0 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className={`grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 ${caregiver ? "items-start" : "items-center"}`}>
          <div className="space-y-6 sm:space-y-8">
            {product.badge && (
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm font-medium">
                {product.badge}
              </Badge>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              {product.headline} <span className="text-primary">{product.headlineAccent}</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span>4.8/5 from 500+ customers</span>
              </div>
              {!caregiver && (
                <div className="rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                  <DynamicOrderCount />
                </div>
              )}
            </div>

            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
                <div className="grid grid-cols-3 items-baseline gap-2 sm:gap-6">
                  {priceTiers.map((tier) => (
                    <div key={tier.quantity}>
                      <p className="text-xs sm:text-sm text-muted-foreground line-through">
                        GH₵{tier.originalTotalPrice.toLocaleString()}
                      </p>
                      <p
                        className={`text-base sm:text-2xl font-bold ${
                          tier.quantity === 1 ? "text-foreground" : "text-primary"
                        }`}
                      >
                        GH₵{tier.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {tier.quantity} {tier.quantity === 1 ? "Unit" : "Units"}
                      </p>
                      {tier.quantity > 1 && (
                        <p className="text-xs font-medium text-primary">Save GH₵{tier.discount.toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
                <a
                  href="#order"
                  className={buttonVariants({ size: "lg", className: "mt-4 w-full h-12 text-base font-semibold" })}
                >
                  Order Now
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Warranty</span>
              </div>
            </div>
          </div>

          <div className="relative order-first -mx-4 overflow-hidden bg-primary/10 p-3 sm:mx-0 sm:p-4 lg:order-last">
            <ProductImage caregiver={caregiver} alt={caregiver ? "Rehabilitation glove for assisted hand movement practice" : `${product.name} product view`} />
          </div>
        </div>
      </div>
    </section>
  )
}
