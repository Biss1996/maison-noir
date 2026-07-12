import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const COLLECTION = "Users";

/* ==========================
   Get All Admins
========================== */

export async function getAdmins() {
  const q = query(
    collection(db, COLLECTION),
    where("role", "==", "admin")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ==========================
   Get Admin
========================== */

export async function getAdmin(id) {
  const snap = await getDoc(
    doc(db, COLLECTION, id)
  );

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}

/* ==========================
   Create Admin
========================== */

export async function createAdmin(data) {
  const ref = await addDoc(
    collection(db, COLLECTION),
    {
      ...data,
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
    }
  );

  return ref.id;
}

/* ==========================
   Update Admin
========================== */

export async function updateAdmin(id, data) {
  await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
}

/* ==========================
   Activate / Deactivate
========================== */

export async function setAdminStatus(
  id,
  active
) {
  await updateDoc(
    doc(db, COLLECTION, id),
    {
      active,
      updatedAt: serverTimestamp(),
    }
  );
}

/* ==========================
   Delete Admin
========================== */

export async function deleteAdmin(id) {
  await deleteDoc(
    doc(db, COLLECTION, id)
  );
}