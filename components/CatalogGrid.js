'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function CatalogGrid({ products, categories }) {
  const [active, setActive] = useState('todos');

  const filtered = useMemo(() => {
    if (active === 'todos') return products;
    return products.filter((p) => p.category_slug === active);
  }, [active, products]);

  const pills = [{ slug: 'todos', name: 'Todas' }, ...categories];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {pills.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              active === c.slug
                ? 'border-wine bg-wine text-cream'
                : 'border-line bg-sand text-muted hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No hay productos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
