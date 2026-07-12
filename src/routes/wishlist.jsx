import { createFileRoute, Link } from "@tanstack/react-router";
import ProductCard from "../components/ui/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts";import { useWishlist } from "../context/AppProviders.jsx";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const { ids } = useWishlist();
  const { items: all } = useProducts();
  const items = all.filter((p) => ids.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No items saved yet.</p>
          <Link to="/shop" className="btn-gold inline-block mt-4 px-6 py-2.5 rounded-full">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
