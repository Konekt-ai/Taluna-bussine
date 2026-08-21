'use client';

import { useEffect, useState } from 'react';

// =====================================================================
//  AVISO DE NOVEDADES
//  Porte fiel de NewsletterPopup del diseño: sale a los 4 segundos, una
//  sola vez por visita. Como no hay lista de correo, el alta se hace por
//  WhatsApp, que es por donde atiende Taluna.
// =====================================================================

const CLAVE = 'tl-newsletter';

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
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  function enviar() {
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
    setTimeout(() => setOpen(false), 2600);
  }

  return (
    <div className="tl-np" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Novedades de Taluna">
      <div className="tl-np__card" onClick={(e) => e.stopPropagation()}>
        <button className="tl-np__x" onClick={() => setOpen(false)} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        {image && (
          <div className="tl-np__img">
            <img src={image} alt="Colección Taluna MX" />
          </div>
        )}

        {listo ? (
          <div className="tl-np__b">
            <span className="tl-np__ok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2>¡Bienvenida!</h2>
            <p>Ya eres parte de Taluna. Pronto sabrás de nosotras.</p>
          </div>
        ) : (
          <div className="tl-np__b">
            <img className="logo" src="/logo-taluna-dark.png" alt="Taluna MX" />
            <p>{texto}</p>
            <p className="strong">{titulo}</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
              placeholder="Déjanos tu correo"
              aria-label="Tu correo"
              style={error ? { borderColor: '#B5544E' } : undefined}
            />
            <button className="sub" onClick={enviar}>
              Suscribirme
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
