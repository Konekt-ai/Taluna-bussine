import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, formatPrice } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import ProductGallery from '@/components/ProductGallery';
import ProductBuy from '@/components/ProductBuy';
import ProductCard from '@/components/ProductCard';

// El catálogo se refresca solo cada minuto (lo que la dueña guarda
// en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

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
  const [product, all, content] = await Promise.all([
    getProductBySlug(params.slug),
    getProducts(),
    getSiteContent(),
  ]);
  if (!product) notFound();

  const { contacto } = content;
  const priceLabel = formatPrice(product.price, product.currency);
  const waMessage = `Hola Taluna, me interesa la "${product.name}" (${priceLabel}). ¿Sigue disponible?`;
  const waHref = `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(waMessage)}`;
  const soldOut = product.sold_out ?? product.total_stock === 0;

  // Detalles de la ficha: los que trae el Organizador (color, tamaño,
  // medidas, herrajes…) o, si viene del catálogo viejo, los de siempre.
  const details = product.details?.length
    ? product.details
    : [
        { label: 'Materiales', value: product.materials },
        { label: 'Medidas', value: product.dimensions },
      ].filter((d) => d.value);

  // Piezas que combinan: primero de la misma categoría.
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category_slug === product.category_slug) - Number(a.category_slug === product.category_slug))
    .slice(0, 5);

  return (
    <>
      <div className="nav-space" />

      <div className="wrap pdp" style={{ paddingTop: 12 }}>
        <Link href="/catalogo" className="pdp__back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 5 8 12 15 19" />
          </svg>
          Volver al catálogo
        </Link>

        <div className="pdp__grid">
          <ProductGallery images={product.images || []} name={product.name} />

          <div>
            {product.category_name && <span className="kicker">{product.category_name}</span>}
            <h1 className="pdp__name">{product.name}</h1>
            <p className="pdp__price">{priceLabel}</p>

            {(product.story || product.short_desc) && (
              <p className="pdp__intro">{product.story || product.short_desc}</p>
            )}

            {/* Variantes / disponibilidad */}
            {product.variants?.length > 0 && (
              <>
                <span className="pdp__label">Disponibilidad</span>
                <div className="pdp__variants">
                  {product.variants.map((v) => (
                    <span
                      key={v.sku || v.name}
                      className={`pdp__variant${v.stock > 0 ? '' : ' off'}`}
                    >
                      {v.name} {v.stock > 0 ? `· ${v.stock}` : '· agotado'}
                    </span>
                  ))}
                </div>
              </>
            )}

            <ProductBuy
              product={product}
              soldOut={soldOut}
              priceLabel={priceLabel}
              waHref={waHref}
            />

            {/* Detalles */}
            {details.length > 0 && (
              <dl className="pdp__specs">
                {details.map((d) => (
                  <div className="pdp__spec" key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>

      {/* Piezas que combinan */}
      {related.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <div className="sec-head">
              <div className="sec-head__t">
                <span className="kicker">También te puede gustar</span>
                <h2 className="sec-title">
                  Sigue <em>explorando.</em>
                </h2>
              </div>
              <Link href="/catalogo" className="seelink">
                Ver todo
              </Link>
            </div>

            <div className="pgrid pgrid--compact">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} variant="min" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
