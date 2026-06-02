import { getProducts, getCategories } from '@/lib/products';
import CatalogGrid from '@/components/CatalogGrid';

export const metadata = {
  title: 'Catálogo · Taluna',
  description: 'Explora todas nuestras bolsas artesanales.',
};

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="shell py-12">
      <header className="mb-10">
        <span className="text-sm uppercase tracking-[0.2em] text-wine">Catálogo</span>
        <h1 className="mt-2 font-display text-4xl text-ink">Todas las bolsas</h1>
        <p className="mt-2 text-muted">{products.length} piezas disponibles.</p>
      </header>
      <CatalogGrid products={products} categories={categories} />
    </div>
  );
}
