import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";
import { getStorage } from "firebase/storage";


export const db = getFirestore(app);
export const storage = getStorage(app);