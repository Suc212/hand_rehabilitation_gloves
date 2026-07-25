import { OrderCta } from "@/components/landing/order-cta"

const faqs = [
  {
    question: "Does SweepBot Pro work on tiled floors?",
    answer: "Yes. It is suitable for tiles and other hard floors commonly used in homes and offices.",
  },
  {
    question: "Can it clean under beds and furniture?",
    answer: "Yes. The low-profile body helps it reach under many beds, sofas, tables, and cabinets.",
  },
  {
    question: "How do I charge it?",
    answer: "Place it on the included charging dock after use. A full charge gives it enough power for daily cleaning.",
  },
  {
    question: "Can I pay when it is delivered?",
    answer:
      "Payment on delivery is available in Accra after your order is confirmed. Orders outside Accra require advance payment before dispatch.",
  },
  {
    question: "What if I have an issue after buying?",
    answer: "Your order includes a warranty, so you can contact us for support if the product develops an issue.",
  },
]

export function FAQ() {
  return (
    <section className="py-16 sm:py-24">
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

        <OrderCta className="mt-10" label="Place Your Order" />
      </div>
    </section>
  )
}
