'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'taluna-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar el carrito guardado al montar (solo en el navegador).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignorar localStorage no disponible */
    }
    setLoaded(true);
  }, []);

  // Persistir cada cambio.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignorar */
    }
  }, [items, loaded]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: Number(product.price) || 0,
          currency: product.currency || 'MXN',
          image: product.images?.[0]?.url || null,
          qty,
        },
      ];
    });
  }

  function removeItem(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function updateQty(slug, qty) {
    setItems((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.floor(qty) || 1) } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, count, subtotal, loaded }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
