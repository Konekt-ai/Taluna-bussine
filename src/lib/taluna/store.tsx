import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Almacén ligero de favoritos + carrito (localStorage).
// Portado de store.js — cada item lleva stripePriceId / productId listos para Stripe.

export type StoreItem = {
  id: string;
  type: "bag" | "strap" | "combo";
  kind: string;
  name: string;
  price: number;
  qty?: number;
  stripePriceId?: string;
  productId?: string;
  meta?: Record<string, unknown>;
};

const FAV_KEY = "taluna_favs_v1";
const CART_KEY = "taluna_cart_v1";
export const WA_PHONE = "5215555555555";

function read(key: string): StoreItem[] {
  if (typeof window === "undefined") return [];
  try {
    return (JSON.parse(window.localStorage.getItem(key) || "[]") as StoreItem[]) || [];
  } catch {
    return [];
  }
}
function write(key: string, val: StoreItem[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* noop */
  }
}

export const fmt = (n: number) => "$" + (n || 0).toLocaleString("es-MX");
export const waLink = (text: string) =>
  "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(text);

type StoreCtx = {
  favs: StoreItem[];
  cart: StoreItem[];
  isFav: (id: string) => boolean;
  toggleFav: (item: StoreItem) => void;
  removeFav: (id: string) => void;
  addToCart: (item: StoreItem) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
  cartTotal: number;
};

const Ctx = createContext<StoreCtx | null>(null);

export function TalunaStoreProvider({ children }: { children: ReactNode }) {
  const [favs, setFavs] = useState<StoreItem[]>([]);
  const [cart, setCart] = useState<StoreItem[]>([]);

  useEffect(() => {
    setFavs(read(FAV_KEY));
    setCart(read(CART_KEY));
  }, []);

  const isFav = useCallback((id: string) => favs.some((f) => f.id === id), [favs]);

  const toggleFav = useCallback((item: StoreItem) => {
    setFavs((prev) => {
      const i = prev.findIndex((f) => f.id === item.id);
      const next = i >= 0 ? prev.filter((f) => f.id !== item.id) : [item, ...prev];
      write(FAV_KEY, next);
      return next;
    });
  }, []);

  const removeFav = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.filter((f) => f.id !== id);
      write(FAV_KEY, next);
      return next;
    });
  }, []);

  const addToCart = useCallback((item: StoreItem) => {
    setCart((prev) => {
      const i = prev.findIndex((c) => c.id === item.id);
      let next: StoreItem[];
      if (i >= 0) {
        next = prev.map((c, idx) =>
          idx === i ? { ...c, qty: (c.qty || 1) + (item.qty || 1) } : c,
        );
      } else {
        next = [{ qty: 1, ...item }, ...prev];
      }
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = prev.filter((c) => c.id !== id);
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      favs,
      cart,
      isFav,
      toggleFav,
      removeFav,
      addToCart,
      removeFromCart,
      cartCount: cart.reduce((n, c) => n + (c.qty || 1), 0),
      cartTotal: cart.reduce((n, c) => n + (c.price || 0) * (c.qty || 1), 0),
    }),
    [favs, cart, isFav, toggleFav, removeFav, addToCart, removeFromCart],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTalunaStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTalunaStore debe usarse dentro de TalunaStoreProvider");
  return ctx;
}
