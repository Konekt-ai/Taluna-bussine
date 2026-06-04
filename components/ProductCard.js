'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

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
  negra: '#2A251F', negro: '#2A251F',
  blanca: '#F4EDE1', blanco: '#F4EDE1',
  camel: '#C7A079',
  taupe: '#9C8B76',
  gris: '#8A8A86',
  roja: '#7A2E3B', rojo: '#7A2E3B',
  tinta: '#2E2A45',
  'azul marino': '#28344B',
  'azul claro': '#9DB6CC',
  rosa: '#D8A7AE',
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

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);

  const img = product.images?.[0]?.url;
  const soldOut = product.total_stock === 0;
  const lowStock = product.total_stock > 0 && product.total_stock <= 3;
  const swatches = swatchesFor(product);

  const badges = [];
  if (product.is_featured && !soldOut) badges.push(['new', 'Nuevo']);
  if (lowStock) badges.push(['last', 'Últimas piezas']);
  if (soldOut) badges.push(['soft', 'Agotado']);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Link className="pcard" href={`/producto/${product.slug}`}>
      <div className="pcard__media">
        {img ? (
          <Image
            src={img}
            alt={product.images?.[0]?.alt || product.name}
            fill
            sizes="(max-width: 960px) 50vw, 25vw"
            className="pimg"
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

        <button
          className={`pcard__fav${fav ? ' on' : ''}`}
          aria-label="Guardar"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFav((f) => !f);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="pcard__add"
          role="button"
          onClick={handleAdd}
          style={soldOut ? { background: 'var(--sand)', color: 'var(--ink-60)' } : undefined}
        >
          {soldOut ? 'Avísame' : added ? '¡Agregado! ✓' : 'Agregar a la bolsa'}
        </div>
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
