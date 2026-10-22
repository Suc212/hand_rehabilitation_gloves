import { Hand, HeartHandshake, ListChecks } from "lucide-react"
import { OrderCta } from "@/components/landing/order-cta"

const steps = [
  { icon: ListChecks, title: "Build a manageable routine", text: "Set aside a short time for hand movement practice, following the guidance of their therapist or healthcare professional." },
  { icon: Hand, title: "Offer a helping hand", text: "The glove assists finger opening and closing, with adjustable settings to match comfortable practice." },
  { icon: HeartHandshake, title: "Be there for the small steps", text: "Support regular practice and notice everyday changes together, without rushing or forcing movement." },
]

export function CaregiverSupport({ recoveryFocused = false }: { recoveryFocused?: boolean }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Support for the person beside them</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{recoveryFocused ? "A clear pathway to faster recovery." : "A clearer routine for the person you care for."}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{recoveryFocused ? "The path to recovery after a stroke can feel unclear and overwhelming. A practical place to start is with your hands: repeated movement and sensory feedback send signals to the brain, helping it strengthen and reorganise the connections used for everyday tasks. With consistent practice and professional guidance, small movements can become meaningful steps forward." : "Helping a parent, partner, or family member with daily exercises can feel overwhelming. Rehab Helper Gloves offer assisted movement practice you can make part of a familiar home routine."}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 sm:p-8">
              <Icon aria-hidden="true" className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">A support tool for guided practice, used alongside professional care. Individual needs and results vary.</p>
        <OrderCta className="mt-8" label="Choose a bundle for your family" />
      </div>
    </section>
  )
}
