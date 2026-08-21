import { useEffect, useRef, useState } from "react";

// Placeholder temporal de imagen — respeta proporciones y fondos del diseño
// original. Se reemplazará por las fotos reales conforme se suban.

/** Fondo compartido por las cards de producto y de straps (mismo que "Más vendidos"). */
export const CARD_BG = "#FCFAF6";


export function Ph({
  label,
  style,
  bg = "#F4EFE8",
  fill = true,
}: {
  label?: string | undefined;
  style?: React.CSSProperties | undefined;
  bg?: string | undefined;
  fill?: boolean | undefined;
}) {

  return (
    <div
      aria-hidden="true"
      style={{
        position: fill ? "absolute" : "relative",
        inset: fill ? 0 : undefined,
        width: "100%",
        height: "100%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#BCB1A0",
          textAlign: "center",
          padding: "0 8px",
          lineHeight: 1.4,
        }}
      >
        {label || "Imagen pendiente"}
      </span>
    </div>
  );
}

/**
 * Media: si hay src real, la muestra ocupando el mismo espacio que el placeholder.
 * Si no, cae al placeholder con la etiqueta indicada.
 */
export function Media({
  src,
  alt,
  label,
  bg = "#F4EFE8",
  fit = "cover",
  position = "center",
  style,
}: {
  src?: string | undefined;
  alt?: string | undefined;
  label?: string | undefined;
  bg?: string | undefined;
  fit?: "cover" | "contain" | undefined;
  position?: string | undefined;
  style?: React.CSSProperties | undefined;

}) {
  if (!src) return <Ph label={label} bg={bg} />;
  return (
    <img
      src={src}
      alt={alt ?? label ?? ""}
      loading="lazy"
      decoding="async"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: position,
        background: bg,
        display: "block",
        ...style,
      }}
    />
  );
}

/**
 * Video mudo en loop que se comporta como imagen de fondo.
 * Optimizado: no descarga nada hasta acercarse al viewport, muestra poster
 * mientras carga y se pausa automáticamente cuando sale de pantalla.
 */
export function MediaVideo({
  src,
  srcMobile,
  poster,
  bg = "#F4EFE8",
  style,
  eager = false,
}: {
  src: string;
  srcMobile?: string | undefined;
  poster?: string | undefined;
  bg?: string | undefined;
  style?: React.CSSProperties | undefined;
  eager?: boolean | undefined;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  // la fuente se decide en cliente (móvil/desktop) para no descargar dos veces
  const [load, setLoad] = useState(false);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    // versión ligera en móvil / conexiones lentas
    const small =
      typeof window !== "undefined" &&
      (window.matchMedia("(max-width: 780px)").matches ||
        (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
          .connection?.saveData === true);
    setSource(small && srcMobile ? srcMobile : src);
    if (eager) setLoad(true);
  }, [src, srcMobile, eager]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => {});
    };


    if (eager) tryPlay();

    // reintentos: algunos navegadores bloquean el primer intento
    el.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);

    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return () => {
        el.removeEventListener("canplay", tryPlay);
        document.removeEventListener("visibilitychange", tryPlay);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setLoad(true);
            tryPlay();
          } else {
            el.pause();
          }
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [eager]);

  return (
    <video
      ref={ref}
      {...(load && source ? { src: source } : {})}
      {...(poster ? { poster } : {})}
      autoPlay
      muted
      {...({ "x-webkit-airplay": "deny" } as Record<string, string>)}


      loop
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      preload={eager ? "auto" : "metadata"}
      {...(eager ? { fetchPriority: "high" as const } : {})}
      onLoadedData={() => {
        void ref.current?.play().catch(() => {});
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        background: bg,
        display: "block",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}



