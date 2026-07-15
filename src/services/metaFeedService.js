import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firestore";

export async function exportMetaCSV() {
  const snapshot = await getDocs(collection(db, "Products"));

  const rows = [];

  rows.push([
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "sale_price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
    "color",
    "size",
    "gender",
    "material",
  ]);

  snapshot.forEach((doc) => {
    const p = doc.data();

    const colors = Array.isArray(p.colors) ? p.colors : [null];
    const sizes = Array.isArray(p.sizes) ? p.sizes : [null];

    colors.forEach((color) => {
      sizes.forEach((size) => {
        const image =
          color?.images?.[0] ||
          p.images?.[0] ||
          p.image ||
          "";

        rows.push([
          doc.id,
          p.name || "",
          p.description || "",
          (p.stock || 0) > 0 ? "in stock" : "out of stock",
          "new",
          `${p.price || 0} KES`,
          p.discount
            ? `${Math.round(
                p.price * (1 - p.discount / 100)
              )} KES`
            : "",
          `https://maisonnoir.ke/product/${doc.id}`,
          image,
          p.brand || "Maison Noir",
          "Apparel & Accessories",
          typeof color === "string"
            ? color
            : color?.name || "",
          size?.label || "",
          p.gender || "Unisex",
          p.material || "",
        ]);
      });
    });
  });

  const csv = rows
    .map((row) =>
      row
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "maison-noir-meta-feed.csv";

  a.click();

  URL.revokeObjectURL(url);
}