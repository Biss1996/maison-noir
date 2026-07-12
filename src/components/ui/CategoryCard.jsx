import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function CategoryCard({ cat, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
    >
      <Link to="/shop" search={{ category: cat.slug }} className="group block relative overflow-hidden rounded-2xl aspect-[4/5] shadow-luxe">
        <img src={cat.image} alt={cat.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-cream">
          <h3 className="font-display text-lg">{cat.name}</h3>
          <p className="text-xs text-cream/70">{cat.count} products</p>
        </div>
      </Link>
    </motion.div>
  );
}
