import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MediaVideo } from "@/components/taluna/Ph";
import { ASSETS } from "@/lib/taluna/assets";

const CENTER = 56; // % del ancho para el video protagonista
const GAP = 10;
const EASE = "cubic-bezier(0.22,0.61,0.36,1)";
const TAP_SLOP = 8; // px: por debajo de esto es tap, no swipe

export function ReelsSpotlight() {
  const base = ASSETS.reels;
  const N = base.length;
  const slides = useMemo(
    () => [...base, ...base, ...base].map((src, i) => ({ src, poster: ASSETS.reelPosters[i % N], key: i })),
    [base, N]
  );
  const [index, setIndex] = useState(N);
  const [anim, setAnim] = useState(true);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; poster?: string | undefined } | null>(null);
  const [closing, setClosing] = useState(false);
  const moved = useRef(false);
  const bodyOverflow = useRef<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);
  const activeId = useRef<number | null>(null);

  // Ancho de un paso (slide + gap) en px
  const step = () => {
    const w = wrapRef.current?.clientWidth ?? 0;
    return (w * CENTER) / 100 + GAP;
  };

  // Reposiciona al bloque central sin salto visible (loop infinito real)
  useEffect(() => {
    if (index < 2 * N && index >= N) return undefined;
    const t = setTimeout(() => {
      setAnim(false);
      setIndex((i) => (i >= 2 * N ? i - N : i + N));
    }, 520);
    return () => clearTimeout(t);
  }, [index, N]);

  useEffect(() => {
    if (anim) return undefined;
    const r = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(r);
  }, [anim]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  // Bloquear scroll del body mientras el lightbox está abierto
  useEffect(() => {
    if (!lightbox) {
      if (bodyOverflow.current !== null) {
        document.body.style.overflow = bodyOverflow.current;
        bodyOverflow.current = null;
      }
      return undefined;
    }
    bodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return undefined;
  }, [lightbox]);

  const closeLightbox = () => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setLightbox(null);
      setClosing(false);
      closeTimer.current = null;
    }, 260);
  };

  // Cerrar lightbox con Escape
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const endDrag = (clientX: number) => {
    if (activeId.current === null) return;
    activeId.current = null;
    const dx = clientX - startX.current;
    const wasDragging = axis.current === "x";
    setDragging(false);
    setDrag(0);
    axis.current = null;
    if (!wasDragging) return;
    const s = step() || 1;
    let move = 0;
    if (Math.abs(dx) > s * 0.5) move = -Math.round(dx / s);
    else if (Math.abs(dx) > 36) move = dx < 0 ? 1 : -1;
    if (move !== 0) setIndex((i) => i + move);
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: dragging ? "grabbing" : "grab",
      }}
      onPointerDown={(e) => {
        activeId.current = e.pointerId;
        startX.current = e.clientX;
        startY.current = e.clientY;
        moved.current = false;
        axis.current = null;
      }}
      onPointerMove={(e) => {
        if (activeId.current === null) return;
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        if (axis.current === null) {
          if (Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) return;
          if (Math.abs(dx) <= Math.abs(dy)) {
            // gesto vertical: dejamos que la página haga scroll
            activeId.current = null;
            setDragging(false);
            setDrag(0);
            return;
          }
          axis.current = "x";
          moved.current = true;
          setDragging(true);
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
        }
        setDrag(dx);
      }}
      onPointerUp={(e) => endDrag(e.clientX)}
      onPointerCancel={(e) => endDrag(e.clientX)}
      onLostPointerCapture={(e) => endDrag(e.clientX)}
    >
      <div
        style={{
          display: "flex",
          gap: GAP,
          alignItems: "center",
          transform: `translateX(calc(${(100 - CENTER) / 2}% - ${index} * (${CENTER}% + ${GAP}px) + ${drag}px))`,
          transition: dragging || !anim ? "none" : `transform 520ms ${EASE}`,
          willChange: "transform",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            style={{
              flex: `0 0 ${CENTER}%`,
              aspectRatio: "9 / 16",
              background: "#E4DACB",
              overflow: "hidden",
              borderRadius: 6,
              position: "relative",
              userSelect: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (moved.current) return;
              if (i !== index) {
                setIndex(i);
                return;
              }
              setLightbox({ src: s.src, poster: s.poster });
            }}
          >
            <MediaVideo src={s.src} poster={s.poster} bg="#E4DACB" />
          </div>
        ))}
      </div>

      {lightbox
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className={`tl-lightbox-backdrop ${closing ? "is-exit" : ""}`}
              onClick={closeLightbox}
            >
              <button
                type="button"
                aria-label="Cerrar video"
                className="tl-lightbox-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
              <div className="tl-lightbox-modal" onClick={(e) => e.stopPropagation()}>
                <MediaVideo src={lightbox.src} poster={lightbox.poster} bg="#E4DACB" eager />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
