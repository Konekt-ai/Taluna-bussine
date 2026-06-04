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
      <div className="mb-10 flex flex-wrap gap-2">
        {pills.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`chip${active === c.slug ? ' is-active' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No hay productos en esta categoría todavía.</p>
      ) : (
        <div className="pgrid">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
