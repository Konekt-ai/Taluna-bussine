import Link from 'next/link';
import CartIcon from './CartIcon';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Taluna<span className="text-wine">.</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-ink">
            Inicio
          </Link>
          <Link href="/catalogo" className="text-muted transition-colors hover:text-ink">
            Catálogo
          </Link>
          <a
            href="https://www.instagram.com/talunamx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Taluna"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <CartIcon />
          <Link
            href="/catalogo"
            className="rounded-full bg-wine px-4 py-2 text-cream transition-colors hover:bg-wineSoft"
          >
            Ver bolsas
          </Link>
        </div>
      </nav>
    </header>
  );
}
