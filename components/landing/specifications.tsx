import { Battery, Ruler, Volume2, Wifi, Navigation, Timer, Wind, HardDrive } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const specs = [
  {
    icon: Battery,
    label: "Battery Life",
    value: "180 min",
    description: "Extended runtime",
  },
  {
    icon: Wind,
    label: "Suction Power",
    value: "4000 Pa",
    description: "Deep cleaning",
  },
  {
    icon: HardDrive,
    label: "Dustbin",
    value: "600 ml",
    description: "Large capacity",
  },
  {
    icon: Volume2,
    label: "Noise Level",
    value: "55 dB",
    description: "Whisper quiet",
  },
  {
    icon: Navigation,
    label: "Navigation",
    value: "LiDAR",
    description: "Precision mapping",
  },
  {
    icon: Wifi,
    label: "Connectivity",
    value: "Wi-Fi 6",
    description: "Smart home ready",
  },
  {
    icon: Timer,
    label: "Charging",
    value: "3 hrs",
    description: "Full recharge",
  },
  {
    icon: Ruler,
    label: "Height",
    value: "9.5 cm",
    description: "Low profile",
  },
]

export function Specifications() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Specifications</h2>
          <p className="mt-4 text-lg text-muted-foreground">Built with premium components for lasting performance</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <img
              src="/images/component-detail-callouts.avif"
              alt="SweepBot Pro component detail callouts"
              className="aspect-square w-full bg-white object-contain p-4"
            />
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">Detailed Component Design</p>
              <p className="text-xs text-muted-foreground">Built for easy daily use and maintenance</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <img
              src="/images/dimensions-brush-detail.avif"
              alt="SweepBot Pro dimensions and brush detail"
              className="aspect-square w-full bg-white object-contain p-4"
            />
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">Compact Low-Profile Build</p>
              <p className="text-xs text-muted-foreground">Sized to clean under furniture and around edges</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <spec.icon className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 text-2xl font-bold text-foreground">{spec.value}</p>
              <p className="mt-1 font-medium text-foreground">{spec.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{spec.description}</p>
            </div>
          ))}
        </div>

        <OrderCta className="mt-12" />
      </div>
    </section>
  )
}
