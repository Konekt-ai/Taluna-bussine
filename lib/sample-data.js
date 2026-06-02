// Datos de ejemplo usados SOLO cuando Supabase aún no está configurado.
// Coinciden con supabase/seed.sql. Sirven para ver la web funcionando ya.

export const sampleCategories = [
  { slug: 'bolsas-de-mano', name: 'Bolsas de mano' },
  { slug: 'bolsas-cruzadas', name: 'Bolsas cruzadas' },
  { slug: 'clutches', name: 'Clutches' },
];

export const sampleProducts = [
  {
    slug: 'bolsa-luna-vino',
    name: 'Bolsa Luna · Vino',
    short_desc: 'Bolsa estructurada en tono vino, tejida a mano.',
    story:
      'La Luna nace del telar de nuestras artesanas. Cada pieza toma cerca de tres días de trabajo y ninguna es idéntica a otra: el tejido cuenta su propia historia.',
    materials: 'Telar artesanal de algodón, herrajes dorados, forro interior.',
    dimensions: '30 x 22 x 12 cm',
    price: 1290,
    currency: 'MXN',
    is_featured: true,
    category_slug: 'bolsas-de-mano',
    category_name: 'Bolsas de mano',
    total_stock: 11,
    images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80', alt: 'Bolsa Luna' }],
    variants: [
      { name: 'Vino', sku: 'LUNA-VINO', stock: 8 },
      { name: 'Negro', sku: 'LUNA-NEG', stock: 3 },
    ],
  },
  {
    slug: 'cruzada-sol-arena',
    name: 'Cruzada Sol · Arena',
    short_desc: 'Bolsa cruzada ligera, ideal para todos los días.',
    story:
      'Pensada para moverte sin cargar de más. Correa ajustable y un tamaño que cabe lo esencial sin renunciar al estilo.',
    materials: 'Piel genuina, correa textil tejida.',
    dimensions: '24 x 18 x 8 cm',
    price: 990,
    currency: 'MXN',
    is_featured: true,
    category_slug: 'bolsas-cruzadas',
    category_name: 'Bolsas cruzadas',
    total_stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', alt: 'Cruzada Sol' }],
    variants: [{ name: 'Arena', sku: 'SOL-ARE', stock: 12 }],
  },
  {
    slug: 'clutch-aurora',
    name: 'Clutch Aurora',
    short_desc: 'Clutch de noche con detalle bordado a mano.',
    story:
      'Aurora reúne el trabajo de bordado tradicional en una pieza moderna. Perfecta para cerrar un look especial.',
    materials: 'Textil bordado a mano, cierre metálico.',
    dimensions: '26 x 14 x 4 cm',
    price: 750,
    currency: 'MXN',
    is_featured: false,
    category_slug: 'clutches',
    category_name: 'Clutches',
    total_stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&q=80', alt: 'Clutch Aurora' }],
    variants: [{ name: 'Único', sku: 'AURORA-U', stock: 5 }],
  },
  {
    slug: 'bolsa-valle-natural',
    name: 'Bolsa Valle · Natural',
    short_desc: 'Tote amplio en fibras naturales.',
    story:
      'El Valle es nuestra pieza más espaciosa: cabe la laptop, el termo y la vida entera. Hecha para acompañarte sin estorbar.',
    materials: 'Fibra natural tejida, asas reforzadas.',
    dimensions: '38 x 32 x 14 cm',
    price: 1450,
    currency: 'MXN',
    is_featured: false,
    category_slug: 'bolsas-de-mano',
    category_name: 'Bolsas de mano',
    total_stock: 6,
    images: [{ url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=900&q=80', alt: 'Bolsa Valle' }],
    variants: [{ name: 'Natural', sku: 'VALLE-NAT', stock: 6 }],
  },
];
