import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter, TrustStrip } from "@/components/taluna/Footer";
import { Overlays, useOverlay } from "@/components/taluna/Header";
import { useTalunaStore, fmt } from "@/lib/taluna/store";
import { ASSETS } from "@/lib/taluna/assets";
import { PRODUCTS, LENGTHS, STRAP_LIST, type ProductDef } from "@/lib/taluna/data";
import miniMaraicaDetails from "@/assets/mini-maraica-details-transparent.png";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const ACCENT = "#9A6A4B";

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS[params.slug];
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Producto no disponible · Taluna" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const description = `${p.kicker}. ${p.measures}. Elige color y strap artesanal intercambiable.`;
    return {
      meta: [
        { title: `${p.name} · Taluna` },
        { name: "description", content: description },
        { property: "og:title", content: `${p.name} · Taluna` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductoPage,
});

function ProductoPage() {
  const { product } = Route.useLoaderData() as { product: ProductDef };
  const { overlay, setOverlay } = useOverlay();
  const { isFav, toggleFav, addToCart, cartCount } = useTalunaStore();

  const [colorId, setColorId] = useState(product.colors[0]!.id);
  const [strapId, setStrapId] = useState<string | null>(null);
  const [lengthId, setLengthId] = useState("mediano");
  const [shot, setShot] = useState(0);
  const [infoTab, setInfoTab] = useState("Descripción");
  const [added, setAdded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const parallaxRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const el = parallaxRef.current;
      const box = el?.parentElement;
      if (!el || !box) return;
      const vh = window.innerHeight || 800;
      const r = box.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const shift = Math.max(-1, Math.min(1, progress)) * -56;
      el.style.transform = `translateY(${shift.toFixed(1)}px) scale(1.04)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]!;
  const straps = STRAP_LIST;
  const strap = straps.find((s) => s.id === strapId) ?? null;

  const len = LENGTHS.find((l) => l.id === lengthId) ?? LENGTHS[1]!;
  const total = product.base + (strap?.price ?? 0) + (strap ? len.add : 0);
  const ready = !!strap;
  const shots = Math.max(color.shots, 1);
  const isLifestyle = (src?: string) => !!src && /lifestyle/i.test(src);
  const heroLifestyle = isLifestyle(color.images?.[shot]);
  const transparentHeader = heroLifestyle && !scrolled;
  const infoTabs = Object.keys(product.info);
  const infoLines = product.info[infoTab] ?? product.info["Descripción"] ?? [];

  const pickColor = (id: string) => {
    setColorId(id);
    setShot(0);
    setStrapId(null);
    setAdded(false);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        background: "#EFEAE1",
        position: "relative",
        overflowX: "hidden",
        minHeight: "100vh",
        paddingBottom: 84,
      }}
    >
      {/* HEADER GROUP (fijo): anuncio + header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          maxWidth: 480,
          zIndex: 50,
          background: transparentHeader
            ? "transparent"
            : scrolled
              ? "linear-gradient(180deg, rgba(239,234,225,0.72) 0%, rgba(239,234,225,0.52) 100%)"
              : "#EFEAE1",
          boxShadow: scrolled ? "0 8px 30px -18px rgba(33,30,26,0.4)" : "none",
          backdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px) saturate(1.3)" : "none",
          transition: "background 0.3s ease-out, box-shadow 0.3s ease-out",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          style={{
            maxHeight: scrolled ? 0 : 30,
            opacity: scrolled ? 0 : 1,
            overflow: "hidden",
            background: transparentHeader ? "rgba(33,30,26,0.28)" : "#E4DACB",
            textAlign: "center",
            fontFamily: FF,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: transparentHeader ? "rgba(255,255,255,0.92)" : "#6E665C",
            transition: "max-height 0.35s ease-out, opacity 0.25s ease-out, background 0.3s ease-out, color 0.3s ease-out",
          }}
        >
          <div style={{ padding: "8px 12px" }}>Envíos a todo México · Hecho en México</div>
        </div>
        <div
          style={{
            height: 56,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "0 14px",
            borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.5)" : "transparent"}`,
          }}
        >
          <Link to="/" aria-label="Volver" style={{ justifySelf: "start", padding: 8, color: "#211E1A", display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 5 8 12 15 19" />
            </svg>
          </Link>
          <Link to="/" style={{ justifySelf: "center", display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
            <img src={ASSETS.logoDark} alt="Taluna MX" style={{ height: 38, width: "auto", display: "block" }} />
          </Link>
          <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 2 }}>
            <button
              onClick={() =>
                toggleFav({ id: product.id, type: "bag", kind: "Bolsa", name: product.name, price: product.base })
              }
              aria-label="Favorito"
              style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav(product.id) ? ACCENT : "none"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
              </svg>
            </button>
            <button
              onClick={() => setOverlay("cart")}
              aria-label="Carrito"
              style={{ position: "relative", background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 3, right: 3, minWidth: 15, height: 15, padding: "0 3px", borderRadius: 999, background: "#211E1A", color: "#fff", fontSize: 9, lineHeight: "15px", textAlign: "center", fontFamily: FF }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* spacer */}
      <div style={{ height: scrolled ? 56 : 92, transition: "height 0.35s ease-out" }} />

      {/* GALERÍA */}
      <section style={{ background: "#EFEAE1", marginTop: heroLifestyle ? (scrolled ? -56 : -92) : 0, transition: "margin-top 0.35s ease-out" }}>
        <div
          className="tl-scroll"
          onScroll={(e) => {
            const el = e.currentTarget;
            setShot(Math.round(el.scrollLeft / (el.clientWidth || 1)));
          }}
          style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", scrollSnapType: "x mandatory" }}
        >
          {Array.from({ length: shots }).map((_, i) => {
            const src = color.images?.[i];
            const life = isLifestyle(src);
            return (
              <div
                key={i}
                style={{
                  flex: "0 0 100%",
                  scrollSnapAlign: "center",
                  aspectRatio: life ? "4 / 5" : "1 / 1",
                  overflow: "hidden",
                  background: life ? "transparent" : "#F3EEE4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: life ? 0 : product.galleryPad,
                }}
              >
                {src ? (
                  <img
                    src={src}
                    alt={`${product.name} ${color.name}`}
                    style={
                      life
                        ? { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }
                        : { maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", transform: "scale(1.08)" }
                    }
                  />
                ) : (
                  <span style={{ fontFamily: FF, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#BCB1A0" }}>
                    Imagen pendiente
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, padding: "16px 0 4px" }}>
          {Array.from({ length: shots }).map((_, i) => (
            <span
              key={i}
              style={{
                width: i === shot ? 18 : 6,
                height: 6,
                borderRadius: 999,
                background: i === shot ? "#211E1A" : "#C9BCA8",
                transition: "background 0.25s ease, width 0.25s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* INFO */}
      <section style={{ padding: "22px 26px 4px", background: "#EFEAE1" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 30, letterSpacing: "-0.01em" }}>{product.name}</h1>
          <span style={{ flex: "0 0 auto", fontFamily: FF, fontSize: 17, color: "#211E1A" }}>{fmt(product.base)}</span>
        </div>
        <p style={{ margin: "0 0 18px", fontFamily: FF, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9C9286" }}>
          {product.kicker}
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: "#6E665C", maxWidth: "42ch" }}>
          {product.intro}
        </p>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.04em", lineHeight: 1.5, fontWeight: 300, color: "#9C9286" }}>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.12em", color: "#6E665C" }}>Medidas</span> · {product.measures}
        </p>
      </section>

      {/* SELECTOR DE COLOR · mini imágenes */}
      <section style={{ padding: "24px 22px 8px" }}>
        <div data-stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {product.colors.map((c) => {
            const thumb = c.images?.[0];
            return (
              <button
                key={c.id}
                onClick={() => !c.pending && pickColor(c.id)}
                aria-label={c.name}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  padding: 0,
                  border: `1px solid ${colorId === c.id ? "#211E1A" : "transparent"}`,
                  background: "#F3EEE4",
                  cursor: c.pending ? "default" : "pointer",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {thumb && <img src={thumb} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                {c.pending && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      textAlign: "center",
                      fontFamily: FF,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#B0A696",
                      border: "1px dashed #D8CDBD",
                      margin: 5,
                      lineHeight: 1.4,
                    }}
                  >
                    Próximamente
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Link to="/categoria/$slug" params={{ slug: "bolsas" }} style={{ fontFamily: FF, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6E665C" }}>
            Explorar todos
          </Link>
        </div>
      </section>

      {/* STRAP */}
      <section style={{ padding: "30px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4, padding: "0 6px" }}>
          <span style={{ fontFamily: FF, fontSize: 12, color: ACCENT }}>01</span>
          <h2 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase" }}>Elige tu strap</h2>
        </div>
        <p style={{ margin: "0 0 18px", padding: "0 6px", fontSize: 13, color: ACCENT, fontWeight: 300 }}>
          Completa tu Taluna con un strap intercambiable.
        </p>
        <div data-stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {straps.map((s) => {
            const on = strapId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setStrapId(s.id);
                  setAdded(false);
                }}
                style={{
                  textAlign: "left",
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    borderRadius: 4,
                    background: "#F7F1E6",
                    boxShadow: on ? `0 0 0 1.5px ${ACCENT}` : "0 0 0 1px #E8E0D4",
                    transition: "box-shadow .2s ease",
                  }}
                >
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.name}
                      loading="lazy"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        padding: 4,
                        transform: "scale(1.32)",
                        mixBlendMode: "multiply",
                        display: "block",
                      }}
                    />
                  ) : (
                    <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C6BCAC" }}>
                      Próximamente
                    </span>
                  )}
                  {on && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        background: ACCENT,
                        color: "#fff",
                        fontFamily: FF,
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p style={{ margin: "10px 0 0", fontFamily: FF, fontSize: 13, color: "#211E1A" }}>{s.name}</p>
                <p style={{ margin: "2px 0 0", fontFamily: FF, fontSize: 12, color: "#6E665C" }}>+{fmt(s.price)}</p>
              </button>
            );
          })}
        </div>
      </section>


      {/* LARGO */}
      <section style={{ padding: "26px 26px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
          <span style={{ fontFamily: FF, fontSize: 12, color: ACCENT }}>02</span>
          <h2 style={{ margin: 0, fontFamily: FF, fontWeight: 600, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase" }}>Largo del strap</h2>
        </div>
        {strap ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {LENGTHS.map((l) => {
              const on = lengthId === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    setLengthId(l.id);
                    setAdded(false);
                  }}
                  style={{
                    padding: "11px 20px",
                    borderRadius: 999,
                    border: `1px solid ${on ? "#211E1A" : "#D8CDBD"}`,
                    background: on ? "#211E1A" : "transparent",
                    color: on ? "#fff" : "#211E1A",
                    fontFamily: FF,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: "#B0A696", fontWeight: 300 }}>
            Elige primero un strap para ver los largos disponibles.
          </p>
        )}
      </section>

      {/* INFO · pestañas */}
      <section style={{ padding: "8px 24px 12px", background: "#EFEAE1" }}>
        <div className="tl-scroll" style={{ display: "flex", gap: 26, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", borderBottom: "1px solid #DED3C2" }}>
          {infoTabs.map((t) => {
            const on = infoTab === t;
            return (
              <button
                key={t}
                onClick={() => setInfoTab(t)}
                style={{
                  flex: "0 0 auto",
                  background: "none",
                  border: "none",
                  padding: "15px 0",
                  marginBottom: -1,
                  cursor: "pointer",
                  fontFamily: FF,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  color: on ? "#211E1A" : "#B0A696",
                  borderBottom: `1.5px solid ${on ? "#211E1A" : "transparent"}`,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div style={{ padding: "26px 2px 10px", minHeight: 180 }}>
          {infoTab === "Detalles" && (
            <div style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto 28px" }}>
              <div style={{ position: "relative", height: 292, background: "transparent" }}>
                {color.images?.[0] ? (
                  <img
                    src={product.slug === "mini-maraica" && color.id === "camel" ? miniMaraicaDetails : color.images[0]}
                    alt={product.name}
                    style={{
                      position: "absolute",
                      left: "3%",
                      top: "1%",
                      width: product.slug === "mini-maraica" && color.id === "camel" ? "88%" : "84%",
                      height: product.slug === "mini-maraica" && color.id === "camel" ? "88%" : "82%",
                      objectFit: "contain",
                      objectPosition: "center",
                      display: "block",
                      transform: product.slug === "mini-maraica" ? "scale(1.24)" : "scale(1.16)",
                      mixBlendMode: product.slug === "mini-maraica" && color.id === "camel" ? "normal" : "multiply",
                    }}
                  />
                ) : (
                  <span style={{ fontFamily: FF, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#BCB1A0" }}>Imagen pendiente</span>
                )}
                <div style={{ position: "absolute", right: 9, top: 37, height: 168, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ position: "relative", width: 1, height: "100%", background: "#BFB4A3" }}>
                    <span style={{ position: "absolute", top: 0, left: -3, width: 7, height: 1, background: "#BFB4A3" }} />
                    <span style={{ position: "absolute", bottom: 0, left: -3, width: 7, height: 1, background: "#BFB4A3" }} />
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: "0.06em", color: "#7E756A", whiteSpace: "nowrap" }}>{product.dims.alto}</span>
                </div>
                <div style={{ position: "absolute", left: "12%", right: "25%", bottom: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <div style={{ position: "relative", width: "100%", height: 1, background: "#BFB4A3" }}>
                    <span style={{ position: "absolute", top: -3, left: 0, width: 1, height: 7, background: "#BFB4A3" }} />
                    <span style={{ position: "absolute", top: -3, right: 0, width: 1, height: 7, background: "#BFB4A3" }} />
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: "0.06em", color: "#7E756A" }}>{product.dims.largo}</span>
                </div>
                <span style={{ position: "absolute", right: 48, bottom: 51, fontFamily: FF, fontSize: 10, letterSpacing: "0.06em", color: "#9A9185" }}>{product.dims.ancho}</span>
              </div>
            </div>
          )}
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {infoLines.map((ln) => (
              <li key={ln} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid #E7DECF" }}>
                <span style={{ flex: "0 0 auto", width: 4, height: 4, borderRadius: 999, background: ACCENT, marginTop: 9 }} />
                <span style={{ fontFamily: FF, fontSize: 14, lineHeight: 1.55, fontWeight: 300, color: "#5C554C" }}>{ln}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EDITORIAL · Detrás de cada strap */}
      <section style={{ padding: "40px 0 8px", background: "#EFEAE1" }}>
        <div style={{ position: "relative", width: "calc(100% - 32px)", height: 500, margin: "0 auto", borderRadius: 22, overflow: "hidden" }}>
          <img
            ref={parallaxRef}
            src={ASSETS.artesana}
            alt="Artesana Taluna con strap tejido a mano"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "-14%",
              width: "100%",
              height: "128%",
              objectFit: "cover",
              objectPosition: "50% 42%",
              transform: "scale(1.02)",
              willChange: "transform",
              display: "block",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,14,0) 52%, rgba(20,17,14,0.12) 70%, rgba(20,17,14,0.46) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 26px 32px", color: "#fff" }}>
            <h2 style={{ margin: "0 0 10px", fontFamily: FF, fontWeight: 700, fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", textShadow: "0 2px 20px rgba(20,17,14,0.35)" }}>
              Detrás de
              <br />
              cada strap
            </h2>
            <p style={{ margin: "0 0 18px", fontFamily: FF, fontSize: 14, lineHeight: 1.45, fontWeight: 400, opacity: 0.96, maxWidth: "30ch", textShadow: "0 1px 12px rgba(20,17,14,0.4)" }}>
              Piezas hechas a mano en colaboración con artesanas mexicanas.
            </p>
            <Link
              to="/categoria/$slug"
              params={{ slug: "straps" }}
              style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FF, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.85)", paddingBottom: 5 }}
            >
              Conoce más
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />
      <SiteFooter />

      {/* BOTTOM BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          maxWidth: 480,
          margin: "0 auto",
          background: "rgba(239,234,225,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid #DED3C2",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div>
          <p style={{ margin: 0, fontFamily: FF, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9C9286" }}>Total</p>
          <p style={{ margin: "2px 0 0", fontFamily: FF, fontSize: 20 }}>{fmt(total)}</p>
        </div>
        {added ? (
          <button
            onClick={() => setOverlay("cart")}
            style={{ flex: 1, maxWidth: 250, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 999, border: "none", background: ACCENT, color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Agregada
          </button>
        ) : ready ? (
          <button
            onClick={() => {
              if (!strap) return;
              addToCart({
                id: `${product.id}-${color.id}-${strap.id}-${lengthId}`,
                type: "combo",
                kind: "Set",
                name: `${product.name.replace("Bolsa ", "")} ${color.name} + ${strap.name} (${len.label})`,
                price: total,
                meta: { bag: product.slug, color: color.id, strap: strap.id, length: lengthId },
              });
              setAdded(true);
            }}
            style={{ flex: 1, maxWidth: 250, padding: 16, borderRadius: 999, border: "none", background: "#211E1A", color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Agregar al carrito
          </button>
        ) : (
          <span style={{ flex: 1, maxWidth: 250, textAlign: "center", padding: 16, borderRadius: 999, background: "#211E1A", color: "#fff", fontFamily: FF, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.5 }}>
            Elige tu strap
          </span>
        )}
      </div>

      <Overlays overlay={overlay} close={() => setOverlay(null)} />
    </div>
  );
}
