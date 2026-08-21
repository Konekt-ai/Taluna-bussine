import { Link } from "@tanstack/react-router";
import { useTalunaStore, fmt, waLink } from "@/lib/taluna/store";
import { Ph } from "./Ph";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Cerrar"
      style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "#211E1A" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
      </svg>
    </button>
  );
}

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  zIndex: 60,
  width: "88%",
  maxWidth: 422,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  animation: "tlSlideInR 0.28s cubic-bezier(0.22,1,0.36,1)",
  boxShadow: "-30px 0 60px -30px rgba(0,0,0,0.4)",
  margin: "0 auto",
};

const headerRow: React.CSSProperties = {
  height: 56,
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 18px",
  borderBottom: "1px solid #EFE7DC",
};

const titleStyle: React.CSSProperties = {
  fontFamily: FF,
  fontSize: 13,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

export function Scrim({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(24,20,16,0.42)",
        backdropFilter: "blur(2px)",
        animation: "tlFade 0.2s ease",
        maxWidth: 480,
        margin: "0 auto",
      }}
    />
  );
}

export function FavsDrawer({ onClose }: { onClose: () => void }) {
  const { favs, removeFav } = useTalunaStore();
  const lines = favs.map((f) => `${f.kind || "Pieza"}: ${f.name} — ${fmt(f.price)}`).join("\n");

  return (
    <div style={drawerStyle}>
      <div style={headerRow}>
        <span style={titleStyle}>Favoritos</span>
        <CloseX onClick={onClose} />
      </div>
      {favs.length > 0 ? (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            {favs.map((f) => (
              <div key={f.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #F1EAE0" }}>
                <div style={{ width: 66, height: 84, flex: "0 0 auto", overflow: "hidden", background: "#F4EFE8", position: "relative" }}>
                  <Ph label={f.name} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ margin: "0 0 2px", fontFamily: FF, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9C9286" }}>
                    {f.kind}
                  </p>
                  <p style={{ margin: "0 0 4px", fontFamily: FF, fontSize: 15, fontWeight: 400 }}>{f.name}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6E665C" }}>{fmt(f.price)}</p>
                </div>
                <button
                  onClick={() => removeFav(f.id)}
                  aria-label="Quitar"
                  style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 4, cursor: "pointer", color: "#B7AD9F" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: "0 0 auto", padding: "16px 18px", borderTop: "1px solid #EFE7DC", display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href={waLink("Hola Taluna, me gustaron estos favoritos:\n" + lines)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: 15,
                background: "#211E1A",
                color: "#fff",
                fontFamily: FF,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 999,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.3A8.5 8.5 0 1 1 21 11.5z" />
              </svg>
              Enviar por WhatsApp
            </a>
            <button
              onClick={onClose}
              style={{
                padding: 14,
                border: "1px solid #211E1A",
                background: "#fff",
                fontFamily: FF,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Seguir explorando
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D8CDBD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 18 }}>
            <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
          </svg>
          <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.6, color: "#9C9286", fontWeight: 300, maxWidth: "26ch" }}>
            Guarda tus bolsas, straps o combinaciones favoritas.
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "14px 30px",
              background: "#211E1A",
              color: "#fff",
              border: "none",
              fontFamily: FF,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Explorar
          </button>
        </div>
      )}
    </div>
  );
}

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, removeFromCart, cartTotal } = useTalunaStore();

  return (
    <div style={drawerStyle}>
      <div style={headerRow}>
        <span style={titleStyle}>Carrito</span>
        <CloseX onClick={onClose} />
      </div>
      {cart.length > 0 ? (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            {cart.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #F1EAE0" }}>
                <div style={{ width: 66, height: 84, flex: "0 0 auto", overflow: "hidden", background: "#F4EFE8", position: "relative" }}>
                  <Ph label={c.name} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ margin: "0 0 2px", fontFamily: FF, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9C9286" }}>
                    {c.kind}
                  </p>
                  <p style={{ margin: "0 0 4px", fontFamily: FF, fontSize: 15, fontWeight: 400 }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6E665C" }}>{fmt(c.price)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(c.id)}
                  aria-label="Quitar"
                  style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 4, cursor: "pointer", color: "#B7AD9F" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: "0 0 auto", padding: "16px 18px", borderTop: "1px solid #EFE7DC" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <span style={{ fontFamily: FF, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>Total</span>
              <span style={{ fontFamily: FF, fontSize: 20 }}>{fmt(cartTotal)}</span>
            </div>
            <button
              style={{
                width: "100%",
                padding: 16,
                background: "#211E1A",
                color: "#fff",
                border: "none",
                fontFamily: FF,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Pagar con Stripe
            </button>
            <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 11, color: "#B0A696" }}>
              Checkout seguro · listo para conectar Stripe
            </p>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D8CDBD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 18 }}>
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.6, color: "#9C9286", fontWeight: 300, maxWidth: "26ch" }}>
            Tu carrito está vacío.
          </p>
          <Link
            to="/arma-tu-taluna"
            style={{
              padding: "14px 30px",
              background: "#211E1A",
              color: "#fff",
              fontFamily: FF,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              borderRadius: 999,
            }}
          >
            Arma tu Taluna
          </Link>
        </div>
      )}
    </div>
  );
}
