'use client';

import { useState } from 'react';
import Link from 'next/link';
import { site } from '@/lib/site';

// =====================================================================
//  FRANJA DE CONFIANZA + PIE DE PÁGINA
//  Mismo tratamiento del diseño aprobado: fondo ivory, columnas que en el
//  celular se abren como acordeón y el logo centrado al final.
//  Los datos de contacto y los dos textos los edita la dueña desde el
//  Organizador; lib/site.js queda como respaldo.
// =====================================================================

const TRUST = [
  {
    t: 'Envíos a México',
    s: 'Recibe donde estés',
    p: (
      <>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
      </>
    ),
  },
  {
    t: 'Compra segura',
    s: 'Te acompañamos por WhatsApp',
    p: (
      <>
        <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  },
  {
    t: 'Hecho en México',
    s: 'Origen artesanal',
    p: (
      <>
        <path d="M12 21s-6-4.4-6-9a6 6 0 0 1 12 0c0 4.6-6 9-6 9z" />
        <circle cx="12" cy="12" r="2.2" />
      </>
    ),
  },
];

export function TrustStrip() {
  return (
    <section className="trust">
      <div className="wrap">
        <div className="trust__grid">
          {TRUST.map((it) => (
            <div className="trust__item" key={it.t}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {it.p}
              </svg>
              <b>{it.t}</b>
              <span>{it.s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Una columna del pie: en escritorio se ve completa, en el celular se abre
// y se cierra con el signo de + (igual que el diseño).
function Col({ title, openCol, setOpenCol, children }) {
  const isOpen = openCol === title;
  return (
    <div className={`foot-col${isOpen ? ' open' : ''}`}>
      <h4>{title}</h4>
      <button
        className="foot-col__head"
        onClick={() => setOpenCol(isOpen ? '' : title)}
        aria-expanded={isOpen}
      >
        {title}
        <span style={{ fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{isOpen ? '–' : '+'}</span>
      </button>
      <div className="foot-col__body">{children}</div>
    </div>
  );
}

export default function Footer({ contacto, texts, categories = [] }) {
  const [openCol, setOpenCol] = useState('Tienda');
  const [email, setEmail] = useState('');

  const year = new Date().getFullYear();
  const wa = contacto?.whatsapp || site.whatsapp;
  const mail = contacto?.email || site.email;
  const instagram = contacto?.instagram || site.social.instagram;
  const tiktok = contacto?.tiktok || site.social.tiktok;
  const facebook = contacto?.facebook || site.social.facebook;
  const mapsUrl = contacto?.mapsUrl || site.store.mapsUrl;
  const storeLines = contacto?.storeLines?.length ? contacto.storeLines : site.store.lines;

  const waHref = (msg) => `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;

  // No hay lista de correo todavía: el alta se hace por WhatsApp, que es
  // por donde la dueña atiende. Así el formulario sí sirve para algo.
  function subscribe(e) {
    e.preventDefault();
    if (!email.includes('@')) return;
    window.open(
      waHref(`Hola Taluna, quiero recibir sus novedades. Mi correo es ${email}`),
      '_blank',
      'noopener,noreferrer'
    );
    setEmail('');
  }

  return (
    <>
      <TrustStrip />

      <footer className="footer">
        <div className="wrap">
          {/* Novedades */}
          <div className="foot-news">
            <h3>Recibe novedades de Taluna</h3>
            <p>Sé la primera en conocer nuevas piezas, lanzamientos y combinaciones.</p>
            <form className="foot-news__form" onSubmit={subscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo"
                aria-label="Tu correo"
              />
              <button type="submit" aria-label="Suscribirme">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </button>
            </form>
            <small>Te escribimos por WhatsApp. Sin spam, solo novedades de Taluna.</small>
          </div>

          {/* Columnas */}
          <div className="foot-cols">
            <Col title="Tienda" openCol={openCol} setOpenCol={setOpenCol}>
              <ul>
                <li>
                  <Link href="/catalogo">Ver catálogo</Link>
                </li>
                {(categories || []).slice(0, 4).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/catalogo?c=${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </Col>

            <Col title="Marca" openCol={openCol} setOpenCol={setOpenCol}>
              <ul>
                <li>
                  <Link href="/#historia">Nuestra historia</Link>
                </li>
                <li>
                  <Link href="/#comunidad">Comunidad</Link>
                </li>
                <li>
                  <Link href="/#contacto">Contacto</Link>
                </li>
                <li>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    Cómo llegar
                  </a>
                </li>
              </ul>
            </Col>

            <Col title="Ayuda" openCol={openCol} setOpenCol={setOpenCol}>
              <ul>
                <li>
                  <a href={waHref('Hola Taluna, tengo una duda sobre envíos.')} target="_blank" rel="noopener noreferrer">
                    Envíos
                  </a>
                </li>
                <li>
                  <a href={waHref('Hola Taluna, quiero preguntar por cambios.')} target="_blank" rel="noopener noreferrer">
                    Cambios y devoluciones
                  </a>
                </li>
                <li>
                  <a href={waHref('Hola Taluna, quiero un pedido personalizado.')} target="_blank" rel="noopener noreferrer">
                    Pedidos personalizados
                  </a>
                </li>
                <li>
                  <a href={`mailto:${mail}`}>{mail}</a>
                </li>
              </ul>
            </Col>

            <Col title="Síguenos" openCol={openCol} setOpenCol={setOpenCol}>
              <p>{texts?.horario}</p>
              <ul>
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    Instagram {contacto?.igHandle || '@talunamx'}
                  </a>
                </li>
                <li>
                  <a href={tiktok} target="_blank" rel="noopener noreferrer">
                    TikTok
                  </a>
                </li>
                <li>
                  <a href={facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={waHref('Hola Taluna, me gustaría hacer un pedido.')} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </Col>
          </div>

          {/* Cierre */}
          <div className="foot-bottom">
            <img className="foot-logo" src="/logo-taluna-dark.png" alt="Taluna MX" />
            <span style={{ maxWidth: '46ch' }}>{texts?.about}</span>
            <span>
              {storeLines.join(' · ')} — © {year} Taluna MX
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
