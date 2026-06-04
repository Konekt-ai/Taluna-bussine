import { getProducts, getCategories } from '@/lib/products';
import CatalogGrid from '@/components/CatalogGrid';

export const metadata = {
  title: 'Catálogo · Taluna',
  description: 'Explora todas nuestras bolsas artesanales.',
};

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="wrap section--tight">
      <header className="mb-10">
        <span className="eyebrow">Catálogo</span>
        <h1 className="sec-title" style={{ marginTop: 12 }}>
          Toda la <em>colección.</em>
        </h1>
        <p className="lead" style={{ marginTop: 12 }}>
          {products.length} piezas hechas a mano, listas para enviar.
        </p>
      </header>
      <CatalogGrid products={products} categories={categories} />
    </div>
  );
}
