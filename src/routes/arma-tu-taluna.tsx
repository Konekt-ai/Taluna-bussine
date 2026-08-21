import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Media } from "@/components/taluna/Ph";
import { SiteFooter, TrustStrip } from "@/components/taluna/Footer";
import { Overlays, useOverlay, SolidHeader } from "@/components/taluna/Header";
import { useTalunaStore, fmt } from "@/lib/taluna/store";
import { CFG_BAGS, CFG_SIZES, CFG_COLORS, STRAP_LIST, LENGTHS } from "@/lib/taluna/data";

const FF = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const THUMB_BG = "#F7F1E6";
const STRAP_CARD_BG = "#F7F1E6";

export const Route = createFileRoute("/arma-tu-taluna")({
  head: () => ({
    meta: [
      { title: "Arma tu Taluna · Personaliza tu bolsa artesanal" },
      {
        name: "description",
        content:
          "Elige bolsa, tamaño, color y strap artesanal para crear tu Taluna única. El total se actualiza al instante.",
      },
      { property: "og:title", content: "Arma tu Taluna" },
      {
        property: "og:description",
        content: "Configura tu bolsa de piel: modelo, tamaño, color y strap intercambiable.",
      },
    ],
  }),
  component: ArmaTuTaluna,
});

const STEPS = ["Bolsa", "Tamaño", "Color", "Strap", "Largo"] as const;

function ArmaTuTaluna() {
  const { overlay, setOverlay } = useOverlay();
  const { addToCart, isFav, toggleFav } = useTalunaStore();

  const [step, setStep] = useState(0);
  const [bagId, setBagId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string | null>(null);
  const [strapId, setStrapId] = useState<string | null>(null);
  const [lengthId, setLengthId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const bag = CFG_BAGS.find((b) => b.id === bagId);
  const size = CFG_SIZES.find((s) => s.id === sizeId);
  const color = CFG_COLORS.find((c) => c.id === colorId);
  const strap = STRAP_LIST.find((s) => s.id === strapId);
  const len = LENGTHS.find((l) => l.id === lengthId);

  const total = useMemo(
    () => (bag?.price ?? 0) + (size?.add ?? 0) + (strap?.price ?? 0) + (len?.add ?? 0),
    [bag, size, strap, len],
  );

  const done = [!!bag, !!size, !!color, !!strap, !!len];
  const ready = done.every(Boolean);
  const comboId = `combo-${bagId}-${sizeId}-${colorId}-${strapId}-${lengthId}`;
  const comboName = bag
    ? `${bag.name}${size ? ` ${size.label}` : ""}${color ? ` · ${color.label}` : ""}${strap ? ` + Strap ${strap.name}` : ""}${len ? ` (${len.label})` : ""}`
    : "Tu Taluna";

  const next = (i: number) => setStep(Math.min(i, STEPS.length - 1));

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#EFEAE1", minHeight: "100vh", position: "relative", overflowX: "hidden", paddingBottom: 96 }}>
      <SolidHeader title="Arma tu Taluna" back="/" onFavs={() => setOverlay("favs")} onCart={() => setOverlay("cart")} />

      <section style={{ padding: "26px 18px 18px", textAlign: "center" }}>
        <p style={{ margin: "0 0 10px", fontFamily: FF, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9A6A4B" }}>Personalízalo</p>
        <h1 style={{ margin: "0 0 12px", fontFamily: FF, fontWeight: 600, fontSize: 30, letterSpacing: "-0.02em" }}>Arma tu Taluna</h1>
        <p style={{ margin: "0 auto", maxWidth: "34ch", fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: "#6E665C" }}>
          Cinco pasos para crear tu pieza: modelo, tamaño, color y el strap que la hace tuya.
        </p>
      </section>

      {/* Progreso */}
      <div className="tl-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", padding: "0 18px 18px", position: "sticky", top: 56, background: "#EFEAE1", zIndex: 20 }}>
        {STEPS.map((s, i) => {
          const on = step === i;
          return (
            <button
              key={s}
              onClick={() => setStep(i)}
              style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 16px",
                borderRadius: 999,
                border: `1px solid ${on ? "#211E1A" : "#DED3C2"}`,
                background: on ? "#211E1A" : "transparent",
                color: on ? "#fff" : done[i] ? "#211E1A" : "#9C9286",
                fontFamily: FF,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.8 }}>{`0${i + 1}`}</span>
              {s}
              {done[i] && !on && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9A6A4B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <section style={{ padding: "0 18px" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 20, overflow: "hidden", background: THUMB_BG }}>
          <Media
            src={bag?.img ?? CFG_BAGS[1]?.img}
            alt={bag?.name ?? "Bolsa Taluna"}
            bg={THUMB_BG}
            fit="contain"
            position="center center"
            style={{
              transform: `scale(${bag?.mini ? 1.72 : 1.12})`,
              transformOrigin: "center center",
              filter: "brightness(1.06) saturate(1.02)",
              mixBlendMode: "multiply",
              opacity: bag ? 1 : 0.85,
            }}
          />

          <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.94)", padding: "8px 16px", borderRadius: 999, fontFamily: FF, fontSize: 12, color: "#211E1A" }}>
            {bag ? fmt(total) : "Desde $990"}
          </span>
          {strap && (
            <div style={{ position: "absolute", left: 16, bottom: 16, display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,0.92)", padding: "8px 16px 8px 8px", borderRadius: 999 }}>
              <span style={{ width: 42, height: 42, borderRadius: 999, overflow: "hidden", position: "relative", background: STRAP_CARD_BG, display: "block" }}>
                <Media src={strap.img} alt={strap.name} bg={STRAP_CARD_BG} fit="contain" position="center center" style={{ transform: "scale(1.32)", transformOrigin: "center center", mixBlendMode: "multiply" }} />
              </span>
              <span style={{ fontFamily: FF, fontSize: 12, color: "#211E1A", paddingRight: 4 }}>Strap {strap.name}</span>
            </div>
          )}
        </div>
      </section>

      {/* Paso activo */}
      <section style={{ padding: "26px 18px 0", minHeight: 190 }}>
        {step === 0 && (
          <StepBlock n="01" title="Elige tu bolsa">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {CFG_BAGS.map((b) => {
                const on = b.id === bagId;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBagId(b.id);
                      setAdded(false);
                      next(1);
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "center" }}
                  >
                    <span style={{ display: "block", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: THUMB_BG, position: "relative", boxShadow: `inset 0 0 0 ${on ? "3px" : "0px"} #9A6A4B`, opacity: on ? 1 : 0.9 }}>
                      <Media
                        src={b.img}
                        alt={b.name}
                        label={b.name}
                        bg={THUMB_BG}
                        fit="contain"
                        position="center center"
                        style={{
                          transform: `scale(${b.mini ? 1.72 : 1.0})`,
                          transformOrigin: "center center",
                          filter: "brightness(1.06) saturate(1.02)",
                          mixBlendMode: "multiply",
                        }}
                      />
                    </span>
                    <span style={{ display: "block", marginTop: 8, fontFamily: FF, fontSize: 12, color: on ? "#211E1A" : "#8A8178" }}>{b.name}</span>
                    <span style={{ display: "block", fontFamily: FF, fontSize: 11.5, color: "#9C9286" }}>{fmt(b.price)}</span>
                  </button>
                );
              })}
            </div>
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock n="02" title="Tamaño">
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              {CFG_SIZES.map((s) => (
                <Pill
                  key={s.id}
                  on={sizeId === s.id}
                  onClick={() => {
                    setSizeId(s.id);
                    setAdded(false);
                    next(2);
                  }}
                  label={`${s.label}${s.add ? ` ${s.add > 0 ? "+" : "−"}${fmt(Math.abs(s.add))}` : ""}`}
                />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock n="03" title="Color de piel">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {CFG_COLORS.map((c) => {
                const on = colorId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setColorId(c.id);
                      setAdded(false);
                      next(3);
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "center" }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        background: c.swatch,
                        boxShadow: `0 0 0 1.5px #fff, 0 0 0 ${on ? "2.5px" : "0px"} #211E1A`,
                      }}
                    />
                    <span style={{ display: "block", marginTop: 8, fontFamily: FF, fontSize: 12, color: on ? "#211E1A" : "#8A8178" }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock n="04" title="Elige tu strap" hint="Obligatorio para completar tu bolsa.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {STRAP_LIST.map((s) => {
                const on = strapId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStrapId(s.id);
                      setLengthId(null);
                      setAdded(false);
                      next(4);
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "center" }}
                  >
                    <span style={{ display: "block", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: STRAP_CARD_BG, position: "relative", boxShadow: `inset 0 0 0 ${on ? "3px" : "0px"} #9A6A4B`, opacity: on ? 1 : 0.9 }}>
                      <Media
                        src={s.img}
                        alt={s.name}
                        label={s.name}
                        bg={STRAP_CARD_BG}
                        fit="contain"
                        position="center center"
                        style={{ padding: 4, transform: "scale(1.32)", transformOrigin: "center center", mixBlendMode: "multiply" }}
                      />
                    </span>
                    <span style={{ display: "block", marginTop: 8, fontFamily: FF, fontSize: 12.5, color: on ? "#211E1A" : "#8A8178" }}>{s.name}</span>
                    <span style={{ display: "block", fontFamily: FF, fontSize: 11.5, color: "#9C9286" }}>+{fmt(s.price)}</span>
                  </button>
                );
              })}
            </div>
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock n="05" title="Largo del strap">
            {strap ? (
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {LENGTHS.map((l) => (
                  <Pill
                    key={l.id}
                    on={lengthId === l.id}
                    onClick={() => {
                      setLengthId(l.id);
                      setAdded(false);
                    }}
                    label={`${l.label}${l.add ? ` +${fmt(l.add)}` : ""}`}
                  />
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13.5, color: "#9A6A4B" }}>Primero elige un strap en el paso 04.</p>
            )}
          </StepBlock>
        )}
      </section>

      {/* Resumen */}
      <section style={{ padding: "28px 18px 0" }}>
        <div style={{ padding: "18px 20px", background: "#F8F5EF", borderRadius: 16 }}>
          <SumRow label="Bolsa" value={bag?.name} />
          <SumRow label="Tamaño" value={size?.label} />
          <SumRow label="Color" value={color?.label} />
          <SumRow label="Strap" value={strap?.name} warn />
          <SumRow label="Largo" value={len?.label} last />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 14 }}>
            <span style={{ fontFamily: FF, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Total</span>
            <span style={{ fontFamily: FF, fontSize: 24 }}>{fmt(total)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (!ready || !strap) return;
            toggleFav({ id: comboId, type: "combo", kind: "Combinación", name: comboName, price: total });
          }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 16, background: "none", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E665C" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav(comboId) ? "#6E665C" : "none"} stroke="#6E665C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
          </svg>
          {isFav(comboId) ? "Combinación guardada" : "Guardar combinación"}
        </button>
      </section>

      <section style={{ padding: "34px 18px 10px" }}>
        <Link
          to="/categoria/straps"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 15, border: "1px solid #211E1A", borderRadius: 999, fontFamily: FF, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}
        >
          Ver straps por separado
        </Link>
      </section>

      <TrustStrip />
      <SiteFooter />

      {/* Barra fija */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, margin: "0 auto", maxWidth: 480, zIndex: 45, background: "rgba(252,250,246,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid #E2D8C9", padding: "12px 16px calc(12px + env(safe-area-inset-bottom))" }}>
        <button
          onClick={() => {
            if (!ready) return;
            addToCart({
              id: comboId,
              type: "combo",
              kind: "Set bolsa + strap",
              name: comboName,
              price: total,
              meta: { bag: bagId, size: sizeId, color: colorId, strap: strapId, length: lengthId },
            });
            setAdded(true);
          }}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 999,
            border: "none",
            cursor: ready ? "pointer" : "not-allowed",
            background: ready ? "#211E1A" : "#E4DACB",
            color: "#fff",
            fontFamily: FF,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {added
            ? "Agregado ✓"
            : ready
              ? `Agregar · ${fmt(total)}`
              : !bag
                ? "Elige tu bolsa"
                : !size
                  ? "Elige el tamaño"
                  : !color
                    ? "Elige el color"
                    : !strap
                      ? "Elige un strap"
                      : "Elige el largo"}
        </button>
      </div>

      <Overlays overlay={overlay} close={() => setOverlay(null)} />
    </div>
  );
}

function StepBlock({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p style={{ margin: "0 0 4px", fontFamily: FF, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C9286" }}>
        {n} · {title}
      </p>
      {hint && <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9A6A4B" }}>{hint}</p>}
      <div style={{ marginTop: hint ? 0 : 14 }}>{children}</div>
    </div>
  );
}

function Pill({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "11px 20px",
        borderRadius: 999,
        border: `1px solid ${on ? "#211E1A" : "#E1D8CB"}`,
        background: on ? "#211E1A" : "#fff",
        color: on ? "#fff" : "#211E1A",
        fontFamily: FF,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SumRow({ label, value, warn, last }: { label: string; value?: string | undefined; warn?: boolean; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 14,
        fontSize: 13,
        padding: "6px 0",
        color: "#6E665C",
        borderBottom: last ? "1px solid #F1EAE0" : "none",
      }}
    >
      <span>{label}</span>
      <span style={{ color: value ? "#211E1A" : warn ? "#9A6A4B" : "#B0A696", textAlign: "right" }}>
        {value || (warn ? "Elige uno" : "—")}
      </span>
    </div>
  );
}
