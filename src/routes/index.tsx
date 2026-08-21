import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ph, Media, MediaVideo, CARD_BG } from "@/components/taluna/Ph";
import { ReelsSpotlight } from "@/components/taluna/ReelsSpotlight";
import { SiteFooter, TrustStrip } from "@/components/taluna/Footer";
import { Overlays, useOverlay, Badge } from "@/components/taluna/Header";
import { useTalunaStore, fmt } from "@/lib/taluna/store";
import { ASSETS } from "@/lib/taluna/assets";

import {
  BEST_SELLERS,
  BAGS,
  STRAPS,
  COLLECTIONS,
} from "@/lib/taluna/data";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
/** Fondo limpio sólo para las miniaturas de "Más vendidos". */
const THUMB_BG = "#F7F1E6";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taluna · Bolsas artesanales que se adaptan a tu estilo" },
      {
        name: "description",
        content:
          "Bolsas de piel hechas a mano en México con straps intercambiables. Elige tu bolsa, color y strap y arma tu Taluna.",
      },
      { property: "og:title", content: "Taluna · Bolsas artesanales mexicanas" },
      {
        property: "og:description",
        content: "Piel, chaquira y diseño mexicano en piezas personalizables.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { overlay, setOverlay } = useOverlay();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favs, cartCount, isFav, toggleFav, addToCart } = useTalunaStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || searchOpen || !!overlay;
  const fg = solid ? "#211E1A" : "#ffffff";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#EFEAE1", position: "relative", overflowX: "hidden", minHeight: "100vh" }}>
      {/* HEADER GROUP */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          maxWidth: 480,
          zIndex: 50,
          background: solid
            ? "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.42) 100%)"
            : "transparent",
          backdropFilter: solid ? "blur(10px) saturate(1.3)" : "none",
          WebkitBackdropFilter: solid ? "blur(10px) saturate(1.3)" : "none",
          borderBottom: solid ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
          boxShadow: solid ? "0 8px 30px -18px rgba(33,30,26,0.4)" : "none",
          transition: "background 0.3s ease-out, box-shadow 0.3s ease-out",
        }}
      >
        {/* scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(20,17,14,0.34) 0%, rgba(20,17,14,0.10) 55%, rgba(20,17,14,0) 100%)",
            opacity: solid ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* announcement */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: solid ? 0 : 34,
            opacity: solid ? 0 : 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "height 0.35s ease, opacity 0.25s ease",
          }}
        >
          <p style={{ margin: 0, fontFamily: FF, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.96)", whiteSpace: "nowrap", padding: "0 18px" }}>
            Envío gratis desde $1,500 · Hecho a mano en México
          </p>
        </div>
        <header style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              height: 62,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "0 14px",
              borderBottom: `1px solid ${solid ? "transparent" : "rgba(255,255,255,0.28)"}`,
            }}
          >
            <button onClick={() => setOverlay("menu")} aria-label="Menú" style={{ justifySelf: "start", background: "none", border: "none", padding: 8, cursor: "pointer", color: fg }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="13" x2="21" y2="13" />
                <line x1="3" y1="19" x2="15" y2="19" />
              </svg>
            </button>
            <Link to="/" aria-label="Taluna MX — inicio" style={{ justifySelf: "center", display: "inline-flex", alignItems: "center" }}>
              <img
                src={solid ? ASSETS.logoDark : ASSETS.logoLight}
                alt="Taluna MX"
                style={{ height: 42, width: "auto", display: "block", transition: "opacity 0.3s ease" }}
              />
            </Link>

            <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 2 }}>
              <button onClick={() => setSearchOpen((s) => !s)} aria-label="Buscar" style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: fg }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </button>
              <button onClick={() => setOverlay("favs")} aria-label="Favoritos" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: fg }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
                </svg>
                {favs.length > 0 && <Badge value={favs.length} bg="#9A6A4B" />}
              </button>
              <button onClick={() => setOverlay("cart")} aria-label="Carrito" style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: fg }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8h12l-1 12H7L6 8z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {cartCount > 0 && <Badge value={cartCount} bg="#211E1A" />}
              </button>
            </div>
          </div>
          {/* Navegación horizontal (solo en estado transparente) */}
          <nav
            className="tl-scroll"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain",
              overflowY: "hidden",
              maxHeight: solid ? 0 : 56,
              opacity: solid ? 0 : 1,
              padding: solid ? "0 22px" : "7px 22px 14px",
              transition: "max-height 0.35s ease, opacity 0.25s ease, padding 0.35s ease",
            }}
          >
            {[
              { label: "Ofertas", to: "/categoria/ofertas" },
              { label: "Nuevas", to: "/categoria/nuevas" },
              { label: "Bolsas", to: "/categoria/bolsas" },
              { label: "Straps", to: "/categoria/straps" },
              { label: "Arma tu Taluna", to: "/arma-tu-taluna", accent: true },
              { label: "Más vendidos", to: "/categoria/mas-vendidos" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                style={{
                  flex: "0 0 auto",
                  fontFamily: FF,
                  fontWeight: 400,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  color: l.accent ? "#F0D9C4" : "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </header>
        {searchOpen && (
          <div style={{ padding: "0 14px 14px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #E1D8CB", borderRadius: 999, padding: "11px 18px", background: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8178" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input placeholder="Buscar bolsas, straps…" style={{ flex: 1, border: "none", outline: "none", fontFamily: FF, fontSize: 14, color: "#211E1A", background: "transparent" }} />
            </div>
          </div>
        )}
      </div>

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", height: "92vh", minHeight: 600, maxHeight: 860, overflow: "hidden", background: "#211E1A" }}>
        <div data-parallax="18" style={{ position: "absolute", inset: "-3% 0", willChange: "transform" }}>
          <MediaVideo src={ASSETS.heroVideo} srcMobile={ASSETS.heroVideoMobile} poster={ASSETS.heroPoster} bg="#2C2823" eager />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,14,0.12) 0%, rgba(20,17,14,0) 42%, rgba(20,17,14,0.06) 62%, rgba(20,17,14,0.55) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 26px 44px", color: "#fff" }}>
          <h1 style={{ margin: "0 0 16px", fontFamily: FF, fontWeight: 600, fontSize: 41, lineHeight: 1, letterSpacing: "-0.025em", maxWidth: "15ch" }}>
            Bolsas artesanales que se adaptan a tu estilo
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.55, opacity: 0.94, maxWidth: "32ch", fontWeight: 300, letterSpacing: "0.01em" }}>
            Piel, chaquira y diseño mexicano en piezas personalizables.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/arma-tu-taluna" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "16px 34px", background: "#fff", color: "#211E1A", fontFamily: FF, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 999 }}>
              Arma tu Taluna
            </Link>
            <Link to="/categoria/bolsas" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "16px 34px", border: "1px solid rgba(255,255,255,0.7)", color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 999 }}>
              Ver bolsas
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL · Combinación del mes */}
      <EditorialCarousel />

      {/* BEST SELLERS */}
      <section style={{ padding: "44px 0 12px", background: "#EFEAE1" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px 18px" }}>
          <h2 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 27, letterSpacing: "-0.02em" }}>Más vendidos</h2>
          <Link to="/categoria/mas-vendidos" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FF, fontSize: 12, color: "#3A342C" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
            Ver todo
          </Link>
        </div>
        <div data-stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 16px" }}>
          {BEST_SELLERS.map((p) => {
            const on = isFav(p.id);
            // Tratamiento visual uniforme sólo para las miniaturas de "Más vendidos":
            // mismo fondo claro, mismo zoom y encuadre centrado. No afecta la ficha de producto.
            const thumbScale = p.id === "mv-5" ? 1.72 : 1.0;
            return (
              <div key={p.id} style={{ position: "relative" }}>
                <Link to={p.to} style={{ display: "block", position: "relative", aspectRatio: "3 / 4", overflow: "hidden", background: THUMB_BG }}>
                  <Media
                    src={p.img}
                    alt={p.name}
                    label={p.label ?? p.name}
                    bg={THUMB_BG}
                    fit="contain"
                    position="center center"
                    style={{
                      transform: `scale(${thumbScale})`,
                      transformOrigin: "center center",
                      filter: "brightness(1.06) saturate(1.02)",
                      mixBlendMode: "multiply",
                    }}
                  />


                  {p.tag && (
                    <span style={{ position: "absolute", top: 8, left: 8, padding: "5px 10px", background: "#211E1A", color: "#fff", fontFamily: FF, fontSize: 10, letterSpacing: "0.02em" }}>
                      {p.tag}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() =>
                    toggleFav({ id: p.id, type: "bag", kind: "Bolsa", name: p.name, price: p.price })
                  }
                  aria-label="Favorito"
                  style={{ position: "absolute", top: 6, right: 6, width: 27, height: 27, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", borderRadius: 999 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#9A6A4B" : "none"} stroke={on ? "#9A6A4B" : "#211E1A"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
                  </svg>
                </button>
                <div style={{ padding: "8px 1px 4px" }}>
                  <p style={{ margin: "0 0 2px", fontFamily: FF, fontSize: 12, lineHeight: 1.2, color: "#211E1A" }}>{p.name}</p>
                  <p style={{ margin: 0, fontFamily: FF, fontSize: 12, color: "#6E665C" }}>{fmt(p.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CAMPAÑA · El strap cambia todo */}
      <section style={{ padding: "52px 22px", background: "#EFEAE1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 12px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9A6A4B" }}>Intercambiables</p>
            <h2 style={{ margin: "0 0 14px", fontFamily: FF, fontWeight: 600, fontSize: 30, lineHeight: 1.04, letterSpacing: "-0.02em", color: "#211E1A" }}>
              El strap
              <br />
              cambia todo
            </h2>
            <p style={{ margin: "0 0 26px", fontFamily: FF, fontSize: 14, lineHeight: 1.5, fontWeight: 300, color: "#6E665C", maxWidth: "22ch" }}>
              Diseños artesanales para transformar tu Taluna.
            </p>
            <Link to="/categoria/straps" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FF, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#211E1A", borderBottom: "1px solid #211E1A", paddingBottom: 5 }}>
              Comprar straps
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </Link>
          </div>
          <div style={{ flex: "0 0 48%", position: "relative", aspectRatio: "9 / 15", maxHeight: 430, overflow: "hidden", borderRadius: 999, background: "#E4DACB", boxShadow: "0 22px 48px -26px rgba(33,30,26,0.5)" }}>
            <MediaVideo src={ASSETS.strapVideo} poster={ASSETS.strapPoster} bg="#E4DACB" />
          </div>
        </div>
      </section>

      {/* MODELOS TALUNA · tabs */}
      <ModelosTaluna />

      {/* EDITORIAL · Detrás de cada strap */}
      <EditorialBlock
        height={500}
        label="Artesana con strap tejido"
        img={ASSETS.artesana}
        position="center 40%"
        title={
          <>
            Detrás de
            <br />
            cada strap
          </>
        }
        text="Piezas hechas a mano en colaboración con artesanas mexicanas."
        cta="Conoce más"
      />

      {/* FUNDADORAS */}
      <EditorialBlock
        height={540}
        label="Las creadoras de Taluna"
        img={ASSETS.fundadoras}
        position="center 30%"
        kicker="Nuestra historia"
        title={
          <>
            Roxana
            <br />
            y Cristy
          </>
        }
        text="La visión detrás de Taluna: diseño, artesanía y piezas pensadas para hacerse tuyas."
        cta="Conoce nuestra historia"
      />


      {/* ARMA TU TALUNA (configurador guiado) */}
      <ConfiguradorTeaser onAdd={addToCart} />

      {/* INSTAGRAM */}
      <section style={{ padding: "56px 0 12px", background: "#EFEAE1" }}>
        <div style={{ textAlign: "center", padding: "0 22px 20px" }}>
          <p style={{ margin: "0 0 6px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9A6A4B" }}>@taluna.mx</p>
          <h2 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 25, letterSpacing: "-0.01em" }}>Inspírate con Taluna</h2>
        </div>
        <ReelsSpotlight />


        <div style={{ textAlign: "center", padding: "22px 22px 0" }}>
          <a href="https://www.instagram.com/talunamx/reels/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FF, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#211E1A", borderBottom: "1px solid #211E1A", paddingBottom: 5, textDecoration: "none" }}>
            Ver en Instagram
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
          </a>
        </div>
      </section>

      <TrustStrip />
      <SiteFooter />

      <NewsletterPopup />
      <Overlays overlay={overlay} close={() => setOverlay(null)} />
    </div>
  );
}

function EditorialCarousel() {

  return (
    <section style={{ padding: "56px 0 60px", background: "#EFEAE1" }}>
      <div style={{ padding: "0 22px" }}>
        <h2
          style={{
            margin: "0 0 26px",
            fontFamily: FF,
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "#211E1A",
          }}
        >
          Combinación del mes
        </h2>
      </div>

      {/* Composición editorial horizontal (2528 × 1696) */}
      <div style={{ position: "relative", padding: "0 22px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "2528 / 1696",
            overflow: "hidden",
            background: "#E7DFD2",
          }}
        >
          <img
            src={ASSETS.coleccionMesLifestyle}
            alt="Mini Maráica negra con strap animal print — editorial Taluna"
            loading="lazy"
            data-parallax="10"
            style={{ position: "absolute", top: "-5%", left: 0, width: "100%", height: "110%", objectFit: "cover", objectPosition: "52% 38%", display: "block", willChange: "transform" }}
          />
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontFamily: FF,
              fontSize: 9.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 6px rgba(20,17,14,0.35)",
            }}
          >
            Mini Maráica · Strap animal print
          </span>
        </div>

        {/* Producto recortado, flotando fuera del encuadre */}
        <div
          style={{
            position: "absolute",
            right: 8,
            bottom: -22,
            width: "30%",
            maxWidth: 190,
          }}
        >
          <img
            src={ASSETS.miniNegroCutout}
            alt="Bolsa Mini Maráica negra"
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              filter: "drop-shadow(0 22px 24px rgba(33,30,26,0.24))",
            }}
          />
        </div>
      </div>
    </section>
  );
}



function ModelosTaluna() {
  const keys = Object.keys(COLLECTIONS);
  const [tab, setTab] = useState<string>(keys[0] ?? "Tacaná");
  const [colorIdx, setColorIdx] = useState(0);
  const col = COLLECTIONS[tab] ?? COLLECTIONS["Tacaná"]!;
  const colors = col.colors;
  const isMini = tab.toLowerCase().includes("mini");


  return (
    <section style={{ padding: "56px 0 8px", background: "#EFEAE1" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 22px 18px" }}>
        <h2 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em" }}>Modelos Taluna</h2>
        <Link to="/categoria/bolsas" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FF, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E665C" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="9 7 17 7 17 15" />
          </svg>
          Ver todo
        </Link>
      </div>
      <div className="tl-scroll" style={{ display: "flex", gap: 22, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", padding: "0 22px 20px" }}>
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => {
              setTab(k);
              setColorIdx(0);
            }}
            style={{
              flex: "0 0 auto",
              background: "none",
              border: "none",
              padding: "0 0 6px",
              cursor: "pointer",
              fontFamily: FF,
              fontSize: 15,
              whiteSpace: "nowrap",
              color: k === tab ? "#211E1A" : "#B0A696",
              borderBottom: `1.5px solid ${k === tab ? "#211E1A" : "transparent"}`,
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <div data-stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "0 22px" }}>
        <Link to={col.to} style={{ display: "block", position: "relative", aspectRatio: "3 / 4.6", overflow: "hidden", borderRadius: 3, background: "#EFE7DC" }}>
          <Media
            src={isMini ? (colors[colorIdx]?.n === "Negro" ? ASSETS.miniNegroLifestyle : ASSETS.miniCamelLifestyle) : ASSETS.modelosLifestyle}
            alt="Modelo Taluna"
            label="Lifestyle"
            bg="#E7DFD2"
            position="center"
          />
        </Link>
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 3, background: THUMB_BG }}>
            <Link to={col.to} style={{ display: "block", position: "absolute", inset: 0 }}>
              <Media
                src={isMini ? ASSETS.miniCamel : ASSETS.maraica}
                alt={`Bolsa ${tab}`}
                label={tab}
                bg={THUMB_BG}
                fit="contain"
                position="center center"
                style={{
                  transform: `scale(${isMini ? 1.72 : 1.0})`,
                  transformOrigin: "center center",
                  filter: "brightness(1.06) saturate(1.02)",
                  mixBlendMode: "multiply",
                }}
              />
            </Link>

            <span style={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent, #9A6A4B)", color: "#fff", borderRadius: 999, fontSize: 20, lineHeight: 1 }}>
              +
            </span>
            <div style={{ position: "absolute", left: 10, bottom: 10, display: "flex", gap: 8 }}>
              {colors.map((c, i) => (
                <button
                  key={c.n}
                  onClick={() => setColorIdx(i)}
                  aria-label={c.n}
                  style={{
                    width: 18,
                    height: 18,
                    padding: 0,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 999,
                    background: c.c,
                    boxShadow: `0 0 0 1.5px rgba(255,255,255,0.9), 0 0 0 ${i === colorIdx ? "2px" : "0px"} #211E1A`,
                  }}
                />
              ))}
            </div>
          </div>
          <p style={{ margin: "10px 0 3px", fontFamily: FF, fontSize: 14 }}>Bolsa {tab}</p>
          <p style={{ margin: 0, fontFamily: FF, fontSize: 13, color: "#6E665C" }}>{fmt(col.price)}</p>
        </div>
      </div>
    </section>
  );
}

function EditorialBlock({
  height,
  label,
  kicker,
  title,
  text,
  cta,
  img,
  position,
}: {
  height: number;
  label: string;
  kicker?: string;
  title: React.ReactNode;
  text: string;
  cta: string;
  img?: string;
  position?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = true;
    // Solo calculamos el parallax mientras el bloque está en pantalla
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      visible = false;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible = e.isIntersecting;
          if (visible) onScroll();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(el);
    }
    const onScroll = () => {
      if (raf || !visible) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 (abajo) → 1 (arriba): desplazamiento sutil de ±30px
        const p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        setShift(Math.max(-1, Math.min(1, p)) * 30);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section style={{ padding: "40px 0", background: "#EFEAE1" }}>
      <div ref={wrapRef} style={{ position: "relative", width: "calc(100% - 32px)", height, margin: "0 auto", borderRadius: 22, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: "-9% 0",
            transform: `translate3d(0, ${shift}px, 0)`,
            willChange: "transform",
          }}
        >
          <Media src={img} alt={label} label={label} bg="#DCD3C6" position={position ?? "center"} />
        </div>

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,14,0) 50%, rgba(20,17,14,0.13) 69%, rgba(20,17,14,0.48) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 26px 32px", color: "#fff" }}>
          {kicker && (
            <p style={{ margin: "0 0 10px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.92 }}>{kicker}</p>
          )}
          <h2 style={{ margin: "0 0 10px", fontFamily: FF, fontWeight: 700, fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", textShadow: "0 2px 20px rgba(20,17,14,0.35)" }}>
            {title}
          </h2>
          <p style={{ margin: "0 0 18px", fontFamily: FF, fontSize: 14, lineHeight: 1.45, opacity: 0.96, maxWidth: "30ch", textShadow: "0 1px 12px rgba(20,17,14,0.4)" }}>{text}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FF, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.85)", paddingBottom: 5 }}>
            {cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}

const BUILDER_BG = "#F7F1E6";

type BuilderColor = { id: string; name: string; swatch: string; img?: string };

const BAG_COLORS: Record<string, BuilderColor[]> = {
  "maraica-mini": [
    { id: "camel", name: "Camel", swatch: "#A9743F", img: ASSETS.miniCamel },
    { id: "negro", name: "Negra", swatch: "#2A2622", img: ASSETS.miniNegro },
    { id: "acero", name: "Acero", swatch: "#8D8B87" },
    { id: "crema", name: "Crema", swatch: "#E4DACB" },
  ],
  maraica: [
    { id: "camel", name: "Camel", swatch: "#A9743F", img: ASSETS.maraica },
    { id: "negro", name: "Negra", swatch: "#2A2622" },
    { id: "arena", name: "Arena", swatch: "#C9B79C" },
  ],
};

const DEFAULT_COLORS: BuilderColor[] = [
  { id: "camel", name: "Camel", swatch: "#A9743F", img: ASSETS.maraica },
  { id: "negro", name: "Negra", swatch: "#2A2622" },
  { id: "arena", name: "Arena", swatch: "#C9B79C" },
];

const stepLabel = { margin: "0 0 13px", fontFamily: FF, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#9C9286" };

function ConfiguradorTeaser({ onAdd }: { onAdd: ReturnType<typeof useTalunaStore>["addToCart"] }) {
  const { isFav, toggleFav } = useTalunaStore();
  const [bagId, setBagId] = useState(BAGS[0]!.id);
  const [colorId, setColorId] = useState<string | null>(null);
  const [strapId, setStrapId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const bag = useMemo(() => BAGS.find((b) => b.id === bagId) ?? BAGS[0]!, [bagId]);
  const colors = BAG_COLORS[bag.id] ?? DEFAULT_COLORS;
  const color = colors.find((c) => c.id === colorId && c.img) ?? colors.find((c) => c.img) ?? colors[0]!;
  const strap = strapId ? STRAPS[strapId] : undefined;
  const total = bag.price + (strap?.price ?? 0);
  const ready = !!strap && !!size;
  const comboId = `combo-${bag.id}-${color.id}-${strapId}-${size ?? ""}`;
  const comboName = `${bag.name} ${color.name}` + (strap ? ` + ${strap.name}` : "");
  const comboFav = isFav(comboId);
  const heroImg = color.img ?? bag.img ?? ASSETS.maraica;

  const pickBag = (id: string) => {
    const b = BAGS.find((x) => x.id === id)!;
    setBagId(id);
    setColorId(null);
    if (!strapId || !b.straps.includes(strapId)) {
      setStrapId(null);
      setSize(null);
    }
    setAdded(false);
  };
  const pickStrap = (id: string) => {
    const s = STRAPS[id]!;
    setStrapId(id);
    setSize(s.sizes.length === 1 ? s.sizes[0]! : null);
    setAdded(false);
  };

  return (
    <section style={{ padding: "60px 22px 64px", background: "#EFEAE1" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <p style={{ margin: "0 0 10px", fontFamily: FF, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent, #9A6A4B)" }}>Personalízalo</p>
        <h2 style={{ margin: "0 0 12px", fontFamily: FF, fontWeight: 600, fontSize: 28, letterSpacing: "-0.01em" }}>Arma tu Taluna</h2>
        <p style={{ margin: "0 auto", fontSize: 14, lineHeight: 1.6, color: "#6E665C", maxWidth: "34ch", fontWeight: 300 }}>
          Elige tu bolsa, combínala con un strap compatible y crea tu pieza.
        </p>
      </div>

      {/* Tu combinación */}
      <div style={{ background: BUILDER_BG, borderRadius: 22, padding: "18px 18px 20px", boxShadow: "0 24px 48px -40px rgba(33,30,26,0.45)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C9286" }}>Tu combinación</span>
          <span key={strap ? total : `base-${bag.id}`} className="tl-fade-swap" style={{ fontFamily: FF, fontSize: 13, color: "#211E1A" }}>{strap ? fmt(total) : `Desde ${fmt(bag.price)}`}</span>
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 16, background: BUILDER_BG }}>
          {/* Bolsa protagonista, ligeramente a la derecha cuando hay strap */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              bottom: "5%",
              left: strap ? "30%" : "6%",
              right: "6%",
              transition: "left 620ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          >
            <div key={`${bag.id}-${color.id}`} className="tl-swap" style={{ position: "absolute", inset: 0 }}>
              <Media
                src={heroImg}
                alt={`Bolsa ${bag.name} ${color.name}`}
                bg="transparent"
                fit="contain"
                position="center center"
                style={{
                  transform: `scale(${bag.id === "maraica-mini" ? 1.16 : 1.04})`,
                  transformOrigin: "center center",
                  filter: "brightness(1.02)",
                  mixBlendMode: "multiply",
                  transition: "transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                }}
              />
            </div>
          </div>

          {/* Strap completo, vertical, integrado al mismo fondo */}
          {strap ? (
            <div
              key={strapId ?? "strap"}
              className="tl-swap-strap"
              style={{ position: "absolute", top: "3%", bottom: "3%", left: "5%", width: "26%", mixBlendMode: "multiply" }}
            >
              <Media
                src={strap.img}
                alt={`Strap ${strap.name}`}
                bg="transparent"
                fit="cover"
                position="center center"
                style={{
                  transform: "scale(1)",
                  transformOrigin: "center center",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          ) : null}


          {/* Etiqueta discreta de la combinación */}
          <span
            style={{
              position: "absolute",
              left: 14,
              bottom: 13,
              fontFamily: FF,
              fontSize: 9.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: strap ? "#9C9286" : "#B0A696",
              whiteSpace: "nowrap",
              maxWidth: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {strap ? strap.name : "Suma un strap"}
          </span>
        </div>


        <p key={`${bag.id}-${color.id}-${strapId ?? ""}-${size ?? ""}`} className="tl-fade-swap" style={{ margin: "14px 2px 0", fontFamily: FF, fontSize: 13, color: "#211E1A" }}>
          {bag.name} · {color.name}
          <span style={{ color: "#9C9286" }}>{strap ? ` · ${strap.name}${size ? ` · ${size}` : ""}` : " · Suma un strap"}</span>
        </p>

      </div>

      {/* 01 Bolsa */}
      <div style={{ marginTop: 30 }}>
        <p style={stepLabel}>01 · Elige tu bolsa</p>
        <div className="tl-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", padding: "10px 6px 16px", margin: "-10px -6px -12px", scrollPaddingInline: 6 }}>
          {BAGS.map((b) => {
            const on = b.id === bagId;
            return (
              <button key={b.id} className="tl-pick" data-on={on ? "1" : "0"} onClick={() => pickBag(b.id)} style={{ flex: "0 0 auto", width: 92, textAlign: "center", border: "none", background: "none", padding: 0, cursor: "pointer" }}>
                <span style={{ display: "block", width: 92, height: 110, overflow: "hidden", borderRadius: 14, background: BUILDER_BG, boxShadow: on ? "inset 0 0 0 1px rgba(154,106,75,0.42), 0 14px 26px -16px rgba(33,30,26,0.42)" : "inset 0 0 0 1px rgba(33,30,26,0.055)", position: "relative", opacity: on ? 1 : 0.86, transition: "box-shadow 320ms ease, transform 320ms cubic-bezier(0.22,0.61,0.36,1), opacity 320ms ease" }}>
                  <Media src={b.img ?? ASSETS.maraica} alt={b.name} bg={BUILDER_BG} fit="contain" position="center center" style={{ transform: "scale(0.88)", transformOrigin: "center center", mixBlendMode: "multiply" }} />
                </span>
                <span style={{ display: "block", marginTop: 8, fontFamily: FF, fontSize: 12, color: on ? "#211E1A" : "#8A8178" }}>{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 02 Color */}
      <div style={{ marginTop: 26 }}>
        <p style={stepLabel}>02 · Elige tu color</p>
        <div className="tl-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", padding: "10px 6px 16px", margin: "-10px -6px -12px", scrollPaddingInline: 6 }}>
          {colors.map((c) => {
            const on = c.id === color.id;
            const available = !!c.img;
            return (
              <button
                key={c.id}
                className="tl-pick"
                data-on={on ? "1" : "0"}
                disabled={!available}
                onClick={() => {
                  setColorId(c.id);
                  setAdded(false);
                }}
                style={{ flex: "0 0 auto", width: 78, textAlign: "center", border: "none", background: "none", padding: 0, cursor: available ? "pointer" : "default" }}
              >
                <span style={{ display: "block", width: 78, height: 92, overflow: "hidden", borderRadius: 12, background: BUILDER_BG, boxShadow: on ? "inset 0 0 0 1px rgba(154,106,75,0.42), 0 12px 22px -15px rgba(33,30,26,0.4)" : "inset 0 0 0 1px rgba(33,30,26,0.055)", position: "relative", transition: "box-shadow 320ms ease, transform 320ms cubic-bezier(0.22,0.61,0.36,1)" }}>
                  {available ? (
                    <Media src={c.img!} alt={`${bag.name} ${c.name}`} bg={BUILDER_BG} fit="contain" position="center center" style={{ transform: "scale(0.9)", transformOrigin: "center center", mixBlendMode: "multiply" }} />
                  ) : (
                    <span style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 999, background: c.swatch, boxShadow: "inset 0 0 0 1px rgba(33,30,26,0.12)" }} />
                      <span style={{ fontFamily: FF, fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B0A696" }}>Próximamente</span>
                    </span>
                  )}
                </span>
                <span style={{ display: "block", marginTop: 8, fontFamily: FF, fontSize: 12, color: on ? "#211E1A" : "#8A8178" }}>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 03 Strap */}
      <div style={{ marginTop: 26 }}>
        <p style={stepLabel}>
          03 · Elige tu strap <span style={{ textTransform: "none", letterSpacing: 0, color: "#C2B8A8" }}>· compatibles con {bag.name}</span>
        </p>
        <div className="tl-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", padding: "10px 6px 16px", margin: "-10px -6px -12px", scrollPaddingInline: 6 }}>
          {bag.straps.map((id) => {
            const s = STRAPS[id]!;
            const on = strapId === id;
            return (
              <button key={id} className="tl-pick" data-on={on ? "1" : "0"} onClick={() => pickStrap(id)} style={{ flex: "0 0 auto", width: 72, textAlign: "center", border: "none", background: "none", padding: 0, cursor: "pointer" }}>
                <span style={{ display: "block", width: 72, height: 72, overflow: "hidden", borderRadius: 999, background: BUILDER_BG, boxShadow: on ? "inset 0 0 0 1px rgba(154,106,75,0.45), 0 10px 20px -14px rgba(33,30,26,0.4)" : "inset 0 0 0 1px rgba(33,30,26,0.06)", position: "relative", opacity: on ? 1 : 0.92, transition: "box-shadow 320ms ease, transform 320ms cubic-bezier(0.22,0.61,0.36,1), opacity 320ms ease" }}>
                  <Media src={s.img} alt={s.name} bg={BUILDER_BG} fit="contain" position="center center" style={{ transform: "scale(1.35)", transformOrigin: "center center", mixBlendMode: "multiply" }} />
                </span>
                <span style={{ display: "block", marginTop: 7, fontFamily: FF, fontSize: 11, lineHeight: 1.3, color: on ? "#211E1A" : "#8A8178" }}>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 04 Largo */}
      {strap && (
        <div style={{ marginTop: 26 }}>
          <p style={stepLabel}>04 · Largo del strap</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {strap.sizes.map((z) => {
              const on = size === z;
              return (
                <button
                  key={z}
                  onClick={() => {
                    setSize(z);
                    setAdded(false);
                  }}
                  style={{
                    padding: "11px 22px",
                    border: `1px solid ${on ? "rgba(154,106,75,0.5)" : "#E6DDD0"}`,
                    background: on ? "#F3EADD" : "#FCFAF6",
                    color: "#211E1A",
                    boxShadow: on ? "0 10px 20px -16px rgba(33,30,26,0.5)" : "none",

                    fontFamily: FF,
                    fontSize: 13,
                    cursor: "pointer",
                    borderRadius: 999,
                    transition: "background-color 300ms ease, color 300ms ease, border-color 300ms ease, transform 300ms cubic-bezier(0.22,0.61,0.36,1)",
                  }}
                >
                  {z}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div style={{ marginTop: 32, padding: "22px 22px 20px", background: "#FCFAF6", borderRadius: 20, boxShadow: "inset 0 0 0 1px #EFE7DA" }}>
        <p style={{ margin: "0 0 16px", fontFamily: FF, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B0A696" }}>Tu resumen</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 16, columnGap: 18 }}>
          {[
            { k: "Bolsa", v: bag.name, muted: false },
            { k: "Color", v: color.name, muted: false },
            { k: "Strap", v: strap ? strap.name : "Elige uno", muted: !strap },
            { k: "Largo", v: size || "Pendiente", muted: !size },
          ].map((r) => (
            <div key={r.k}>
              <span style={{ display: "block", fontFamily: FF, fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B0A696", marginBottom: 5 }}>{r.k}</span>
              <span style={{ display: "block", fontFamily: FF, fontSize: 15, lineHeight: 1.3, color: r.muted ? "#9A6A4B" : "#211E1A", fontWeight: 400 }}>{r.v}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #EAE1D3 20%, #EAE1D3 80%, transparent)", margin: "20px 0 16px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9C9286" }}>Total</span>
          <span style={{ fontFamily: FF, fontSize: 30, lineHeight: 1, letterSpacing: "-0.02em", color: "#211E1A" }}>{fmt(total)}</span>
        </div>
        <p style={{ margin: "8px 0 0", textAlign: "right", fontSize: 11, color: "#B0A696", fontWeight: 300 }}>Envío incluido · Hecho a mano en México</p>
      </div>


      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {ready ? (
          <button
            onClick={() => {
              onAdd({
                id: comboId,
                type: "combo",
                kind: "Set",
                name: `${comboName} · ${size}`,
                price: total,
                stripePriceId: "",
                productId: "",
                meta: { bag: bag.id, color: color.id, strap: strapId, size },
              });
              setAdded(true);
            }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 17, background: "#211E1A", color: "#fff", border: "none", fontFamily: FF, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 999, cursor: "pointer" }}
          >
            {added ? "Agregado ✓" : "Agregar a carrito"}
          </button>
        ) : (
          <span style={{ width: "100%", textAlign: "center", padding: 17, background: "#E4DACB", color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 999 }}>
            {strap ? "Elige el largo" : "Elige un strap"}
          </span>
        )}
        <button
          onClick={() => {
            if (!strap) return;
            toggleFav({ id: comboId, type: "combo", kind: "Combinación", name: comboName, price: total });
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E665C" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={comboFav ? "#6E665C" : "none"} stroke="#6E665C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
          </svg>
          {comboFav ? "Guardada" : "Guardar combinación"}
        </button>
      </div>
    </section>
  );
}

function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    // no bloquea la carga inicial ni el primer scroll; solo una vez por sesión
    try {
      if (sessionStorage.getItem("tl-newsletter") === "1") return;
    } catch {
      /* sin sessionStorage */
    }
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("tl-newsletter", "1");
      } catch {
        /* noop */
      }
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(24,20,16,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 26, maxWidth: 480, margin: "0 auto", animation: "tlFade 0.35s ease" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 340, background: "#F6F1E9", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 70px -24px rgba(20,17,14,0.55)", animation: "tlPopIn 0.5s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          style={{ position: "absolute", top: 12, right: 12, zIndex: 2, width: 34, height: 34, borderRadius: 999, border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#211E1A" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
        <div style={{ width: "100%", aspectRatio: "4 / 3", overflow: "hidden", background: "#E4DACB", position: "relative" }}>
          <Media src={ASSETS.popupBench} alt="Colección Taluna MX" label="Taluna" bg="#E4DACB" position="center" />
        </div>
        {done ? (
          <div style={{ padding: "40px 24px 42px", textAlign: "center" }}>
            <span style={{ display: "inline-flex", width: 52, height: 52, borderRadius: 999, background: "#9A6A4B", color: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2 style={{ margin: "0 0 10px", fontFamily: FF, fontWeight: 600, fontSize: 24, letterSpacing: "0.02em" }}>¡Bienvenida!</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, fontWeight: 300, color: "#6E665C" }}>
              Ya eres parte de Taluna. Pronto sabrás de nosotras.
            </p>
          </div>
        ) : (
          <div style={{ padding: "26px 24px", textAlign: "center" }}>
            <img
              src={ASSETS.logoDark}
              alt="Taluna MX"
              style={{ height: 64, width: "auto", display: "block", margin: "2px auto 20px" }}
            />

            <p style={{ margin: "0 0 6px", fontSize: 14, lineHeight: 1.5, fontWeight: 300, color: "#6E665C" }}>
              Mantente al tanto de nuestros lanzamientos, novedades y piezas especiales.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: "#211E1A" }}>
              Únete hoy y recibe acceso antes que nadie a nuevas colecciones.
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Déjanos tu correo"
              style={{ width: "100%", border: `1px solid ${err ? "#B5544E" : "#D8CDBD"}`, background: "#fff", padding: "14px 16px", fontFamily: FF, fontSize: 14, color: "#211E1A", outline: "none", borderRadius: 10, marginBottom: 12, textAlign: "center" }}
            />
            <button
              onClick={() => {
                if (!email.includes("@")) {
                  setErr(true);
                  return;
                }
                setDone(true);
                setTimeout(() => setOpen(false), 2600);
              }}
              style={{ width: "100%", padding: 15, border: "none", borderRadius: 10, background: "#211E1A", color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Suscribirme
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
