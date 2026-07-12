import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../../context/AppProviders.jsx";
import { formatKES } from "../../utils/currency";
import { priceAfterDiscount } from "../../utils/pricing";
export default function ProductCard({ product, index = 0 }) {
  const wish = useWishlist();
  const img =
  product.images?.[0] ||  product.image ||  product.colors?.[0]?.images?.[0] ||  "/placeholder.png";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative overflow-hidden rounded-xl bg-secondary aspect-[3/4]">
          <img src={img} alt={product.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          {(product.discount || 0) > 0 &&  (
            <span className="absolute top-3 left-3 btn-gold text-xs font-semibold px-2 py-1 rounded">−{product.discount}%</span>
          )}
          {product.newArrival === true && (
            <span className="absolute top-3 right-3 bg-ink text-cream text-xs font-semibold px-2 py-1 rounded">NEW</span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); wish.toggle(product.id); }}
            className={`absolute bottom-3 right-3 h-9 w-9 rounded-full grid place-items-center transition ${wish.has(product.id) ? "bg-accent text-ink" : "glass"}`}
            aria-label="Wishlist"
          ><FiHeart /></button>
        </div>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
          <h3 className="text-sm font-medium mt-1 line-clamp-1">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-semibold">{formatKES(priceAfterDiscount(product))}</span>
            {product.discount > 0 && <span className="text-xs text-muted-foreground line-through">{formatKES(product.price)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
