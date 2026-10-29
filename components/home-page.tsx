import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Hand, HeartHandshake, MessageCircle, PackageCheck, Truck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { PRODUCT_PATH } from "@/lib/routes"
import { UNIT_PRICE } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Korret Stores | Support for Everyday Independence",
  description: "Discover practical support for home rehabilitation and everyday independence. Explore our hand rehabilitation glove with free delivery across Ghana.",
}

const values = [
  { icon: Hand, title: "Made for everyday routines", text: "Practical tools that fit into short, regular sessions at home." },
  { icon: HeartHandshake, title: "Support for you and your family", text: "Options for people working on hand mobility and the caregivers beside them." },
  { icon: Truck, title: "Delivered across Ghana", text: "Free delivery, with payment on delivery available in Accra and Kumasi." },
]

const steps = [
  { icon: PackageCheck, title: "Find your fit", text: "Explore the glove, how it works, and the available bundles." },
  { icon: MessageCircle, title: "Place your order", text: "Share your details. Our team will contact you on WhatsApp to confirm." },
  { icon: Truck, title: "Get ready for delivery", text: "We will confirm your address, payment arrangements, and delivery details." },
]

// Saved for the future home-page launch; this module has no public route.
export default function HomePageDraft() {
  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <section className="overflow-hidden bg-primary/5">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">A little support. More possibility.</p>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Everyday steps.<br /><span className="text-primary">Greater independence.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Thoughtful support for the moments that matter. Discover practical tools for hand mobility, home rehabilitation, and your daily routine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={PRODUCT_PATH} prefetch={false} className={buttonVariants({ size: "lg", className: "h-12 px-6" })}>
                Explore the glove <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
              <a href="#our-approach" className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 bg-transparent px-6" })}>Get to know us</a>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><Truck aria-hidden="true" className="h-4 w-4 text-primary" /> Free delivery across Ghana</div>
          </div>
          <div className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-white bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">Our featured product</span><span>Home rehabilitation</span>
            </div>
            <Image src="/images/Img 1.avif" alt="Hand rehabilitation glove and controller" width={935} height={960} preload fetchPriority="high" unoptimized className="mx-auto aspect-square w-full max-w-sm object-contain py-4" />
            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <div><p className="text-sm font-semibold sm:text-base">Hand Rehabilitation Glove</p><p className="mt-1 text-xs text-muted-foreground">Assisted movement. At your own pace.</p></div>
              <Link href={PRODUCT_PATH} prefetch={false} aria-label="View the hand rehabilitation glove" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"><ArrowUpRight aria-hidden="true" className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="our-approach" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The Korret approach</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Small moments.<br />Meaningful support.</h2></div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Holding a cup. Getting dressed. Taking part in a familiar routine. We focus on practical support for everyday independence, with products you can explore clearly and order simply.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 sm:p-8"><Icon aria-hidden="true" className="h-7 w-7 text-primary" /><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
          ))}
        </div>
      </section>

      <section id="featured-product" className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white p-6"><Image src="/images/Img 5.avif" alt="A closer look at the hand rehabilitation glove" width={960} height={960} sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, calc(100vw - 80px)" className="mx-auto aspect-square w-full max-w-md object-contain" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Meet your daily support</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Hand Rehabilitation Glove</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">A wearable tool that assists finger opening and closing for repeated hand movement practice. Designed for short home sessions, with adjustable support and a rechargeable controller.</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["Assisted finger flexion and extension", "Adjustable settings for comfortable practice", "Single units and bundles available"].map((item) => (
                <li key={item} className="flex items-start gap-3"><span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{item}</li>
              ))}
            </ul>
            <p className="mt-7 text-sm text-muted-foreground">Single unit <span className="ml-1 text-2xl font-bold text-foreground">GH₵{UNIT_PRICE.toLocaleString("en-GH")}</span></p>
            <Link href={PRODUCT_PATH} prefetch={false} className={buttonVariants({ size: "lg", className: "mt-6 h-12 px-6" })}>View product & bundles <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">Use alongside professional guidance. Individual needs and results vary.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Simple from the start</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From our store to your door.</h2></div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="border-t pt-6"><div className="flex items-center justify-between text-primary"><span className="text-xs font-semibold">0{index + 1}</span><Icon aria-hidden="true" className="h-6 w-6" /></div><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:flex-row md:items-center">
          <div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Make room for your next small step.</h2><p className="mt-3 text-sm opacity-90">Explore the glove and find the option that fits your routine.</p></div>
          <Link href={PRODUCT_PATH} prefetch={false} className={buttonVariants({ variant: "secondary", size: "lg", className: "h-12 shrink-0 bg-white px-6 text-primary hover:bg-white/90" })}>Explore the product <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  )
}
