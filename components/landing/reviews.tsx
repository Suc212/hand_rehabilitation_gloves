import { StaticImage } from "@/components/landing/static-image"
import { MessageCircle, Star } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const reviews = [
  {
    id: 1,
    name: "Akosua Ofori",
    location: "Accra",
    rating: 5,
    text: "After my stroke, simple tasks like holding a cup and buttoning my shirt were difficult. The glove made home therapy easier by gently helping my fingers open and close.",
  },
  {
    id: 2,
    name: "Abena Darko",
    location: "East Legon",
    rating: 5,
    text: "We use it with my father after his stroke, between therapy appointments. It gives us a clear routine for short daily sessions instead of just reminding him to squeeze a ball.",
  },
  {
    id: 3,
    name: "Nana Owusu",
    location: "Kumasi",
    rating: 5,
    text: "My stroke affected movement in my hand, so I wanted a simple way to keep practising at home. The glove helps me repeat the opening and closing exercises my therapist showed me.",
  },
  {
    id: 4,
    name: "Lydia Hammond",
    location: "Takoradi",
    rating: 5,
    text: "Since my mother's stroke, we have been helping her make time for hand exercises. Using the glove gives us a routine we can follow together, with breaks whenever she needs them.",
  },
]

export function Reviews() {
  return (
    <section id="facebook-reviews" className="border-y bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
            <MessageCircle className="h-4 w-4" />
            Facebook Reviews
          </span>
          <div className="mt-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">4.8/5 from 500+ customers</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What People Are Saying on Facebook
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Experiences with hand practice at home, from stroke recovery to support from family.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border bg-card p-3 shadow-lg sm:p-4">
          <div className="overflow-hidden rounded-xl bg-white">
            <StaticImage
              src="/images/Review_1.avif"
              width={1122}
              height={1402}
              loading="lazy"
              sizes="(min-width: 960px) 864px, calc(100vw - 64px)"
              alt="Facebook review from Akosua Ofori about using a hand rehabilitation glove after stroke recovery"
              className="w-full object-contain"
            />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Illustrative stroke recovery stories — simulated examples, not verified customer reviews.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Simulated stroke recovery reviews">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              <div className="mt-4">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.location}</p>
              </div>
            </div>
          ))}
        </div>

        <OrderCta className="mt-10" />
      </div>
    </section>
  )
}
