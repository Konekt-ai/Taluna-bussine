'use client';

import { useState } from 'react';
import Link from 'next/link';
import { site } from '@/lib/site';

// =====================================================================
//  FRANJA DE CONFIANZA + PIE
//  Porte fiel de src/components/taluna/Footer.tsx del diseño.
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
    t: 'Pagos seguros',
    s: 'Compra protegida',
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
    <section className="tl-trust">
      <div className="tl-trust__grid">
        {TRUST.map((it) => (
          <div className="tl-trust__item" key={it.t}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              {it.p}
            </svg>
            <b>{it.t}</b>
            <span>{it.s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Footer({ contacto, texts, categories = [] }) {
  const [open, setOpen] = useState('Tienda');
  const [email, setEmail] = useState('');

  const year = new Date().getFullYear();
  const wa = contacto?.whatsapp || site.whatsapp;
  const mail = contacto?.email || site.email;
  const instagram = contacto?.instagram || site.social.instagram;
  const tiktok = contacto?.tiktok || site.social.tiktok;
  const facebook = contacto?.facebook || site.social.facebook;
  const mapsUrl = contacto?.mapsUrl || site.store.mapsUrl;

  const waHref = (msg) => `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;

  const cols = [
    {
      title: 'Tienda',
      links: [
        { label: 'Ver catálogo', to: '/catalogo' },
        ...(categories || []).slice(0, 4).map((c) => ({ label: c.name, to: `/catalogo?c=${c.slug}` })),
        { label: 'Arma tu Taluna', to: '/arma-tu-taluna' },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        { label: 'Envíos', href: waHref('Hola Taluna, tengo una duda sobre envíos.') },
        { label: 'Cambios y devoluciones', href: waHref('Hola Taluna, quiero preguntar por cambios.') },
        { label: 'Pedidos personalizados', href: waHref('Hola Taluna, quiero un pedido personalizado.') },
        { label: mail, href: `mailto:${mail}` },
      ],
    },
    {
      title: 'Marca',
      links: [
        { label: 'Nuestra historia', to: '/#historia' },
        { label: 'Comunidad', to: '/#comunidad' },
        { label: 'Contacto', to: '/#contacto' },
        { label: 'Cómo llegar', href: mapsUrl },
      ],
    },
    {
      title: 'Síguenos',
      links: [
        { label: `Instagram ${contacto?.igHandle || '@talunamx'}`, href: instagram },
        { label: 'TikTok', href: tiktok },
        { label: 'Facebook', href: facebook },
        { label: 'WhatsApp', href: waHref('Hola Taluna, me gustaría hacer un pedido.') },
      ],
    },
  ];

  // No hay lista de correo todavía: el alta se hace por WhatsApp.
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

      <footer className="tl-ft">
        {/* Novedades */}
        <div className="tl-ft__news">
          <h3>Recibe novedades de Taluna</h3>
          <p>Sé la primera en conocer nuevas piezas, lanzamientos y combinaciones.</p>
          <form className="tl-ft__form" onSubmit={subscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              aria-label="Tu correo"
            />
            <button type="submit" aria-label="Suscribir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </button>
          </form>
          <small>Te escribimos por WhatsApp. Sin spam, solo novedades de Taluna.</small>
        </div>

        {/* Acordeones */}
        <div className="tl-ft__cols">
          {cols.map((col) => {
            const isOpen = open === col.title;
            return (
              <div className="tl-ft__col" key={col.title}>
                <button
                  className="tl-ft__colhead"
                  onClick={() => setOpen(isOpen ? '' : col.title)}
                  aria-expanded={isOpen}
                >
                  {col.title}
                  <span>{isOpen ? '–' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="tl-ft__colbody">
                    {col.links.map((l) =>
                      l.to ? (
                        <Link key={l.label} href={l.to}>
                          {l.label}
                        </Link>
                      ) : (
                        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label}
                        </a>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cierre */}
        <div className="tl-ft__end">
          <img src="/logo-taluna-dark.png" alt="Taluna MX" />
          <p>
            © {year} Taluna · Hecho en México
          </p>
          {texts?.about && (
            <p style={{ marginTop: 10, maxWidth: '38ch', marginLeft: 'auto', marginRight: 'auto', fontWeight: 300 }}>
              {texts.about}
            </p>
          )}
        </div>
      </footer>
    </>
  );
}
