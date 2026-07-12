export function priceAfterDiscount(price = 0, discount = 0) {
  return Math.round(price * (1 - discount / 100));
}