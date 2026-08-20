'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// =====================================================================
//  BOTONES DE COMPRA DE LA FICHA
//  En escritorio van dentro de la columna de texto; en el celular además
//  se queda una barra fija abajo con el precio y el botón, como en el
//  diseño aprobado.
// =====================================================================

export default function ProductBuy({ product, soldOut = false, priceLabel, waHref }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    if (soldOut) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const label = soldOut ? 'Agotada' : added ? 'Agregada ✓' : 'Agregar a la bolsa';

  return (
    <>
      <div className="pdp__actions">
        <button className="btn btn--primary btn--block" onClick={add} disabled={soldOut}>
          {label}
        </button>

        {added && (
          <Link href="/carrito" className="btn btn--outline btn--block">
            Ver mi bolsa
          </Link>
        )}

        <a className="pdp__alt" href={waHref} target="_blank" rel="noopener noreferrer">
          {soldOut ? 'Avísame cuando llegue por WhatsApp' : 'o cómprala directo por WhatsApp'}
        </a>
      </div>

      {/* Barra fija de compra (celular) */}
      <div className="buybar">
        <div className="buybar__p">
          <span>Precio</span>
          <b>{priceLabel}</b>
        </div>
        <button className="btn btn--primary" onClick={add} disabled={soldOut}>
          {label}
        </button>
      </div>
    </>
  );
}
