'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Activa las animaciones .reveal en CUALQUIER página y al cambiar de ruta.
// Incluye un failsafe para que el contenido nunca quede invisible.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let els = Array.from(document.querySelectorAll('.reveal:not(.in)'));

    const check = () => {
      const h = window.innerHeight || document.documentElement.clientHeight;
      for (let i = els.length - 1; i >= 0; i--) {
        const r = els[i].getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > 0) {
          els[i].classList.add('in');
          els.splice(i, 1);
        }
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    // Failsafe: si algo impide la animación, muestra lo que esté en pantalla.
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < (window.innerHeight || 800) && r.bottom > 0) el.classList.add('shown');
      });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
