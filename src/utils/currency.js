export function formatKES(amount = 0) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceAfterDiscount(price, discount = 0) {
  return Math.round(price * (1 - discount / 100));
}