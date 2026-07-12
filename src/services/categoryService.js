import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const categoriesRef = collection(db, "categories");

/* -------------------------
   Helpers
------------------------- */

export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* -------------------------
   Realtime Categories
------------------------- */

export function getCategories(callback) {
  const q = query(categoriesRef, orderBy("name"));

  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    },
    (error) => {
      console.error("Categories listener:", error);
      callback([]);
    }
  );
}

/* -------------------------
   Single Category
------------------------- */

export async function getCategory(id) {
  const snapshot = await getDoc(doc(db, "categories", id));

  if (!snapshot.exists()) {
    throw new Error("Category not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/* -------------------------
   Add Category
------------------------- */

export async function addCategory(category) {
  return addDoc(categoriesRef, {
    ...category,

    slug: category.slug || slugify(category.name),

    active:
      category.active === undefined
        ? true
        : category.active,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Update Category
------------------------- */

export async function updateCategory(id, data) {
  return updateDoc(doc(db, "categories", id), {
    ...data,

    slug:
      data.slug ||
      slugify(data.name || ""),

    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Delete Category
------------------------- */

export async function deleteCategory(id) {
  return deleteDoc(doc(db, "categories", id));
}