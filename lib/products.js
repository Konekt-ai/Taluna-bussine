import { supabase, isSupabaseReady } from './supabase';
import { sampleProducts, sampleCategories } from './sample-data';

// Formatea precio en pesos (o la moneda que venga).
export function formatPrice(value, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

// Lista de categorías para el menú/filtros.
export async function getCategories() {
  if (!isSupabaseReady) return sampleCategories;
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name')
    .eq('is_active', true)
    .order('position', { ascending: true });
  if (error || !data) return sampleCategories;
  return data;
}

// Todo el catálogo publicado.
export async function getProducts() {
  if (!isSupabaseReady) return sampleProducts;
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .order('is_featured', { ascending: false });
  if (error || !data) return sampleProducts;
  return data;
}

// Productos destacados para el home.
export async function getFeatured() {
  const all = await getProducts();
  const featured = all.filter((p) => p.is_featured);
  return featured.length ? featured : all.slice(0, 3);
}

// Un producto por su slug (para la ficha).
export async function getProductBySlug(slug) {
  if (!isSupabaseReady) {
    return sampleProducts.find((p) => p.slug === slug) || null;
  }
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) {
    return sampleProducts.find((p) => p.slug === slug) || null;
  }
  return data;
}
