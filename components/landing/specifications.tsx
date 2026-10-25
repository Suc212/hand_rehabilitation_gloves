import { StaticImage } from "@/components/landing/static-image"
import { Activity, Battery, Hand, Ruler, Settings, ShieldCheck, Timer, Waves } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const mechanics = [
  {
    icon: Hand,
    label: "Movement",
    value: "Assisted",
    description: "Guides finger opening and closing for repeated mobility work",
  },
  {
    icon: Activity,
    label: "Exercise Focus",
    value: "Flex / Extend",
    description: "Supports the core hand motions used in daily tasks",
  },
  {
    icon: Settings,
    label: "Controls",
    value: "Adjustable",
    description: "Settings can be matched to comfort and training needs",
  },
  {
    icon: Timer,
    label: "Sessions",
    value: "Short & Frequent",
    description: "Designed for repeatable daily practice instead of long sessions",
  },
  {
    icon: Waves,
    label: "Comfort",
    value: "Wearable",
    description: "Adjustable hand placement for supported therapy routines",
  },
  {
    icon: Battery,
    label: "Power",
    value: "Rechargeable",
    description: "Cord-free use for home or caregiver-supported sessions",
  },
  {
    icon: Ruler,
    label: "Fit",
    value: "Secure",
    description: "Straps help keep the hand positioned during movement",
  },
  {
    icon: ShieldCheck,
    label: "Support",
    value: "Warranty",
    description: "After-sales help is included with your order",
  },
]

const guidance = [
  "Start with short, comfortable sessions and increase only as tolerated",
  "Use alongside professional guidance after stroke, surgery, injury, or diagnosis",
  "Track small wins such as repetitions, grip confidence, range of motion, or task completion",
]

export function Specifications() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A simple wearable system for assisted hand movement, comfort, and measurable home practice.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <StaticImage
              src="/images/Img 5.avif"
              width={960}
              height={960}
              sizes="(min-width: 1280px) 596px, (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
              alt="Hand rehabilitation glove component detail"
              className="aspect-square w-full bg-white object-contain p-4"
            />
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">Assisted Movement System</p>
              <p className="text-xs text-muted-foreground">Guides repeated finger flexion and extension exercises</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <StaticImage
              src="/images/Img 6.avif"
              width={960}
              height={960}
              sizes="(min-width: 1280px) 596px, (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
              alt="Hand rehabilitation glove fit and strap detail"
              className="aspect-square w-full bg-white object-contain p-4"
            />
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">Comfortable Wearable Fit</p>
              <p className="text-xs text-muted-foreground">Adjustable support for secure hand placement</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mechanics.map((item) => (
            <div key={item.label} className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <item.icon className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 text-xl font-bold text-foreground">{item.value}</p>
              <p className="mt-1 font-medium text-foreground">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-semibold text-foreground">Session guidance</h3>
          <ul className="mt-5 space-y-3">
            {guidance.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <OrderCta className="mt-12" />
      </div>
    </section>
  )
}
