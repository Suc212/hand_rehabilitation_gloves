import { AlertCircle, Sparkles } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const problems = [
  "Manual sweeping wastes hours every week",
  "Traditional vacuums miss corners and edges",
  "Dust and dirts accumulate quickly",
  "Inconsistent cleaning schedules",
  "Bending to sweep causes back strain",
]

const solutions = [
  "Automated daily cleaning while you're away",
  "LiDAR mapping covers 100% of floor space",
  "HEPA filtration captures 99.97% of particles",
  "Smart scheduling adapts to your lifestyle",
  "Set it and leave it",
]

export function ProblemSolution() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <AlertCircle className="h-4 w-4" />
            The Cleaning Problem
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Traditional cleaning is broken.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Hours spent pushing heavy vacuums, missed spots, and floors that never stay clean. There has to be a better
            way.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <img
            src="/images/SmartSweeper Img 1.png"
            alt="Customer post showing SweepBot Pro cleaning a living room floor"
            className="aspect-square w-full max-w-xl rounded-2xl bg-white object-contain shadow-lg"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-destructive">
              <AlertCircle className="h-5 w-5" />
              The Old Way
            </h3>
            <ul className="mt-6 space-y-4">
              {problems.map((problem) => (
                <li key={problem} className="flex items-start gap-3 text-destructive/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Sparkles className="h-5 w-5" />
              The SweepBot Way
            </h3>
            <ul className="mt-6 space-y-4">
              {solutions.map((solution) => (
                <li key={solution} className="flex items-start gap-3 text-primary/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Stop wasting time on floors. Let SweepBot handle it.</p>
          <OrderCta className="mt-6" />
        </div>
      </div>
    </section>
  )
}
