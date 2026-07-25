import { MessageCircle, PackageCheck, PhoneCall } from "lucide-react"

const steps = [
  {
    icon: PackageCheck,
    title: "Place Order",
    description: "Choose your quantity and submit your delivery details.",
  },
  {
    icon: PhoneCall,
    title: "Confirmation Call",
    description: "We contact you on WhatsApp or phone to confirm your order.",
  },
  {
    icon: MessageCircle,
    title: "Delivery",
    description: "Receive your SweepBot Pro through free delivery anywhere in Ghana.",
  },
]

export function OrderProcess() {
  return (
    <section className="border-y bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3 rounded-xl bg-background p-4 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-primary">Step {index + 1}</p>
                <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
