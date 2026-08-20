# Taluna · Web + Catálogo (Konekt)

Tienda de bolsas artesanales con catálogo conectado a base de datos. Todo el stack es **gratis**.

- **Web:** Next.js 14 (App Router)
- **Base de datos:** Supabase (Postgres + Storage)
- **Hosting:** Vercel (capa gratis)
- **Dominio:** DigitalPlat FreeDomain

> La web **funciona desde ya** con datos de ejemplo, aunque no hayas conectado Supabase. En cuanto pongas tus llaves, jala de la base de datos real automáticamente.

---

## 1. Correr en tu compu (local)

Necesitas Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — ya verás la tienda con productos de ejemplo.

---

## 2. ¿De dónde salen los productos y las fotos?

Del **Organizador** (repo `Tanuna-organizador`), el panel que Taluna usa desde el
celular: ahí da de alta bolsas, straps y cinturones y sube las fotos (bucket
`studio` de Supabase). Esta tienda lee ese mismo catálogo, así que **lo que se
guarda en el Organizador aparece aquí solo**, sin volver a desplegar y sin tocar
SQL. Tarda menos de un minuto.

**Qué se publica:** lo que tiene *nombre*, *precio* y estado *Activa/Activo* o
*Agotada/Agotado*. Lo oculto y lo marcado "Próximamente" no sale; los borradores
sin precio tampoco. En el Organizador, la pantalla **Tu tienda en vivo** dice
exactamente qué se está mostrando, qué no y por qué.

### Encenderlo (una sola vez)

1. Supabase → **SQL Editor → New query** → pega todo `supabase/studio-catalog.sql`
   y dale **Run**.
2. Eso crea la vista `studio_catalog` (solo campos públicos: las notas internas y
   el SKU nunca salen) y **apaga** el catálogo viejo de la demo, cuyas fotos
   vivían en el bucket `productos` que solo era de prueba.

Si esa vista no existe o falla, la tienda usa como respaldo el catálogo viejo en
tablas: nunca se queda en blanco.

---

## 3. La página también se edita desde el Organizador

En el Organizador, la sección **Tu página** deja a Taluna:

- cambiar **textos, botones y fotos** de cada bloque del home;
- **mover los bloques de lugar** (flechas ↑↓) y **ocultar** los que no quiera;
- **agregar bloques nuevos**: un *aviso* (franja de promoción), *texto + imagen*,
  una *galería de fotos*, una *foto grande con texto* (bloque editorial) o la
  *combinación del mes* (la foto panorámica con la bolsa recortada encima);
- cambiar el **video o la foto de portada**, con una versión para computadora
  (horizontal) y otra opcional para celular (vertical); el video sube directo a
  Supabase porque no cabe por las rutas del servidor;
- cambiar la **barra de hasta arriba** (el textito encima del logo);
- editar **WhatsApp, correo, redes y mapa**, que alimentan el menú, el pie y
  todos los botones de WhatsApp del sitio;
- editar el **encabezado del catálogo** (incluida su foto de portada) y los
  textos del **pie de página**.

Lo que NO se puede tocar es el diseño (colores, tipografías, tamaños): así la
página siempre se ve bien pase lo que pase.

### La página reconoce el aparato

Cada foto grande admite **dos versiones**: la de computadora (horizontal) y una
opcional para **celular** (vertical). La página elige sola cuál poner:

- las fotos las decide el propio navegador con `<picture>`, antes de pintar (no
  hay parpadeo y no se descargan las dos);
- el video de portada lo decide `components/HeroMedia.js`, así que un celular
  nunca se baja el video pesado de computadora — y si el teléfono va en **ahorro
  de datos** o el usuario pidió menos animación, se queda la foto de respaldo;
- el **recorte** (qué tan alta o ancha se ve cada foto) cambia solo entre
  celular, tablet y computadora con las variables `--ar-*` de
  `app/globals.css`. Si algo se ve mal recortado, se ajusta ahí y cambia en toda
  la página.

En los títulos, un **salto de línea** parte el renglón y lo que va `*entre
asteriscos*` sale en el color de la marca (el café Taluna).

### Encenderlo (una sola vez)

Supabase → **SQL Editor → New query** → pega todo `supabase/site-content.sql` y
dale **Run**. Crea la vista `studio_site`. Mientras no exista (o si falla), la
tienda muestra sus textos originales, que son los mismos que ves hoy.

> Los textos originales viven en `lib/site-content.js` y hay una **copia
> idéntica** en `public/estudio.html` del Organizador (constante
> `SITE_DEFAULTS`), que es la que se siembra la primera vez que abren la
> pantalla. Si cambias un original aquí, cámbialo también allá.

### Que el cambio se vea al instante (opcional)

Sin esto la tienda ya se refresca sola cada 60 segundos. Para que salga en el
momento exacto en que la dueña guarda:

1. En la tienda (Vercel → Environment Variables): `REVALIDATE_SECRET` con una
   contraseña larga inventada.
2. En el Organizador: `STORE_REVALIDATE_URL=https://TU-TIENDA/api/revalidate` y
   `STORE_REVALIDATE_SECRET` con **el mismo** valor.

---

## 4. Crear la base de datos (Supabase) — gratis

1. Entra a https://supabase.com y crea cuenta (gratis).
2. **New project** → ponle nombre (ej. `taluna`) y una contraseña de base de datos.
3. Cuando esté listo, ve a **SQL Editor → New query**.
4. Pega TODO el contenido de `supabase/schema.sql` y dale **Run**. (Crea las tablas.)
5. Repite con `supabase/seed.sql` para tener productos de ejemplo (opcional).
6. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public` key

### Conectar la web a Supabase

Crea un archivo `.env.local` (copia de `.env.example`) y pega tus llaves:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_WHATSAPP=5213312345678
```

Reinicia `npm run dev`. Ahora los productos vienen de tu base de datos real.

### Subir fotos de productos

Ya no se hace aquí: las sube Taluna desde el **Organizador** y se guardan en el
bucket `studio`. Esta tienda las toma de ahí (ver sección 2). Las tablas
`products` / `product_images` quedan solo como respaldo histórico.

---

## 5. Publicar la web (Vercel) — gratis

1. Sube este proyecto a un repo de GitHub.
2. Entra a https://vercel.com, **Add New → Project**, importa el repo.
3. En **Environment Variables** agrega las mismas 3 variables del `.env.local`.
4. **Deploy.** En ~1 minuto tendrás una URL `https://taluna.vercel.app`.

---

## 6. Dominio gratis (DigitalPlat FreeDomain)

1. Entra a https://domain.digitalplat.org y registra tu dominio gratis (ej. `taluna.dpdns.org` o un TLD gratuito).
2. En Vercel: tu proyecto → **Settings → Domains** → agrega tu dominio.
3. Vercel te dará registros DNS (un CNAME o registros A). Cópialos en el panel DNS de DigitalPlat.
4. Espera la propagación (minutos a un par de horas). Listo: tu tienda en tu dominio, sin pagarle a GoDaddy.

---

## 7. ¿Dónde toca cada cosa?

| Quiero cambiar...            | Archivo |
|------------------------------|---------|
| Colores / marca              | `app/globals.css` (bloque `:root` de arriba: `--ivory`, `--ink`, `--accent`…) y `tailwind.config.js` |
| Tipografías                  | `app/layout.js` (link de Google Fonts: **Figtree**) + `--font-body` / `--font-display` en `app/globals.css` |
| Textos del home              | `app/page.js` |
| Estructura de la base datos  | `supabase/schema.sql` |
| Qué se publica y cómo se ve el catálogo del Organizador | `supabase/studio-catalog.sql` y `lib/studio.js` |
| Textos originales de la página y bloques | `lib/site-content.js` y `components/blocks/HomeBlocks.js` |
| Cada cuánto se refresca el catálogo | `CATALOG_REVALIDATE` en `lib/supabase.js` y el `export const revalidate` de cada página |
| Productos de ejemplo         | `supabase/seed.sql` y `lib/sample-data.js` |
| Número de WhatsApp           | variable `NEXT_PUBLIC_WHATSAPP` |

---

## Estructura del proyecto

```
app/
  layout.js              Estructura global (nav, footer, WhatsApp)
  page.js                Home
  catalogo/page.js       Catálogo con filtros
  producto/[slug]/page.js Ficha de producto
components/              Nav, Footer, ProductCard, CatalogGrid, WhatsAppButton
  api/revalidate/route.js  Refresco inmediato que dispara el Organizador
components/blocks/       Cada bloque del home (portada, artesanal, galería…)
lib/
  supabase.js            Cliente de Supabase
  studio.js              Catálogo del Organizador -> productos de la tienda
  site-content.js        Textos/bloques de la página (con sus originales)
  products.js            Lectura de datos (Organizador -> tablas -> ejemplo)
  sample-data.js         Datos de ejemplo
supabase/
  schema.sql             Esquema de la base de datos
  seed.sql               Datos de ejemplo
  studio-catalog.sql     Vista pública del catálogo del Organizador
  site-content.sql       Vista pública de la página editable
```

---

## Roadmap (siguiente, según la propuesta Konekt)

- [x] Panel admin para que Taluna edite catálogo sin tocar SQL (repo `Tanuna-organizador`)
- [ ] Instagram Shopping (feed Meta desde el mismo catálogo)
- [ ] Carrito + checkout
- [ ] CRM básico (leads desde WhatsApp) y automatizaciones
- [ ] Dashboard ejecutivo (ventas, stock, productos top)
