import { createFileRoute, Link } from "@tanstack/react-router";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/AppProviders.jsx";
import { formatKES } from "../utils/currency";
export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 300;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Shopping Bag</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Your bag is empty.</p>
          <Link to="/shop" className="btn-gold inline-block mt-4 px-6 py-2.5 rounded-full">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.key} className="flex gap-4 border rounded-xl p-4 bg-card">
                <img src={i.image} alt={i.name} className="w-24 h-28 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.color?.name}{i.size ? ` · ${i.size.label}` : ""}</p>
                    </div>
                    <button onClick={() => remove(i.key)} className="text-muted-foreground hover:text-destructive"><FiTrash2 /></button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md border">
                      <button className="px-3" onClick={() => setQty(i.key, i.quantity - 1)}>−</button>
                      <span className="px-3 text-sm">{i.quantity}</span>
                      <button className="px-3" onClick={() => setQty(i.key, i.quantity + 1)}>+</button>
                    </div>
                    <p className="font-semibold">{formatKES(Math.round(i.price * (1 - i.discount / 100)) * i.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-secondary rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display text-2xl mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatKES(shipping)}</span></div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base"><span>Total</span><span>{formatKES(total)}</span></div>
            </div>
            <Link to="/checkout" className="btn-gold block mt-6 text-center py-3 rounded-full font-medium">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
