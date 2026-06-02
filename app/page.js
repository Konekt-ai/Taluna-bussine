import Link from 'next/link';
import { getFeatured, getCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const [featured, categories] = await Promise.all([getFeatured(), getCategories()]);

  return (
    <div>
      {/* HERO — vende desde el primer scroll */}
      <section className="relative overflow-hidden">
        <div className="shell grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="rise">
            <span className="text-sm uppercase tracking-[0.2em] text-wine">Hecho a mano en México</span>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
              Bolsas que cuentan una historia<span className="text-wine">.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              Piezas artesanales premium, pensadas para acompañarte. Cada bolsa es única, igual que tú.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="rounded-full bg-wine px-6 py-3 text-cream transition-colors hover:bg-wineSoft"
              >
                Ver el catálogo
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-6 py-3 text-ink transition-colors hover:border-ink"
              >
                Escríbenos
              </a>
            </div>
          </div>

          <div className="rise grid grid-cols-2 gap-4" style={{ animationDelay: '0.15s' }}>
            {featured.slice(0, 2).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="shell py-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href="/catalogo"
              className="rounded-full border border-line bg-sand px-5 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="shell py-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">Lo más querido</h2>
          <Link href="/catalogo" className="text-sm text-accent hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* BLOQUE DE CONFIANZA */}
      <section className="shell py-12">
        <div className="grid gap-6 rounded-card border border-line bg-sand p-8 sm:grid-cols-3">
          {[
            ['Hecho a mano', 'Cada pieza es elaborada por artesanas mexicanas.'],
            ['Piezas únicas', 'No hay dos bolsas idénticas. La tuya es solo tuya.'],
            ['Atención cercana', 'Te acompañamos por WhatsApp en cada compra.'],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-display text-xl text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
