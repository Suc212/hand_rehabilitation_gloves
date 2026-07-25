import { AlertCircle, CheckCircle2 } from "lucide-react"

const recoveryGaps = [
  "In-clinic therapy can be hard to repeat often enough between visits",
  "At-home stretching routines are easy to under-do or skip",
  "Stress balls and putty do not guide full finger opening and closing",
  "Small progress can be difficult for patients and caregivers to notice",
]

export function ProblemSolution() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <AlertCircle className="h-4 w-4" />
              The Problem
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Losing fine motor control affects more than your grip.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Buttoning a shirt, holding a cup, typing a message, turning a key: tasks nobody thinks about until
                they are difficult again.
              </p>
              <p>
                Traditional recovery paths work, but they can be slow, easy to under-do, and hard to track. This glove
                is built to close that gap with guided, repeatable movement support at home.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-foreground">Where recovery often gets stuck</h3>
            <ul className="mt-6 space-y-4">
              {recoveryGaps.map((gap) => (
                <li key={gap} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
