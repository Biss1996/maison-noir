import { formatKES, priceAfterDiscount } from "../../../services/productService";

export default function ProductTable({
  products,
  loading,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4">Image</th>
            <th className="p-4">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Discount</th>
            <th className="p-4">Final Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-4">
                <img
                  src={
                    product.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover border"
                />
              </td>

              <td className="p-4 font-medium">
                {product.name}
              </td>

              <td className="p-4">
                {formatKES(product.price)}
              </td>

              <td className="p-4">
                {product.discount || 0}%
              </td>

              <td className="p-4 font-semibold text-green-600">
                {formatKES(priceAfterDiscount(product))}
              </td>

              <td className="p-4">
                {product.stock || 0}
              </td>

              <td className="p-4">
                {product.active !== false ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                    Hidden
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}