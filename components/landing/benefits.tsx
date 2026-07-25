import { Smartphone, Map, Clock, Leaf } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const benefits = [
  //{
    //icon: Smartphone,
    //title: "App Control",
    //description:
    //  "Control your SweepBot from anywhere with our intuitive mobile app. Start, stop, schedule, and monitor cleaning sessions in real-time.",
  //},
  {
    icon: Map,
    title: "Smart Mapping",
    description:
      "Advanced LiDAR technology creates detailed maps of your home, ensuring systematic coverage and no missed spots.",
  },
  {
    icon: Clock,
    title: "Auto Scheduling",
    description:
      "Set a cleaning time and let SweepBot handle regular floor care while you focus on your day.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description:
      "Energy-efficient operation uses 80% less power than traditional vacuums while delivering superior results.",
  },
]

export function Benefits() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose SweepBot Pro</h2>
          <p className="mt-4 text-lg text-muted-foreground">Intelligent features designed for modern living</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white">
            <img
              src="/images/room-cleaning-modes.avif"
              alt="SweepBot Pro cleaning modes for different rooms"
              className="aspect-[4/3] w-full object-contain p-4 transition-transform hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-2xl bg-white">
            <img
              src="/images/floor-surface-suitability.avif"
              alt="SweepBot Pro suitable for different floor surfaces"
              className="aspect-[4/3] w-full object-contain p-4 transition-transform hover:scale-105"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <OrderCta className="mt-12" />
      </div>
    </section>
  )
}
