import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DynamicOrderCount } from "@/components/landing/dynamic-order-count"
import { priceTiers } from "@/lib/pricing"
import { CheckCircle2, Shield, Star } from "lucide-react"

const heroBenefits = [
  "Supports grip strength and finger mobility",
  "Built for stroke recovery and post-surgery healing",
  "Helps with short, frequent home therapy sessions",
  "Designed for daily independence and confidence",
  "Free delivery in Ghana",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm font-medium">
              Wearable Hand Recovery Support
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Regain Control of Your Hands <span className="text-primary">At Your Own Pace</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              A wearable rehab tool designed to support grip strength, finger mobility, and daily independence for
              stroke recovery, post-surgery healing, and chronic hand conditions.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span>4.8/5 from 500+ customers</span>
              </div>
              <div className="rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                <DynamicOrderCount />
              </div>
            </div>

            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {heroBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  {priceTiers.map((tier) => (
                    <div key={tier.quantity}>
                      <p className="text-xs sm:text-sm text-muted-foreground line-through">
                        GH₵{tier.originalTotalPrice.toLocaleString()}
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold ${
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
                <Button className="mt-4 w-full h-12 text-base font-semibold" size="lg" asChild>
                  <a href="#order">Order Now</a>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Warranty</span>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5" />
            <img
              src="/images/Img 1.avif"
              alt="Hand rehabilitation glove product view"
              className="mx-auto w-full max-w-sm rounded-2xl bg-white object-contain shadow-lg sm:max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
