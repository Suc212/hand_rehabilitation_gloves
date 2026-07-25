import { Activity, Brain, Hand, HeartHandshake } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const helpLevels = [
  {
    icon: Hand,
    level: "Level 1",
    title: "Physical / Mechanical",
    points: [
      "Supports repetitive motion exercises that rebuild finger flexion and extension",
      "Assists gentle, consistent opening and closing movement",
      "Helps retain warmth around the hand before movement work",
      "Encourages circulation through repeated guided motion",
    ],
  },
  {
    icon: Activity,
    level: "Level 2",
    title: "Functional / Everyday Life",
    points: [
      "Rebuilds motions used for gripping, pinching, and hand control",
      "Bridges the gap between clinical exercise and holding a fork again",
      "Designed for short, frequent sessions that fit around a normal day",
    ],
  },
  {
    icon: Brain,
    level: "Level 3",
    title: "Clinical / Recovery-Oriented",
    points: [
      "Complements prescribed physical or occupational therapy",
      "Encourages consistency, a key factor in neuroplasticity-driven recovery",
      "Helps patients and caregivers notice progress between clinical visits",
    ],
  },
  {
    icon: HeartHandshake,
    level: "Level 4",
    title: "Emotional / Psychological",
    points: [
      "Small visible wins rebuild confidence, not just muscle",
      "Reduces the helpless feeling that can follow loss of hand function",
      "Gives family members a concrete way to support recovery",
    ],
  },
]

export function Benefits() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Helps</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Four practical levels of support, from finger movement to everyday confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {helpLevels.map((level) => (
            <div key={level.title} className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <level.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">{level.level}</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{level.title}</h3>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {level.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <OrderCta className="mt-12" />
      </div>
    </section>
  )
}
