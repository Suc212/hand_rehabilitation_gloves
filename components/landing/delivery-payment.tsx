import { Banknote, MapPin, Truck } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

export function DeliveryPayment() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Truck className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Free Delivery in Ghana 🇬🇭
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We offer free delivery across Ghana. Payment on delivery is available only in Accra after your order has
            been confirmed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Accra Orders</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Customers in Accra can pay when the SweepBot Pro is delivered. We will contact you first to confirm your
              details before dispatch.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Outside Accra</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Orders outside Accra require advance payment before shipment. This helps us confirm dispatch and provide
              reliable delivery to your location.
            </p>
          </div>
        </div>

        <OrderCta className="mt-10" />
      </div>
    </section>
  )
}
