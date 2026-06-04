'use client';

import { useEffect } from 'react';

// Ajusta el video del hero (velocidad suave + respeto a "reduce motion").
// Las animaciones .reveal las activa <ScrollReveal /> de forma global.
export default function HomeEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const v = document.querySelector('.hero__video');
    if (!v) return;

    if (reduce) {
      v.removeAttribute('autoplay');
      v.pause();
      return;
    }

    const tryPlay = () => {
      try { v.playbackRate = 0.82; } catch (e) {}
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    v.addEventListener('loadeddata', tryPlay, { once: true });
    v.addEventListener('canplay', tryPlay, { once: true });
    tryPlay();
  }, []);

  return null;
}
