import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FOOTER_COLS } from "@/lib/taluna/data";
import { ASSETS } from "@/lib/taluna/assets";


const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export function TrustStrip() {
  const items = [
    {
      title: "Envíos a México",
      sub: "Recibe donde estés",
      path: (
        <>
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </>
      ),
    },
    {
      title: "Pagos seguros",
      sub: "Compra protegida",
      path: (
        <>
          <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
          <polyline points="9 12 11 14 15 10" />
        </>
      ),
    },
    {
      title: "Hecho en México",
      sub: "Origen artesanal",
      path: (
        <>
          <path d="M12 21s-6-4.4-6-9a6 6 0 0 1 12 0c0 4.6-6 9-6 9z" />
          <circle cx="12" cy="12" r="2.2" />
        </>
      ),
    },
  ];
  return (
    <section style={{ background: "#EFEAE1", padding: "40px 20px 8px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "1px solid #DED3C2",
          borderBottom: "1px solid #DED3C2",
        }}
      >
        {items.map((it, i) => (
          <div
            key={it.title}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 8,
              padding: "20px 8px",
              borderLeft: i === 1 ? "1px solid #E7DDCD" : undefined,
              borderRight: i === 1 ? "1px solid #E7DDCD" : undefined,
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9A6A4B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {it.path}
            </svg>
            <p style={{ margin: 0, fontFamily: FF, fontSize: 12, color: "#211E1A" }}>{it.title}</p>
            <p style={{ margin: 0, fontFamily: FF, fontSize: 10, fontWeight: 300, color: "#9C9286" }}>
              {it.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  const [open, setOpen] = useState<string>("Tienda");

  return (
    <footer style={{ background: "#EFEAE1", color: "#211E1A", padding: "48px 22px 40px" }}>
      {/* Newsletter */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <p
          style={{
            margin: "0 0 10px",
            fontFamily: FF,
            fontWeight: 400,
            fontSize: 22,
            letterSpacing: "-0.01em",
            color: "#211E1A",
          }}
        >
          Recibe novedades de Taluna
        </p>
        <p
          style={{
            margin: "0 auto 24px",
            fontFamily: FF,
            fontSize: 14,
            fontWeight: 300,
            lineHeight: 1.5,
            color: "#6E665C",
            maxWidth: "34ch",
          }}
        >
          Sé la primera en conocer nuevas piezas, lanzamientos y combinaciones.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #211E1A",
            paddingBottom: 9,
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          <input
            placeholder="Tu correo"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#211E1A",
              fontFamily: FF,
              fontSize: 15,
              textAlign: "left",
            }}
          />
          <button
            aria-label="Suscribir"
            style={{ background: "none", border: "none", color: "#211E1A", cursor: "pointer", padding: 0 }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </button>
        </div>
        <p style={{ margin: "12px 0 0", fontFamily: FF, fontSize: 11, fontWeight: 300, color: "#A79C8C" }}>
          Sin spam. Solo novedades de Taluna.
        </p>
      </div>

      {/* Acordeones */}
      <div>
        {FOOTER_COLS.map((col) => {
          const isOpen = open === col.title;
          return (
            <div key={col.title} style={{ borderTop: "1px solid #DED3C2" }}>
              <button
                onClick={() => setOpen(isOpen ? "" : col.title)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: FF,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#211E1A",
                }}
              >
                {col.title}
                <span style={{ fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "2px 0 18px" }}>
                  {col.links.map((l) =>
                    l.to ? (
                      <Link
                        key={l.label}
                        to={l.to}
                        style={{ fontFamily: FF, fontSize: 14, fontWeight: 300, color: "#6E665C" }}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <span
                        key={l.label}
                        style={{ fontFamily: FF, fontSize: 14, fontWeight: 300, color: "#6E665C" }}
                      >
                        {l.label}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ borderTop: "1px solid #DED3C2" }} />
      </div>

      {/* Cierre */}
      <div style={{ marginTop: 34, textAlign: "center" }}>
        <img
          src={ASSETS.logoDark}
          alt="Taluna MX"
          style={{ display: "block", height: 22, width: "auto", margin: "0 auto 18px", opacity: 0.9 }}
        />

        <p style={{ margin: 0, fontFamily: FF, fontSize: 11, letterSpacing: "0.04em", color: "#9C9286" }}>
          © 2026 Taluna · Hecho en México
        </p>
      </div>
    </footer>
  );
}
