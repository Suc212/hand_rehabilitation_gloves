"use client"

import { useEffect, useRef } from "react"

import { OrderCta } from "@/components/landing/order-cta"

export function ProductVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewTime = 0.1

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause()
          return
        }

        video.muted = true
        void video.play().catch(() => {})
      },
      { threshold: 0.45 },
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="border-y bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            See How It Works
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Watch the video to see SweepBot in action, navigating around furniture and obstacles.
          </p>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-lg">
            <video
              ref={videoRef}
              className="aspect-[9/16] w-full bg-muted object-contain"
              controls
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                if (event.currentTarget.currentTime === 0) {
                  event.currentTarget.currentTime = previewTime
                }
              }}
            >
              <source src={`/product-demo.mp4#t=${previewTime}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <OrderCta className="mt-6" />
        </div>
      </div>
    </section>
  )
}
