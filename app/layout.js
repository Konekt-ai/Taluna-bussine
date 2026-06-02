import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: 'Taluna · Bolsas artesanales hechas en México',
  description:
    'Bolsas artesanales premium. Cada pieza, hecha a mano. Descubre el catálogo Taluna.',
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
