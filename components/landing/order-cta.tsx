import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

type OrderCtaProps = {
  className?: string
  label?: string
}

export function OrderCta({ className = "", label = "Order Now" }: OrderCtaProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
        <a href="#order">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {label}
        </a>
      </Button>
    </div>
  )
}
