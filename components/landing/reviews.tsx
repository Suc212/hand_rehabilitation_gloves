import { Star } from "lucide-react"

import { OrderCta } from "@/components/landing/order-cta"

const reviews = [
  {
    id: 1,
    name: "Kwame Asante",
    location: "Accra",
    rating: 5,
    text: "This robot sweeper has changed my life! My house is always clean even when I'm at work. Best purchase I've made this year.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Ama Mensah",
    location: "Kumasi",
    rating: 5,
    text: "I was skeptical at first, but SweepBot Pro exceeded my expectations. It navigates around furniture perfectly and the battery lasts long.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Kofi Osei",
    location: "Tema",
    rating: 5,
    text: "My wife loves it! No more arguments about who sweeps the floor. Worth every cedis. Delivery was also very fast.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Efua Boateng",
    location: "Takoradi",
    rating: 5,
    text: "I bought 2 for my home and office. The cleaning quality is amazing and it's so quiet. Highly recommend to all busy Ghanaians!",
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Yaw Darko",
    location: "East Legon",
    rating: 5,
    text: "Perfect for my tiled floors. It picks up dust and pet hair easily. Customer service was also very helpful when I had questions.",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Adwoa Frimpong",
    location: "Spintex",
    rating: 5,
    text: "Gift for my mother and she calls me every day to thank me. Easy to use even for someone not tech-savvy. 10/10!",
    date: "3 days ago",
  },
]

export function Reviews() {
  return (
    <section className="py-12 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">4.9/5 from 500+ happy customers</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What Other Ghanaians Are Saying
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-card shadow-lg">
          <img
            src="/images/Image 3.png"
            alt="Customer testimonial from Jessica Williams holding a smart sweeper"
            className="w-full object-contain"
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        <OrderCta className="mt-10" />
      </div>
    </section>
  )
}
