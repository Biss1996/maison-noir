export function formatKES(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceAfterDiscount(price, discount = 0) {
  return price - (price * discount) / 100;
}