import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {  doc,  getDoc,  setDoc,} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

function phoneToEmail(phone) {
  return `${phone.replace(/\D/g, "")}@maisonnoir.ke`;
}

export async function registerUser({
  fullName,
  phone,
  password,
}) {
  const email = phoneToEmail(phone);

  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    fullName,
    phone,
    email,
    role: "customer",
    createdAt: Date.now(),
  });

  return getCurrentUser(cred.user.uid);
}

export async function loginUser(phone, password) {
  const email = phoneToEmail(phone);

  const cred = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return getCurrentUser(cred.user.uid);
}

export async function getCurrentUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));

  return {
    uid,
    ...snap.data(),
  };
}

export function logoutUser() { 
    return signOut(auth);
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}