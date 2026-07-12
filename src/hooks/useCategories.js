import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCategories((items) => {
      setCategories(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    categories,
    loading,

    // alias for compatibility with older components
    items: categories,
  };
}