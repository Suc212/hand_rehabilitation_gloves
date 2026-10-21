const faqs = [
  {
    question: "Is this a replacement for physical therapy?",
    answer:
      "No. The glove is designed to complement prescribed physical or occupational therapy, not replace professional care.",
  },
  {
    question: "How soon can I expect to see results?",
    answer:
      "Recovery timelines vary by condition, consistency, and severity. Many users focus on small measurable wins such as more repetitions, better grip control, or easier daily tasks.",
  },
  {
    question: "Is it safe to use without supervision?",
    answer:
      "For general stiffness, many people use it at home. After stroke, surgery, nerve injury, or a diagnosed condition, use it with guidance from your clinician or therapist.",
  },
  {
    question: "What conditions is this not recommended for?",
    answer:
      "Do not use it over open wounds, untreated fractures, severe pain, active swelling that has not been assessed, or any condition your clinician has advised against exercising.",
  },
  {
    question: "How often should I use it per day or week?",
    answer:
      "Short, frequent sessions are usually easier to maintain than long sessions. Follow your therapist's advice and stop if you feel pain or unusual discomfort.",
  },
  {
    question: "Does it fit different hand sizes?",
    answer:
      "The glove uses adjustable support for secure hand placement. Contact us before ordering if you are unsure about fit.",
  },
  {
    question: "Can I pay when it is delivered?",
    answer:
      "Payment on delivery is available in Accra after your order is confirmed. Orders outside Accra require advance payment before dispatch.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Questions Before You Order</h2>
          <p className="mt-4 text-lg text-muted-foreground">Clear answers for common buyer concerns</p>
        </div>

        <div className="mt-10 divide-y rounded-2xl border bg-card shadow-sm">
          {faqs.map((faq) => (
            <div key={faq.question} className="p-5 sm:p-6">
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-lg sm:px-10">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Recovery Happens in the Small, Daily Moments
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">
            Start rebuilding hand strength and independence today.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="#order"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-semibold text-primary shadow-sm transition-colors hover:bg-white/90"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
