import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  increment,
  writeBatch,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const COLLECTION = "Products";
const productsRef = collection(db, COLLECTION);

/* ===========================================
   REALTIME PRODUCTS
=========================================== */

export function getProducts(callback) {
  const q = query(productsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(products);
    },
    (error) => {
      console.error("Products listener:", error);
      callback([]);
    }
  );
}

/* ===========================================
   GET SINGLE PRODUCT
=========================================== */

export async function getProduct(id) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/* ===========================================
   CREATE PRODUCT
=========================================== */

export async function createProduct(product) {
  const ref = await addDoc(productsRef, {
    ...product,
    active: product.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

// Backwards compatibility
export const addProduct = createProduct;

/* ===========================================
   UPDATE PRODUCT
=========================================== */

export async function updateProduct(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/* ===========================================
   DELETE PRODUCT
=========================================== */

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ===========================================
   DECREMENT INVENTORY
=========================================== */

export async function decrementInventory(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const batch = writeBatch(db);

  items.forEach((item) => {
    const productId = item.productId || item.id;

    if (!productId) return;

    batch.update(doc(db, COLLECTION, productId), {
      stock: increment(-(item.quantity || 1)),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

/* ===========================================
   HELPERS
=========================================== */

export function getFeaturedProducts(products = []) {
  return products.filter((p) => p.featured);
}

export function getTrendingProducts(products = []) {
  return products.filter((p) => p.trending);
}

export function getNewArrivals(products = []) {
  return products.filter((p) => p.newArrival);
}

export function formatKES(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function priceAfterDiscount(product) {
  const price = Number(product?.price) || 0;
  const discount = Number(product?.discount) || 0;

  return Math.round(price * (1 - discount / 100));
}