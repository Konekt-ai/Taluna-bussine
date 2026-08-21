'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  FICHA DE PRODUCTO
//  Porte fiel de src/routes/producto.$slug.tsx del diseño:
//  galería que se desliza con puntitos, colores, "01 elige tu strap",
//  "02 largo del strap", pestañas de información y barra fija con el total.
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

export default function ProductDetail({ product, straps = [], waPhone, esStrap = false }) {
  const { addItem, isFav, toggleFav, openDrawer } = useCart();

  const fotos = (product.images || []).filter((i) => i?.url);
  const variantes = product.variants || [];
  const [shot, setShot] = useState(0);
  const [color, setColor] = useState(null);
  const [strapSlug, setStrapSlug] = useState(null);
  const [largo, setLargo] = useState(null);
  const [tab, setTab] = useState('Descripción');
  const [added, setAdded] = useState(false);
  const railRef = useRef(null);

  const strap = useMemo(() => straps.find((s) => s.slug === strapSlug) || null, [straps, strapSlug]);
  const largos = (strap?.variants || []).filter(hayStock);

  const agotado = product.sold_out ?? product.total_stock === 0;
  const total = (product.price || 0) + (strap?.price || 0);

  const pideStrap = !esStrap && straps.length > 0;
  const faltaStrap = pideStrap && !strap;
  const faltaLargo =
    Boolean(strap && largos.length && !largo) || Boolean(esStrap && variantes.length && !color);

  const itemId = strap
    ? `combo-${product.slug}-${color || 'x'}-${strap.slug}-${largo || 'x'}`
    : `${product.slug}${color ? `-${color}` : ''}`;
  const nombre = strap ? `${product.name} + ${strap.name}` : product.name;
  const detalle = [color, largo].filter(Boolean).join(' · ');

  const linea = {
    id: itemId,
    slug: product.slug,
    kind: strap ? 'Combinación' : product.category_name || 'Pieza',
    name: nombre,
    detalle,
    price: total,
    currency: product.currency || 'MXN',
    image: fotos[0]?.url || null,
    qty: 1,
  };

  const guardado = isFav(product.slug);
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hola Taluna, me interesa la "${nombre}"${detalle ? ` (${detalle})` : ''} — ${precio(total)}. ¿Sigue disponible?`
  )}`;

  const tabs = useMemo(() => {
    const out = {};
    const desc = product.story || product.short_desc;
    if (desc) out['Descripción'] = [desc];
    if (product.details?.length) out['Detalles'] = product.details.map((d) => `${d.label}: ${d.value}`);
    const mat = [product.materials, product.dimensions].filter(Boolean);
    if (mat.length) out['Materiales y cuidados'] = mat;
    out['Envíos y cambios'] = [
      'Envíos a todo México.',
      'El envío se cotiza por WhatsApp al confirmar el pedido.',
      'Cambios sujetos a las políticas de Taluna.',
      'Cualquier duda, escríbenos por WhatsApp o Instagram.',
    ];
    return out;
  }, [product]);

  const tabKeys = Object.keys(tabs);
  const tabActiva = tabs[tab] ? tab : tabKeys[0];

  function irAFoto(i) {
    const el = railRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  const etiqueta = agotado
    ? 'Agotada'
    : faltaStrap
      ? 'Elige tu strap'
      : faltaLargo
        ? strap
          ? 'Elige el largo'
          : 'Elige el color'
        : added
          ? 'Agregado ✓'
          : 'Agregar al carrito';

  const puede = !agotado && !faltaStrap && !faltaLargo;

  return (
    <div className="tl-pdp">
      {/* GALERÍA */}
      <section>
        {fotos.length ? (
          <>
            <div
              className="tl-pdp__rail tl-scroll"
              ref={railRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                setShot(Math.round(el.scrollLeft / (el.clientWidth || 1)));
              }}
            >
              {fotos.map((f, i) => (
                <div className="tl-pdp__slide" key={f.url}>
                  <img
                    src={f.url}
                    alt={f.alt || product.name}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                  />
                </div>
              ))}
            </div>

            {fotos.length > 1 && (
              <div className="tl-pdp__dots">
                {fotos.map((f, i) => (
                  <button
                    key={f.url}
                    className={i === shot ? 'on' : ''}
                    aria-label={`Ver foto ${i + 1}`}
                    onClick={() => irAFoto(i)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="tl-pdp__slide">
            <span className="tl-ph">Imagen pendiente</span>
          </div>
        )}
      </section>

      {/* INFO */}
      <section className="tl-pdp__info">
        <div className="tl-pdp__titlerow">
          <h1>{product.name}</h1>
          <span>{precio(product.price, product.currency)}</span>
        </div>
        {product.short_desc && <p className="tl-pdp__kicker">{product.short_desc}</p>}
        {product.story && <p className="tl-pdp__intro">{product.story}</p>}
        {product.dimensions && (
          <p className="tl-pdp__med">
            <span>Medidas</span> · {product.dimensions}
          </p>
        )}
      </section>

      {/* COLOR */}
      {variantes.length > 0 && (
        <section className="tl-pdp__colors">
          <div className="tl-pdp__colorgrid" data-stagger>
            {variantes.map((v) => {
              const hex = swatch(v.name);
              const on = color === v.name;
              const off = !hayStock(v);
              return (
                <button
                  key={v.sku || v.name}
                  className={`tl-pdp__color${on ? ' on' : ''}${off ? ' off' : ''}`}
                  onClick={() => !off && setColor(on ? null : v.name)}
                  aria-pressed={on}
                  disabled={off}
                  aria-label={v.name}
                >
                  <span className="sw" style={hex ? { background: hex } : undefined} />
                  <span className="nm" style={hex ? undefined : { color: 'var(--tl-faint)', textShadow: 'none' }}>
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="tl-pdp__all">
            <Link href="/catalogo">Explorar todos</Link>
          </div>
        </section>
      )}

      {/* 01 · STRAP */}
      {pideStrap && (
        <section className="tl-pdp__sec">
          <div className="tl-pdp__step">
            <span>01</span>
            <h2>Elige tu strap</h2>
          </div>
          <p className="tl-pdp__note">Completa tu Taluna con un strap intercambiable.</p>

          <div className="tl-pdp__straps" data-stagger>
            {straps.map((s) => {
              const on = s.slug === strap?.slug;
              return (
                <button
                  key={s.slug}
                  className={`tl-strapcard${on ? ' on' : ''}`}
                  onClick={() => {
                    setStrapSlug(on ? null : s.slug);
                    setLargo(null);
                    setAdded(false);
                  }}
                  aria-pressed={on}
                >
                  <span className="tl-strapcard__img">
                    {s.images?.[0]?.url ? (
                      <img src={s.images[0].url} alt={s.name} loading="lazy" />
                    ) : (
                      <span className="tl-ph">Próximamente</span>
                    )}
                    {on && <span className="tl-strapcard__check">✓</span>}
                  </span>
                  <p>{s.name}</p>
                  <p>+{precio(s.price, s.currency)}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 02 · LARGO */}
      {pideStrap && (
        <section className="tl-pdp__sec">
          <div className="tl-pdp__step">
            <span>02</span>
            <h2>Largo del strap</h2>
          </div>
          {strap ? (
            largos.length ? (
              <div className="tl-pills" style={{ padding: '10px 6px 0' }}>
                {largos.map((v) => {
                  const on = largo === v.name;
                  return (
                    <button
                      key={v.sku || v.name}
                      className={`tl-pill${on ? ' on' : ''}`}
                      onClick={() => setLargo(on ? null : v.name)}
                      aria-pressed={on}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="tl-pdp__note">Este strap viene en largo único.</p>
            )
          ) : (
            <p className="tl-pdp__note">Primero elige un strap.</p>
          )}
        </section>
      )}

      {/* PESTAÑAS */}
      {tabKeys.length > 0 && (
        <section className="tl-pdp__sec">
          <div className="tl-tabs tl-scroll">
            {tabKeys.map((k) => (
              <button key={k} className={`tl-tab${k === tabActiva ? ' on' : ''}`} onClick={() => setTab(k)}>
                {k}
              </button>
            ))}
          </div>
          <ul className="tl-tablist">
            {(tabs[tabActiva] || []).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Alternativas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: '28px 26px 0' }}>
        <button className="tl-save" onClick={() => toggleFav(product)} aria-pressed={guardado}>
          <svg viewBox="0 0 24 24" fill={guardado ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
          </svg>
          {guardado ? 'Guardada' : 'Guardar'}
        </button>

        <a className="tl-save" href={waHref} target="_blank" rel="noopener noreferrer">
          {agotado ? 'Avísame cuando llegue' : 'Preguntar por WhatsApp'}
        </a>

        {faltaStrap && (
          <button
            className="tl-save"
            onClick={() => {
              addItem({ ...linea, id: product.slug, name: product.name, price: product.price, kind: product.category_name });
              openDrawer('cart');
            }}
          >
            Agregar solo la bolsa
          </button>
        )}
      </div>

      {/* BARRA FIJA */}
      <div className="tl-buy">
        <div className="tl-buy__t">
          <span>Total</span>
          <b>{precio(total, product.currency)}</b>
        </div>
        <button
          className={`tl-btn ${puede ? 'tl-btn--dark' : 'tl-btn--mute'}`}
          onClick={() => {
            if (!puede) return;
            addItem(linea);
            setAdded(true);
            openDrawer('cart');
            setTimeout(() => setAdded(false), 2200);
          }}
          disabled={!puede}
        >
          {etiqueta}
        </button>
      </div>
    </div>
  );
}
