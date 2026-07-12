import { useEffect, useState } from "react";
import {
  getOrders,
  getOrdersByUser,
  getOrdersBySeller,
} from "../services/orderService";

/* ===========================
   All Orders
=========================== */

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getOrders((items) => {
      setOrders(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { orders, loading };
}

/* ===========================
   Customer Orders
=========================== */

export function useUserOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = getOrdersByUser(userId, (items) => {
      setOrders(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { orders, loading };
}

/* ===========================
   Seller Orders
=========================== */

export function useSellerOrders(sellerId) {
  const [orders, setOrders] =useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getOrdersBySeller(sellerId, (items) => {
      setOrders(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [sellerId]);

  return { orders, loading };
}