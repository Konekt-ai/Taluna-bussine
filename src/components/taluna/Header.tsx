import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useTalunaStore } from "@/lib/taluna/store";
import { NAV_LINKS } from "@/lib/taluna/data";
import { ASSETS } from "@/lib/taluna/assets";

import { Scrim, FavsDrawer, CartDrawer } from "./Drawers";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export type Overlay = "menu" | "favs" | "cart" | null;

export function useOverlay() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay]);
  return { overlay, setOverlay };
}

export function Overlays({ overlay, close }: { overlay: Overlay; close: () => void }) {
  return (
    <>
      {overlay && <Scrim onClick={close} />}
      {overlay === "menu" && <MenuDrawer onClose={close} />}
      {overlay === "favs" && <FavsDrawer onClose={close} />}
      {overlay === "cart" && <CartDrawer onClose={close} />}
    </>
  );
}

function MenuDrawer({ onClose }: { onClose: () => void }) {
  const links = [
    ...NAV_LINKS,
    { label: "Historia", to: "", color: "#211E1A" },
    { label: "Contacto", to: "", color: "#211E1A" },
    { label: "Instagram", to: "", color: "#211E1A" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 60,
        width: "84%",
        maxWidth: 404,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        animation: "tlSlideIn 0.28s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: "30px 0 60px -30px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: "1px solid #EFE7DC" }}>
        <img src={ASSETS.logoDark} alt="Taluna MX" style={{ height: 18, width: "auto", display: "block" }} />
        <button onClick={onClose} aria-label="Cerrar" style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "22px 24px 30px" }}>
        {links.map((link) => {
          const inner = (
            <>
              {link.label}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9BFAF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </>
          );
          const style: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 0",
            borderBottom: "1px solid #F1EAE0",
            fontFamily: FF,
            fontWeight: 300,
            fontSize: 22,
            letterSpacing: "0.01em",
            color: link.color,
          };
          return link.to ? (
            <Link key={link.label} to={link.to} onClick={onClose} style={style}>
              {inner}
            </Link>
          ) : (
            <span key={link.label} style={style}>
              {inner}
            </span>
          );
        })}
        <div style={{ display: "flex", gap: 18, marginTop: 28, fontFamily: FF, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8178" }}>
          <span>Instagram</span>
          <span>WhatsApp</span>
        </div>
      </nav>
    </div>
  );
}

/** Header sólido (categoría / producto) */
export function SolidHeader({
  title,
  back,
  onFavs,
  onCart,
  announcement,
  right,
}: {
  title?: string;
  back?: string;
  onFavs?: () => void;
  onCart?: () => void;
  announcement?: boolean;
  right?: ReactNode;
}) {
  const { favs, cartCount } = useTalunaStore();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: scrolled
          ? "linear-gradient(180deg, rgba(239,234,225,0.72) 0%, rgba(239,234,225,0.52) 100%)"
          : "#EFEAE1",
        backdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.5)" : "1px solid #E7DDCD",
        boxShadow: scrolled ? "0 8px 30px -18px rgba(33,30,26,0.4)" : "none",
        transition: "background 0.3s ease-out, box-shadow 0.3s ease-out",
      }}
    >
      {announcement && (
        <div
          style={{
            background: scrolled ? "rgba(228,218,203,0.5)" : "#E4DACB",
            textAlign: "center",
            padding: "7px 12px",
            fontFamily: FF,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6E665C",
          }}
        >
          Envíos a todo México · Hecho en México
        </div>
      )}

      <div style={{ height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 14px" }}>
        <Link to={back || "/"} aria-label="Volver" style={{ justifySelf: "start", padding: 8, color: "#211E1A", display: "inline-flex" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 5 8 12 15 19" />
          </svg>
        </Link>
        {title ? (
          <span
            style={{
              justifySelf: "center",
              fontFamily: FF,
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#211E1A",
            }}
          >
            {title}
          </span>
        ) : (
          <Link to="/" aria-label="Taluna MX — inicio" style={{ justifySelf: "center", display: "inline-flex", alignItems: "center" }}>
            <img src={ASSETS.logoDark} alt="Taluna MX" style={{ height: 40, width: "auto", display: "block" }} />
          </Link>

        )}
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 2 }}>
          {right}
          {onFavs && (
            <button onClick={onFavs} aria-label="Favoritos" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
              </svg>
              {favs.length > 0 && <Badge value={favs.length} bg="#9A6A4B" />}
            </button>
          )}
          {onCart && (
            <button onClick={onCart} aria-label="Carrito" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && <Badge value={cartCount} bg="#211E1A" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Header de colección: fijo, transparente sobre el hero, glass al hacer scroll */
export function CollectionHeader({
  title,
  back,
  onFavs,
  onCart,
  overHero,
}: {
  title: string;
  back?: string;
  onFavs?: () => void;
  onCart?: () => void;
  overHero?: boolean;
}) {
  const { favs, cartCount } = useTalunaStore();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = Boolean(overHero) && !scrolled;
  const fg = light ? "#FFFFFF" : "#211E1A";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        margin: "0 auto",
        maxWidth: 480,
        background: scrolled
          ? "linear-gradient(180deg, rgba(239,234,225,0.78) 0%, rgba(239,234,225,0.58) 100%)"
          : overHero
            ? "transparent"
            : "#EFEAE1",
        backdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 30px -18px rgba(33,30,26,0.4)" : "none",
        transition: "background 0.35s ease-out, box-shadow 0.35s ease-out, border-color 0.35s ease-out",
      }}
    >
      <div
        style={{
          maxHeight: scrolled ? 0 : 30,
          opacity: scrolled ? 0 : 1,
          overflow: "hidden",
          background: light ? "rgba(33,30,26,0.28)" : "#E4DACB",
          textAlign: "center",
          fontFamily: FF,
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: light ? "rgba(255,255,255,0.92)" : "#6E665C",
          transition: "max-height 0.35s ease-out, opacity 0.25s ease-out",
        }}
      >
        <div style={{ padding: "8px 12px" }}>Envíos a todo México · Hecho en México</div>
      </div>

      <div style={{ height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 14px" }}>
        <Link to={back || "/"} aria-label="Volver" style={{ justifySelf: "start", padding: 8, color: fg, display: "inline-flex", transition: "color 0.3s ease-out" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 5 8 12 15 19" />
          </svg>
        </Link>
        <span
          style={{
            justifySelf: "center",
            fontFamily: FF,
            fontSize: 13,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: fg,
            transition: "color 0.3s ease-out",
          }}
        >
          {title}
        </span>
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 2 }}>
          {onFavs && (
            <button onClick={onFavs} aria-label="Favoritos" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: fg, transition: "color 0.3s ease-out" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
              </svg>
              {favs.length > 0 && <Badge value={favs.length} bg="#9A6A4B" />}
            </button>
          )}
          {onCart && (
            <button onClick={onCart} aria-label="Carrito" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: fg, transition: "color 0.3s ease-out" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && <Badge value={cartCount} bg="#211E1A" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Badge({ value, bg }: { value: number; bg: string }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 3,
        right: 3,
        minWidth: 15,
        height: 15,
        padding: "0 3px",
        borderRadius: 999,
        background: bg,
        color: "#fff",
        fontSize: 9,
        lineHeight: "15px",
        textAlign: "center",
        fontFamily: FF,
      }}
    >
      {value}
    </span>
  );
}
