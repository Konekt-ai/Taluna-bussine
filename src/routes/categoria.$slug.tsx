import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Media, CARD_BG } from "@/components/taluna/Ph";
import { SiteFooter, TrustStrip } from "@/components/taluna/Footer";
import { Overlays, useOverlay, CollectionHeader } from "@/components/taluna/Header";
import { useTalunaStore, fmt } from "@/lib/taluna/store";
import { CATEGORIES, BAGS, STRAP_LIST } from "@/lib/taluna/data";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const PRODUCT_ROUTE: Record<string, string> = {
  maraica: "/producto/maraica",
  "maraica-mini": "/producto/mini-maraica",
};

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => {
    const cat = CATEGORIES[params.slug];
    const title = cat ? `${cat.title} · Taluna` : "Catálogo · Taluna";
    const description = cat
      ? `Descubre ${cat.title.toLowerCase()} Taluna: piezas artesanales de piel hechas en México.`
      : "Catálogo de bolsas y straps artesanales Taluna.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoriaPage,
});

const STRAP_BG = "#F7F1E6";

function CategoriaPage() {
  const { slug } = Route.useParams();
  const { overlay, setOverlay } = useOverlay();
  const { isFav, toggleFav, addToCart } = useTalunaStore();
  const [sort, setSort] = useState<"destacado" | "menor" | "mayor">("destacado");
  const [strapFilter, setStrapFilter] = useState<"todos" | "ancho" | "delgado" | "tejido">("todos");

  const cat = CATEGORIES[slug] ?? { kicker: "Catálogo", title: "Todo", kind: "bag" as const };
  const isStrap = cat.kind === "strap";
  const hero = cat.hero;

  const items = useMemo(() => {
    const base = isStrap
      ? STRAP_LIST.filter((s) => strapFilter === "todos" || s.category === strapFilter).map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          type: "strap" as const,
          kind: "Strap",
          to: "",
          note: s.sizes.join(" · "),
          img: s.img,
        }))
      : BAGS.map((b) => ({
          id: b.id,
          name: `Bolsa ${b.name}`,
          price: b.price,
          type: "bag" as const,
          kind: "Bolsa",
          to: PRODUCT_ROUTE[b.id] ?? "",
          note: "Requiere strap",
          img: b.img,
        }));

    const sorted = [...base];
    if (sort === "menor") sorted.sort((a, b) => a.price - b.price);
    if (sort === "mayor") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [isStrap, sort, strapFilter]);

  const filters: ReadonlyArray<readonly [string, string]> = isStrap
    ? ([
        ["todos", "Todos"],
        ["ancho", "Anchos"],
        ["delgado", "Delgados"],
        ["tejido", "Tejidos"],
      ] as const)
    : ([
        ["destacado", "Destacados"],
        ["menor", "Precio menor"],
        ["mayor", "Precio mayor"],
      ] as const);
  const activeFilter = isStrap ? strapFilter : sort;
  const setFilter = (id: string) =>
    isStrap ? setStrapFilter(id as typeof strapFilter) : setSort(id as typeof sort);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#EFEAE1", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <CollectionHeader
        title={cat.title}
        back="/"
        overHero={Boolean(hero)}
        onFavs={() => setOverlay("favs")}
        onCart={() => setOverlay("cart")}
      />

      {/* Portada de colección */}
      {hero ? (
        <section style={{ position: "relative", height: 420, overflow: "hidden", background: "#E4DACB" }}>
          <img
            src={hero}
            alt={cat.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(33,30,26,0.32) 0%, rgba(33,30,26,0.06) 42%, rgba(33,30,26,0.42) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", padding: "0 20px" }}>
            <p style={{ margin: "0 0 8px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)" }}>{cat.kicker}</p>
            <h1 style={{ margin: 0, fontFamily: FF, fontWeight: 400, fontSize: 34, letterSpacing: "0.02em", color: "#fff" }}>{cat.title}</h1>
          </div>
        </section>
      ) : (
        <section style={{ padding: "112px 16px 4px" }}>
          <p style={{ margin: "0 0 8px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9A6A4B" }}>{cat.kicker}</p>
          <h1 style={{ margin: 0, fontFamily: FF, fontWeight: 400, fontSize: 32, letterSpacing: "-0.01em" }}>{cat.title}</h1>
        </section>
      )}


      {/* Filtros editoriales */}
      <div
        className="tl-scroll"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain",
          padding: "18px 18px 12px",
          borderBottom: "1px solid #E3D9C9",
        }}
      >
        {filters.map(([id, label]) => {
          const on = activeFilter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                flex: "0 0 auto",
                background: "none",
                border: "none",
                borderBottom: `1px solid ${on ? "#211E1A" : "transparent"}`,
                padding: "0 0 7px",
                color: on ? "#211E1A" : "#9C948A",
                fontFamily: FF,
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.25s ease-out, border-color 0.25s ease-out",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <section data-stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px 14px", padding: "22px 16px 50px" }}>
        {items.map((p) => {
          const on = isFav(p.id);
          const strapCard = p.type === "strap";
          const card = (
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden", background: strapCard ? STRAP_BG : CARD_BG, borderRadius: strapCard ? 4 : 3, boxShadow: strapCard ? "0 0 0 1px #E8E0D4" : "none" }}>
              {strapCard && p.img ? (
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 4, transform: "scale(1.32)", mixBlendMode: "multiply", display: "block" }}
                />
              ) : (
                <Media src={p.img} alt={p.name} label="" bg={strapCard ? STRAP_BG : CARD_BG} fit="contain" />
              )}
              {strapCard && (
                <button
                  onClick={() =>
                    addToCart({ id: `strap-${p.id}`, type: "strap", kind: "Strap", name: p.name, price: p.price })
                  }
                  aria-label={`Agregar ${p.name}`}
                  style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(33,30,26,0.12)",
                    color: "#211E1A",
                    cursor: "pointer",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          );
          return (
            <article key={p.id} style={{ position: "relative" }}>
              {p.to ? (
                <Link to={p.to} style={{ display: "block" }}>
                  {card}
                </Link>
              ) : (
                card
              )}
              <button
                onClick={() => toggleFav({ id: p.id, type: p.type, kind: p.kind, name: p.name, price: p.price })}
                aria-label="Favorito"
                style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(255,255,255,0.72)", border: "none", cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#9A6A4B" : "none"} stroke={on ? "#9A6A4B" : "#211E1A"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
                </svg>
              </button>

              <div style={{ padding: "12px 2px 0" }}>
                <p style={{ margin: "0 0 4px", fontFamily: FF, fontSize: 13.5, fontWeight: 300, color: "#211E1A" }}>{p.name}</p>
                <p style={{ margin: 0, fontFamily: FF, fontSize: 13, fontWeight: 300, color: "#6E665C" }}>{fmt(p.price)}</p>
              </div>
            </article>
          );
        })}
      </section>

      <TrustStrip />
      <SiteFooter />
      <Overlays overlay={overlay} close={() => setOverlay(null)} />
    </div>
  );
}
