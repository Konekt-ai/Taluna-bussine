import { getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import CatalogGrid from '@/components/CatalogGrid';
import RichText from '@/components/blocks/RichText';

// El catálogo se refresca solo cada minuto (lo que la dueña guarda
// en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

export const metadata = {
  title: 'Catálogo · Taluna',
  description: 'Explora todas nuestras bolsas artesanales.',
};

export default async function CatalogoPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  // El encabezado lo edita la dueña; {piezas} se cambia por el número real.
  const { eyebrow, title, lead } = content.catalogo;
  const leadText = String(lead || '').replace(/\{piezas\}/g, products.length);

  return (
    <div className="wrap section--tight">
      <header className="mb-10">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="sec-title" style={{ marginTop: 12 }}>
          <RichText text={title} />
        </h1>
        {leadText && (
          <p className="lead" style={{ marginTop: 12 }}>
            {leadText}
          </p>
        )}
      </header>
      <CatalogGrid products={products} categories={categories} />
    </div>
  );
}
