import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firestore";

const COLLECTION = "orders";

/* ===========================================
   CREATE ORDER
=========================================== */

export async function createOrder(order) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...order,
    status: order.status || "Pending",
    paymentStatus: order.paymentStatus || "Pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

/* ===========================================
   GET SINGLE ORDER
=========================================== */

export async function getOrder(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));

  if (!snap.exists()) {
    throw new Error("Order not found");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}

/* ===========================================
   UPDATE ORDER
=========================================== */

export async function updateOrder(id, data) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/* ===========================================
   UPDATE STATUS
=========================================== */

export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/* ===========================================
   DELETE ORDER
=========================================== */

export async function deleteOrder(id) {
  return updateDoc(doc(db, COLLECTION, id), {
    deleted: true,
    updatedAt: serverTimestamp(),
  });
}

/* ===========================================
   REALTIME ORDERS
=========================================== */

export function getOrders(callback) {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      orders.sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() || 0) -
          (a.createdAt?.toMillis?.() || 0)
      );

      callback(orders);
    },
    console.error
  );
}

/* ===========================================
   CUSTOMER ORDERS (Realtime)
=========================================== */

export function getOrdersByUser(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      orders.sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() || 0) -
          (a.createdAt?.toMillis?.() || 0)
      );

      callback(orders);
    },
    console.error
  );
}

/* ===========================================
   SELLER ORDERS (Realtime)
=========================================== */

export function getOrdersBySeller(sellerId, callback) {
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
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      orders.sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() || 0) -
          (a.createdAt?.toMillis?.() || 0)
      );

      callback(orders);
    },
    console.error
  );
}



/* ===========================================
   DASHBOARD HELPERS
=========================================== */

export function countPendingOrders(orders) {
  return orders.filter((o) => o.status === "Pending").length;
}

export function countCompletedOrders(orders) {
  return orders.filter((o) => o.status === "Completed").length;
}

export function calculateRevenue(orders) {
  return orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
}

export function countTodayOrders(orders) {
  const today = new Date().toDateString();

  return orders.filter((order) => {
    if (!order.createdAt?.toDate) return false;

    return order.createdAt.toDate().toDateString() === today;
  }).length;
}
export function subscribeUserOrders(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
  collection(db, "orders"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
);
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
}