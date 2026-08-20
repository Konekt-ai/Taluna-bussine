'use client';

import { useEffect, useState } from 'react';

// =====================================================================
//  AVISO DE NOVEDADES
//  Aparece una sola vez por visita, unos segundos después de entrar (no
//  estorba la carga). No hay lista de correo todavía, así que el alta se
//  hace por WhatsApp, que es por donde atiende Taluna.
// =====================================================================

const CLAVE = 'taluna-newsletter';

export default function NewsletterPopup({ image, waPhone, texto, titulo }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLAVE) === '1') return undefined;
    } catch {
      return undefined;
    }
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(CLAVE, '1');
      } catch {
        /* noop */
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  function enviar(e) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError(true);
      return;
    }
    setError(false);
    setListo(true);
    window.open(
      `https://wa.me/${waPhone}?text=${encodeURIComponent(
        `Hola Taluna, quiero recibir sus novedades. Mi correo es ${email}`
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
    setTimeout(() => setOpen(false), 2400);
  }

  return (
    <div className="np" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Novedades de Taluna">
      <div className="np__card" onClick={(e) => e.stopPropagation()}>
        <button className="np__x" onClick={() => setOpen(false)} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        {image && (
          <div className="np__img">
            <img src={image} alt="" />
          </div>
        )}

        {listo ? (
          <div className="np__body center">
            <span className="np__ok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2>¡Bienvenida!</h2>
            <p>Ya eres parte de Taluna. Pronto sabrás de nosotras.</p>
          </div>
        ) : (
          <div className="np__body">
            <img className="np__logo" src="/logo-taluna-dark.png" alt="Taluna MX" />
            <p className="np__lead">{texto}</p>
            <p className="np__strong">{titulo}</p>

            <form onSubmit={enviar}>
              <input
                type="email"
                className="inp np__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Déjanos tu correo"
                aria-label="Tu correo"
                style={error ? { borderColor: '#B5544E' } : undefined}
              />
              <button type="submit" className="btn btn--primary btn--block">
                Suscribirme
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
