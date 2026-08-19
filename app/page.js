import { getProducts, getCategories, formatPrice } from '@/lib/products';
import { getSiteContent, ASSETS } from '@/lib/site-content';
import HomeEffects from '@/components/HomeEffects';
import { BLOCKS } from '@/components/blocks/HomeBlocks';

// El catálogo y los textos se refrescan solos cada minuto (lo que la dueña
// guarda en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

// =====================================================================
//  HOME
//  La página se arma con los bloques que la dueña dejó guardados en el
//  Organizador: en SU orden, solo los que están visibles y con SUS textos
//  y fotos. Cada bloque vive en components/blocks/HomeBlocks.js y los
//  valores originales en lib/site-content.js.
// =====================================================================

export default async function Home() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  const { contacto } = content;

  const featured = (products.filter((p) => p.is_featured).length
    ? products.filter((p) => p.is_featured)
    : products
  ).slice(0, 4);

  // Portada por categoría: primera foto real de un producto de esa categoría.
  const coverFor = (slug) =>
    products.find((p) => p.category_slug === slug && p.images?.[0]?.url)?.images?.[0]?.url || null;

  // Fotos reales para la comunidad (Instagram); si faltan, el asset artesanal.
  const productImgs = products.map((p) => p.images?.[0]?.url).filter(Boolean);
  const igImgs = Array.from({ length: 5 }, (_, i) => productImgs[i] || ASSETS.craft);

  const ctx = {
    products,
    categories,
    featured,
    heroFeat: featured[0] || products[0],
    coverFor,
    igImgs,
    contacto,
    formatPrice,
    waHref: (msg) => `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(msg)}`,
  };

  return (
    <>
      {content.blocks
        .filter((b) => b.on !== false)
        .map((b) => {
          const Block = BLOCKS[b.type];
          return Block ? <Block key={b.id} b={b} ctx={ctx} /> : null;
        })}
      <HomeEffects />
    </>
  );
}
