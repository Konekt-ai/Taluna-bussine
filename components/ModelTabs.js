'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  MODELOS TALUNA
//  Pestañas por modelo, como en el diseño: a la izquierda la foto de
//  ambiente y a la derecha la pieza sobre fondo crema, con sus colores
//  y el botón + para echarla a la bolsa.
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
  const [added, setAdded] = useState(false);

  if (!models.length) return null;

  const p = models[Math.min(i, models.length - 1)];
  const colores = coloresDe(p);
  // La segunda foto suele ser la de ambiente; si no hay, se repite la primera.
  const ambiente = p.images?.[1]?.url || p.images?.[0]?.url;
  const pieza = p.images?.[0]?.url;

  return (
    <>
      <div className="rail modelos__tabs" role="tablist">
        {models.map((m, idx) => (
          <button
            key={m.slug}
            role="tab"
            aria-selected={idx === i}
            className={`modelos__tab${idx === i ? ' is-active' : ''}`}
            onClick={() => {
              setI(idx);
              setColorIdx(0);
              setAdded(false);
            }}
          >
            {m.name.replace(/^bolsa\s+/i, '')}
          </button>
        ))}
      </div>

      <div className="modelos__grid">
        <Link href={`/producto/${p.slug}`} className="modelos__life">
          {ambiente ? (
            <img src={ambiente} alt={p.name} loading="lazy" />
          ) : (
            <div className="imgph">{p.name}</div>
          )}
        </Link>

        <div className="modelos__side">
          <div className="modelos__pieza">
            <Link href={`/producto/${p.slug}`} aria-label={`Ver ${p.name}`}>
              {pieza ? (
                <img src={pieza} alt={p.name} loading="lazy" />
              ) : (
                <div className="imgph">{p.name}</div>
              )}
            </Link>

            <button
              className="modelos__add"
              aria-label={`Agregar ${p.name} a la bolsa`}
              onClick={() => {
                addItem(p);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? '✓' : '+'}
            </button>

            {colores.length > 0 && (
              <div className="modelos__colores">
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

          <p className="modelos__nombre">{p.name}</p>
          <p className="modelos__precio">
            {precio(p.price, p.currency)}
            {colores[colorIdx] && <span> · {colores[colorIdx].name}</span>}
          </p>
        </div>
      </div>
    </>
  );
}
