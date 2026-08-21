'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  CAJONES DE FAVORITOS Y BOLSA
//  Porte fiel de src/components/taluna/Drawers.tsx del diseño: entran
//  desde la derecha con el fondo oscurecido.
//  El pedido se cierra en /carrito, que es donde se piden los datos.
// =====================================================================

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

function Linea({ item, onRemove }) {
  return (
    <div className="tl-dwline">
      <div className="tl-dwline__img">
        {item.image ? <img src={item.image} alt="" loading="lazy" /> : <span className="tl-ph">{item.name}</span>}
      </div>
      <div className="tl-dwline__b">
        <p className="tl-dwline__kind">{item.kind}</p>
        <p className="tl-dwline__name">{item.name}</p>
        {item.detalle && <p className="tl-dwline__meta">{item.detalle}</p>}
        <p className="tl-dwline__price">
          {item.qty > 1 ? `${item.qty} × ` : ''}
          {precio(item.price, item.currency)}
        </p>
      </div>
      <button className="tl-dwline__x" onClick={onRemove} aria-label={`Quitar ${item.name}`}>
        <Close />
      </button>
    </div>
  );
}

export default function Drawers() {
  const { items, favs, subtotal, removeItem, removeFav, addItem, drawer, closeDrawer } = useCart();

  if (drawer !== 'cart' && drawer !== 'favs') return null;
  const esCarrito = drawer === 'cart';

  return (
    <>
      <div className="tl-scrim" onClick={closeDrawer} aria-hidden="true" />

      <aside className="tl-dw" aria-label={esCarrito ? 'Carrito' : 'Favoritos'}>
        <div className="tl-dw__head">
          <span className="tl-dw__title">{esCarrito ? 'Carrito' : 'Favoritos'}</span>
          <button className="tl-ic" onClick={closeDrawer} aria-label="Cerrar">
            <Close />
          </button>
        </div>

        {esCarrito ? (
          items.length ? (
            <>
              <div className="tl-dw__body">
                {items.map((i) => (
                  <Linea key={i.id} item={i} onRemove={() => removeItem(i.id)} />
                ))}
              </div>
              <div className="tl-dw__foot">
                <div className="tl-dw__total">
                  <span>Total</span>
                  <b>{precio(subtotal)}</b>
                </div>
                <p className="tl-dw__nota">El envío se cotiza por WhatsApp.</p>
                <Link href="/carrito" className="tl-btn tl-btn--dark tl-btn--block" onClick={closeDrawer}>
                  Finalizar pedido
                </Link>
                <button className="tl-btn tl-btn--outline tl-btn--block" onClick={closeDrawer}>
                  Seguir comprando
                </button>
              </div>
            </>
          ) : (
            <div className="tl-dw__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <p>Tu carrito está vacío.</p>
              <Link href="/arma-tu-taluna" className="tl-btn tl-btn--dark" onClick={closeDrawer}>
                Arma tu Taluna
              </Link>
            </div>
          )
        ) : favs.length ? (
          <>
            <div className="tl-dw__body">
              {favs.map((f) => (
                <div key={f.id}>
                  <Linea item={f} onRemove={() => removeFav(f.id)} />
                  <button
                    className="tl-dwline__add"
                    onClick={() => {
                      addItem(f);
                      removeFav(f.id);
                    }}
                  >
                    Pasar al carrito
                  </button>
                </div>
              ))}
            </div>
            <div className="tl-dw__foot">
              <button className="tl-btn tl-btn--outline tl-btn--block" onClick={closeDrawer}>
                Seguir explorando
              </button>
            </div>
          </>
        ) : (
          <div className="tl-dw__empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.5C12 20.5 3.5 15 3.5 8.8a4.3 4.3 0 0 1 8.5-1 4.3 4.3 0 0 1 8.5 1C20.5 15 12 20.5 12 20.5z" />
            </svg>
            <p>Guarda tus bolsas, straps o combinaciones favoritas.</p>
            <Link href="/catalogo" className="tl-btn tl-btn--dark" onClick={closeDrawer}>
              Explorar
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
