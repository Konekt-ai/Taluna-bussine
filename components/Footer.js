import Link from 'next/link';
import { site } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    'Hola Taluna, me gustaría hacer un pedido.'
  )}`;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <img className="footer__logo" src="/logo-taluna-light.png" alt="Taluna MX" />
            <p style={{ maxWidth: '36ch', marginTop: 14, color: 'rgba(235,225,209,.6)', fontSize: '.95rem' }}>
              Bolsas y straps 100% de piel, hechos a mano por artesanas mexicanas. Cada pieza,
              una obra de arte.
            </p>
          </div>

          <div className="footer__col">
            <h4>Tienda</h4>
            <ul>
              <li><Link href="/catalogo">Bolsas</Link></li>
              <li><Link href="/catalogo">Straps</Link></li>
              <li><Link href="/catalogo">Ver catálogo</Link></li>
              <li>
                <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Cómo llegar
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Marca</h4>
            <ul>
              <li><Link href="/#historia">Historia</Link></li>
              <li><Link href="/#comunidad">Comunidad</Link></li>
              <li><Link href="/#contacto">Contacto</Link></li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Pedidos por WhatsApp</h4>
            <p style={{ color: 'rgba(235,225,209,.6)', fontSize: '.95rem', marginBottom: 16 }}>
              Atención de lunes a sábado. Hacemos envíos a todo México.
            </p>
            <a className="btn btn--light" href={waHref} target="_blank" rel="noopener noreferrer">
              Escribir ahora
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Taluna MX. Hecho a mano en México.</span>
          <span style={{ display: 'flex', gap: 20, opacity: 0.85 }}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>Ecosistema por Konekt AI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
