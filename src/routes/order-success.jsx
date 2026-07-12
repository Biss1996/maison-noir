import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccess,
  validateSearch: (s) => ({ id: typeof s.id === "string" ? s.id : undefined }),
});

function OrderSuccess() {
  const { id } = useSearch({ from: "/order-success" });
  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto btn-gold h-20 w-20 rounded-full grid place-items-center"><FiCheck size={36} /></motion.div>
        <h1 className="mt-6 font-display text-4xl">Thank you!</h1>
        <p className="mt-3 text-muted-foreground">Your order has been placed. You will receive a confirmation shortly.</p>
        {id && <p className="mt-2 text-xs font-mono text-muted-foreground">Order #{id.slice(0, 8)}</p>}
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/orders" className="btn-gold px-6 py-2.5 rounded-full">View orders</Link>
          <Link to="/shop" className="px-6 py-2.5 rounded-full border">Continue shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}
