import Builder from './Builder';

// Reparte el catálogo entre bolsas (1ª categoría) y straps (2ª) y se lo
// entrega al configurador.
export default function BuilderTeaser({ products = [], categories = [], contacto }) {
  const bolsasSlug = categories[0]?.slug;
  const strapsSlug = categories[1]?.slug;

  const bags = products.filter((p) => p.category_slug === bolsasSlug);
  const straps = strapsSlug ? products.filter((p) => p.category_slug === strapsSlug) : [];

  if (!bags.length) return null;

  return <Builder bags={bags} straps={straps} waPhone={contacto?.whatsapp} />;
}
