'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { site } from '@/lib/site';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/catalogo', label: 'Bolsas' },
  { href: '/catalogo', label: 'Straps' },
  { href: '/#historia', label: 'Historia' },
  { href: '/#contacto', label: 'Contacto' },
];

export default function Nav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    'Hola Taluna, me gustaría hacer un pedido.'
  )}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra la hoja móvil al cambiar de ruta.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav__in">
          <Link className="brand" href="/" aria-label="Taluna MX inicio">
            <span className="brand__mark">Taluna</span>
            <span className="brand__mx">MX</span>
          </Link>

          <nav className="nav__links">
            {LINKS.map((l, i) => (
              <Link
                key={`${l.label}-${i}`}
                className={`nav__link${pathname === l.href ? ' is-active' : ''}`}
                href={l.href}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav__right">
            <Link
              href="/carrito"
              className="icon-btn"
              style={{ position: 'relative' }}
              aria-label={`Bolsa (${count} artículos)`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9 8a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>

            <a
              className="btn btn--primary nav__cta"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="nav__cta-text">Pedir por WhatsApp</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z" />
              </svg>
            </a>

            <button
              className="icon-btn nav__burger"
              aria-label="Menú"
              onClick={() => setOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hoja móvil */}
      <div
        className={`sheet${open ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="sheet__panel">
          <div className="sheet__head">
            <Link className="brand" href="/">
              <span className="brand__mark">Taluna</span>
              <span className="brand__mx">MX</span>
            </Link>
            <button className="icon-btn" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {LINKS.map((l, i) => (
            <Link key={`s-${l.label}-${i}`} className="sheet__link" href={l.href}>
              {l.label}
            </Link>
          ))}
          <a
            className="btn btn--primary btn--block"
            style={{ marginTop: 24 }}
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
