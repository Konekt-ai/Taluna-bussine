'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';

// =====================================================================
//  CUADRÍCULA DEL CATÁLOGO
//  Filtros editoriales subrayados + rejilla de dos, como en el diseño
//  (categoria.$slug.tsx). Entiende ?c=categoria y ?q=busqueda.
// =====================================================================

const ORDENES = [
  ['destacado', 'Destacados'],
  ['menor', 'Precio menor'],
  ['mayor', 'Precio mayor'],
];

export default function CatalogGrid({ products, categories }) {
  const [active, setActive] = useState('todos');
  const [query, setQuery] = useState('');
  const [orden, setOrden] = useState('destacado');

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      setActive(p.get('c') || 'todos');
      setQuery((p.get('q') || '').trim().toLowerCase());
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  // La segunda categoría son los straps: sus fichas llevan otro trato.
  const strapsSlug = categories[1]?.slug;

  const filtered = useMemo(() => {
    let list = products;
    if (active !== 'todos') list = list.filter((p) => p.category_slug === active);
    if (query) {
      list = list.filter((p) =>
        `${p.name} ${p.category_name || ''} ${p.short_desc || ''}`.toLowerCase().includes(query)
      );
    }
    const out = [...list];
    if (orden === 'menor') out.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (orden === 'mayor') out.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (orden === 'destacado') out.sort((a, b) => Number(!!b.is_featured) - Number(!!a.is_featured));
    return out;
  }, [active, orden, products, query]);

  const pills = [{ slug: 'todos', name: 'Todas' }, ...categories];

  return (
    <>
      <div className="tl-filters tl-scroll">
        {pills.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`tl-filter${active === c.slug ? ' on' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="tl-filters tl-scroll" style={{ borderBottom: 'none', paddingBottom: 4 }}>
        {ORDENES.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setOrden(id)}
            className={`tl-filter${orden === id ? ' on' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="tl-empty">
          {query
            ? 'No encontramos piezas con esa búsqueda. Escríbenos por WhatsApp y te ayudamos.'
            : 'No hay productos en esta categoría todavía.'}
        </p>
      ) : (
        <section className="tl-cat__grid" data-stagger>
          {filtered.map((p) => (
            <div className="reveal" key={p.slug}>
              <ProductCard product={p} esStrap={p.category_slug === strapsSlug} />
            </div>
          ))}
        </section>
      )}
    </>
  );
}
