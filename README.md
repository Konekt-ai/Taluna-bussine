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

## 2. Crear la base de datos (Supabase) — gratis

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

En Supabase → **Storage** → crea un bucket llamado `productos` y márcalo como **público**.
Sube las fotos, copia la URL pública de cada una y pégala en la tabla `product_images`
(o desde el panel **Table Editor**).

---

## 3. Publicar la web (Vercel) — gratis

1. Sube este proyecto a un repo de GitHub.
2. Entra a https://vercel.com, **Add New → Project**, importa el repo.
3. En **Environment Variables** agrega las mismas 3 variables del `.env.local`.
4. **Deploy.** En ~1 minuto tendrás una URL `https://taluna.vercel.app`.

---

## 4. Dominio gratis (DigitalPlat FreeDomain)

1. Entra a https://domain.digitalplat.org y registra tu dominio gratis (ej. `taluna.dpdns.org` o un TLD gratuito).
2. En Vercel: tu proyecto → **Settings → Domains** → agrega tu dominio.
3. Vercel te dará registros DNS (un CNAME o registros A). Cópialos en el panel DNS de DigitalPlat.
4. Espera la propagación (minutos a un par de horas). Listo: tu tienda en tu dominio, sin pagarle a GoDaddy.

---

## 5. ¿Dónde toca cada cosa?

| Quiero cambiar...            | Archivo |
|------------------------------|---------|
| Colores / marca              | `app/globals.css` (variables `--color-*`) y `tailwind.config.js` |
| Tipografías                  | `app/layout.js` (link de fuentes) + `app/globals.css` |
| Textos del home              | `app/page.js` |
| Estructura de la base datos  | `supabase/schema.sql` |
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
lib/
  supabase.js            Cliente de Supabase
  products.js            Lectura de datos (con fallback a ejemplo)
  sample-data.js         Datos de ejemplo
supabase/
  schema.sql             Esquema de la base de datos
  seed.sql               Datos de ejemplo
```

---

## Roadmap (siguiente, según la propuesta Konekt)

- [ ] Panel admin para que Taluna edite catálogo sin tocar SQL
- [ ] Instagram Shopping (feed Meta desde el mismo catálogo)
- [ ] Carrito + checkout
- [ ] CRM básico (leads desde WhatsApp) y automatizaciones
- [ ] Dashboard ejecutivo (ventas, stock, productos top)
