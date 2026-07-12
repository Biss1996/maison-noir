import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ImageUploader from "../uploads/ImageUploader";

const emptyProduct = {
  name: "",
  brand: "",
  category: "",
  description: "",
  price: 0,
  discount: 0,
  stock: 0,
  featured: false,
  trending: false,
  newArrival: false,
  instock: true,
  images: [""],
  colors: [],
  sizes: [],
};

const availableColors = [
  "Black", "White", "Grey", "Brown", "Blue",
  "Green", "Red", "Yellow", "Pink", "Purple",
];

const availableSizes = [
  "XS", "S", "M", "L", "XL", "XXL", "XXXL",
];

export default function ProductForm({
  initialData,
  categories = [],
  onSubmit,
  loading = false,
}) {
  const [product, setProduct] = useState(emptyProduct);

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...emptyProduct,
        ...initialData,
      });
    } else {
      setProduct(emptyProduct);
    }
  }, [initialData]);

  const update = (key, value) => {
    setProduct((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayValue = (field, value) => {
    setProduct((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  };

  const save = (e) => {
    e.preventDefault();
    if (!product.name.trim()) {
      return Swal.fire("Error", "Product name is required.", "error");
    }
    if (!product.category) {
      return Swal.fire("Error", "Select a category.", "error");
    }
    if (product.price <= 0) {
      return Swal.fire("Error", "Enter a valid price.", "error");
    }
    onSubmit({
      ...product,
      images: product.images.filter(Boolean),
    });
  };

  return (
    <div className="h-[calc(100vh-2rem)] overflow-y-auto pr-2">
      <form onSubmit={save} className="space-y-4 p-2 sm:p-4">
        {/* Main Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            placeholder="Brand"
            value={product.brand}
            onChange={(e) => update("brand", e.target.value)}
          />

          <select
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            value={product.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            placeholder="Price"
            value={product.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            placeholder="Discount (%)"
            value={product.discount}
            onChange={(e) => update("discount", Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
          />
        </div>

        <textarea
          rows={4}
          className="w-full border rounded-lg p-3 text-sm resize-none"
          placeholder="Product Description"
          value={product.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div>
          <h3 className="font-semibold mb-2 text-sm">Product Images</h3>
          <ImageUploader
            value={product.images}
            onChange={(images) => update("images", images)}
            enableUpload={false}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm">Available Colors</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleArrayValue("colors", color)}
                className={`rounded-full px-3 py-1.5 text-xs border transition-all ${
                  product.colors.includes(color)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm">Available Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleArrayValue("sizes", size)}
                className={`rounded-full px-3 py-1.5 text-xs border transition-all ${
                  product.sizes.includes(size)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "featured", label: "Featured Product" },
            { key: "trending", label: "Trending" },
            { key: "newArrival", label: "New Arrival" },
            { key: "instock", label: "In Stock" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={product[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-4 h-4"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          disabled={loading}
          className="btn-gold w-full rounded-full py-2.5 text-sm disabled:opacity-60 sticky bottom-0 z-10"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}