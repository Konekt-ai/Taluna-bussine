// Configuración central del sitio: redes, contacto y tienda física.
// Cambia aquí los datos y se actualizan en todo el sitio.

export const site = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868',
  email: 'contacto@talunamx.com',
  // Teléfonos (formato visible). El primero es también el de WhatsApp.
  phones: ['33 3129 2868', '33 3137 7989', '33 1326 8071'],
  social: {
    instagram: 'https://www.instagram.com/talunamx',
    tiktok: 'https://www.tiktok.com/@talunamx',
    facebook: 'https://www.facebook.com/talunamx',
  },
  store: {
    lines: ['El Greco 471', 'Residencial Juan Manuel, C.P. 44680', 'Guadalajara, Jalisco, México'],
    mapsUrl: 'https://maps.app.goo.gl/uhK2ADZSRDpL3zL38',
  },
};
