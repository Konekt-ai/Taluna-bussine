import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollReveal from '@/components/ScrollReveal';
import { CartProvider } from '@/components/CartContext';
import Drawers from '@/components/Drawers';
import NewsletterPopup from '@/components/NewsletterPopup';
import { getSiteContent } from '@/lib/site-content';
import { getCategories } from '@/lib/products';

// Los datos de contacto y los textos del pie los edita la dueña desde el
// Organizador; se refrescan solos cada minuto igual que el catálogo.
export const revalidate = 60;

export const metadata = {
  title: 'Taluna · Bolsas artesanales hechas en México',
  description:
    'Bolsas y straps de piel hechos a mano en México. Piezas personalizables: elige tu bolsa, tu color y tu strap.',
  icons: { icon: '/favicon.png' },
};

export const viewport = {
  themeColor: '#EFEAE1',
};

export default async function RootLayout({ children }) {
  const [{ contacto, footer, header, popup }, categories] = await Promise.all([
    getSiteContent(),
    getCategories(),
  ]);

  return (
    <html lang="es">
      <head>
        {/* Figtree es la tipografía del diseño aprobado: una sola familia,
            de 300 a 700. Para cambiarla, ajusta este link y las variables
            --font-body / --font-display en app/globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Nav contacto={contacto} categories={categories} announcement={header?.announcement} />
          <main>{children}</main>
          <Footer contacto={contacto} texts={footer} categories={categories} />
          <Drawers />
          {popup?.on !== false && (
            <NewsletterPopup
              image={popup?.image}
              texto={popup?.text}
              titulo={popup?.title}
              waPhone={contacto.whatsapp}
            />
          )}
          <WhatsAppButton phone={contacto.whatsapp} />
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  );
}
