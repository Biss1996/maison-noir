import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function CategoryCard({ cat, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
    >
      <Link
        to="/shop"
        search={{ category: cat.slug }}
        className="group relative block overflow-hidden rounded-xl aspect-[16/9] shadow-lg"
      >
        <img
          src={cat.image}
          alt={cat.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-7 left-0 right-0 p-3">
            <p className="text-xs text-amber-300">
            {cat.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}