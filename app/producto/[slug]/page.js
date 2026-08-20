import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import ProductDetail from '@/components/ProductDetail';
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
  const [product, all, categories, content] = await Promise.all([
    getProductBySlug(params.slug),
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);
  if (!product) notFound();

  // La segunda categoría del catálogo son los straps (la primera, las bolsas).
  const strapsSlug = categories[1]?.slug;
  const esStrap = strapsSlug && product.category_slug === strapsSlug;
  const straps = esStrap ? [] : all.filter((p) => p.category_slug === strapsSlug);

  // Piezas que combinan: primero las de la misma categoría.
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort(
      (a, b) =>
        Number(b.category_slug === product.category_slug) -
        Number(a.category_slug === product.category_slug)
    )
    .slice(0, 5);

  return (
    <>
      <div className="nav-space" />

      <div className="wrap">
        <Link href="/catalogo" className="pdp__back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 5 8 12 15 19" />
          </svg>
          Volver al catálogo
        </Link>
      </div>

      <ProductDetail
        product={product}
        straps={straps}
        esStrap={Boolean(esStrap)}
        waPhone={content.contacto.whatsapp}
      />

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
