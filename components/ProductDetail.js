'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  FICHA DE PRODUCTO
//  Como en el diseño: galería que se desliza con puntitos, colores,
//  "01 elige tu strap", "02 largo del strap", pestañas de información y
//  una barra fija abajo con el TOTAL.
//
//  Los straps son productos reales del catálogo (categoría Straps) y el
//  largo sale de las variantes de ese strap.
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

  // El diseño arma bolsa + strap; si todavía no hay straps publicados, la
  // bolsa se puede pedir sola para no bloquear la venta.
  const pideStrap = !esStrap && straps.length > 0;
  const faltaStrap = pideStrap && !strap;
  const faltaLargo = Boolean(strap && largos.length && !largo) || Boolean(esStrap && variantes.length && !color);

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

  // Fichas técnicas para las pestañas, con lo que traiga el catálogo.
  const tabs = useMemo(() => {
    const out = {};
    const desc = product.story || product.short_desc;
    if (desc) out['Descripción'] = [desc];
    if (product.details?.length) {
      out['Detalles'] = product.details.map((d) => `${d.label}: ${d.value}`);
    }
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
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  function agregar() {
    if (agotado) return;
    addItem(linea);
    setAdded(true);
    openDrawer('cart');
    setTimeout(() => setAdded(false), 2200);
  }

  const etiquetaBoton = agotado
    ? 'Agotada'
    : faltaStrap
      ? 'Elige tu strap'
      : faltaLargo
        ? strap
          ? 'Elige el largo'
          : 'Elige el color'
        : added
          ? 'Agregada ✓'
          : 'Agregar al carrito';

  const puedeAgregar = !agotado && !faltaStrap && !faltaLargo;

  return (
    <div className="pdp2">
      {/* GALERÍA */}
      <section className="pdp2__gallery">
        {fotos.length ? (
          <>
            <div
              className="pdp2__rail"
              ref={railRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                setShot(Math.round(el.scrollLeft / (el.clientWidth || 1)));
              }}
            >
              {fotos.map((f, i) => (
                <div className="pdp2__slide" key={f.url}>
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
              <div className="pdp2__dots">
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
          <div className="pdp2__slide">
            <div className="imgph">Foto próximamente</div>
          </div>
        )}
      </section>

      {/* INFO */}
      <div className="pdp2__col">
        <section className="pdp2__info">
          <div className="pdp2__titlerow">
            <h1>{product.name}</h1>
            <span>{precio(product.price, product.currency)}</span>
          </div>
          {product.short_desc && <p className="pdp2__kicker">{product.short_desc}</p>}
          {product.story && <p className="pdp2__intro">{product.story}</p>}
          {product.dimensions && (
            <p className="pdp2__medidas">
              <span>Medidas</span> · {product.dimensions}
            </p>
          )}
        </section>

        {/* COLOR */}
        {variantes.length > 0 && (
          <section className="pdp2__sec">
            <p className="pdp2__label">
              {esStrap ? 'Elige el largo' : 'Elige tu color'}
            </p>
            <div className="pdp2__colors">
              {variantes.map((v) => {
                const hex = swatch(v.name);
                const on = color === v.name;
                const off = !hayStock(v);
                return (
                  <button
                    key={v.sku || v.name}
                    className={`pdp2__color${on ? ' on' : ''}${off ? ' off' : ''}`}
                    onClick={() => !off && setColor(on ? null : v.name)}
                    aria-pressed={on}
                    disabled={off}
                  >
                    <span
                      className="pdp2__colorchip"
                      style={hex ? { background: hex } : undefined}
                    >
                      {!hex && v.name.slice(0, 2)}
                    </span>
                    <span className="pdp2__colorname">{v.name}</span>
                    {off && <span className="pdp2__colorno">Agotado</span>}
                  </button>
                );
              })}
            </div>
            <div className="pdp2__right">
              <Link href="/catalogo">Explorar todos</Link>
            </div>
          </section>
        )}

        {/* 01 · STRAP */}
        {pideStrap && (
          <section className="pdp2__sec">
            <p className="pdp2__step">
              <span>01</span> Elige tu strap
            </p>
            <p className="pdp2__stepnota">Completa tu Taluna con un strap intercambiable.</p>

            <div className="pdp2__straps">
              {straps.map((s) => {
                const on = s.slug === strap?.slug;
                return (
                  <button
                    key={s.slug}
                    className={`pdp2__strap${on ? ' on' : ''}`}
                    onClick={() => {
                      setStrapSlug(on ? null : s.slug);
                      setLargo(null);
                      setAdded(false);
                    }}
                    aria-pressed={on}
                  >
                    <span className="pdp2__strapimg">
                      {s.images?.[0]?.url ? (
                        <img src={s.images[0].url} alt="" loading="lazy" />
                      ) : (
                        <span className="imgph">{s.name}</span>
                      )}
                      {on && <span className="pdp2__check">✓</span>}
                    </span>
                    <span className="pdp2__strapname">{s.name}</span>
                    <span className="pdp2__strapprice">+{precio(s.price, s.currency)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 02 · LARGO */}
        {pideStrap && (
          <section className="pdp2__sec">
            <p className="pdp2__step">
              <span>02</span> Largo del strap
            </p>
            {strap ? (
              largos.length ? (
                <div className="bld__pills">
                  {largos.map((v) => {
                    const on = largo === v.name;
                    return (
                      <button
                        key={v.sku || v.name}
                        className={`bld__pill${on ? ' on' : ''}`}
                        onClick={() => setLargo(on ? null : v.name)}
                        aria-pressed={on}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="pdp2__stepnota">Este strap viene en largo único.</p>
              )
            ) : (
              <p className="pdp2__stepnota">Primero elige un strap.</p>
            )}
          </section>
        )}

        {/* PESTAÑAS DE INFORMACIÓN */}
        {tabKeys.length > 0 && (
          <section className="pdp2__sec">
            <div className="rail pdp2__tabs">
              {tabKeys.map((k) => (
                <button
                  key={k}
                  className={`pdp2__tab${k === tabActiva ? ' on' : ''}`}
                  onClick={() => setTab(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <ul className="pdp2__list">
              {(tabs[tabActiva] || []).map((linea2, i) => (
                <li key={i}>{linea2}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Alternativas */}
        <div className="pdp2__alt">
          <button
            className="bld__save"
            onClick={() => toggleFav(product)}
            aria-pressed={guardado}
          >
            <svg viewBox="0 0 24 24" fill={guardado ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
            </svg>
            {guardado ? 'Guardada' : 'Guardar'}
          </button>

          <a className="bld__save" href={waHref} target="_blank" rel="noopener noreferrer">
            {agotado ? 'Avísame cuando llegue' : 'Preguntar por WhatsApp'}
          </a>

          {faltaStrap && (
            <button
              className="bld__save"
              onClick={() => {
                addItem({ ...linea, id: product.slug, kind: product.category_name, name: product.name, price: product.price });
                openDrawer('cart');
              }}
            >
              Agregar solo la bolsa
            </button>
          )}
        </div>
      </div>

      {/* BARRA FIJA CON EL TOTAL */}
      <div className="pdp2__bar">
        <div className="pdp2__bartotal">
          <span>Total</span>
          <b>{precio(total, product.currency)}</b>
        </div>
        <button
          className={`btn ${puedeAgregar ? 'btn--primary' : ''}`}
          onClick={agregar}
          disabled={!puedeAgregar}
        >
          {etiquetaBoton}
        </button>
      </div>
    </div>
  );
}
