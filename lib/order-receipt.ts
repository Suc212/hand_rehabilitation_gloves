import { z } from "zod"
import { priceTiers } from "@/lib/pricing"
import { DEFAULT_PRODUCT_ID, PRODUCT_IDS } from "@/lib/products"

export const ORDER_RECEIPT_COOKIE = "korret_order_receipt"

const receiptSchema = z.object({
  productId: z.enum(PRODUCT_IDS).default(DEFAULT_PRODUCT_ID),
  orderId: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(3),
  totalPrice: z.number().positive().finite(),
})

export type OrderReceipt = z.infer<typeof receiptSchema>

export function readOrderReceipt(value: string | undefined): OrderReceipt | null {
  if (!value) return null
  try {
    const result = receiptSchema.safeParse(JSON.parse(decodeURIComponent(value)))
    if (!result.success) return null
    const tier = priceTiers.find((item) => item.quantity === result.data.quantity)
    return tier?.totalPrice === result.data.totalPrice ? result.data : null
  } catch {
    return null
  }
}
