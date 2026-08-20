'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  ARMA TU TALUNA
//  El configurador del diseño, conectado al catálogo real:
//    · las BOLSAS y los STRAPS son productos del catálogo;
//    · los COLORES son las variantes de la bolsa;
//    · el LARGO son las variantes del strap.
//  Todo lo que la dueña publique desde el Organizador aparece aquí solo.
//
//  compact = la versión corta que va en el inicio.
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

const swatch = (nombre) => COLOR_MAP[(nombre || '').trim().toLowerCase()] || null;
const disponible = (v) => v.stock === undefined || v.stock === null || v.stock > 0;

function Paso({ n, titulo, nota, children }) {
  return (
    <div className="bld__step">
      <p className="bld__steplabel">
        <span>{n}</span> {titulo}
        {nota && <em>{nota}</em>}
      </p>
      {children}
    </div>
  );
}

export default function Builder({ bags = [], straps = [], waPhone, compact = false }) {
  const { addItem, isFav, toggleFav, openDrawer } = useCart();

  const [bagSlug, setBagSlug] = useState(bags[0]?.slug || null);
  const [color, setColor] = useState(null);
  const [strapSlug, setStrapSlug] = useState(null);
  const [largo, setLargo] = useState(null);
  const [added, setAdded] = useState(false);

  const bag = useMemo(() => bags.find((b) => b.slug === bagSlug) || bags[0], [bags, bagSlug]);
  const strap = useMemo(() => straps.find((s) => s.slug === strapSlug) || null, [straps, strapSlug]);

  const colores = (bag?.variants || []).filter(disponible);
  const largos = (strap?.variants || []).filter(disponible);

  const total = (bag?.price || 0) + (strap?.price || 0);
  const listo = Boolean(bag && strap && (!largos.length || largo));

  const comboId = `combo-${bag?.slug}-${color || 'x'}-${strap?.slug || 'x'}-${largo || 'x'}`;
  const comboName = bag
    ? `${bag.name}${color ? ` · ${color}` : ''}${strap ? ` + ${strap.name}` : ''}`
    : 'Tu Taluna';
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

  function elegirBolsa(slug) {
    setBagSlug(slug);
    setColor(null);
    setAdded(false);
  }

  function elegirStrap(slug) {
    setStrapSlug(slug === strapSlug ? null : slug);
    setLargo(null);
    setAdded(false);
  }

  return (
    <div className={`bld${compact ? ' bld--compact' : ''}`}>
      {/* Vista previa de la combinación */}
      <div className="bld__preview">
        <div className="bld__previewhead">
          <span>Tu combinación</span>
          <b>{strap ? precio(total) : `Desde ${precio(bag?.price)}`}</b>
        </div>

        <div className="bld__stage">
          {strap && (
            <div className="bld__strap">
              {strap.images?.[0]?.url ? (
                <img src={strap.images[0].url} alt={strap.name} />
              ) : (
                <div className="imgph">{strap.name}</div>
              )}
            </div>
          )}

          <div className={`bld__bag${strap ? ' is-shifted' : ''}`}>
            {bag?.images?.[0]?.url ? (
              <img src={bag.images[0].url} alt={bag.name} />
            ) : (
              <div className="imgph">{bag?.name}</div>
            )}
          </div>

          <span className="bld__tag">{strap ? strap.name : 'Suma un strap'}</span>
        </div>

        <p className="bld__resumenlinea">
          {bag?.name}
          {color ? ` · ${color}` : ''}
          <span>{strap ? ` · ${strap.name}${largo ? ` · ${largo}` : ''}` : ' · Suma un strap'}</span>
        </p>
      </div>

      {/* 01 · Bolsa */}
      <Paso n="01" titulo="Elige tu bolsa">
        <div className="rail bld__rail">
          {bags.map((b) => {
            const on = b.slug === bag?.slug;
            return (
              <button
                key={b.slug}
                className={`bld__pick${on ? ' on' : ''}`}
                onClick={() => elegirBolsa(b.slug)}
                aria-pressed={on}
              >
                <span className="bld__pickimg">
                  {b.images?.[0]?.url ? (
                    <img src={b.images[0].url} alt="" loading="lazy" />
                  ) : (
                    <span className="imgph">{b.name}</span>
                  )}
                </span>
                <span className="bld__picklabel">{b.name}</span>
                <span className="bld__pickprice">{precio(b.price, b.currency)}</span>
              </button>
            );
          })}
        </div>
      </Paso>

      {/* 02 · Color */}
      {colores.length > 0 && (
        <Paso n="02" titulo="Elige tu color">
          <div className="bld__pills">
            {colores.map((v) => {
              const hex = swatch(v.name);
              const on = color === v.name;
              return (
                <button
                  key={v.sku || v.name}
                  className={`bld__pill${on ? ' on' : ''}`}
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
        </Paso>
      )}

      {/* 03 · Strap */}
      <Paso
        n={colores.length ? '03' : '02'}
        titulo="Elige tu strap"
        nota={bag ? `compatibles con ${bag.name}` : null}
      >
        {straps.length ? (
          <div className="rail bld__rail bld__rail--straps">
            {straps.map((s) => {
              const on = s.slug === strap?.slug;
              return (
                <button
                  key={s.slug}
                  className={`bld__pick bld__pick--strap${on ? ' on' : ''}`}
                  onClick={() => elegirStrap(s.slug)}
                  aria-pressed={on}
                >
                  <span className="bld__pickimg">
                    {s.images?.[0]?.url ? (
                      <img src={s.images[0].url} alt="" loading="lazy" />
                    ) : (
                      <span className="imgph">{s.name}</span>
                    )}
                  </span>
                  <span className="bld__picklabel">{s.name}</span>
                  <span className="bld__pickprice">+{precio(s.price, s.currency)}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="lead">Todavía no hay straps publicados en el catálogo.</p>
        )}
      </Paso>

      {/* 04 · Largo */}
      {strap && largos.length > 0 && (
        <Paso n={colores.length ? '04' : '03'} titulo="Largo del strap">
          <div className="bld__pills">
            {largos.map((v) => {
              const on = largo === v.name;
              return (
                <button
                  key={v.sku || v.name}
                  className={`bld__pill${on ? ' on' : ''}`}
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
        </Paso>
      )}

      {/* Resumen */}
      <div className="bld__resumen">
        <p className="bld__steplabel"><span>Tu resumen</span></p>
        <div className="bld__resumengrid">
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

        <div className="bld__total">
          <span>Total</span>
          <b>{precio(total)}</b>
        </div>
        <p className="bld__nota">Envío por cotizar · Hecho a mano en México</p>
      </div>

      {/* Acciones */}
      <div className="bld__acciones">
        {listo ? (
          <button
            className="btn btn--primary btn--block"
            onClick={() => {
              addItem(linea);
              setAdded(true);
              openDrawer('cart');
            }}
          >
            {added ? 'Agregada ✓' : 'Agregar a la bolsa'}
          </button>
        ) : (
          <button className="btn btn--block" disabled>
            {!strap ? 'Elige un strap' : 'Elige el largo'}
          </button>
        )}

        <div className="bld__acciones2">
          <button
            className="bld__save"
            onClick={() => strap && toggleFav(linea)}
            disabled={!strap}
          >
            <svg viewBox="0 0 24 24" fill={guardada ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
            </svg>
            {guardada ? 'Guardada' : 'Guardar combinación'}
          </button>

          <a className="bld__save" href={waHref} target="_blank" rel="noopener noreferrer">
            Preguntar por WhatsApp
          </a>
        </div>

        {compact && (
          <Link href="/arma-tu-taluna" className="ulink" style={{ marginTop: 6 }}>
            Abrir el configurador completo
          </Link>
        )}
      </div>
    </div>
  );
}
