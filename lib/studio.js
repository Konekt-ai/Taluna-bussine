import { supabase } from './supabase';

// =====================================================================
//  ORGANIZADOR -> TIENDA
//  El Organizador (tanuna-organizador) guarda bolsas, straps, cinturones
//  y fotos en un solo documento. La vista "studio_catalog" de Supabase
//  (ver supabase/studio-catalog.sql) lo entrega ya filtrado y limpio.
//  Aquí lo traducimos a la forma que usa la tienda (la misma que tenía
//  la vista catalog_public), para que las páginas no cambien.
//
//  REGLA DE PUBLICACIÓN (la aplica el SQL, aquí solo la repetimos por
//  seguridad): se muestra lo que tiene nombre, precio y estado
//  "Activa/Activo" o "Agotada/Agotado". Lo oculto y lo "Próximamente"
//  no sale, y los borradores sin precio tampoco.
// =====================================================================

const SECTIONS = [
  { key: 'bags', kind: 'bag', slug: 'bolsas', name: 'Bolsas', prefix: 'bolsa-' },
  { key: 'straps', kind: 'strap', slug: 'straps', name: 'Straps', prefix: 'strap-' },
  { key: 'belts', kind: 'belt', slug: 'cinturones', name: 'Cinturones', prefix: 'cinturon-' },
];

// Orden en el que se ven bien las fotos de un producto (los ángulos vienen
// del Organizador). Lo que no esté en la lista va al final, en su orden.
const PHOTO_ORDER = [
  'Fondo blanco · frontal',
  'Fondo blanco',
  'Fondo blanco · 3/4',
  'Fondo blanco · lateral',
  'Fondo blanco · trasera',
  'En modelo · frontal',
  'En modelo · lateral',
  'En modelo · de espaldas',
  'Puesto en modelo',
  'Puesto en bolsa',
  'Extendido completo',
  'Enrollado',
  'Close-up piel',
  'Close-up tejido',
  'Close-up terminales',
  'Close-up hebilla',
  'Close-up logo',
  'Close-up herrajes',
  'Tamaño en persona',
  'Lifestyle',
  'Instagram Shopping',
];

// Ese "ángulo" guarda un enlace, no una foto.
const NOT_A_PHOTO = new Set(['Video o link']);

// Etiquetas del Organizador que marcan un producto como destacado (home).
const FEATURED_TAGS = new Set([
  'Nueva', 'Nuevo', 'Más vendida', 'Más vendido', 'Recomendada', 'Recomendado',
]);

// "Taúu" -> "tauu" · "Maraica Mini" -> "maraica-mini"
function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Si la dueña ya escribió "Bolsa Luna", no queremos /producto/bolsa-bolsa-luna.
function slugFor(section, item, taken) {
  const clean = String(item.name || '').replace(
    /^(bolsas?|straps?|cinturones?|cintur[oó]n)\s+/i,
    ''
  );
  const base = section.prefix + (slugify(clean) || slugify(item.name) || 'producto');
  // Dos productos con el mismo nombre: el segundo lleva sufijo estable.
  const slug = taken.has(base) ? `${base}-${String(item.id || '').slice(-4)}` : base;
  taken.add(slug);
  return slug;
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function text(value) {
  const s = String(value ?? '').trim();
  return s || null;
}

// Fotos ordenadas: primero la marcada como "Principal" en el Organizador,
// luego el orden natural de ángulos.
function photosOf(item) {
  const photos = item.photos || {};
  const roles = item.photoRoles || {};
  const entries = Object.entries(photos).filter(
    ([slot, url]) => !NOT_A_PHOTO.has(slot) && typeof url === 'string' && url.startsWith('http')
  );

  const rank = (slot) => {
    if ((roles[slot] || []).includes('Principal')) return -1;
    const i = PHOTO_ORDER.indexOf(slot);
    return i === -1 ? PHOTO_ORDER.length : i;
  };

  return entries
    .sort((a, b) => rank(a[0]) - rank(b[0]))
    .map(([slot, url]) => ({ url, alt: `${item.name} — ${slot}` }));
}

// Medidas legibles a partir de alto/ancho/largo (bolsas).
function measures(item) {
  const parts = [
    ['Alto', item.dimH],
    ['Ancho', item.dimW],
    ['Largo', item.dimD],
  ].filter(([, v]) => num(v) !== null);
  if (!parts.length) return null;
  return parts.map(([label, v]) => `${label} ${num(v)}`).join(' · ') + ' cm';
}

// Filas de la ficha de producto. Solo se muestran las que tienen dato.
function detailsOf(kind, item) {
  const rows =
    kind === 'bag'
      ? [
          ['Color', item.color],
          ['Tamaño', item.size],
          ['Medidas', measures(item)],
          ['Material', item.material],
          ['Herrajes', [item.hardware, item.hardwareColor].filter(Boolean).join(' · ')],
          ['Ideal para', (item.useType || []).join(' · ')],
        ]
      : kind === 'strap'
      ? [
          ['Tipo', item.type],
          ['Color', item.color],
          ['Colores', item.colorsSecondary],
          ['Base de piel', item.leatherBase],
          ['Diseño', item.pattern],
          ['Largo', item.length],
          ['Ancho', num(item.width) !== null ? `${num(item.width)} cm` : null],
          ['Material', item.material],
          ['Es para', item.forType],
        ]
      : [
          ['Tipo', item.type],
          ['Color', item.color],
          ['Colores', item.colorsSecondary],
          ['Talla', item.size],
          ['Largo', num(item.length) !== null ? `${num(item.length)} cm` : null],
          ['Ancho', num(item.width) !== null ? `${num(item.width)} cm` : null],
        ];

  return rows
    .map(([label, value]) => ({ label, value: text(value) }))
    .filter((row) => row.value);
}

function toProduct(section, item, taken) {
  const price = num(item.price) || 0;
  const stock = num(item.stock);
  const images = photosOf(item);
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const soldOut = /^agotad/i.test(item.status || '') || stock === 0;

  return {
    id: item.id,
    slug: slugFor(section, item, taken),
    name: item.name,
    short_desc: text(item.descShort),
    story: text(item.descLong) || text(item.descShort),
    materials: text(item.material),
    dimensions: section.kind === 'bag' ? measures(item) : null,
    details: detailsOf(section.kind, item),
    price,
    currency: 'MXN',
    is_featured: tags.some((t) => FEATURED_TAGS.has(t)),
    category_slug: section.slug,
    category_name: section.name,
    // null = la dueña no lleva inventario de esa pieza (no es "agotado").
    total_stock: stock,
    sold_out: soldOut,
    images,
    variants: [],
  };
}

// Traduce lo que entrega la vista studio_catalog a productos de la tienda.
export function productsFromCatalog(data) {
  const taken = new Set();
  const products = [];
  for (const section of SECTIONS) {
    for (const item of data?.[section.key] || []) {
      if (!item?.name || !(num(item.price) > 0)) continue;
      products.push(toProduct(section, item, taken));
    }
  }
  // Los destacados primero (el resto conserva el orden del Organizador).
  return products.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
}

// Devuelve los productos del Organizador, o null si la vista todavía no
// existe / no se pudo leer (ahí la tienda usa su respaldo).
export async function getStudioProducts() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('studio_catalog')
    .select('bags, straps, belts, updated_at')
    .maybeSingle();

  if (error) {
    console.warn('[taluna] No se pudo leer studio_catalog:', error.message);
    return null;
  }
  if (!data) return [];

  return productsFromCatalog(data);
}

// Categorías con al menos un producto publicado, en el orden del Organizador.
export function categoriesFrom(products) {
  return SECTIONS.filter((s) => products.some((p) => p.category_slug === s.slug)).map((s) => ({
    slug: s.slug,
    name: s.name,
  }));
}
