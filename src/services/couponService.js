import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const COLLECTION = "coupons";
const couponsRef = collection(db, COLLECTION);

/* -------------------------
   Realtime Coupons
------------------------- */

export function getCoupons(callback) {
  const q = query(couponsRef, orderBy("createdAt", "desc"));

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
      console.error("Coupons listener:", error);
      callback([]);
    }
  );
}



/* -------------------------
   Single Coupon
------------------------- */

export async function getCoupon(id) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));

  if (!snapshot.exists()) {
    throw new Error("Coupon not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/* -------------------------
   Add Coupon
------------------------- */

export async function addCoupon(coupon) {
  return addDoc(couponsRef, {
    ...coupon,

    code: String(coupon.code || "")
      .trim()
      .toUpperCase(),

    type: coupon.type || "percent",

    value: Number(coupon.value) || 0,

    minSubtotal:
      Number(coupon.minSubtotal) || 0,

    active:
      coupon.active === undefined
        ? true
        : coupon.active,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });
}

/* ==========================================
   SELLER COUPONS
========================================== */

export function getSellerCoupons(sellerId, callback) {
  if (!sellerId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION),
    where("sellerId", "==", sellerId)
  );

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
    console.error
  );
}
/* -------------------------
   Update Coupon
------------------------- */

export async function updateCoupon(id, data) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,

    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Delete Coupon
------------------------- */

export async function deleteCoupon(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

/* -------------------------
   Lookup by Code
------------------------- */

export async function findCoupon(code) {
  if (!code) return null;

  const q = query(
    couponsRef,
    where(
      "code",
      "==",
      String(code).trim().toUpperCase()
    )
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const coupon = {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };

  if (coupon.active === false) return null;

  if (
    coupon.expiresAt &&
    coupon.expiresAt.toDate &&
    coupon.expiresAt.toDate() < new Date()
  ) {
    return null;
  }

  return coupon;
}

/* -------------------------
   Discount Calculator
------------------------- */

export function applyCoupon(
  subtotal,
  coupon
) {
  if (!coupon) return 0;

  if (
    coupon.minSubtotal &&
    subtotal < coupon.minSubtotal
  ) {
    return 0;
  }

  if (coupon.type === "fixed") {
    return Math.min(
      subtotal,
      Number(coupon.value) || 0
    );
  }

  return Math.round(
    subtotal *
      ((Number(coupon.value) || 0) / 100)
  );
}