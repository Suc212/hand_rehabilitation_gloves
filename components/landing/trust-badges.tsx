import { CheckCircle2 } from "lucide-react"

const badges = ["🇬🇭 Free Delivery in Ghana", "Warranty", "Ultra-Quiet Operation"]

export function TrustBadges() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
