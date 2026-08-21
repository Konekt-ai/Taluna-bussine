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
  title: 'Taluna · Bolsas artesanales que se adaptan a tu estilo',
  description:
    'Bolsas de piel hechas a mano en México con straps intercambiables. Elige tu bolsa, color y strap y arma tu Taluna.',
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
        {/* Figtree es la tipografía del diseño. Para cambiarla, ajusta este
            link y la variable --tl-ff en app/globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {/* La columna del diseño: 480 px centrados, también en escritorio */}
          <div className="tl-shell">
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
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
