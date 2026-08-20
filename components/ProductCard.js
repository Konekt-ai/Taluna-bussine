'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

// =====================================================================
//  FICHA DE PRODUCTO EN CUADRÍCULA
//  Diseño aprobado: foto casi a escuadra sobre fondo crema, y debajo
//  nombre y precio en texto chiquito. Nada de recuadros ni sombras.
//  variant="min" es la versión compacta de "Lo más vendido".
// =====================================================================

function formatPrice(value, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value || 0);
}

// Mapea nombres de color reales (variantes) a un swatch. Solo colores conocidos:
// las variantes que no son color (ej. "Para bolsa") simplemente no muestran swatch.
const COLOR_MAP = {
  negra: '#2A2622', negro: '#2A2622',
  blanca: '#F4EDE1', blanco: '#F4EDE1',
  crema: '#E4DACB',
  camel: '#A9743F',
  arena: '#C9B79C',
  taupe: '#9B8C79',
  acero: '#8D8B87',
  gris: '#8A8A86',
  cafe: '#7A5238', café: '#7A5238',
  vino: '#6E2F37',
  roja: '#7A2E3B', rojo: '#7A2E3B',
  salvia: '#A8B29A',
  tinta: '#2E2A45',
  'azul marino': '#28344B',
  'azul claro': '#9DB6CC',
  rosa: '#D8B7AE',
};

function swatchesFor(product) {
  if (!Array.isArray(product.variants)) return [];
  const out = [];
  for (const v of product.variants) {
    const hex = COLOR_MAP[(v.name || '').trim().toLowerCase()];
    if (hex && !out.includes(hex)) out.push(hex);
    if (out.length >= 4) break;
  }
  return out;
}

export default function ProductCard({ product, variant = 'full', priority = false }) {
  const { addItem, isFav, toggleFav } = useCart();
  const [added, setAdded] = useState(false);
  const fav = isFav(product.slug);
  const min = variant === 'min';

  const img = product.images?.[0]?.url;
  // El Organizador marca el estado ("Agotada"); el catálogo viejo solo
  // tenía inventario. total_stock null = no se lleva inventario de esa pieza.
  const soldOut = product.sold_out ?? product.total_stock === 0;
  const lowStock = product.total_stock > 0 && product.total_stock <= 3;
  const swatches = min ? [] : swatchesFor(product);

  const badges = [];
  if (soldOut) badges.push(['soft', 'Agotado']);
  else if (lowStock) badges.push(['last', 'Últimas piezas']);
  else if (product.is_featured) badges.push(['new', 'Destacada']);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Link className={`pcard${min ? ' pcard--min' : ''}`} href={`/producto/${product.slug}`}>
      <div className="pcard__media">
        {img ? (
          <Image
            src={img}
            alt={product.images?.[0]?.alt || product.name}
            fill
            sizes={min ? '(max-width: 720px) 33vw, 20vw' : '(max-width: 720px) 50vw, 25vw'}
            className="pimg"
            priority={priority}
          />
        ) : (
          <div className="imgph">{product.name}</div>
        )}

        {badges.length > 0 && (
          <div className="pcard__badges">
            {badges.map(([kind, label]) => (
              <span key={label} className={`badge badge--${kind}`}>
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Guardar en favoritos, como en el diseño */}
        <button
          className={`round-btn pcard__fav${fav ? ' on' : ''}`}
          aria-label={fav ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name}`}
          aria-pressed={fav}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFav(product);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
          </svg>
        </button>

        {!min && (
          <div
            className="pcard__add"
            role="button"
            tabIndex={0}
            onClick={handleAdd}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleAdd(e);
            }}
          >
            {soldOut ? 'Avísame' : added ? 'Agregado ✓' : 'Agregar a la bolsa'}
          </div>
        )}
      </div>

      <div className="pcard__body">
        <div className="pcard__cat">{product.category_name}</div>
        <div className="pcard__name">{product.name}</div>
        <div className="pcard__row">
          <div className="pcard__price">{formatPrice(product.price, product.currency)}</div>
          {swatches.length > 0 && (
            <div className="pcard__swatches">
              {swatches.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
