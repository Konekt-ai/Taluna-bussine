'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { site } from '@/lib/site';

// =====================================================================
//  ENCABEZADO
//  Igual que el diseño aprobado: barra de aviso arriba, logo al centro,
//  menú de categorías debajo. Sobre la portada se ve transparente (logo
//  blanco) y al bajar se vuelve vidrio esmerilado (logo oscuro).
// =====================================================================

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="13" x2="21" y2="13" />
    <line x1="3" y1="19" x2="15" y2="19" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const IconBag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const IconWa = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z" />
  </svg>
);

export default function Nav({ contacto, categories = [], announcement }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Empezamos suponiendo portada en el inicio; el efecto lo confirma.
  const [overHero, setOverHero] = useState(pathname === '/');

  // El número lo edita la dueña desde el Organizador; site.js es el respaldo.
  const waHref = `https://wa.me/${contacto?.whatsapp || site.whatsapp}?text=${encodeURIComponent(
    'Hola Taluna, me gustaría hacer un pedido.'
  )}`;

  // Menú: catálogo + las categorías reales del catálogo + marca.
  const links = useMemo(() => {
    const cats = (categories || []).slice(0, 5).map((c) => ({
      label: c.name,
      href: `/catalogo?c=${c.slug}`,
    }));
    return [
      { label: 'Catálogo', href: '/catalogo' },
      ...cats,
      { label: 'Historia', href: '/#historia' },
      { label: 'Contacto', href: '/#contacto', accent: true },
    ];
  }, [categories]);

  // ¿Hay portada a pantalla completa en esta página? Si la hay, el
  // encabezado va transparente encima de ella.
  useEffect(() => {
    setOverHero(!!document.querySelector('[data-hero]'));
    setSearchOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = !overHero || scrolled || searchOpen || open;
  const aviso = announcement || 'Envíos a todo México · Hecho a mano en México';

  return (
    <>
      <header
        className={`nav${solid ? ' solid' : ''}${overHero ? ' over' : ''}${
          scrolled ? ' scrolled' : ''
        }`}
        id="nav"
      >
        <div className="nav__scrim" aria-hidden="true" />

        <div className="nav__ann">{aviso}</div>

        <div className="nav__bar">
          <div className="nav__left">
            <button
              className="icon-btn nav__burger"
              aria-label="Menú"
              onClick={() => setOpen(true)}
            >
              <IconMenu />
            </button>
          </div>

          <Link className="brand" href="/" aria-label="Taluna MX — inicio">
            <img
              className="brand__logo"
              src={solid ? '/logo-taluna-dark.png' : '/logo-taluna-light.png'}
              alt="Taluna MX"
            />
          </Link>

          <div className="nav__right">
            <button
              className="icon-btn"
              aria-label="Buscar"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((s) => !s)}
            >
              <IconSearch />
            </button>

            <Link href="/carrito" className="icon-btn" aria-label={`Bolsa (${count} artículos)`}>
              <IconBag />
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>

            <a
              className="icon-btn"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir por WhatsApp"
            >
              <IconWa />
            </a>
          </div>
        </div>

        <nav className="nav__links" aria-label="Categorías">
          {links.map((l) => (
            <Link
              key={l.label}
              className={`nav__link${l.accent ? ' is-accent' : ''}${
                pathname === l.href ? ' is-active' : ''
              }`}
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {searchOpen && (
          <div className="nav__search">
            <form
              className="nav__search-in"
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                window.location.href = `/catalogo?q=${encodeURIComponent(String(q || ''))}`;
              }}
            >
              <IconSearch />
              <input name="q" placeholder="Buscar bolsas, straps…" autoFocus />
            </form>
          </div>
        )}
      </header>

      {/* Cajón lateral (móvil) */}
      <div
        className={`sheet${open ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="sheet__panel">
          <div className="sheet__head">
            <Link href="/" onClick={() => setOpen(false)}>
              <img className="sheet__logo" src="/logo-taluna-dark.png" alt="Taluna MX" />
            </Link>
            <button className="icon-btn" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          <nav className="sheet__nav">
            {links.map((l) => (
              <Link
                key={`s-${l.label}`}
                className={`sheet__link${l.accent ? ' is-accent' : ''}`}
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </Link>
            ))}

            <a
              className="btn btn--primary btn--block"
              style={{ marginTop: 26 }}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir por WhatsApp
            </a>

            <div className="sheet__foot">
              <a href={contacto?.instagram || site.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
