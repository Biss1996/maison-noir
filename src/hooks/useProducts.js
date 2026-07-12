import { useEffect, useMemo, useState } from "react";

import {
  getProducts,
  getProduct,
} from "../services/productService";

/* =========================================
   ALL PRODUCTS
========================================= */

export function useProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getProducts((products) => {
      setItems(products);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    items,
    loading,
  };
}

/* =========================================
   SINGLE PRODUCT
========================================= */

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getProduct(id)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  return {
    product,
    loading,
  };
}

/* =========================================
   FEATURED PRODUCTS
========================================= */

export function useFeaturedProducts() {
  const { items, loading } = useProducts();

  const products = useMemo(
    () => items.filter((p) => p.featured),
    [items]
  );

  return {
    items: products,
    loading,
  };
}

/* =========================================
   NEW ARRIVALS
========================================= */

export function useNewArrivals() {
  const { items, loading } = useProducts();

  const products = useMemo(
    () => items.filter((p) => p.newArrival),
    [items]
  );

  return {
    items: products,
    loading,
  };
}

/* =========================================
   TRENDING
========================================= */

export function useTrendingProducts() {
  const { items, loading } = useProducts();

  const products = useMemo(
    () => items.filter((p) => p.trending),
    [items]
  );

  return {
    items: products,
    loading,
  };
}