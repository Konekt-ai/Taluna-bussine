import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, formatPrice } from '@/lib/products';

// Genera las rutas estáticas de cada producto (mejor SEO + velocidad).
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Producto no encontrado · Taluna' };
  return {
    title: `${product.name} · Taluna`,
    description: product.short_desc || product.story,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const img = product.images?.[0]?.url;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5213312345678';
  const waMessage = `Hola Taluna, me interesa la "${product.name}" (${formatPrice(
    product.price,
    product.currency
  )}). ¿Sigue disponible?`;
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
  const soldOut = product.total_stock === 0;

  return (
    <div className="shell py-10">
      <Link href="/catalogo" className="text-sm text-muted hover:text-ink">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-sand">
          {img ? (
            <Image
              src={img}
              alt={product.images?.[0]?.alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">Sin imagen</div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm uppercase tracking-wide text-muted">{product.category_name}</span>
          <h1 className="mt-1 font-display text-4xl leading-tight text-ink">{product.name}</h1>
          <p className="mt-4 text-2xl font-medium text-wine">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.story && <p className="mt-6 leading-relaxed text-muted">{product.story}</p>}

          {/* Variantes / disponibilidad */}
          {product.variants?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-ink">Disponibilidad</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <span
                    key={v.sku || v.name}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      v.stock > 0
                        ? 'border-line text-ink'
                        : 'border-line text-muted line-through opacity-60'
                    }`}
                  >
                    {v.name} {v.stock > 0 ? `(${v.stock})` : '(agotado)'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA WhatsApp */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-cream transition-colors sm:w-auto ${
              soldOut ? 'bg-muted' : 'bg-wine hover:bg-wineSoft'
            }`}
          >
            {soldOut ? 'Avísame cuando llegue' : 'Comprar por WhatsApp'}
          </a>

          {/* Detalles */}
          <dl className="mt-10 divide-y divide-line border-t border-line text-sm">
            {product.materials && (
              <div className="flex justify-between py-3">
                <dt className="text-muted">Materiales</dt>
                <dd className="max-w-[60%] text-right text-ink">{product.materials}</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between py-3">
                <dt className="text-muted">Medidas</dt>
                <dd className="text-ink">{product.dimensions}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
