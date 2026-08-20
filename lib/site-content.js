import { supabase } from './supabase';

// =====================================================================
//  CONTENIDO EDITABLE DE LA PÁGINA
//  Todo lo que la dueña puede cambiar desde el Organizador (sección
//  "Tu página"): textos, botones, fotos, el ORDEN de los bloques, cuáles
//  se ven y cuáles no, más los datos de contacto.
//
//  Vive en Supabase en `studio_docs` con id='site' y la tienda lo lee por
//  la vista pública `studio_site` (ver supabase/site-content.sql).
//
//  Lo de abajo son los valores ORIGINALES: es lo que se ve si todavía no
//  han tocado nada, y el respaldo de cualquier campo que quede vacío.
//  ⚠️ El Organizador tiene esta misma copia en `public/estudio.html`
//  (constante SITE_DEFAULTS) para poder mostrarla en el editor.
//
//  Formato de los textos:
//    · un salto de línea = un renglón nuevo
//    · *entre asteriscos* = la palabra en color de acento
// =====================================================================

export const ASSETS = {
  heroVideo: '/design/taluna-hero-bag.mp4',
  heroPoster: '/design/taluna-hero-bag-poster.jpg',
  craft: '/design/craft-straps.jpg',
};

// Campos por tipo de bloque. Los bloques que la dueña agregue usan los
// mismos tipos "libres" del final (aviso, textoImagen, galeria, editorial,
// combinacion).
export const BLOCK_DEFAULTS = {
  hero: {
    eyebrow: 'Hecho a mano en México',
    title: 'Bolsas artesanales que se adaptan a *tu estilo.*',
    lead: 'Piel, chaquira y diseño mexicano en piezas personalizables. Elige tu bolsa, tu color y tu strap.',
    cta1: { text: 'Ver catálogo', to: 'catalogo' },
    cta2: { text: 'Nuestra historia', to: 'historia' },
    // n vacío = se cuenta solo (número de piezas publicadas)
    stats: [
      { n: '', l: 'Modelos' },
      { n: '100%', l: 'Piel genuina' },
      { n: 'MX', l: 'Hecho a mano' },
    ],
    // type 'video' usa src+poster; type 'image' usa image (si está vacía, sigue el video).
    // Los campos *Mobile son la versión vertical: el celular usa esa y la
    // computadora la normal (ver components/HeroMedia.js).
    media: {
      type: 'video',
      src: ASSETS.heroVideo,
      srcMobile: '',
      poster: ASSETS.heroPoster,
      posterMobile: '',
      image: '',
      imageMobile: '',
    },
    showCap: true,
  },
  craft: {
    image: ASSETS.craft,
    imageMobile: '',
    eyebrow: 'Intercambiables',
    title: 'El strap\ncambia *todo.*',
    text: 'Diseños artesanales para transformar tu Taluna. Cada strap se teje cuenta por cuenta y se monta sobre piel genuina.',
    chips: ['Chaquira tejida', 'Piel genuina', 'Latón macizo'],
    cta: { text: 'Comprar straps', to: 'catalogo' },
  },
  categorias: {
    eyebrow: 'Explora por categoría',
    title: 'Modelos *Taluna.*',
    cta: { text: 'Ver todo', to: 'catalogo' },
  },
  destacados: {
    eyebrow: 'Favoritos de la temporada',
    title: 'Lo más vendido',
    lead: 'Las piezas que nuestras clientas no sueltan. Disponibilidad real, listas para enviar.',
  },
  historia: {
    eyebrow: 'Nuestra historia',
    title: 'Detrás de\ncada *strap.*',
    lead: 'Taluna nace del trabajo de manos artesanas mexicanas. Combinamos tejido y chaquira con piel seleccionada para crear piezas modernas que duran años, no temporadas.',
    image1: ASSETS.craft,
    image1Mobile: '',
    image2: ASSETS.heroPoster,
    points: [
      { t: 'Piel genuina seleccionada', d: 'Materiales nobles que envejecen con carácter.' },
      { t: 'Hecho a mano, pieza por pieza', d: 'Detalles tejidos y chaquira aplicados a mano.' },
      { t: 'Atención cercana', d: 'Te acompañamos por WhatsApp en cada compra.' },
    ],
  },
  materiales: {
    eyebrow: 'Materiales',
    title: 'Lo que la\nhace *especial.*',
    lead: 'Nada es accidental. Elegimos cada material por su textura, su color y la forma en que envejece contigo.',
    image: ASSETS.heroPoster,
    imageMobile: '',
    items: [
      { k: '100% piel', v: 'Tacto suave, larga vida' },
      { k: 'Telar', v: 'Hilo de algodón teñido a mano' },
      { k: 'Chaquira', v: 'Cuentas aplicadas una a una' },
      { k: 'Herrajes', v: 'Acabado mate resistente' },
    ],
  },
  comunidad: {
    eyebrow: '@talunamx',
    title: 'Inspírate con *Taluna.*',
    // Si se dejan vacías, se usan las fotos reales del catálogo.
    images: [],
    cta: { text: 'Ver en Instagram', to: 'instagram' },
  },
  contacto: {
    eyebrow: 'Estamos cerca',
    title: '¿Lista para tu\n*próxima pieza?*',
    lead: 'Escríbenos por WhatsApp y te ayudamos a elegir. Hacemos envíos a todo México y aceptamos pedidos personalizados.',
    image: ASSETS.heroPoster,
    imageMobile: '',
  },

  // ---- Bloques que la dueña puede AGREGAR las veces que quiera ----
  aviso: {
    text: 'Envío gratis en compras mayores a $2,000',
    cta: { text: '', to: 'catalogo' },
  },
  textoImagen: {
    eyebrow: '',
    title: 'Un título bonito',
    text: 'Cuenta aquí lo que quieras: una promoción, una historia, un aviso.',
    image: '',
    imageMobile: '',
    side: 'derecha',
    cta: { text: '', to: 'catalogo' },
  },
  galeria: {
    title: 'Galería',
    images: [],
  },
  editorial: {
    eyebrow: 'Nuestra historia',
    title: 'Un título\nsobre la *foto.*',
    text: 'Una frase corta que acompañe la imagen.',
    image: '',
    imageMobile: '',
    chips: [],
    cta: { text: 'Conoce más', to: 'historia' },
  },
  combinacion: {
    eyebrow: 'Lo que se está usando',
    title: 'Combinación del mes',
    tag: 'Bolsa · Strap',
    image: '',
    imageMobile: '',
    cutout: '',
    cta: { text: 'Ver la combinación', to: 'catalogo' },
  },
};

// Orden original de la página (el ritmo del diseño aprobado).
export const DEFAULT_ORDER = [
  'hero',
  'destacados',
  'craft',
  'categorias',
  'historia',
  'materiales',
  'comunidad',
  'contacto',
];

export const SITE_DEFAULTS = {
  v: 2,
  blocks: DEFAULT_ORDER.map((type) => ({ id: type, type, on: true, ...BLOCK_DEFAULTS[type] })),
  // La barra chiquita de hasta arriba, encima del logo.
  header: {
    announcement: 'Envíos a todo México · Hecho a mano en México',
  },
  contacto: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868',
    email: 'contacto@talunamx.com',
    phones: ['33 3129 2868', '33 3137 7989', '33 1326 8071'],
    instagram: 'https://www.instagram.com/talunamx',
    tiktok: 'https://www.tiktok.com/@talunamx',
    facebook: 'https://www.facebook.com/talunamx',
    storeLines: ['El Greco 471', 'Residencial Juan Manuel, C.P. 44680', 'Guadalajara, Jalisco, México'],
    mapsUrl: 'https://maps.app.goo.gl/uhK2ADZSRDpL3zL38',
    igHandle: '@talunamx',
  },
  catalogo: {
    eyebrow: 'Catálogo',
    title: 'Toda la *colección.*',
    // {piezas} se cambia por el número real de productos
    lead: '{piezas} piezas hechas a mano, listas para enviar.',
    // Foto de portada del catálogo (opcional). Vacía = encabezado sencillo.
    image: '',
    imageMobile: '',
  },
  footer: {
    about: 'Bolsas y straps 100% de piel, hechos a mano por artesanas mexicanas. Cada pieza, una obra de arte.',
    horario: 'Atención de lunes a sábado. Hacemos envíos a todo México.',
  },
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Mezcla lo guardado con los originales: cualquier campo que falte usa el
// original, así un documento viejo o a medias nunca rompe la página.
export function mergeSiteContent(doc) {
  const saved = isObj(doc) ? doc : {};
  const blocks = Array.isArray(saved.blocks) && saved.blocks.length ? saved.blocks : SITE_DEFAULTS.blocks;

  return {
    blocks: blocks
      .filter((b) => isObj(b) && b.type && BLOCK_DEFAULTS[b.type])
      .map((b) => ({ id: b.id || b.type, on: b.on !== false, ...BLOCK_DEFAULTS[b.type], ...b })),
    header: { ...SITE_DEFAULTS.header, ...(isObj(saved.header) ? saved.header : {}) },
    contacto: { ...SITE_DEFAULTS.contacto, ...(isObj(saved.contacto) ? saved.contacto : {}) },
    catalogo: { ...SITE_DEFAULTS.catalogo, ...(isObj(saved.catalogo) ? saved.catalogo : {}) },
    footer: { ...SITE_DEFAULTS.footer, ...(isObj(saved.footer) ? saved.footer : {}) },
  };
}

// Lee el contenido guardado por el Organizador. Si la vista todavía no
// existe (o falla), devuelve los originales: la página nunca se rompe.
export async function getSiteContent() {
  if (!supabase) return mergeSiteContent(null);

  const { data, error } = await supabase
    .from('studio_site')
    .select('content, updated_at')
    .maybeSingle();

  if (error) {
    console.warn('[taluna] No se pudo leer studio_site:', error.message);
    return mergeSiteContent(null);
  }
  return mergeSiteContent(data?.content);
}

// A dónde apunta un botón. Se guarda un destino con nombre (no una URL
// suelta) para que la dueña no pueda dejar un enlace roto.
export const LINK_TARGETS = {
  catalogo: 'Ver el catálogo',
  historia: 'Ir a Historia',
  comunidad: 'Ir a Comunidad',
  contacto: 'Ir a Contacto',
  whatsapp: 'Escribir por WhatsApp',
  instagram: 'Abrir Instagram',
};

export function hrefFor(to, contacto) {
  switch (to) {
    case 'whatsapp':
      return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(
        'Hola Taluna, me gustaría hacer un pedido.'
      )}`;
    case 'instagram':
      return contacto.instagram;
    case 'historia':
      return '/#historia';
    case 'comunidad':
      return '/#comunidad';
    case 'contacto':
      return '/#contacto';
    case 'catalogo':
    default:
      return '/catalogo';
  }
}

export const isExternal = (to) => to === 'whatsapp' || to === 'instagram';
