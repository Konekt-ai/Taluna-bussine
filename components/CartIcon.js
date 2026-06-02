'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={`Ver carrito (${count} artículos)`}
      className="relative text-muted transition-colors hover:text-ink"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-wine px-1 text-[11px] font-medium text-cream">
          {count}
        </span>
      )}
    </Link>
  );
}
