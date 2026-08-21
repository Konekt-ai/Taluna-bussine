'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  FICHA EN LA CUADRÍCULA DEL CATÁLOGO
//  Porte fiel de la rejilla de categoria.$slug.tsx: dos por renglón,
//  foto casi a escuadra y debajo el nombre y el precio.
// =====================================================================

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

export default function ProductCard({ product, esStrap = false }) {
  const { addItem, isFav, toggleFav } = useCart();
  const on = isFav(product.slug);

  const img = product.images?.[0]?.url;
  const agotado = product.sold_out ?? product.total_stock === 0;

  return (
    <div className="tl-pcard">
      <Link href={`/producto/${product.slug}`}>
        <div className={`tl-cat__card${esStrap ? ' tl-cat__card--strap' : ''}`}>
          {img ? (
            <img src={img} alt={product.images?.[0]?.alt || product.name} loading="lazy" />
          ) : (
            <span className="tl-ph">{product.name}</span>
          )}
          {agotado && <span className="tl-tag">Agotado</span>}
        </div>
      </Link>

      <button
        className={`tl-fav${on ? ' on' : ''}`}
        aria-label={on ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name}`}
        aria-pressed={on}
        onClick={() => toggleFav(product)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
        </svg>
      </button>

      {esStrap && !agotado && (
        <button
          className="tl-cat__add"
          aria-label={`Agregar ${product.name}`}
          onClick={() => addItem(product)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      <p className="tl-cat__name">{product.name}</p>
      <p className="tl-cat__price">{precio(product.price, product.currency)}</p>
    </div>
  );
}
