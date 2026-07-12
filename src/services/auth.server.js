
// import jwt from "jsonwebtoken";
// import { initializeApp, getApps } from "firebase/app";
// import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

// const cfg = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY,
//   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VITE_FIREBASE_APP_ID,
// };

// let _db = null;
// export function getDb() {
//   if (_db) return _db;
//   if (!cfg.apiKey || !cfg.projectId) throw new Error("Firebase env vars are not configured. Add VITE_FIREBASE_* to your env.");
//   const app = getApps().length ? getApps()[0] : initializeApp(cfg);
//   _db = getFirestore(app);
//   return _db;
// }

// // Accept 07XXXXXXXX or +2547XXXXXXXX; normalize to +254...
// export function normalizePhone(raw) {
//   if (!raw) return null;
//   const p = String(raw).replace(/\s+/g, "");
//   if (/^\+254\d{9}$/.test(p)) return p;
//   if (/^254\d{9}$/.test(p)) return "+" + p;
//   if (/^0\d{9}$/.test(p)) return "+254" + p.slice(1);
//   return null;
// }

// export async function findUserByPhone(phone) {
//   const db = getDb();
//   const q = query(collection(db, "users"), where("phone", "==", phone));
//   const snap = await getDocs(q);
//   if (snap.empty) return null;
//   const d = snap.docs[0];
//   return { id: d.id, ...d.data() };
// }

// export async function createUser({ fullName, phone, password }) {
//   const db = getDb();
//   const existing = await findUserByPhone(phone);
//   if (existing) throw new Error("Phone number already registered");
//   const passwordHash = await bcrypt.hash(password, 10);
//   const id = crypto.randomUUID();
//   const user = { fullName, phone, passwordHash, role: "customer", createdAt: Date.now() };
//   await setDoc(doc(db, "users", id), user);
//   return { id, ...user };
// }

// export async function verifyPassword(user, password) {
//   return bcrypt.compare(password, user.passwordHash || "");
// }

// export function issueToken(user) {
//   const secret = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
//   return jwt.sign({ sub: user.id, phone: user.phone, role: user.role }, secret, { expiresIn: "7d" });
// }

// export function sanitize(user) {
//   const { passwordHash, ...safe } = user;
//   return safe;
// }

// return { id: d.id, ...d.data() };
// }
// export async function createUser({ fullName, phone, password }) {
// export async function createUser({ fullName, phone, password, whatsapp = "", role = "customer", displayName = "" }) {
//   const db = getDb();
//   const existing = await findUserByPhone(phone);
//   if (existing) throw new Error("Phone number already registered");
//   const passwordHash = await bcrypt.hash(password, 10);
//   const id = crypto.randomUUID();
//   const user = { fullName, phone, passwordHash, role: "customer", createdAt: Date.now() };
//   const user = {
//     fullName, phone, passwordHash,
//     role: role === "admin" ? "admin" : "customer",
//     displayName: displayName || fullName,
//     whatsapp: whatsapp || phone,
//     createdAt: Date.now(),
//   };
//   await setDoc(doc(db, "users", id), user);
//   return { id, ...user };
// }