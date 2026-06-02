// Datos de ejemplo usados SOLO cuando Supabase aún no está configurado.
// Coinciden con supabase/seed.sql (catálogo real de Taluna).

export const sampleCategories = [
  { slug: 'bolsas', name: 'Bolsas' },
  { slug: 'straps', name: 'Straps' },
];

function totalStock(variants) {
  return variants.reduce((sum, v) => sum + v.stock, 0);
}

const bolsas = [
  {
    slug: 'bolsa-tauu',
    name: 'Bolsa Tauú',
    short_desc: 'La bolsa perfecta para cualquier salida. 100% piel.',
    story:
      'La Tauú es 100% piel, hecha a mano por artesanas mexicanas. Combínala con tu strap artesanal favorito —chaquira o tejido— y hazla única. Pregunta por los diseños disponibles.',
    materials: '100% piel',
    price: 3800,
    is_featured: true,
    variants: [
      { name: 'Negra', sku: 'TAUU-NEG', stock: 10 },
      { name: 'Blanca', sku: 'TAUU-BLA', stock: 10 },
      { name: 'Camel', sku: 'TAUU-CAM', stock: 10 },
    ],
  },
  {
    slug: 'bolsa-maraica',
    name: 'Bolsa Maraica',
    short_desc: '100% piel · desde $3,500. Elige tu strap.',
    story:
      'La Maraica en 100% piel. Elige el strap que más te guste. Precio con strap tejida $3,500; con strap chaquira $4,000. Colores básicos: taupe, camel, negra, gris. De temporada: tinta y azul marino.',
    materials: '100% piel',
    price: 3500,
    is_featured: true,
    variants: [
      { name: 'Taupe', sku: 'MARAICA-TAU', stock: 10 },
      { name: 'Camel', sku: 'MARAICA-CAM', stock: 10 },
      { name: 'Negra', sku: 'MARAICA-NEG', stock: 10 },
      { name: 'Gris', sku: 'MARAICA-GRI', stock: 10 },
      { name: 'Tinta', sku: 'MARAICA-TIN', stock: 6 },
      { name: 'Azul marino', sku: 'MARAICA-AZM', stock: 6 },
    ],
  },
  {
    slug: 'bolsa-tacana',
    name: 'Bolsa Tacaná',
    short_desc: '100% piel · desde $3,500. Elige tu strap.',
    story:
      'La Tacaná en 100% piel. Precio con strap tejido $3,500; con strap chaquira $4,000. Colores básicos: taupe, camel, negra, gris. De temporada: roja.',
    materials: '100% piel',
    price: 3500,
    is_featured: false,
    variants: [
      { name: 'Taupe', sku: 'TACANA-TAU', stock: 10 },
      { name: 'Camel', sku: 'TACANA-CAM', stock: 10 },
      { name: 'Negra', sku: 'TACANA-NEG', stock: 10 },
      { name: 'Gris', sku: 'TACANA-GRI', stock: 10 },
      { name: 'Roja', sku: 'TACANA-ROJ', stock: 6 },
    ],
  },
  {
    slug: 'bolsa-luna',
    name: 'Bolsa Luna',
    short_desc: '100% piel · desde $2,500. Compacta y versátil.',
    story:
      'La Luna, compacta y elegante, 100% piel. Precio con strap tejido $2,500; con strap chaquira $3,000. Colores básicos: negra, taupe, camel, gris. De temporada: azul claro y rosa.',
    materials: '100% piel',
    price: 2500,
    is_featured: true,
    variants: [
      { name: 'Negra', sku: 'LUNA-NEG', stock: 10 },
      { name: 'Taupe', sku: 'LUNA-TAU', stock: 10 },
      { name: 'Camel', sku: 'LUNA-CAM', stock: 10 },
      { name: 'Gris', sku: 'LUNA-GRI', stock: 10 },
      { name: 'Azul claro', sku: 'LUNA-AZC', stock: 6 },
      { name: 'Rosa', sku: 'LUNA-ROS', stock: 6 },
    ],
  },
].map((p) => ({
  ...p,
  currency: 'MXN',
  category_slug: 'bolsas',
  category_name: 'Bolsas',
  total_stock: totalStock(p.variants),
  images: [],
}));

const straps = [
  {
    slug: 'strap-tejido',
    name: 'Strap Tejido',
    short_desc: 'Strap tejido artesanal. Bolsa $1,000 · celular $700.',
    story:
      'Straps tejidos a mano. Pregunta por los diseños y tamaños disponibles. Para bolsa $1,000; versión para celular $700.',
    materials: 'Tejido artesanal',
    price: 1000,
    is_featured: false,
    variants: [
      { name: 'Para bolsa', sku: 'STRAP-TEJ-BOL', stock: 15 },
      { name: 'Para celular', sku: 'STRAP-TEJ-CEL', stock: 15 },
    ],
  },
  {
    slug: 'strap-chaquira',
    name: 'Strap Chaquira',
    short_desc: 'Strap de chaquira artesanal. Bolsa $2,200 · celular $1,500.',
    story:
      'Straps de chaquira, tejidos cuenta por cuenta a mano. Pregunta por los diseños y tamaños disponibles. Para bolsa $2,200; versión para celular $1,500.',
    materials: 'Chaquira artesanal',
    price: 2200,
    is_featured: false,
    variants: [
      { name: 'Para bolsa', sku: 'STRAP-CHA-BOL', stock: 15 },
      { name: 'Para celular', sku: 'STRAP-CHA-CEL', stock: 15 },
    ],
  },
].map((p) => ({
  ...p,
  currency: 'MXN',
  category_slug: 'straps',
  category_name: 'Straps',
  total_stock: totalStock(p.variants),
  images: [],
}));

export const sampleProducts = [...bolsas, ...straps];
