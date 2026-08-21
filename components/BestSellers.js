'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

// Cuadrícula de tres por renglón con el corazón, como "Más vendidos"
// del diseño (src/routes/index.tsx).

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

export default function BestSellers({ products = [] }) {
  const { isFav, toggleFav } = useCart();

  return (
    <div className="tl-grid3" data-stagger>
      {products.map((p) => {
        const on = isFav(p.slug);
        const img = p.images?.[0]?.url;
        const agotado = p.sold_out ?? p.total_stock === 0;
        const tag = agotado ? 'Agotado' : p.is_featured ? 'Destacada' : null;

        return (
          <div className="tl-pcard reveal" key={p.slug}>
            <Link href={`/producto/${p.slug}`} className="tl-pcard__box">
              {img ? <img src={img} alt={p.name} loading="lazy" /> : <span className="tl-ph">{p.name}</span>}
              {tag && <span className="tl-tag">{tag}</span>}
            </Link>

            <button
              className={`tl-fav${on ? ' on' : ''}`}
              aria-label={on ? `Quitar ${p.name} de favoritos` : `Guardar ${p.name}`}
              aria-pressed={on}
              onClick={() => toggleFav(p)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
              </svg>
            </button>

            <div className="tl-pcard__b">
              <p>{p.name}</p>
              <p>{precio(p.price, p.currency)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
