import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "hongcha_cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sameLine(item, productId, size) {
  return item.productId === productId && item.size === size;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1, size = null) => {
    setItems((prev) => {
      const existing = prev.find((item) => sameLine(item, product.id, size));
      if (existing) {
        return prev.map((item) =>
          sameLine(item, product.id, size) ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.title,
          price: product.price,
          size,
          qty,
          imagePlaceholder: product.imagePlaceholder,
          imageUrl: product.imageUrl,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((productId, size, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        sameLine(item, productId, size) ? { ...item, qty: Math.max(item.qty + delta, 1) } : item
      )
    );
  }, []);

  const removeItem = useCallback((productId, size) => {
    setItems((prev) => prev.filter((item) => !sameLine(item, productId, size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
