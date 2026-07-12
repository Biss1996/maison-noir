import { useEffect, useState } from "react";

import {
  getCoupons,
  getSellerCoupons,
} from "../services/couponService";

/* =========================================
   All Coupons
========================================= */

export function useCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCoupons((data) => {
      setCoupons(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    coupons,
    loading,
  };
}

/* =========================================
   Seller Coupons
========================================= */

export function useSellerCoupons(sellerId) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setCoupons([]);
      setLoading(false);
      return;
    }

    const unsubscribe = getSellerCoupons(
      sellerId,
      (data) => {
        setCoupons(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [sellerId]);

  return {
    coupons,
    loading,
  };
}