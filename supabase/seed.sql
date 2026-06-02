-- =====================================================================
--  CATÁLOGO REAL — Taluna (basado en el catálogo oficial)
--  Corre esto DESPUÉS de schema.sql.
--  OJO: primero BORRA cualquier dato previo (de ejemplo) para no duplicar.
-- =====================================================================

-- Limpia datos anteriores (productos de ejemplo, etc.)
truncate table product_variants, product_images, products, categories cascade;

-- ---------------------------------------------------------------------
-- CATEGORÍAS
-- ---------------------------------------------------------------------
insert into categories (slug, name, description, position) values
  ('bolsas', 'Bolsas', 'Bolsas 100% de piel, hechas a mano.', 1),
  ('straps', 'Straps', 'Straps artesanales tejidos y de chaquira.', 2)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- BOLSA TAUÚ — $3,800
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'bolsas')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'bolsa-tauu', 'Bolsa Tauú',
       'La bolsa perfecta para cualquier salida. 100% piel.',
       'La Tauú es 100% piel, hecha a mano por artesanas mexicanas. Combínala con tu strap artesanal favorito —chaquira o tejido— y hazla única. Pregunta por los diseños disponibles.',
       '100% piel', 3800.00, true
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock)
select p.id, v.name, v.sku, v.stock
from products p
join (values
  ('Negra', 'TAUU-NEG', 10),
  ('Blanca', 'TAUU-BLA', 10),
  ('Camel', 'TAUU-CAM', 10)
) as v(name, sku, stock) on true
where p.slug = 'bolsa-tauu';

-- ---------------------------------------------------------------------
-- BOLSA MARAICA — strap tejida $3,500 / chaquira $4,000
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'bolsas')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'bolsa-maraica', 'Bolsa Maraica',
       '100% piel · desde $3,500. Elige tu strap.',
       'La Maraica en 100% piel. Elige el strap que más te guste. Precio con strap tejida $3,500; con strap chaquira $4,000. Colores básicos: taupe, camel, negra, gris. De temporada: tinta y azul marino.',
       '100% piel', 3500.00, true
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock)
select p.id, v.name, v.sku, v.stock
from products p
join (values
  ('Taupe', 'MARAICA-TAU', 10),
  ('Camel', 'MARAICA-CAM', 10),
  ('Negra', 'MARAICA-NEG', 10),
  ('Gris', 'MARAICA-GRI', 10),
  ('Tinta', 'MARAICA-TIN', 6),
  ('Azul marino', 'MARAICA-AZM', 6)
) as v(name, sku, stock) on true
where p.slug = 'bolsa-maraica';

-- ---------------------------------------------------------------------
-- BOLSA TACANÁ — strap tejido $3,500 / chaquira $4,000
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'bolsas')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'bolsa-tacana', 'Bolsa Tacaná',
       '100% piel · desde $3,500. Elige tu strap.',
       'La Tacaná en 100% piel. Precio con strap tejido $3,500; con strap chaquira $4,000. Colores básicos: taupe, camel, negra, gris. De temporada: roja.',
       '100% piel', 3500.00, false
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock)
select p.id, v.name, v.sku, v.stock
from products p
join (values
  ('Taupe', 'TACANA-TAU', 10),
  ('Camel', 'TACANA-CAM', 10),
  ('Negra', 'TACANA-NEG', 10),
  ('Gris', 'TACANA-GRI', 10),
  ('Roja', 'TACANA-ROJ', 6)
) as v(name, sku, stock) on true
where p.slug = 'bolsa-tacana';

-- ---------------------------------------------------------------------
-- BOLSA LUNA — strap tejido $2,500 / chaquira $3,000
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'bolsas')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'bolsa-luna', 'Bolsa Luna',
       '100% piel · desde $2,500. Compacta y versátil.',
       'La Luna, compacta y elegante, 100% piel. Precio con strap tejido $2,500; con strap chaquira $3,000. Colores básicos: negra, taupe, camel, gris. De temporada: azul claro y rosa.',
       '100% piel', 2500.00, true
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock)
select p.id, v.name, v.sku, v.stock
from products p
join (values
  ('Negra', 'LUNA-NEG', 10),
  ('Taupe', 'LUNA-TAU', 10),
  ('Camel', 'LUNA-CAM', 10),
  ('Gris', 'LUNA-GRI', 10),
  ('Azul claro', 'LUNA-AZC', 6),
  ('Rosa', 'LUNA-ROS', 6)
) as v(name, sku, stock) on true
where p.slug = 'bolsa-luna';

-- ---------------------------------------------------------------------
-- STRAPS TEJIDOS — bolsa $1,000 / celular $700
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'straps')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'strap-tejido', 'Strap Tejido',
       'Strap tejido artesanal. Bolsa $1,000 · celular $700.',
       'Straps tejidos a mano. Pregunta por los diseños y tamaños disponibles. Para bolsa $1,000; versión para celular $700.',
       'Tejido artesanal', 1000.00, false
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock, price_override)
select p.id, v.name, v.sku, v.stock, v.price_override
from products p
join (values
  ('Para bolsa', 'STRAP-TEJ-BOL', 15, null::numeric),
  ('Para celular', 'STRAP-TEJ-CEL', 15, 700.00)
) as v(name, sku, stock, price_override) on true
where p.slug = 'strap-tejido';

-- ---------------------------------------------------------------------
-- STRAPS CHAQUIRA — bolsa $2,200 / celular $1,500
-- ---------------------------------------------------------------------
with cat as (select id from categories where slug = 'straps')
insert into products (category_id, slug, name, short_desc, story, materials, price, is_featured)
select cat.id, 'strap-chaquira', 'Strap Chaquira',
       'Strap de chaquira artesanal. Bolsa $2,200 · celular $1,500.',
       'Straps de chaquira, tejidos cuenta por cuenta a mano. Pregunta por los diseños y tamaños disponibles. Para bolsa $2,200; versión para celular $1,500.',
       'Chaquira artesanal', 2200.00, false
from cat on conflict (slug) do nothing;

insert into product_variants (product_id, name, sku, stock, price_override)
select p.id, v.name, v.sku, v.stock, v.price_override
from products p
join (values
  ('Para bolsa', 'STRAP-CHA-BOL', 15, null::numeric),
  ('Para celular', 'STRAP-CHA-CEL', 15, 1500.00)
) as v(name, sku, stock, price_override) on true
where p.slug = 'strap-chaquira';

-- ---------------------------------------------------------------------
-- IMÁGENES (fotos reales subidas a Supabase Storage, bucket "productos")
-- ---------------------------------------------------------------------
insert into product_images (product_id, url, alt, position)
select p.id, img.url, p.name, 0
from products p
join (values
  ('bolsa-tauu',     'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/Tauu.jpeg'),
  ('bolsa-maraica',  'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/MARAICA.jpeg'),
  ('bolsa-tacana',   'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/Tacana.jpeg'),
  ('bolsa-luna',     'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/Luna.jpeg'),
  ('strap-tejido',   'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/STRAPS%20%20TEJIDOS.jpeg'),
  ('strap-chaquira', 'https://zvtwqwxycyrjwfxamgqn.supabase.co/storage/v1/object/public/productos/STRAPS%20CHAQUIRA.jpeg')
) as img(slug, url) on img.slug = p.slug;
