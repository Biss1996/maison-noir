// Firestore-based notifications for sellers.
import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db, firebaseReady } from "../firebase/config.jsx";
const COL = "notifications";
export async function pushNotification({ sellerId, type = "info", title, body, orderId = null }) {
  if (!firebaseReady || !sellerId) return;
  try {
    await addDoc(collection(db, COL), {
      sellerId, type, title, body, orderId,
      read: false, createdAt: serverTimestamp(),
    });
  } catch (_) { /* non-blocking */ }
}
export async function markRead(id) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, COL, id), { read: true });
}
export function useSellerNotifications(sellerId) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!firebaseReady || !sellerId) return;
    const q = query(collection(db, COL), where("sellerId", "==", sellerId), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    return () => unsub();
  }, [sellerId]);
  return items;
}
