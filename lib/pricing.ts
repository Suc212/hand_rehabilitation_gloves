export const UNIT_PRICE = 2000

const OLD_UNIT_PRICE = 1500
const OLD_ORIGINAL_UNIT_PRICE = 2300
const OLD_BUNDLE_PRICES = {
  2: 2700,
  3: 3800,
}

export const ORIGINAL_UNIT_PRICE = Math.round((UNIT_PRICE * OLD_ORIGINAL_UNIT_PRICE) / OLD_UNIT_PRICE)

export const bundlePrices: Record<number, number> = {
  1: UNIT_PRICE,
  2: Math.round(UNIT_PRICE * 2 * (OLD_BUNDLE_PRICES[2] / (OLD_UNIT_PRICE * 2))),
  3: Math.round(UNIT_PRICE * 3 * (OLD_BUNDLE_PRICES[3] / (OLD_UNIT_PRICE * 3))),
}

export const priceTiers = [1, 2, 3].map((quantity) => {
  const originalTotalPrice = quantity * ORIGINAL_UNIT_PRICE
  const totalPrice = bundlePrices[quantity]

  return {
    quantity,
    totalPrice,
    originalTotalPrice,
    discount: originalTotalPrice - totalPrice,
  }
})
