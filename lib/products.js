import { supabase, isSupabaseReady } from './supabase';
import { getStudioProducts, categoriesFrom } from './studio';
import { sampleProducts, sampleCategories } from './sample-data';

// =====================================================================
//  DE DÓNDE SALE EL CATÁLOGO (en este orden):
//   1. El ORGANIZADOR (vista studio_catalog). Es la fuente real: lo que
//      la dueña guarda ahí es lo que se ve aquí, fotos incluidas.
//   2. Las tablas de la demo (catalog_public), como respaldo mientras no
//      se corra supabase/studio-catalog.sql en el proyecto.
//   3. Datos de ejemplo, cuando no hay llaves de Supabase (desarrollo).
// =====================================================================

// Formatea precio en pesos (o la moneda que venga).
export function formatPrice(value, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

async function loadCatalog() {
  if (!isSupabaseReady) {
    return { products: sampleProducts, categories: sampleCategories };
  }

  // 1) El Organizador manda.
  const studio = await getStudioProducts();
  if (studio) {
    return { products: studio, categories: categoriesFrom(studio) };
  }

  // 2) Respaldo: catálogo viejo en tablas.
  const [prod, cats] = await Promise.all([
    supabase.from('catalog_public').select('*').order('is_featured', { ascending: false }),
    supabase.from('categories').select('slug, name').eq('is_active', true).order('position', {
      ascending: true,
    }),
  ]);

  return {
    products: prod.error || !prod.data ? sampleProducts : prod.data,
    categories: cats.error || !cats.data?.length ? sampleCategories : cats.data,
  };
}

// Lista de categorías para el menú/filtros.
export async function getCategories() {
  return (await loadCatalog()).categories;
}

// Todo el catálogo publicado.
export async function getProducts() {
  return (await loadCatalog()).products;
}

// Productos destacados para el home.
export async function getFeatured() {
  const all = await getProducts();
  const featured = all.filter((p) => p.is_featured);
  return featured.length ? featured : all.slice(0, 3);
}

// Un producto por su slug (para la ficha).
export async function getProductBySlug(slug) {
  const { products } = await loadCatalog();
  return products.find((p) => p.slug === slug) || null;
}
