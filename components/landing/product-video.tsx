import { StaticImage } from "@/components/landing/static-image"
import { OrderCta } from "@/components/landing/order-cta"

const conditions = [
  ["Hand weakness after stroke", "Assisted movement for practising finger opening and closing"],
  ["Difficulty opening the hand", "Guided finger movement during a therapist-approved recovery routine"],
  ["Reduced grip control after stroke", "Repeatable hand exercises to practise movements used in everyday tasks"],
  ["Limited finger mobility after stroke", "Adjustable support for comfortable, guided hand practice"],
  ["Stroke recovery at home", "A clear routine for short sessions with family or caregiver support"],
]

const settings = ["Stroke rehabilitation at home", "Therapist-guided hand practice", "Family-supported recovery routines"]

export function ProductVideo() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Who It Is For</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Designed for stroke survivors who need support practising hand movement, finger mobility, and grip
              control. Use it as part of a recovery routine guided by your therapist or healthcare professional.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-lg">
              <StaticImage
                src="/images/Img 8.avif"
                width={800}
                height={800}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, calc(100vw - 48px)"
                alt="Hand rehabilitation glove for guided hand practice after stroke"
                className="aspect-[4/3] w-full object-contain p-4"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="grid bg-muted/50 px-5 py-3 text-sm font-semibold text-foreground sm:grid-cols-[0.42fr_0.58fr]">
                <span>Stroke recovery need</span>
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
