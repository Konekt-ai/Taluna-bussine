// Datos de producto Taluna — portados desde los archivos originales (Fable/Claude).
// Las imágenes reales se van sustituyendo; donde falten se usan placeholders con
// las mismas proporciones y fondos.
import { ASSETS } from "./assets";



export type StrapCategory = "ancho" | "delgado" | "tejido";

export type Strap = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  img?: string | undefined;

  category: StrapCategory;
};

export type Bag = {
  id: string;
  name: string;
  price: number;
  straps: string[];
  img?: string;
};


export const CURRENCY = (n: number) => "$" + (n || 0).toLocaleString("es-MX");

/**
 * Catálogo único de straps (fuente de verdad para ficha de producto y colección).
 * Nombres provisionales: sustituir `name` cuando existan los definitivos.
 */
export const STRAP_LIST: Strap[] = [
  { id: "s01", name: "Strap Ancho 01", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[0], category: "ancho" },
  { id: "s02", name: "Strap Delgado 01", price: 490, sizes: ["Corto", "Mediano", "Largo"], img: ASSETS.straps[1], category: "delgado" },
  { id: "s03", name: "Strap Ancho 02", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[2], category: "ancho" },
  { id: "s04", name: "Strap Ancho 03", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[3], category: "ancho" },
  { id: "s05", name: "Strap Ancho 04", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[4], category: "ancho" },
  { id: "s06", name: "Strap Delgado 02", price: 490, sizes: ["Corto", "Mediano", "Largo"], img: ASSETS.straps[5], category: "delgado" },
  { id: "s07", name: "Strap Ancho 05", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[6], category: "ancho" },
  { id: "s08", name: "Strap Tejido 01", price: 590, sizes: ["Mediano", "Largo"], img: ASSETS.straps[7], category: "tejido" },
  { id: "s09", name: "Strap Tejido 02", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[8], category: "tejido" },
  { id: "s10", name: "Strap Ancho 06", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[9], category: "ancho" },
  { id: "s11", name: "Strap Tejido 03", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[10], category: "tejido" },
  { id: "s12", name: "Strap Ancho 07", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[11], category: "ancho" },
  { id: "s13", name: "Strap Delgado 03", price: 490, sizes: ["Corto", "Mediano", "Largo"], img: ASSETS.straps[12], category: "delgado" },
  { id: "s14", name: "Strap Tejido 04", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[13], category: "tejido" },
  { id: "s15", name: "Strap Ancho 08", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[14], category: "ancho" },
  { id: "s16", name: "Strap Delgado 04", price: 490, sizes: ["Corto", "Mediano", "Largo"], img: ASSETS.straps[15], category: "delgado" },
  { id: "s17", name: "Strap Tejido 05", price: 590, sizes: ["Mediano", "Largo"], img: ASSETS.straps[16], category: "tejido" },
  { id: "s18", name: "Strap Ancho 09", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[17], category: "ancho" },
  { id: "s19", name: "Strap Tejido 06", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[18], category: "tejido" },
  { id: "s20", name: "Strap Ancho 10", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[19], category: "ancho" },
  { id: "s21", name: "Strap Ancho 11", price: 790, sizes: ["Mediano", "Largo"], img: ASSETS.straps[20], category: "ancho" },
  { id: "s22", name: "Strap Delgado 05", price: 490, sizes: ["Corto", "Mediano", "Largo"], img: ASSETS.straps[21], category: "delgado" },
  { id: "s23", name: "Strap Tejido 07", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[22], category: "tejido" },
  { id: "s24", name: "Strap Tejido 08", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[23], category: "tejido" },
  { id: "s25", name: "Strap Ancho 12", price: 690, sizes: ["Mediano", "Largo"], img: ASSETS.straps[24], category: "ancho" },
];


export const STRAPS: Record<string, Strap> = Object.fromEntries(
  STRAP_LIST.map((s) => [s.id, s]),
);



const ALL_STRAP_IDS = STRAP_LIST.map((s) => s.id);

export const BAGS: Bag[] = [
  { id: "tacana", name: "Tacaná", price: 1890, straps: ALL_STRAP_IDS },
  { id: "maraica", name: "Maraica", price: 1690, straps: ALL_STRAP_IDS, img: ASSETS.maraica },
  { id: "maraica-mini", name: "Maraica Mini", price: 1490, straps: ALL_STRAP_IDS, img: ASSETS.miniCamel },

  { id: "tauu", name: "Taúu", price: 1990, straps: ALL_STRAP_IDS },
  { id: "luna", name: "Luna", price: 1790, straps: ALL_STRAP_IDS },
];


// Bolsas del configurador "Arma tu Taluna" (página completa)
export const CFG_BAGS = [
  { id: "tacana", name: "Tacaná", price: 1890, img: ASSETS.maraica, mini: false },
  { id: "maraica", name: "Maraica", price: 1690, img: ASSETS.maraica, mini: false },
  { id: "tauu", name: "Taúu", price: 1990, img: ASSETS.maraica, mini: false },
  { id: "luna", name: "Luna", price: 1790, img: ASSETS.maraica, mini: false },
  { id: "mini-maraica", name: "Mini Maraica", price: 1490, img: ASSETS.miniCamel, mini: true },
  { id: "mauu", name: "Mauu de celular", price: 990, img: ASSETS.maraica, mini: false },
];

export const CFG_SIZES = [
  { id: "m", label: "Mediana", add: 0 },
  { id: "g", label: "Grande", add: 200 },
  { id: "s", label: "Mini", add: -200 },
];

export const CFG_COLORS = [
  { id: "arena", label: "Arena", swatch: "#C9B79C" },
  { id: "cafe", label: "Café", swatch: "#7A5238" },
  { id: "negro", label: "Negro", swatch: "#2A2622" },
  { id: "vino", label: "Vino", swatch: "#6E2F37" },
];

export const BEST_SELLERS: {
  id: string;
  name: string;
  price: number;
  to: string;
  tag?: string;
  img?: string;
  label?: string;
}[] = [
  { id: "mv-1", name: "Tacaná", price: 1890, to: "/categoria/bolsas-tacana", img: ASSETS.maraica },
  { id: "mv-2", name: "Maraica", price: 1690, to: "/producto/maraica", img: ASSETS.maraica },
  { id: "mv-3", name: "Taúu", price: 1990, to: "/categoria/bolsas-tauu", tag: "Sale", img: ASSETS.maraica },
  { id: "mv-4", name: "Luna", price: 1790, to: "/categoria/bolsas-luna", img: ASSETS.maraica },
  { id: "mv-5", name: "Mini Maraica", price: 1490, to: "/producto/mini-maraica", img: ASSETS.miniCamel },
  { id: "mv-6", name: "Mauu", price: 990, to: "/categoria/bolsas-mauu-celular", img: ASSETS.maraica },


];


export const COLLECTIONS: Record<
  string,
  { price: number; to: string; img?: string; colors: { n: string; c: string }[] }
> = {
  "Tacaná": {
    price: 1890,
    to: "/categoria/bolsas-tacana",
    colors: [
      { n: "Negro", c: "#2A2622" },
      { n: "Arena", c: "#C9B79C" },
      { n: "Café", c: "#7A5238" },
      { n: "Vino", c: "#6E2F37" },
    ],
  },
  "Maraica": {
    price: 1690,
    to: "/producto/maraica",
    img: ASSETS.maraica,
    colors: [
      { n: "Arena", c: "#C9B79C" },
      { n: "Negro", c: "#2A2622" },
      { n: "Taupe", c: "#9B8C79" },
      { n: "Salvia", c: "#A8B29A" },
    ],
  },
  "Luna": {
    price: 1790,
    to: "/categoria/bolsas-luna",
    colors: [
      { n: "Café", c: "#7A5238" },
      { n: "Negro", c: "#2A2622" },
      { n: "Arena", c: "#C9B79C" },
    ],
  },
  "Taúu": {
    price: 1990,
    to: "/categoria/bolsas-tauu",
    colors: [
      { n: "Negro", c: "#2A2622" },
      { n: "Vino", c: "#6E2F37" },
      { n: "Arena", c: "#C9B79C" },
      { n: "Taupe", c: "#9B8C79" },
    ],
  },
  "Maraica Mini": {
    price: 1490,
    to: "/producto/mini-maraica",
    img: ASSETS.miniCamel,
    colors: [
      { n: "Arena", c: "#C9B79C" },
      { n: "Negro", c: "#2A2622" },
      { n: "Rosa", c: "#D8B7AE" },
      { n: "Salvia", c: "#A8B29A" },
    ],
  },
};


export type CategoryDef = {
  kicker: string;
  title: string;
  kind: "bag" | "strap";
  tag?: string;
  /** Imagen de portada de la colección */
  hero?: string;
};

export const CATEGORIES: Record<string, CategoryDef> = {
  bolsas: { kicker: "Catálogo", title: "Bolsas", kind: "bag", hero: ASSETS.modelosLifestyle },
  straps: { kicker: "Catálogo", title: "Straps", kind: "strap", hero: ASSETS.heroStraps },
  ofertas: { kicker: "Catálogo", title: "Ofertas", kind: "bag", tag: "Oferta" },
  "mas-vendidos": { kicker: "Catálogo", title: "Más vendidos", kind: "bag", tag: "Más vendido" },
  nuevas: { kicker: "Catálogo", title: "Nuevas", kind: "bag", tag: "Nuevo" },
  "bolsas-tacana": { kicker: "Bolsas", title: "Tacaná", kind: "bag" },
  "bolsas-maraica": { kicker: "Bolsas", title: "Maraica", kind: "bag" },
  "bolsas-tauu": { kicker: "Bolsas", title: "Taúu", kind: "bag" },
  "bolsas-luna": { kicker: "Bolsas", title: "Luna", kind: "bag" },
  "bolsas-mini-maraica": { kicker: "Bolsas", title: "Mini Maraica", kind: "bag" },
  "bolsas-mauu-celular": { kicker: "Bolsas", title: "Mauu de celular", kind: "bag" },
  "straps-chiapas": { kicker: "Straps", title: "Straps Chiapas", kind: "strap" },
  "straps-huichol": { kicker: "Straps", title: "Straps Huichol", kind: "strap" },
  "straps-anchos": { kicker: "Straps", title: "Straps anchos", kind: "strap" },
  "straps-delgados": { kicker: "Straps", title: "Straps delgados", kind: "strap" },
  "cinturon-shakria": { kicker: "Accesorios", title: "Cinturón Shakria", kind: "strap" },
};

// Producto: rutas de bolsa con configuración de color + strap obligatorio
export type ProductColor = {
  id: string;
  name: string;
  pending?: boolean;
  shots: number;
  /** Fotos reales disponibles; el resto de shots queda como placeholder. */
  images?: string[];
};


export type ProductDef = {
  id: string;
  slug: string;
  name: string;
  base: number;
  kicker: string;
  intro: string;
  measures: string;
  dims: { alto: string; largo: string; ancho: string };
  /** Padding interior de la galería (el original de Maráica usa 22px, Mini 0). */
  galleryPad: number;
  colors: ProductColor[];
  straps: { id: string; name: string; price: number; colors: string[]; img?: string }[];
  info: Record<string, string[]>;
};

const LENGTHS = [
  { id: "corto", label: "Corto", add: 0 },
  { id: "mediano", label: "Mediano", add: 0 },
  { id: "largo", label: "Largo", add: 80 },
];
export { LENGTHS };

export const PRODUCTS: Record<string, ProductDef> = {
  maraica: {
    id: "prod-maraica",
    slug: "maraica",
    name: "Bolsa Maráica",
    base: 1690,
    kicker: "Nuestro diseño más versátil",
    intro:
      "Nuestro diseño más versátil con el tamaño ideal para la vida diaria. Cierre exterior y lateral, asas cortas para el brazo y un strap crossbody intercambiable.",
    measures: "Alto 21 · Largo 31 · Ancho 21 cm",
    dims: { alto: "21 cm", largo: "31 cm", ancho: "21 cm" },
    galleryPad: 22,
    colors: [
      { id: "camel", name: "Camel", shots: 4, images: ASSETS.maraicaShots },
      { id: "acero", name: "Acero", shots: 4 },
      { id: "negro", name: "Negro", shots: 4 },
      { id: "crema", name: "Crema", shots: 4 },
    ],
    straps: [
      { id: "huichol", name: "Huichol", price: 690, colors: ["camel", "acero", "negro", "crema"] },
      { id: "chiapas", name: "Chiapas", price: 690, colors: ["camel", "crema", "acero"], img: ASSETS.strapChiapas },
      { id: "delgado", name: "Delgado", price: 490, colors: ["camel", "negro", "crema"], img: ASSETS.strapDelgado },
      { id: "ancho", name: "Ancho", price: 590, colors: ["negro", "acero", "camel"] },
    ],
    info: {
      "Descripción": [
        "Diseño versátil para uso diario.",
        "Tamaño ideal: ni chica ni grande.",
        "Asas cortas para llevar en el brazo.",
        "Compatible con strap largo intercambiable.",
        "Pensada para combinarse con distintos estilos.",
      ],
      "Detalles": [
        "Cierre exterior",
        "Cierre lateral",
        "Asas cortas",
        "Compatible con straps intercambiables",
        "Strap se elige por separado",
      ],
      "Materiales y cuidados": [
        "Piel granulada",
        "Herrajes metálicos",
        "Strap artesanal según selección",
        "Limpiar con paño suave",
        "Evitar humedad, sol directo prolongado, perfumes o químicos",
        "Guardar en lugar seco",
      ],
      "Envíos y cambios": [
        "Envíos a todo México",
        "Pagos seguros",
        "Cambios sujetos a políticas de Taluna",
        "Para dudas, contacto por WhatsApp o Instagram",
      ],
    },
  },
  "mini-maraica": {
    id: "prod-mini-maraica",
    slug: "mini-maraica",
    name: "Bolsa Mini Maráica",
    base: 1490,
    kicker: "Compacta, práctica y con muchísimo estilo",
    intro:
      "Diseñada para llevar lo esencial con comodidad y verte increíble de día o de noche. Perfecta para moverte libremente. Incluye cierre exterior y asa crossbody con detalles de chaquira.",
    measures: "Alto 14 · Largo 20 · Ancho 13 cm",
    dims: { alto: "14 cm", largo: "20 cm", ancho: "13 cm" },
    galleryPad: 0,
    colors: [
      { id: "camel", name: "Camel", shots: 7, images: ASSETS.miniCamelShots },
      { id: "negro", name: "Negro", shots: 7, images: ASSETS.miniNegroShots },
      { id: "rosa", name: "Rosa", pending: true, shots: 0 },
      { id: "salvia", name: "Salvia", pending: true, shots: 0 },
    ],
    straps: [
      { id: "huichol", name: "Huichol", price: 690, colors: ["camel", "negro", "rosa", "salvia"] },
      { id: "chiapas", name: "Chiapas", price: 690, colors: ["camel", "rosa", "salvia"], img: ASSETS.strapChiapas },
      { id: "delgado", name: "Delgado", price: 490, colors: ["camel", "negro", "salvia"], img: ASSETS.strapDelgado },
      { id: "ancho", name: "Ancho", price: 590, colors: ["negro", "camel", "rosa"] },
    ],
    info: {
      "Descripción": [
        "Compacta, práctica y con muchísimo estilo.",
        "Espacio exacto para lo esencial.",
        "Ideal de día o de noche.",
        "Cierre exterior.",
        "Asa crossbody con detalles de chaquira, intercambiable.",
      ],
      "Detalles": [
        "Cierre exterior",
        "Cierre lateral",
        "Asas cortas",
        "Compatible con straps intercambiables",
        "Strap se elige por separado",
      ],
      "Materiales y cuidados": [
        "Piel granulada",
        "Herrajes metálicos",
        "Strap artesanal según selección",
        "Limpiar con paño suave",
        "Evitar humedad, sol directo prolongado, perfumes o químicos",
        "Guardar en lugar seco",
      ],
      "Envíos y cambios": [
        "Envíos a todo México",
        "Pagos seguros",
        "Cambios sujetos a políticas de Taluna",
        "Para dudas, contacto por WhatsApp o Instagram",
      ],
    },
  },
};

export const FOOTER_COLS = [
  {
    title: "Tienda",
    links: [
      { label: "Bolsas", to: "/categoria/bolsas" },
      { label: "Straps", to: "/categoria/straps" },
      { label: "Arma tu Taluna", to: "/arma-tu-taluna" },
      { label: "Cinturones", to: "/categoria/cinturon-shakria" },
      { label: "Ofertas", to: "/categoria/ofertas" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Envíos", to: "" },
      { label: "Cambios y devoluciones", to: "" },
      { label: "Preguntas frecuentes", to: "" },
      { label: "Contacto", to: "" },
    ],
  },
  {
    title: "Marca",
    links: [
      { label: "Nuestra historia", to: "" },
      { label: "Artesanas", to: "" },
      { label: "Políticas", to: "" },
      { label: "Términos y condiciones", to: "" },
    ],
  },
  {
    title: "Síguenos",
    links: [
      { label: "Instagram", to: "" },
      { label: "WhatsApp", to: "" },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Bolsas", to: "/categoria/bolsas", color: "#211E1A" },
  { label: "Straps", to: "/categoria/straps", color: "#211E1A" },
  { label: "Arma tu Taluna", to: "/arma-tu-taluna", color: "#9A6A4B" },
  { label: "Más vendidos", to: "/categoria/mas-vendidos", color: "#211E1A" },
  { label: "Nuevas", to: "/categoria/nuevas", color: "#211E1A" },
  { label: "Ofertas", to: "/categoria/ofertas", color: "#211E1A" },
  { label: "Cinturones", to: "/categoria/cinturon-shakria", color: "#211E1A" },
];
