import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/AppProviders.jsx";
import { formatKES } from "../../utils/currency";
export default function CartDrawer() {
  const { open, setOpen, items, remove, setQty, subtotal } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <motion.aside
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-background flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-display text-xl">Your Bag ({items.length})</h3>
              <button onClick={() => setOpen(false)}><FiX size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 && <p className="text-muted-foreground text-sm">Your bag is empty.</p>}
              {items.map((i) => (
                <div key={i.key} className="flex gap-3 border-b pb-4">
                  <img src={i.image} alt={i.name} className="w-20 h-24 object-cover rounded-md" loading="lazy" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-medium text-sm">{i.name}</p>
                        <p className="text-xs text-muted-foreground">{i.color?.name}{i.size ? ` · ${i.size.label}` : ""}</p>
                      </div>
                      <button onClick={() => remove(i.key)} className="text-muted-foreground hover:text-destructive"><FiTrash2 size={16} /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border">
                        <button className="px-2" onClick={() => setQty(i.key, i.quantity - 1)}>−</button>
                        <span className="px-2 text-sm">{i.quantity}</span>
                        <button className="px-2" onClick={() => setQty(i.key, i.quantity + 1)}>+</button>
                      </div>
                      <p className="text-sm font-semibold">{formatKES(Math.round(i.price * (1 - i.discount / 100)) * i.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t space-y-3">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{formatKES(subtotal)}</span></div>
              <Link to="/checkout" onClick={() => setOpen(false)} className="btn-gold block text-center py-3 rounded-md font-medium">Checkout</Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="block text-center text-sm underline">View full cart</Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
