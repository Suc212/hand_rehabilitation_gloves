import Image from "next/image"
import { OrderCta } from "@/components/landing/order-cta"

const conditions = [
  ["Stroke recovery", "Supports repetitive motion therapy tied to neuroplasticity-based recovery"],
  ["Post-surgical recovery", "Gentle mobility work after carpal tunnel release, tendon repair, or fracture fixation"],
  ["Arthritis", "Low-impact daily mobility maintenance and warmth support for stiffness"],
  ["Parkinson's & essential tremor", "Grip stability support and fine motor control practice"],
  ["Peripheral neuropathy", "Encourages nerve-engaging movement and sensory feedback"],
  ["Multiple sclerosis", "Supports mobility maintenance during flare recovery"],
  ["Sports or repetitive strain", "Grip strength rebuilding for climbers, musicians, and manual workers"],
  ["Age-related stiffness", "Preventive daily movement support, no diagnosis required"],
]

const settings = ["At-home daily use", "In-clinic OT/PT supplementary tool", "Travel-friendly recovery support"]

export function ProductVideo() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Who It Is For</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              The glove is built for people who need practical support with hand mobility, grip strength, and fine
              motor control across different recovery needs.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src="/images/Img 8.avif"
                width={800}
                height={800}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, calc(100vw - 48px)"
                alt="Hand rehabilitation glove in a therapy setting"
                className="aspect-[4/3] w-full object-contain p-4"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="grid bg-muted/50 px-5 py-3 text-sm font-semibold text-foreground sm:grid-cols-[0.42fr_0.58fr]">
                <span>Condition</span>
                <span className="hidden sm:block">How the glove helps</span>
              </div>
              <div className="divide-y">
                {conditions.map(([condition, support]) => (
                  <div key={condition} className="grid gap-1 px-5 py-4 text-sm sm:grid-cols-[0.42fr_0.58fr]">
                    <p className="font-medium text-foreground">{condition}</p>
                    <p className="leading-relaxed text-muted-foreground">{support}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-foreground">By setting</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {settings.map((setting) => (
                  <span key={setting} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    {setting}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <OrderCta className="mt-12" />
      </div>
    </section>
  )
}
