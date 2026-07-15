import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../firebase/firestore";

/* ----------------------------------
   Store Settings Document
----------------------------------- */

const SETTINGS_REF = doc(
  db,
  "settings",
  "store"
);

/* ----------------------------------
   Default Settings
----------------------------------- */

export const DEFAULT_SETTINGS = {
  storeName: "Maison Noir",
  tagline: "Luxury, curated.",

  logoUrl: "",
  bannerUrl: "",

  phone: "+254757497007",
  whatsapp: "254727783444",
  email: "hello@maisonnoir.co.ke",

  facebook: "https://www.facebook.com/profile.php?id=100087398916255",
  instagram: "https://www.instagram.com/maisonnoirke/",

  deliveryFee: 300,
  freeDeliveryOver: 5000,

  currency: "KES",
};

/* ----------------------------------
   Realtime Settings
----------------------------------- */

export function getSettings(callback) {
  return onSnapshot(
    SETTINGS_REF,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({
          ...DEFAULT_SETTINGS,
          ...snapshot.data(),
        });
      } else {
        callback(DEFAULT_SETTINGS);
      }
    },
    console.error
  );
}

/* ----------------------------------
   React Hook
----------------------------------- */

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getSettings((data) => {
      setSettings(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    settings,
    loading,
  };
}
/* ----------------------------------
   Save Settings
----------------------------------- */

export async function saveSettings(data) {
  await setDoc(
    SETTINGS_REF,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}