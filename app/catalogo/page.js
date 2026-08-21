import { getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import CatalogGrid from '@/components/CatalogGrid';
import Pic from '@/components/Pic';
import { plainText } from '@/components/blocks/RichText';

// El catálogo se refresca solo cada minuto (lo que la dueña guarda
// en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

export const metadata = {
  title: 'Catálogo · Taluna',
  description: 'Bolsas y straps artesanales de piel, hechos a mano en México.',
};

export default async function CatalogoPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  const { eyebrow, title, lead, image, imageMobile } = content.catalogo;
  const leadText = String(lead || '').replace(/\{piezas\}/g, products.length);
  const cover = image || products.find((p) => p.images?.[0]?.url)?.images?.[0]?.url || null;

  return (
    <>
      {cover ? (
        <section className="tl-cover" data-hero>
          <Pic src={cover} mobile={image ? imageMobile : ''} alt={plainText(title)} priority />
          <div className="tl-cover__scrim" />
          <div className="tl-cover__b">
            {eyebrow && <p>{eyebrow}</p>}
            <h1>{plainText(title)}</h1>
          </div>
        </section>
      ) : (
        <section className="tl-plainhead">
          {eyebrow && <p>{eyebrow}</p>}
          <h1>{plainText(title)}</h1>
          {leadText && (
            <p style={{ marginTop: 12, fontSize: 14, fontWeight: 300, color: 'var(--tl-muted)', letterSpacing: 0, textTransform: 'none' }}>
              {leadText}
            </p>
          )}
        </section>
      )}

      <CatalogGrid products={products} categories={categories} />
    </>
  );
}
