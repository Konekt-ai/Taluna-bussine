import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import ProductDetail from '@/components/ProductDetail';

// El catálogo se refresca solo cada minuto.
export const revalidate = 60;

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

  // La segunda categoría del catálogo son los straps.
  const strapsSlug = categories[1]?.slug;
  const esStrap = Boolean(strapsSlug && product.category_slug === strapsSlug);
  const straps = esStrap ? [] : all.filter((p) => p.category_slug === strapsSlug);

  return (
    <>
      <div className="tl-space" />
      <ProductDetail
        product={product}
        straps={straps}
        esStrap={esStrap}
        waPhone={content.contacto.whatsapp}
      />
    </>
  );
}
