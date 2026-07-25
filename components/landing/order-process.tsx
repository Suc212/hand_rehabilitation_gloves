import { CheckCircle2, CircleMinus, XCircle } from "lucide-react"

const comparisons = [
  {
    feature: "Guided finger opening and closing",
    glove: "Yes",
    stressBall: "No",
    noTool: "No",
  },
  {
    feature: "Short repeatable home sessions",
    glove: "Yes",
    stressBall: "Limited",
    noTool: "Hard to maintain",
  },
  {
    feature: "Supports real task movement",
    glove: "Grip, pinch, and finger mobility",
    stressBall: "Mostly squeezing",
    noTool: "Unstructured",
  },
  {
    feature: "Caregiver-friendly routine",
    glove: "Clear assisted movement",
    stressBall: "Minimal guidance",
    noTool: "Depends on memory",
  },
]

const getIcon = (value: string) => {
  if (value === "Yes" || value.includes("Grip") || value.includes("Clear")) {
    return <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
  }

  if (value === "No") {
    return <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
  }

  return <CircleMinus className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
}

export function OrderProcess() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Use a Rehab Glove?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Compared with stress balls, putty, or no tool, the glove gives hand recovery a clearer movement routine.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] gap-3 bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground sm:text-sm">
            <span>Recovery need</span>
            <span>Rehab glove</span>
            <span>Stress ball / putty</span>
            <span>No tool</span>
          </div>
          <div className="divide-y">
            {comparisons.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] gap-3 px-4 py-4 text-xs sm:text-sm"
              >
                <p className="font-medium text-foreground">{row.feature}</p>
                {[row.glove, row.stressBall, row.noTool].map((value, index) => (
                  <p key={`${row.feature}-${index}`} className="flex items-start gap-2 leading-relaxed text-muted-foreground">
                    {getIcon(value)}
                    <span>{value}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
