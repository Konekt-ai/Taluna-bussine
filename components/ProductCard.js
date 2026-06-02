import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/products';

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url;
  const lowStock = product.total_stock > 0 && product.total_stock <= 3;
  const soldOut = product.total_stock === 0;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-sand transition-shadow hover:shadow-soft"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {img ? (
          <Image
            src={img}
            alt={product.images?.[0]?.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Foto próximamente</div>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs text-cream">
            Agotado
          </span>
        )}
        {lowStock && (
          <span className="absolute left-3 top-3 rounded-full bg-wine px-3 py-1 text-xs text-cream">
            Últimas piezas
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-muted">{product.category_name}</span>
        <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
        <p className="mt-auto pt-2 font-medium text-wine">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
