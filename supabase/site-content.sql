-- =====================================================================
--  TALUNA · Contenido editable de la PÁGINA
--  Corre esto UNA VEZ en Supabase -> SQL Editor -> New query.
--  Se puede volver a correr sin romper nada.
--
--  Es el hermano de studio-catalog.sql:
--    · studio-catalog.sql  -> los PRODUCTOS (bolsas, straps, fotos)
--    · este archivo        -> la PÁGINA (textos, botones, fotos de la
--                             portada, el ORDEN de los bloques y los
--                             datos de contacto)
--
--  La dueña lo edita desde el Organizador, sección "Tu página". Se guarda
--  en la misma tabla studio_docs pero en su propia fila (id='site'), para
--  que editar la página y editar el catálogo nunca se pisen entre sí.
--
--  OJO: todo lo que se guarde aquí es contenido PENSADO PARA VERSE en la
--  tienda (por eso la vista lo entrega tal cual). No metas datos privados
--  en esta fila; lo interno va en la fila 'main', que sigue cerrada.
-- =====================================================================

-- 1) La fila donde vive la página ---------------------------------------
insert into public.studio_docs (id, data)
values ('site', '{}'::jsonb)
on conflict (id) do nothing;

-- 2) Vista pública que lee la tienda ------------------------------------
create or replace view public.studio_site as
select
  d.data       as content,
  d.updated_at
from public.studio_docs d
where d.id = 'site';

-- Solo lectura, y solo de esta vista. La tabla studio_docs sigue cerrada
-- con RLS: nadie de fuera puede escribir ni leer la fila del catálogo.
grant select on public.studio_site to anon, authenticated;

-- 3) Comprobación rápida (opcional) --------------------------------------
--   select jsonb_array_length(content->'blocks') as bloques,
--          updated_at
--     from public.studio_site;
-- Mientras la dueña no abra "Tu página" en el Organizador, devuelve NULL
-- y la tienda muestra sus textos originales. Eso es normal.
