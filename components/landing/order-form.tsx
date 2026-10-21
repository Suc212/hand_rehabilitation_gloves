"use client"

import type React from "react"
import Image from "next/image"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, ShieldCheck, Banknote } from "lucide-react"
import { ORIGINAL_UNIT_PRICE, UNIT_PRICE, priceTiers } from "@/lib/pricing"
import { ORDER_SUCCESS_PATH } from "@/lib/routes"
import { DEFAULT_PRODUCT_ID, products, type ProductId } from "@/lib/products"

function Label({ className = "", ...props }: React.ComponentProps<"label">) {
  return <label className={`flex items-center gap-2 text-sm leading-none font-medium ${className}`} {...props} />
}

const quantityOptions = priceTiers.map(({ quantity, totalPrice, originalTotalPrice, discount }) => {

  return {
    quantity,
    unitPrice: UNIT_PRICE,
    originalUnitPrice: ORIGINAL_UNIT_PRICE,
    totalPrice,
    originalTotalPrice,
    discount,
    label: `${quantity} ${quantity === 1 ? "Unit" : "Units"}`,
    description:
      quantity === 1
        ? "Hand Rehabilitation Glove + controller"
        : `Bundle deal: Save GH₵${discount.toLocaleString()} - ${
            quantity === 2 ? "Good for family or clinic use" : "Best for therapy centers & caregivers"
          }`,
    popular: quantity === 2,
  }
})

export function OrderForm({ productId = DEFAULT_PRODUCT_ID }: { productId?: ProductId }) {
  const product = products[productId]
  const [selectedQuantity, setSelectedQuantity] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedOption = useMemo(
    () => quantityOptions.find((opt) => opt.quantity === selectedQuantity) || quantityOptions[0],
    [selectedQuantity],
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const orderData = {
      productId,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      quantity: selectedQuantity.toString(),
      totalPrice: selectedOption.totalPrice.toString(),
      discount: selectedOption.discount.toString(),
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json().catch(() => null)

      if (response.ok && result?.success) {
        // A fresh request reads the receipt cookie and avoids a cached summary.
        window.location.replace(ORDER_SUCCESS_PATH)
        return
      } else {
        setError(result?.error || "Something went wrong. Please try again.")
      }
    } catch (submitError) {
      console.error("Order submission error:", submitError)
      setError("Unable to submit your order. Please check your connection and try again.")
    }
    setIsSubmitting(false)
  }

  return (
    <section id="order" className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Fill this form to place your order
          </h2>
          <p className="mt-3 text-muted-foreground">Free delivery in Ghana</p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2 text-sm sm:flex-row sm:justify-center">
            <span className="rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary">
              Limited stock available for delivery
            </span>
            <span className="rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
              Bundle deal active today
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Warranty</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <Banknote className="h-4 w-4" />
            <span>Accra Payment on Delivery</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-8 space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/images/Img 10.avif"
                  width={800}
                  height={800}
                  sizes="(min-width: 1024px) 320px, 1px"
                  alt={`${product.name} product package`}
                  className="aspect-square w-full object-contain p-4"
                />
              </div>
              <div className="rounded-xl bg-primary/5 p-4 text-center">
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">Includes controller and therapy accessories</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="min-w-0 lg:col-span-3 rounded-2xl border bg-card p-5 shadow-lg sm:p-8"
          >
            {error && <div role="alert" className="mb-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="space-y-5">
              <fieldset className="min-w-0">
                <legend className="text-base font-semibold">How Many Do You Want?</legend>
                <div className="mt-3 grid gap-3">
                  {quantityOptions.map((option) => (
                    <label
                      key={option.quantity}
                      htmlFor={`qty-${option.quantity}`}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all active:scale-[0.98] ${
                        selectedQuantity === option.quantity
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-muted-foreground/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="quantity"
                        value={option.quantity}
                        id={`qty-${option.quantity}`}
                        checked={selectedQuantity === option.quantity}
                        onChange={() => setSelectedQuantity(option.quantity)}
                        className="h-4 w-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{option.label}</span>
                          {option.popular && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{option.quantity === 1 ? `${product.name} + controller` : option.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground line-through">
                          GH₵{option.originalTotalPrice.toLocaleString()}
                        </p>
                        <p className="text-lg font-bold text-foreground">GH₵{option.totalPrice.toLocaleString()}</p>
                        {option.discount > 0 && (
                          <p className="text-xs font-medium text-primary">-GH₵{option.discount.toLocaleString()}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Kwame"
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Asante"
                    required
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0XX XXX XXXX"
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">
                  WhatsApp Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0XX XXX XXXX"
                  required
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">We'll contact you on WhatsApp to confirm your order</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="kwame@example.com"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="e.g. Spintex Road, near Shell Filling Station, Accra"
                  rows={3}
                  required
                  className="text-base resize-none"
                />
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {selectedOption.quantity} x {product.name} @ GH₵{UNIT_PRICE.toLocaleString()}
                  </span>
                  <span className="font-medium text-foreground">
                    GH₵{(selectedOption.quantity * UNIT_PRICE).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Original Price</span>
                  <span className="font-medium text-muted-foreground line-through">
                    GH₵{selectedOption.originalTotalPrice.toLocaleString()}
                  </span>
                </div>
                {selectedOption.discount > 0 && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bundle Discount</span>
                    <span className="font-medium text-primary">-GH₵{selectedOption.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">
                    GH₵{selectedOption.totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-center text-xs font-medium text-primary">
                  Pay GH₵{selectedOption.totalPrice.toLocaleString()} when you receive your order
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full min-h-14 h-auto whitespace-normal py-3 text-sm sm:text-base font-semibold" disabled={isSubmitting}>
                <Package className="mr-2 h-5 w-5" />
                {isSubmitting
                  ? "Processing..."
                  : `Order Now - Pay GH₵${selectedOption.totalPrice.toLocaleString()} on Delivery`}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                No payment required now - Our team will confirm payment and delivery arrangements
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
