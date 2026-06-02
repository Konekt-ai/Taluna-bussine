import Link from 'next/link';

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
