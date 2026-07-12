export function buildOrderMessage({ order, storeName = "Maison Noir" }) {
  const items = (order.items || [])
    .map((item, index) => {
      return `${index + 1}. ${item.name}
Color: ${item.color?.name || item.color || "-"}
Size: ${item.size?.label || item.size || "-"}
Qty: ${item.quantity}
Price: KSh ${Number(item.price).toLocaleString()}`;
    })
    .join("\n\n");

  return `*NEW ORDER - ${storeName.toUpperCase()}*

Order #: ${order.id || "-"}

 *Customer*
Name: ${order.customer?.fullName || order.customer?.name || "-"}
Phone: ${order.customer?.phone || "-"}

*Delivery Address*
${order.shipping?.address || "-"}
${order.shipping?.city || ""}
${order.shipping?.country || ""}
${order.shipping?.notes ? `Notes: ${order.shipping.notes}` : ""}

━━━━━━━━━━━━━━

${items}

━━━━━━━━━━━━━━

Subtotal: KSh ${Number(order.subtotal || 0).toLocaleString()}
Delivery: KSh ${Number(order.deliveryFee || 0).toLocaleString()}
Discount: KSh ${Number(order.discount || 0).toLocaleString()}
Total: *KSh ${Number(order.total || 0).toLocaleString()}*

Please confirm this order.`;
}