'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// =====================================================================
//  BOLSA (carrito) + FAVORITOS
//  Los dos viven en el navegador de la clienta (localStorage), igual que
//  en el diseño. El carrito acepta piezas del catálogo y también
//  "combinaciones" armadas en Arma tu Taluna (bolsa + strap + largo).
// =====================================================================

const CartContext = createContext(null);
const STORAGE_KEY = 'taluna-cart';
const FAVS_KEY = 'taluna-favs';

function leer(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardar(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignorar localStorage no disponible */
  }
}

// Convierte un producto del catálogo en una línea de carrito/favoritos.
function desdeProducto(product, qty = 1) {
  return {
    id: product.slug,
    slug: product.slug,
    kind: product.category_name || 'Pieza',
    name: product.name,
    price: Number(product.price) || 0,
    currency: product.currency || 'MXN',
    image: product.images?.[0]?.url || null,
    qty,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [favs, setFavs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // 'cart' | 'favs' | null — qué cajón está abierto
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    setItems(leer(STORAGE_KEY));
    setFavs(leer(FAVS_KEY));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) guardar(STORAGE_KEY, items);
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) guardar(FAVS_KEY, favs);
  }, [favs, loaded]);

  // Bloquea el fondo mientras un cajón está abierto.
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  /* ------------------------- carrito ------------------------- */

  // Acepta un producto del catálogo o una línea ya armada (combinación).
  const addItem = useCallback((entrada, qty = 1) => {
    const linea = entrada?.slug && entrada?.images !== undefined ? desdeProducto(entrada, qty) : { qty, ...entrada };
    if (!linea.id) linea.id = linea.slug;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === linea.id);
      if (i >= 0) {
        return prev.map((x, idx) => (idx === i ? { ...x, qty: (x.qty || 1) + (linea.qty || 1) } : x));
      }
      return [...prev, linea];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.floor(qty) || 1) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  /* ------------------------ favoritos ------------------------ */

  const isFav = useCallback((id) => favs.some((f) => f.id === id), [favs]);

  const toggleFav = useCallback((entrada) => {
    const linea = entrada?.slug && entrada?.images !== undefined ? desdeProducto(entrada) : entrada;
    if (!linea.id) linea.id = linea.slug;
    setFavs((prev) => {
      const existe = prev.some((f) => f.id === linea.id);
      return existe ? prev.filter((f) => f.id !== linea.id) : [linea, ...prev];
    });
  }, []);

  const removeFav = useCallback((id) => {
    setFavs((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const count = items.reduce((n, i) => n + (i.qty || 1), 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);

  const value = useMemo(
    () => ({
      items,
      favs,
      addItem,
      removeItem,
      updateQty,
      clear,
      isFav,
      toggleFav,
      removeFav,
      count,
      favCount: favs.length,
      subtotal,
      loaded,
      drawer,
      openDrawer: setDrawer,
      closeDrawer: () => setDrawer(null),
    }),
    [items, favs, addItem, removeItem, updateQty, clear, isFav, toggleFav, removeFav, count, subtotal, loaded, drawer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
