'use client';

import { useEffect, useRef, useState } from 'react';

// =====================================================================
//  PORTADA QUE RECONOCE EL DISPOSITIVO
//
//  · Si la portada es FOTO: <picture> elige sola la versión vertical
//    (celular) o la horizontal (tablet / computadora).
//  · Si la portada es VIDEO: primero se pinta la foto de respaldo (que
//    también tiene su versión de celular) y encima entra el video que
//    toque. El archivo se decide en el navegador, así que el celular
//    NUNCA descarga el video pesado de computadora.
//  · Si el teléfono va en "ahorro de datos" o el usuario pidió menos
//    animación, se queda la foto y el video ni se descarga.
// =====================================================================

const MOBILE_Q = '(max-width: 640px)';

export default function HeroMedia({ media = {}, alt = 'Taluna' }) {
  const esFoto = media.type === 'image';

  const foto = media.image || '';
  const fotoMovil = media.imageMobile || '';
  const poster = media.poster || '';
  const posterMovil = media.posterMobile || '';
  const video = media.src || '';
  const videoMovil = media.srcMobile || '';

  const ref = useRef(null);
  const [fuente, setFuente] = useState(null); // el video que toca, ya decidido
  const [listo, setListo] = useState(false); // ya se puede ver el video

  useEffect(() => {
    if (esFoto || !video) return undefined;

    const chico = window.matchMedia(MOBILE_Q).matches;
    const conn = navigator.connection || {};
    const pocoDatos = conn.saveData === true || /2g/.test(conn.effectiveType || '');
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Con ahorro de datos o "menos movimiento" se queda la foto fija.
    if (pocoDatos || menosMovimiento) return undefined;

    setFuente(chico && videoMovil ? videoMovil : video);
    return undefined;
  }, [esFoto, video, videoMovil]);

  // Reproducir en cuanto se pueda; pausar si la portada sale de pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el || !fuente) return undefined;

    const play = () => {
      el.muted = true;
      try {
        el.playbackRate = 0.85;
      } catch {
        /* algunos navegadores no lo permiten */
      }
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    };

    el.addEventListener('canplay', play);
    play();

    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) play();
            else el.pause();
          }
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(el);
    }

    return () => {
      el.removeEventListener('canplay', play);
      io?.disconnect();
    };
  }, [fuente]);

  // ---- Portada de FOTO ----
  if (esFoto && (foto || fotoMovil)) {
    return (
      <div className="hero__media">
        <picture>
          {foto && fotoMovil && <source media={MOBILE_Q} srcSet={fotoMovil} />}
          <img className="hero__photo" src={foto || fotoMovil} alt={alt} fetchPriority="high" />
        </picture>
      </div>
    );
  }

  // ---- Portada de VIDEO (con foto de respaldo debajo) ----
  return (
    <div className="hero__media">
      {(poster || posterMovil) && (
        <picture>
          {posterMovil && <source media={MOBILE_Q} srcSet={posterMovil} />}
          <img
            className="hero__photo"
            src={poster || posterMovil}
            alt={alt}
            fetchPriority="high"
          />
        </picture>
      )}

      {fuente && (
        <video
          ref={ref}
          className={`hero__video${listo ? ' is-ready' : ''}`}
          src={fuente}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          onLoadedData={() => setListo(true)}
        />
      )}
    </div>
  );
}
