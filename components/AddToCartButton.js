'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

// Botón sencillo de "agregar a la bolsa". La ficha de producto usa
// components/ProductBuy.js (que además pone la barra fija del celular);
// este queda para cualquier otro lugar donde haga falta uno suelto.
export default function AddToCartButton({ product, soldOut = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <button disabled className="btn btn--block" style={{ marginTop: 26 }}>
        Agotada
      </button>
    );
  }

  return (
    <div className="pdp__actions">
      <button
        className="btn btn--primary btn--block"
        onClick={() => {
          addItem(product);
          setAdded(true);
        }}
      >
        {added ? 'Agregada ✓' : 'Agregar a la bolsa'}
      </button>
      {added && (
        <Link href="/carrito" className="btn btn--outline btn--block">
          Ver mi bolsa
        </Link>
      )}
    </div>
  );
}
