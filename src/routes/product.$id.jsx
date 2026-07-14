import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiShare2, FiCheck } from "react-icons/fi";
import { priceAfterDiscount } from "../utils/pricing";
import { formatKES } from "../utils/currency";

import { useProducts } from "../hooks/useProducts";import { useCart, useWishlist } from "../context/AppProviders.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";

export const Route = createFileRoute("/product/$id")({ component: ProductDetails });

function ProductDetails() {
  const { id } = useParams({ from: "/product/$id" });
  const { items: allProducts, loading } = useProducts();
  const cart = useCart(); const wish = useWishlist();

  const product = useMemo(() => allProducts.find((x) => x.id === id), [allProducts, id]);
  const related = useMemo(
    () => product ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [],
    [allProducts, product]
  );

  const [colorIdx, setColorIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (loading && !product) return <div className="mx-auto max-w-7xl px-6 py-24 text-center text-muted-foreground">Loading…</div>;
  if (!product) return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/shop" className="btn-gold inline-block mt-4 px-6 py-2.5 rounded-full">Back to shop</Link>
    </div>
  );

  const color = product.colors?.[colorIdx] || product.colors?.[0];
  const size = product.sizes?.[sizeIdx] || product.sizes?.[0];
  const images =
  color?.images?.length? color.images : product.images?.length? product.images: product.image ? [product.image]: product.colors?.[0]?.images || [];

  const handleAdd = () => {cart.add(product, { color: color || null, size: size || null, quantity: qty,});};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-xs text-muted-foreground mb-6"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</div>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl overflow-hidden bg-secondary aspect-[4/5]">
            {images[imgIdx] && (
              <motion.img key={images[imgIdx]} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} src={images[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex gap-3 mt-4">
            {images.map((im, i) => (
              <button key={im} onClick={() => setImgIdx(i)} className={`h-20 w-16 rounded-md overflow-hidden border-2 ${i === imgIdx ? "border-accent" : "border-transparent"}`}>
                <img src={im} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-widest text-accent">{product.brand || "Maison"}</p>
          <h1 className="mt-1 font-display text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-accent">{"★".repeat(Math.round(product.rating || 0))}<span className="text-muted-foreground">{"★".repeat(5 - Math.round(product.rating || 0))}</span></div>
            <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-sm font-semibold"> {formatKES(priceAfterDiscount(product.price,product.discount ) )}
</span>
            {(product.discount || 0) > 0 && <span className="text-muted-foreground text-red-700 line-through">{formatKES(product.price)}</span>}
            {(product.discount || 0) > 0 && <span className="text-xs btn-gold px-2 py-1 rounded">Save {product.discount}%</span>}
          </div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{product.description || ""}</p>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Color: <span className="text-muted-foreground">{color?.name}</span></p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button key={`${c.name}-${i}`} onClick={() => { setColorIdx(i); setImgIdx(0); }} className={`h-10 w-10 rounded-full border-6 ${i === colorIdx ? "border-accent" : "border-border"}`} aria-label={c.name} />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, i) => (
                  <button key={`${s.label}-${i}`} onClick={() => setSizeIdx(i)} disabled={s.stock === 0}
                    className={`px-4 py-2 rounded-md border text-sm ${i === sizeIdx ? "bg-ink text-cream" : "hover:border-accent"} ${s.stock === 0 ? "opacity-40 line-through" : ""}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            )}
            
          {color?.stock > 0 && <div className="mt-6 flex items-center gap-2 text-sm text-emerald-700"><FiCheck /> In stock — {color.stock} available</div>}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border">
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="px-4 py-2 text-sm">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button onClick={handleAdd} className="btn-gold flex-1 py-3 rounded-full font-medium">Add to Bag</button>
            <button onClick={() => wish.toggle(product.id)} className={`h-12 w-12 rounded-full grid place-items-center border ${wish.has(product.id) ? "bg-accent border-accent" : ""}`}><FiHeart /></button>
            <button className="h-12 w-12 rounded-full grid place-items-center border"><FiShare2 /></button>
          </div>

          <div className="mt-8 rounded-xl bg-secondary p-4 text-xs space-y-1 text-muted-foreground">
            {product.sku && <p><strong className="text-foreground">SKU:</strong> {product.sku}</p>}
            {product.material && <p><strong className="text-foreground">Material:</strong> {product.material}</p>}
            {product.gender && <p><strong className="text-foreground">Gender:</strong> {product.gender}</p>}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
