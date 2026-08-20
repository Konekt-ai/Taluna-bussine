import Builder from './Builder';

// Envoltura del configurador para el inicio: reparte el catálogo entre
// bolsas y straps y lo entrega ya listo al componente de cliente.
export default function BuilderTeaser({ products = [], categories = [], contacto, compact = true }) {
  const bolsasSlug = categories[0]?.slug;
  const strapsSlug = categories[1]?.slug;

  const bags = products.filter((p) => p.category_slug === bolsasSlug);
  const straps = strapsSlug ? products.filter((p) => p.category_slug === strapsSlug) : [];

  if (!bags.length) return null;

  return (
    <Builder bags={bags} straps={straps} waPhone={contacto?.whatsapp} compact={compact} />
  );
}
