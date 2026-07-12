import { useEffect, useState } from "react";
import { subscribeUserOrders } from "../services/orderService";

export function useUserOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return {
    orders,
    loading,
  };
}