'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { site } from '@/lib/site';

// =====================================================================
//  ENCABEZADO
//  Porte fiel del diseño (Artisan Migration · src/routes/index.tsx y
//  src/components/taluna/Header.tsx):
//    · barra de aviso de 34 px
//    · fila de 62 px: menú | logo | buscar · favoritos · bolsa
//    · navegación horizontal de categorías, que se recoge al bajar
//  Sobre la portada va transparente con logo blanco; al bajar se vuelve
//  vidrio esmerilado con logo oscuro.
// =====================================================================

const Menu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="13" x2="21" y2="13" />
    <line x1="3" y1="19" x2="15" y2="19" />
  </svg>
);

const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const Heart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
  </svg>
);

const Bag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export default function Nav({ contacto, categories = [], announcement }) {
  const pathname = usePathname();
  const { count, favCount, openDrawer } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === '/');

  const waHref = `https://wa.me/${contacto?.whatsapp || site.whatsapp}?text=${encodeURIComponent(
    'Hola Taluna, me gustaría hacer un pedido.'
  )}`;

  // Menú de categorías: las reales del catálogo + Arma tu Taluna.
  const links = useMemo(() => {
    const cats = (categories || []).slice(0, 4).map((c) => ({
      label: c.name,
      href: `/catalogo?c=${c.slug}`,
    }));
    return [...cats, { label: 'Arma tu Taluna', href: '/arma-tu-taluna', accent: true }];
  }, [categories]);

  // ¿Esta página lleva portada a pantalla completa?
  useEffect(() => {
    setOverHero(!!document.querySelector('[data-hero]'));
    setSearchOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menu]);

  const solid = scrolled || searchOpen || menu || !overHero;
  const aviso = announcement || 'Envío gratis desde $1,500 · Hecho a mano en México';

  return (
    <>
      <div
        className={`tl-fixed tl-hd${solid ? ' solid' : ''}${overHero ? '' : ' plain'}`}
        id="nav"
      >
        {overHero && <div className="tl-hd__scrim" aria-hidden="true" />}

        <div className="tl-ann">
          <p>{aviso}</p>
        </div>

        <header>
          <div className="tl-hd__bar">
            <div className="tl-hd__left">
              <button className="tl-ic tl-ic--menu" aria-label="Menú" onClick={() => setMenu(true)}>
                <Menu />
              </button>
            </div>

            <Link className="tl-hd__logo" href="/" aria-label="Taluna MX — inicio">
              <img
                src={solid ? '/logo-taluna-dark.png' : '/logo-taluna-light.png'}
                alt="Taluna MX"
              />
            </Link>

            <div className="tl-hd__right">
              <button
                className="tl-ic"
                aria-label="Buscar"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((s) => !s)}
              >
                <Search />
              </button>

              <button
                className="tl-ic"
                aria-label={`Favoritos (${favCount})`}
                onClick={() => openDrawer('favs')}
              >
                <Heart />
                {favCount > 0 && <span className="tl-badge tl-badge--fav">{favCount}</span>}
              </button>

              <button
                className="tl-ic"
                aria-label={`Carrito (${count})`}
                onClick={() => openDrawer('cart')}
              >
                <Bag />
                {count > 0 && <span className="tl-badge">{count}</span>}
              </button>
            </div>
          </div>

          {/* Navegación horizontal (se recoge al bajar) */}
          <nav className="tl-hd__nav tl-scroll" aria-label="Categorías">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className={l.accent ? 'accent' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
        </header>

        {searchOpen && (
          <div className="tl-search">
            <form
              className="tl-search__in"
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                window.location.href = `/catalogo?q=${encodeURIComponent(String(q || ''))}`;
              }}
            >
              <Search />
              <input name="q" placeholder="Buscar bolsas, straps…" autoFocus />
            </form>
          </div>
        )}
      </div>

      {/* Cajón del menú */}
      {menu && (
        <>
          <div className="tl-scrim" onClick={() => setMenu(false)} aria-hidden="true" />
          <div className="tl-menu">
            <div className="tl-menu__head">
              <img src="/logo-taluna-dark.png" alt="Taluna MX" />
              <button className="tl-ic" aria-label="Cerrar" onClick={() => setMenu(false)}>
                <Close />
              </button>
            </div>

            <nav className="tl-menu__nav">
              {[...links, { label: 'Historia', href: '/#historia' }, { label: 'Contacto', href: '/#contacto' }].map(
                (l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={`tl-menu__link${l.accent ? ' accent' : ''}`}
                    onClick={() => setMenu(false)}
                  >
                    {l.label}
                    <Chevron />
                  </Link>
                )
              )}

              <div className="tl-menu__foot">
                <a href={contacto?.instagram || site.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
