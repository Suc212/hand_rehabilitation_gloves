import { Truck } from "lucide-react"

export function FreeDeliveryBanner() {
  return (
    <div className="bg-primary px-4 py-2 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-sm font-semibold sm:text-base">
        <Truck className="h-4 w-4 flex-shrink-0" />
        <span>Free delivery today on all orders</span>
      </div>
    </div>
  )
}
