import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollReveal from '@/components/ScrollReveal';
import { CartProvider } from '@/components/CartContext';

export const metadata = {
  title: 'Taluna · Bolsas artesanales hechas en México',
  description:
    'Bolsas artesanales premium. Cada pieza, hecha a mano. Descubre el catálogo Taluna.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Fuentes cargadas por link (no requieren fetch en build).
            Para cambiar la tipografía, ajusta estos links y las variables
            --font-display / --font-body en app/globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@1,8..60,400;1,8..60,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Nav />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  );
}
