import {
  createContext, useContext,  useEffect,  useMemo,  useState,  useCallback,} from "react";
import Swal from "sweetalert2";
import {  doc,  getDoc,} from "firebase/firestore";
import {  onAuthStateChanged,} from "firebase/auth";
import { db } from "../firebase/firestore";
import {  loginUser,  registerUser,  logoutUser,} from "../services/authService";
import { auth } from "../firebase/auth";
import { phoneToEmail } from "../utils/phone";

/* ==========================================================
   AUTH
========================================================== */

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {

        if (!firebaseUser) {

          setUser(null);

          setLoading(false);

          return;
        }

        const snap = await getDoc(
          doc(db, "users", firebaseUser.uid)
        );

        if (snap.exists()) {

          setUser({
            uid: firebaseUser.uid,
            ...snap.data(),
          });

        } else {

          setUser(null);

        }

        setLoading(false);

      }
    );

    return unsubscribe;

  }, []);

  const login = useCallback(async (phone, password) => {

    const user = await loginUser(phone, password);

    setUser(user);

    return user;

  }, []);

  const register = useCallback(async (payload) => {

    const user = await registerUser(payload);

    setUser(user);

    return user;

  }, []);

  const logout = useCallback(async () => {

    await logoutUser();

    setUser(null);

  }, []);

  const value = useMemo(() => ({

    user,

    loading,

    login,

    register,

    logout,

    isAuthenticated: !!user,

    role: user?.role || "customer",

    isAdmin: user?.role === "admin",

    isCustomer: user?.role !== "admin",

  }), [

    user,

    loading,

    login,

    register,

    logout,

  ]);

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>
  );
}

/* ==========================================================
   CART
========================================================== */

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mn_cart");

      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mn_cart",
      JSON.stringify(items)
    );
  }, [items]);

  const add = useCallback(
    (
      product,
      {
        color,
        size,
        quantity = 1,
      }
    ) => {
      setItems((prev) => {
        const key = `${product.id}::${color?.name || ""}::${
          size?.label || ""
        }`;

        const existing = prev.find(
          (i) => i.key === key
        );

        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            key,

            productId: product.id,

            name: product.name,

            image:
              color?.images?.[0] ||
              product.images?.[0] ||
              product.image ||
              "/placeholder.png",

            price: product.price,

            discount:
              product.discount || 0,

            color: color
              ? {
                  name: color.name,
                  hex: color.hex,
                }
              : null,

            size: size
              ? {
                  label: size.label,
                }
              : null,

            quantity,
          },
        ];
      });

      setOpen(true);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Added to bag",
        timer: 1400,
        showConfirmButton: false,
      });
    },
    []
  );

  const remove = useCallback((key) => {
    setItems((prev) =>
      prev.filter((i) => i.key !== key)
    );
  }, []);

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key
          ? {
              ...i,
              quantity: Math.max(1, qty),
            }
          : i
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Math.round(
        item.price *
          (1 - item.discount / 100)
      ) *
        item.quantity,
    0
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      items,

      open,

      setOpen,

      add,

      remove,

      setQty,

      clear,

      subtotal,

      count,
    }),
    [
      items,
      open,
      add,
      remove,
      setQty,
      clear,
      subtotal,
      count,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* ==========================================================
   WISHLIST
========================================================== */

const WishlistContext = createContext(null);

export const useWishlist = () =>
  useContext(WishlistContext);

function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(
        "mn_wish"
      );

      if (raw) {
        setIds(JSON.parse(raw));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mn_wish",
      JSON.stringify(ids)
    );
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }, []);

  const has = useCallback(
    (id) => ids.includes(id),
    [ids]
  );

  const value = useMemo(
    () => ({
      ids,

      toggle,

      has,

      count: ids.length,
    }),
    [ids, toggle, has]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/* ==========================================================
   APP PROVIDERS
========================================================== */

export function AppProviders({
  children,
}) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}