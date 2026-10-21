import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, MessageCircle, PackageCheck, Truck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ORDER_RECEIPT_COOKIE, readOrderReceipt } from "@/lib/order-receipt"
import { DEFAULT_PRODUCT_ID, products } from "@/lib/products"
import { Footer } from "@/components/landing/footer"
import { PurchaseEvent } from "@/components/analytics/purchase-event"

export const metadata: Metadata = {
  title: "Your Order | Korret Stores",
  robots: { index: false, follow: false },
}

const nextSteps = [
  { icon: MessageCircle, title: "Look out for our message", text: "Our team will contact you on WhatsApp to confirm your order." },
  { icon: PackageCheck, title: "Confirm the details", text: "We will check your address and explain the payment arrangements for your location." },
  { icon: Truck, title: "Get ready for delivery", text: "Once confirmed, we will arrange your free delivery within Ghana." },
]

export default async function OrderSuccessPage() {
  const cookieStore = await cookies()
  const receipt = readOrderReceipt(cookieStore.get(ORDER_RECEIPT_COOKIE)?.value)
  const product = products[receipt?.productId ?? DEFAULT_PRODUCT_ID]

  if (!receipt) {
    return (
      <>
      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-20" tabIndex={-1}>
        <div className="max-w-lg text-center">
          <PackageCheck aria-hidden="true" className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">No recent order to show</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">Your order summary will appear here after a successful order. If you already ordered and this summary has expired, our team will still contact you on WhatsApp.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={product.path} prefetch={false} className={buttonVariants({ size: "lg" })}>Explore the glove</Link>
          </div>
        </div>
      </main>
      <Footer productPath={product.path} />
      </>
    )
  }

  return (
    <>
    <PurchaseEvent receipt={receipt} productName={product.name} productPath={product.path} />
    <main id="main-content" className="flex-1 bg-primary/5 px-4 py-12 sm:px-6 sm:py-20" tabIndex={-1}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden="true" className="h-8 w-8" /></span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Thank you for choosing Korret Stores</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Your order has been received.</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">You’re one step closer. Our team will contact you on WhatsApp to confirm your order and arrange delivery.</p>
        </div>

        <section aria-labelledby="order-summary-heading" className="mt-10 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b px-5 py-5 sm:px-8">
            <h2 id="order-summary-heading" className="font-semibold">Order summary</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" /> Received</span>
          </div>
          <dl className="space-y-5 p-5 text-sm sm:p-8">
            <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Order reference</dt><dd className="break-all font-mono text-xs" data-order-reference>{receipt.orderId}</dd></div>
            <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Product</dt><dd className="font-medium" data-order-product>{product.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Quantity</dt><dd>{receipt.quantity} {receipt.quantity === 1 ? "unit" : "units"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Delivery within Ghana</dt><dd className="font-medium text-primary">Free</dd></div>
            <div className="flex items-center justify-between gap-4 border-t pt-5"><dt className="font-semibold">Order total</dt><dd className="text-2xl font-bold" data-order-total>GH₵{receipt.totalPrice.toLocaleString("en-GH")}</dd></div>
          </dl>
          <p className="border-t bg-muted/40 px-5 py-4 text-xs leading-relaxed text-muted-foreground sm:px-8">No online payment has been taken. Payment on delivery is available in Accra; our team will confirm payment arrangements for other locations.</p>
        </section>

        <section aria-labelledby="next-steps-heading" className="mt-10">
          <h2 id="next-steps-heading" className="text-xl font-semibold">What happens next?</h2>
          <ol className="mt-5 space-y-5">
            {nextSteps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-card"><Icon aria-hidden="true" className="h-5 w-5 text-primary" /></span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div></li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={product.path} prefetch={false} className={buttonVariants({ size: "lg", className: "h-12" })}>Back to product <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link>
          <Link href={`${product.path}#order`} prefetch={false} className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 bg-card" })}>Place another order</Link>
        </div>
      </div>
    </main>
    <Footer productPath={product.path} />
    </>
  )
}
