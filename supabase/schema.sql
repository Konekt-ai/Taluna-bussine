-- =====================================================================
--  TALUNA · INVENTORY HUB — Esquema de catálogo (Supabase / PostgreSQL)
--  Cómo usarlo:
--    1. Entra a tu proyecto en https://app.supabase.com
--    2. Menú izquierdo -> SQL Editor -> New query
--    3. Pega TODO este archivo y dale "Run".
--  Esto crea las tablas, relaciones, políticas de seguridad y una vista
--  lista para consumir desde la web.
-- =====================================================================

-- Extensión para generar IDs (ya viene activa en Supabase, por si acaso)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- CATEGORÍAS
-- ---------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- ej: "bolsas-de-mano"
  name        text not null,                 -- ej: "Bolsas de mano"
  description text,
  position    int  not null default 0,       -- orden en el menú
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCTOS  (catálogo maestro)
-- ---------------------------------------------------------------------
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references categories(id) on delete set null,
  slug         text unique not null,         -- ej: "bolsa-luna-vino"
  name         text not null,
  short_desc   text,                          -- frase corta para la tarjeta
  story        text,                          -- storytelling (ficha de producto)
  materials    text,                          -- ej: "Piel genuina, telar artesanal"
  dimensions   text,                          -- ej: "30 x 22 x 12 cm"
  price        numeric(10,2) not null default 0,
  currency     text not null default 'MXN',
  is_published boolean not null default true, -- regla de publicación
  is_featured  boolean not null default false,-- aparece en home
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_published_idx on products(is_published);

-- ---------------------------------------------------------------------
-- IMÁGENES DE PRODUCTO
-- ---------------------------------------------------------------------
create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,                  -- URL pública (Supabase Storage o externa)
  alt         text,
  position    int  not null default 0
);

create index if not exists product_images_product_idx on product_images(product_id);

-- ---------------------------------------------------------------------
-- VARIANTES + STOCK  (color/talla, inventario por variante)
--  Aquí vive el inventario. Más adelante se puede ampliar a "stock por canal"
--  agregando una tabla channels y stock_by_channel sin romper nada.
-- ---------------------------------------------------------------------
create table if not exists product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  name           text not null,               -- ej: "Vino", "Arena", "Talla M"
  sku            text unique,
  stock          int  not null default 0,
  price_override numeric(10,2),               -- si la variante cuesta distinto
  is_active      boolean not null default true
);

create index if not exists product_variants_product_idx on product_variants(product_id);

-- ---------------------------------------------------------------------
-- updated_at automático en products
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- VISTA: catálogo publicado, con su categoría, imágenes y stock total
--  La web consume esta vista para no hacer joins a mano.
-- ---------------------------------------------------------------------
create or replace view catalog_public as
select
  p.id,
  p.slug,
  p.name,
  p.short_desc,
  p.story,
  p.materials,
  p.dimensions,
  p.price,
  p.currency,
  p.is_featured,
  c.slug  as category_slug,
  c.name  as category_name,
  coalesce(
    (select sum(v.stock) from product_variants v where v.product_id = p.id and v.is_active),
    0
  ) as total_stock,
  coalesce(
    (select json_agg(json_build_object('url', i.url, 'alt', i.alt) order by i.position)
       from product_images i where i.product_id = p.id),
    '[]'::json
  ) as images,
  coalesce(
    (select json_agg(json_build_object('name', v.name, 'sku', v.sku, 'stock', v.stock) order by v.name)
       from product_variants v where v.product_id = p.id and v.is_active),
    '[]'::json
  ) as variants
from products p
left join categories c on c.id = p.category_id
where p.is_published = true;

-- ---------------------------------------------------------------------
-- SEGURIDAD (Row Level Security)
--  Lectura pública del catálogo; escritura solo desde el panel admin
--  (con la service_role key, que NUNCA va en el frontend).
-- ---------------------------------------------------------------------
alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;

-- Lectura pública (cualquiera puede VER el catálogo)
drop policy if exists "lectura publica categorias" on categories;
create policy "lectura publica categorias" on categories
  for select using (is_active = true);

drop policy if exists "lectura publica productos" on products;
create policy "lectura publica productos" on products
  for select using (is_published = true);

drop policy if exists "lectura publica imagenes" on product_images;
create policy "lectura publica imagenes" on product_images
  for select using (true);

drop policy if exists "lectura publica variantes" on product_variants;
create policy "lectura publica variantes" on product_variants
  for select using (true);

-- Nota: no creamos políticas de INSERT/UPDATE/DELETE a propósito.
-- Eso significa que solo la service_role key (backend/admin) puede escribir.
-- =====================================================================
