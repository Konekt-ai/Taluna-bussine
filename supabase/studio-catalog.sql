-- =====================================================================
--  TALUNA · Puente entre el ORGANIZADOR y la TIENDA pública
--  Corre esto UNA VEZ en Supabase -> SQL Editor -> New query.
--  Se puede volver a correr las veces que quieras sin romper nada.
--
--  ¿Qué hace?
--  El Organizador guarda TODO (bolsas, straps, cinturones y fotos) en una
--  sola fila JSON de la tabla public.studio_docs, que está cerrada al
--  público con RLS. Esta vista abre SOLO lo que la tienda necesita
--  enseñar, ya limpio:
--    · únicamente productos con nombre, con precio y con estado
--      "Activa/Activo" o "Agotada/Agotado" (los ocultos y los
--      "Próximamente" NO salen);
--    · únicamente campos públicos (las notas internas y el código
--      interno/SKU NUNCA se exponen);
--    · las fotos ya resueltas a su URL pública del bucket "studio".
--
--  A partir de aquí, lo que la dueña guarda en el Organizador es lo que
--  se ve en la tienda. No hay que copiar nada a mano.
-- =====================================================================

-- 1) Número seguro -------------------------------------------------------
-- Convierte texto a número sin reventar si viene vacío o mal escrito
-- ("4,000.00" -> 4000.00, "" -> NULL, "abc" -> NULL).
create or replace function public.studio_num(v text)
returns numeric
language sql immutable as $fn$
  select nullif(
    substring(replace(coalesce(v, ''), ',', '') from '[0-9]+(?:\.[0-9]+)?'),
    ''
  )::numeric
$fn$;

-- 2) ¿Este producto se puede mostrar al público? -------------------------
-- Regla única (la tienda y el Organizador enseñan lo mismo):
-- necesita nombre, precio mayor a 0 y estado visible.
create or replace function public.studio_is_public(item jsonb)
returns boolean
language sql immutable as $fn$
  select coalesce(btrim(item->>'name'), '') <> ''
     and coalesce(item->>'status', 'Activa') in ('Activa', 'Activo', 'Agotada', 'Agotado')
     and coalesce(public.studio_num(coalesce(item->>'basePrice', item->>'price')), 0) > 0
$fn$;

-- 3) Producto "limpio" para la tienda ------------------------------------
-- Lista blanca de campos: lo que NO esté aquí jamás sale al público
-- (por ejemplo "notes" = notas internas y "sku" = código interno).
-- Las fotos se entregan como { "nombre del ángulo": "url pública" }.
create or replace function public.studio_public_item(item jsonb, images jsonb)
returns jsonb
language sql immutable as $fn$
  select jsonb_strip_nulls(jsonb_build_object(
    'id',              item->>'id',
    'name',            btrim(item->>'name'),
    'status',          item->>'status',
    'descShort',       nullif(btrim(coalesce(item->>'descShort', '')), ''),
    'descLong',        nullif(btrim(coalesce(item->>'descLong', '')), ''),
    'category',        nullif(btrim(coalesce(item->>'category', '')), ''),
    'color',           nullif(btrim(coalesce(item->>'color', item->>'colorMain', '')), ''),
    'colorsSecondary', nullif(btrim(coalesce(item->>'colorsSecondary', '')), ''),
    'size',            nullif(btrim(coalesce(item->>'size', '')), ''),
    'type',            nullif(btrim(coalesce(item->>'type', '')), ''),
    'pattern',         nullif(btrim(coalesce(item->>'pattern', '')), ''),
    'leatherBase',     nullif(btrim(coalesce(item->>'leatherBase', '')), ''),
    'forType',         nullif(btrim(coalesce(item->>'forType', '')), ''),
    'length',          nullif(btrim(coalesce(item->>'length', '')), ''),
    'width',           nullif(btrim(coalesce(item->>'width', '')), ''),
    'material',        nullif(btrim(coalesce(item->>'material', '')), ''),
    'hardware',        nullif(btrim(coalesce(item->>'hardware', '')), ''),
    'hardwareColor',   nullif(btrim(coalesce(item->>'hardwareColor', '')), ''),
    'profile',         nullif(btrim(coalesce(item->>'profile', '')), ''),
    'price',           public.studio_num(coalesce(item->>'basePrice', item->>'price')),
    'stock',           public.studio_num(item->>'stock'),
    'dimH',            public.studio_num(item->>'dimH'),
    'dimW',            public.studio_num(item->>'dimW'),
    'dimD',            public.studio_num(item->>'dimD'),
    'tags',            coalesce(item->'tags', '[]'::jsonb),
    'useType',         coalesce(item->'useType', '[]'::jsonb),
    'photoRoles',      coalesce(item->'photoRoles', '{}'::jsonb),
    'photos',          (
      select coalesce(jsonb_object_agg(e.slot, images->>e.img), '{}'::jsonb)
        from jsonb_each_text(
               case when jsonb_typeof(item->'photos') = 'object'
                    then item->'photos' else '{}'::jsonb end
             ) as e(slot, img)
       where images->>e.img is not null
    )
  ))
$fn$;

-- 4) Lista de productos publicables de una sección -----------------------
-- Respeta el orden en el que aparecen en el Organizador.
create or replace function public.studio_public_list(items jsonb, images jsonb)
returns jsonb
language sql immutable as $fn$
  select coalesce(
    jsonb_agg(public.studio_public_item(t.item, images) order by t.ord),
    '[]'::jsonb
  )
  from jsonb_array_elements(
         case when jsonb_typeof(items) = 'array' then items else '[]'::jsonb end
       ) with ordinality as t(item, ord)
  where public.studio_is_public(t.item)
$fn$;

-- 5) LA VISTA que consume la tienda --------------------------------------
-- Una sola fila con las tres secciones ya filtradas y limpias.
create or replace view public.studio_catalog as
select
  d.updated_at,
  public.studio_public_list(d.data->'bags',   d.data->'images') as bags,
  public.studio_public_list(d.data->'straps', d.data->'images') as straps,
  public.studio_public_list(d.data->'belts',  d.data->'images') as belts
from public.studio_docs d
where d.id = 'main';

-- Lectura pública SOLO de la vista. La tabla studio_docs sigue cerrada:
-- nadie de fuera puede ver borradores, notas internas ni escribir nada.
grant select on public.studio_catalog to anon, authenticated;
grant execute on function public.studio_num(text)                 to anon, authenticated;
grant execute on function public.studio_is_public(jsonb)          to anon, authenticated;
grant execute on function public.studio_public_item(jsonb, jsonb) to anon, authenticated;
grant execute on function public.studio_public_list(jsonb, jsonb) to anon, authenticated;

-- 6) Apaga el catálogo de la demo ----------------------------------------
-- Las tablas products/product_images de la demo ya NO alimentan la tienda
-- (sus fotos vivían en el bucket "productos", que era solo de prueba).
-- Las dejamos OCULTAS, no las borramos: si algún día quieres recuperarlas,
-- corre  ->  update public.products set is_published = true;
update public.products set is_published = false where is_published;

-- 7) Comprobación rápida (opcional) --------------------------------------
-- Debe devolver tus bolsas/straps/cinturones publicables:
--   select jsonb_array_length(bags)   as bolsas,
--          jsonb_array_length(straps) as straps,
--          jsonb_array_length(belts)  as cinturones
--     from public.studio_catalog;
