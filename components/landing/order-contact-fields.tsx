import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function Label({ className = "", ...props }: React.ComponentProps<"label">) {
  return <label className={`flex items-center gap-2 text-sm leading-none font-medium ${className}`} {...props} />
}

// Render static, uncontrolled fields and their merged styles on the server.
// The parent client form still owns validation, FormData, submission, and events.
export function OrderContactFields() {
  return (
    <>
              <fieldset className="space-y-3">
                <legend className="text-base font-semibold">
                  Which hand is affected? <span className="text-destructive">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {(["left", "right"] as const).map((hand) => (
                    <label key={hand} className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="affectedHand"
                        value={hand}
                        required
                        className="h-4 w-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      />
                      <span>{hand === "left" ? "Left hand" : "Right hand"}</span>
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

    </>
  )
}
