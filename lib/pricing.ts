export const UNIT_PRICE = 1600

const OLD_UNIT_PRICE = 1500
const OLD_ORIGINAL_UNIT_PRICE = 2300

export const ORIGINAL_UNIT_PRICE = Math.round((UNIT_PRICE * OLD_ORIGINAL_UNIT_PRICE) / OLD_UNIT_PRICE)

const THREE_UNIT_DISCOUNT_PERCENT = 10

export const bundlePrices: Record<number, number> = {
  1: UNIT_PRICE,
  2: 3000,
  3: Math.round(UNIT_PRICE * 3 * (1 - THREE_UNIT_DISCOUNT_PERCENT / 100)),
}

export const priceTiers = [1, 2, 3].map((quantity) => {
  const originalTotalPrice = quantity * ORIGINAL_UNIT_PRICE
  const totalPrice = bundlePrices[quantity]

  return {
    quantity,
    totalPrice,
    originalTotalPrice,
    bundleDiscountPercent: Math.round(((quantity * UNIT_PRICE - totalPrice) / (quantity * UNIT_PRICE)) * 10000) / 100,
    discount: originalTotalPrice - totalPrice,
  }
})
