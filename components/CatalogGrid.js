'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';

// =====================================================================
//  CUADRÍCULA DEL CATÁLOGO
//  Filtros editoriales (subrayados, en mayúsculas) como en el diseño.
//  Entiende ?c=categoria y ?q=busqueda para que el menú y el buscador del
//  encabezado lleguen directo a lo que se pidió. La dirección se lee ya
//  en el navegador, así el catálogo completo sigue viajando en el HTML
//  (bueno para Google y para que no haya parpadeo).
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

  // Lee ?c= y ?q= de la dirección (y también cuando se cambia de enlace).
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
    <div>
      {/* Categorías */}
      <div className="filters">
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

      {/* Orden */}
      <div className="filters" style={{ borderBottom: 'none', paddingBottom: 22 }}>
        {ORDENES.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setOrden(id)}
            className={`chip${orden === id ? ' is-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {query && (
        <p className="lead" style={{ marginBottom: 22 }}>
          Resultados para <strong style={{ color: 'var(--ink)' }}>{query}</strong> ·{' '}
          {filtered.length} {filtered.length === 1 ? 'pieza' : 'piezas'}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="empty-note">
          {query
            ? 'No encontramos piezas con esa búsqueda. Escríbenos por WhatsApp y te ayudamos.'
            : 'No hay productos en esta categoría todavía.'}
        </p>
      ) : (
        <div className="pgrid" data-stagger>
          {filtered.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
