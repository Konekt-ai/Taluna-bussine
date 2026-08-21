'use client';

import { useMemo, useState } from 'react';
import { useCart } from './CartContext';

// =====================================================================
//  ARMA TU TALUNA
//  Porte fiel del ConfiguradorTeaser del diseño, conectado al catálogo:
//    · BOLSAS y STRAPS son productos del catálogo
//    · COLORES son las variantes de la bolsa
//    · LARGO son las variantes del strap
// =====================================================================

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

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

const swatch = (n) => COLOR_MAP[(n || '').trim().toLowerCase()] || null;
const hayStock = (v) => v.stock === undefined || v.stock === null || v.stock > 0;

export default function Builder({ bags = [], straps = [], waPhone }) {
  const { addItem, isFav, toggleFav, openDrawer } = useCart();

  const [bagSlug, setBagSlug] = useState(bags[0]?.slug || null);
  const [color, setColor] = useState(null);
  const [strapSlug, setStrapSlug] = useState(null);
  const [largo, setLargo] = useState(null);
  const [added, setAdded] = useState(false);

  const bag = useMemo(() => bags.find((b) => b.slug === bagSlug) || bags[0], [bags, bagSlug]);
  const strap = useMemo(() => straps.find((s) => s.slug === strapSlug) || null, [straps, strapSlug]);

  const colores = (bag?.variants || []).filter(hayStock);
  const largos = (strap?.variants || []).filter(hayStock);

  const total = (bag?.price || 0) + (strap?.price || 0);
  const listo = Boolean(bag && strap && (!largos.length || largo));

  const comboId = `combo-${bag?.slug}-${color || 'x'}-${strap?.slug || 'x'}-${largo || 'x'}`;
  const comboName = bag ? `${bag.name}${color ? ` ${color}` : ''}${strap ? ` + ${strap.name}` : ''}` : 'Tu Taluna';
  const detalle = [color, largo].filter(Boolean).join(' · ');
  const guardada = isFav(comboId);

  const linea = {
    id: comboId,
    slug: bag?.slug,
    kind: 'Combinación',
    name: comboName,
    detalle,
    price: total,
    currency: bag?.currency || 'MXN',
    image: bag?.images?.[0]?.url || null,
    qty: 1,
  };

  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hola Taluna, armé esta combinación: ${comboName}${detalle ? ` (${detalle})` : ''} — ${precio(total)}. ¿Me ayudan a pedirla?`
  )}`;

  if (!bags.length) return null;

  const nPaso = (n) => String(n).padStart(2, '0');
  let paso = 0;

  return (
    <div>
      {/* Tu combinación */}
      <div className="tl-cfg__box">
        <div className="tl-cfg__boxhead">
          <span>Tu combinación</span>
          <b key={strap ? total : `base-${bag?.slug}`} className="tl-fade-swap">
            {strap ? precio(total) : `Desde ${precio(bag?.price)}`}
          </b>
        </div>

        <div className="tl-cfg__stage">
          {strap && (
            <div key={strapSlug} className="tl-cfg__strap tl-swap-strap">
              {strap.images?.[0]?.url ? (
                <img src={strap.images[0].url} alt={strap.name} />
              ) : (
                <span className="tl-ph">{strap.name}</span>
              )}
            </div>
          )}

          <div className={`tl-cfg__bag${strap ? ' shift' : ''}`}>
            <div key={`${bag?.slug}-${color || ''}`} className="tl-swap" style={{ width: '100%', height: '100%' }}>
              {bag?.images?.[0]?.url ? (
                <img src={bag.images[0].url} alt={bag.name} />
              ) : (
                <span className="tl-ph">{bag?.name}</span>
              )}
            </div>
          </div>

          <span className="tl-cfg__label">{strap ? strap.name : 'Suma un strap'}</span>
        </div>

        <p key={`${bag?.slug}-${color || ''}-${strapSlug || ''}-${largo || ''}`} className="tl-cfg__line tl-fade-swap">
          {bag?.name}
          {color ? ` · ${color}` : ''}
          <span>{strap ? ` · ${strap.name}${largo ? ` · ${largo}` : ''}` : ' · Suma un strap'}</span>
        </p>
      </div>

      {/* 01 · Bolsa */}
      <div className="tl-step">
        <p className="tl-step__t">{nPaso(++paso)} · Elige tu bolsa</p>
        <div className="tl-picks tl-scroll">
          {bags.map((b) => {
            const on = b.slug === bag?.slug;
            return (
              <button
                key={b.slug}
                className={`tl-pick${on ? ' on' : ''}`}
                onClick={() => {
                  setBagSlug(b.slug);
                  setColor(null);
                  setAdded(false);
                }}
                aria-pressed={on}
              >
                <span className="tl-pick__img">
                  {b.images?.[0]?.url ? (
                    <img src={b.images[0].url} alt="" loading="lazy" />
                  ) : (
                    <span className="tl-ph">{b.name}</span>
                  )}
                </span>
                <span className="tl-pick__n">{b.name}</span>
                <span className="tl-pick__p">{precio(b.price, b.currency)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 02 · Color */}
      {colores.length > 0 && (
        <div className="tl-step">
          <p className="tl-step__t">{nPaso(++paso)} · Elige tu color</p>
          <div className="tl-pills">
            {colores.map((v) => {
              const hex = swatch(v.name);
              const on = color === v.name;
              return (
                <button
                  key={v.sku || v.name}
                  className={`tl-pill${on ? ' on' : ''}`}
                  onClick={() => {
                    setColor(on ? null : v.name);
                    setAdded(false);
                  }}
                  aria-pressed={on}
                >
                  {hex && <i style={{ background: hex }} />}
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 03 · Strap */}
      <div className="tl-step">
        <p className="tl-step__t">
          {nPaso(++paso)} · Elige tu strap {bag && <em>compatibles con {bag.name}</em>}
        </p>
        {straps.length ? (
          <div className="tl-picks tl-scroll">
            {straps.map((s) => {
              const on = s.slug === strap?.slug;
              return (
                <button
                  key={s.slug}
                  className={`tl-pick tl-pick--strap${on ? ' on' : ''}`}
                  onClick={() => {
                    setStrapSlug(on ? null : s.slug);
                    setLargo(null);
                    setAdded(false);
                  }}
                  aria-pressed={on}
                >
                  <span className="tl-pick__img">
                    {s.images?.[0]?.url ? (
                      <img src={s.images[0].url} alt="" loading="lazy" />
                    ) : (
                      <span className="tl-ph">{s.name}</span>
                    )}
                  </span>
                  <span className="tl-pick__n">{s.name}</span>
                  <span className="tl-pick__p">+{precio(s.price, s.currency)}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="tl-cfg__line">Todavía no hay straps publicados en el catálogo.</p>
        )}
      </div>

      {/* 04 · Largo */}
      {strap && largos.length > 0 && (
        <div className="tl-step">
          <p className="tl-step__t">{nPaso(++paso)} · Largo del strap</p>
          <div className="tl-pills">
            {largos.map((v) => {
              const on = largo === v.name;
              return (
                <button
                  key={v.sku || v.name}
                  className={`tl-pill${on ? ' on' : ''}`}
                  onClick={() => {
                    setLargo(on ? null : v.name);
                    setAdded(false);
                  }}
                  aria-pressed={on}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="tl-sum">
        <p className="tl-sum__t">Tu resumen</p>
        <div className="tl-sum__grid">
          {[
            ['Bolsa', bag?.name, false],
            ['Color', color || (colores.length ? 'Elige uno' : '—'), !color && colores.length > 0],
            ['Strap', strap?.name || 'Elige uno', !strap],
            ['Largo', largo || (largos.length ? 'Pendiente' : '—'), !largo && largos.length > 0],
          ].map(([k, v, pend]) => (
            <div key={k}>
              <span>{k}</span>
              <b className={pend ? 'pend' : ''}>{v}</b>
            </div>
          ))}
        </div>

        <div className="tl-sum__rule" />

        <div className="tl-sum__total">
          <span>Total</span>
          <b>{precio(total)}</b>
        </div>
        <p className="tl-sum__nota">Envío por cotizar · Hecho a mano en México</p>
      </div>

      {/* Acciones */}
      <div className="tl-cfg__acts">
        {listo ? (
          <button
            className="tl-btn tl-btn--dark tl-btn--block"
            onClick={() => {
              addItem(linea);
              setAdded(true);
              openDrawer('cart');
            }}
          >
            {added ? 'Agregado ✓' : 'Agregar a carrito'}
          </button>
        ) : (
          <span className="tl-btn tl-btn--mute tl-btn--block">
            {!strap ? 'Elige un strap' : 'Elige el largo'}
          </span>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
          <button className="tl-save" onClick={() => strap && toggleFav(linea)} disabled={!strap}>
            <svg viewBox="0 0 24 24" fill={guardada ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
            </svg>
            {guardada ? 'Guardada' : 'Guardar combinación'}
          </button>

          <a className="tl-save" href={waHref} target="_blank" rel="noopener noreferrer">
            Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
