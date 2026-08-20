'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  CAJONES LATERALES (favoritos y bolsa)
//  Como en el diseño: entran desde la derecha por encima de la página,
//  con el fondo oscurecido. El pedido se cierra por WhatsApp desde la
//  página del carrito, que es donde se piden los datos de envío.
// =====================================================================

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

function Linea({ item, onRemove }) {
  return (
    <div className="dw-line">
      <div className="dw-line__img">
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" />
        ) : (
          <div className="imgph">{item.name}</div>
        )}
      </div>
      <div className="dw-line__body">
        <span className="dw-line__kind">{item.kind}</span>
        <span className="dw-line__name">{item.name}</span>
        {item.detalle && <span className="dw-line__meta">{item.detalle}</span>}
        <span className="dw-line__price">
          {item.qty > 1 ? `${item.qty} × ` : ''}
          {precio(item.price, item.currency)}
        </span>
      </div>
      <button className="dw-line__x" onClick={onRemove} aria-label={`Quitar ${item.name}`}>
        <IconX />
      </button>
    </div>
  );
}

function Vacio({ icono, texto, cta, onClose }) {
  return (
    <div className="dw-empty">
      <span className="dw-empty__ico">{icono}</span>
      <p>{texto}</p>
      <Link href="/catalogo" className="btn btn--primary" onClick={onClose}>
        {cta}
      </Link>
    </div>
  );
}

export default function Drawers() {
  const {
    items,
    favs,
    subtotal,
    removeItem,
    removeFav,
    addItem,
    drawer,
    closeDrawer,
  } = useCart();

  const abierto = drawer === 'cart' || drawer === 'favs';
  const esCarrito = drawer === 'cart';

  return (
    <>
      <div
        className={`dw-scrim${abierto ? ' open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`dw${abierto ? ' open' : ''}`}
        aria-hidden={!abierto}
        aria-label={esCarrito ? 'Tu bolsa' : 'Favoritos'}
      >
        <div className="dw__head">
          <span className="dw__title">{esCarrito ? 'Tu bolsa' : 'Favoritos'}</span>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Cerrar">
            <IconX />
          </button>
        </div>

        {esCarrito ? (
          items.length ? (
            <>
              <div className="dw__body">
                {items.map((i) => (
                  <Linea key={i.id} item={i} onRemove={() => removeItem(i.id)} />
                ))}
              </div>
              <div className="dw__foot">
                <div className="dw__total">
                  <span>Total</span>
                  <b>{precio(subtotal)}</b>
                </div>
                <p className="dw__nota">El envío se cotiza por WhatsApp.</p>
                <Link href="/carrito" className="btn btn--primary btn--block" onClick={closeDrawer}>
                  Finalizar pedido
                </Link>
                <button className="btn btn--outline btn--block" onClick={closeDrawer}>
                  Seguir comprando
                </button>
              </div>
            </>
          ) : (
            <Vacio
              onClose={closeDrawer}
              cta="Ver catálogo"
              texto="Tu bolsa está vacía."
              icono={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8h12l-1 12H7L6 8z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
              }
            />
          )
        ) : favs.length ? (
          <>
            <div className="dw__body">
              {favs.map((f) => (
                <div key={f.id}>
                  <Linea item={f} onRemove={() => removeFav(f.id)} />
                  <button
                    className="dw-line__add"
                    onClick={() => {
                      addItem(f);
                      removeFav(f.id);
                    }}
                  >
                    Pasar a mi bolsa
                  </button>
                </div>
              ))}
            </div>
            <div className="dw__foot">
              <button className="btn btn--outline btn--block" onClick={closeDrawer}>
                Seguir explorando
              </button>
            </div>
          </>
        ) : (
          <Vacio
            onClose={closeDrawer}
            cta="Explorar"
            texto="Guarda aquí tus bolsas, straps o combinaciones favoritas."
            icono={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
              </svg>
            }
          />
        )}
      </aside>
    </>
  );
}
