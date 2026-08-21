'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  MODELOS TALUNA
//  Porte fiel de ModelosTaluna (src/routes/index.tsx): pestañas por
//  modelo, foto de ambiente a la izquierda y la pieza a la derecha con
//  sus colores y el botón +.
//  Los modelos son los productos reales del catálogo.
// =====================================================================

const COLOR_MAP = {
  negra: '#2A2622', negro: '#2A2622',
  blanca: '#F4EDE1', blanco: '#F4EDE1',
  crema: '#E4DACB',
  camel: '#A9743F',
  arena: '#C9B79C',
  taupe: '#9B8C79',
  acero: '#8D8B87',
  gris: '#8A8A86',
  cafe: '#7A5238', 'café': '#7A5238',
  vino: '#6E2F37',
  roja: '#7A2E3B', rojo: '#7A2E3B',
  salvia: '#A8B29A',
  tinta: '#2E2A45',
  'azul marino': '#28344B',
  'azul claro': '#9DB6CC',
  rosa: '#D8B7AE',
};

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

function coloresDe(p) {
  if (!Array.isArray(p.variants)) return [];
  const out = [];
  for (const v of p.variants) {
    const hex = COLOR_MAP[(v.name || '').trim().toLowerCase()];
    if (hex && !out.some((c) => c.hex === hex)) out.push({ hex, name: v.name });
    if (out.length >= 5) break;
  }
  return out;
}

export default function ModelTabs({ models = [] }) {
  const { addItem } = useCart();
  const [i, setI] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  if (!models.length) return null;

  const p = models[Math.min(i, models.length - 1)];
  const colores = coloresDe(p);
  const ambiente = p.images?.[1]?.url || p.images?.[0]?.url;
  const pieza = p.images?.[0]?.url;

  return (
    <>
      <div className="tl-mod__tabs tl-scroll" role="tablist">
        {models.map((m, idx) => (
          <button
            key={m.slug}
            role="tab"
            aria-selected={idx === i}
            className={`tl-mod__tab${idx === i ? ' on' : ''}`}
            onClick={() => {
              setI(idx);
              setColorIdx(0);
            }}
          >
            {m.name.replace(/^bolsa\s+/i, '')}
          </button>
        ))}
      </div>

      <div className="tl-mod__grid" data-stagger>
        <Link href={`/producto/${p.slug}`} className="tl-mod__life reveal">
          {ambiente ? <img src={ambiente} alt={p.name} loading="lazy" /> : <span className="tl-ph">{p.name}</span>}
        </Link>

        <div className="reveal" data-d="1">
          <div className="tl-mod__pieza">
            <Link href={`/producto/${p.slug}`} aria-label={`Ver ${p.name}`}>
              {pieza ? <img src={pieza} alt={p.name} loading="lazy" /> : <span className="tl-ph">{p.name}</span>}
            </Link>

            <button
              className="tl-mod__plus"
              aria-label={`Agregar ${p.name} al carrito`}
              onClick={() => addItem(p)}
            >
              +
            </button>

            {colores.length > 0 && (
              <div className="tl-mod__colors">
                {colores.map((c, idx) => (
                  <button
                    key={c.hex}
                    aria-label={c.name}
                    title={c.name}
                    className={idx === colorIdx ? 'on' : ''}
                    style={{ background: c.hex }}
                    onClick={() => setColorIdx(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="tl-mod__name">{p.name}</p>
          <p className="tl-mod__price">{precio(p.price, p.currency)}</p>
        </div>
      </div>
    </>
  );
}
