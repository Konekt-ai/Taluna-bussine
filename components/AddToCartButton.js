'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function AddToCartButton({ product, soldOut = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <button
        disabled
        className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-muted px-6 py-4 text-center text-cream sm:w-auto"
      >
        Agotado
      </button>
    );
  }

  function handleAdd() {
    addItem(product);
    setAdded(true);
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        onClick={handleAdd}
        className="inline-flex w-full items-center justify-center rounded-full bg-wine px-6 py-4 text-center text-cream transition-colors hover:bg-wineSoft sm:w-auto"
      >
        Agregar al carrito
      </button>
      {added && (
        <Link
          href="/carrito"
          className="inline-flex w-full items-center justify-center rounded-full border border-wine px-6 py-4 text-center text-wine transition-colors hover:bg-wine hover:text-cream sm:w-auto"
        >
          Ver carrito →
        </Link>
      )}
    </div>
  );
}
