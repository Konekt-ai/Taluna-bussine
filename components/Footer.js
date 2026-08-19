import Link from 'next/link';
import { site } from '@/lib/site';

// Los datos de contacto y estos dos textos los edita la dueña desde el
// Organizador; lib/site.js queda como respaldo.
export default function Footer({ contacto, texts }) {
  const year = new Date().getFullYear();
  const wa = contacto?.whatsapp || site.whatsapp;
  const email = contacto?.email || site.email;
  const instagram = contacto?.instagram || site.social.instagram;
  const mapsUrl = contacto?.mapsUrl || site.store.mapsUrl;
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(
    'Hola Taluna, me gustaría hacer un pedido.'
  )}`;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <img className="footer__logo" src="/logo-taluna-light.png" alt="Taluna MX" />
            <p style={{ maxWidth: '36ch', marginTop: 14, color: 'rgba(235,225,209,.6)', fontSize: '.95rem' }}>
              {texts?.about}
            </p>
          </div>

          <div className="footer__col">
            <h4>Tienda</h4>
            <ul>
              <li><Link href="/catalogo">Bolsas</Link></li>
              <li><Link href="/catalogo">Straps</Link></li>
              <li><Link href="/catalogo">Ver catálogo</Link></li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
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
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Pedidos por WhatsApp</h4>
            <p style={{ color: 'rgba(235,225,209,.6)', fontSize: '.95rem', marginBottom: 16 }}>
              {texts?.horario}
            </p>
            <a className="btn btn--light" href={waHref} target="_blank" rel="noopener noreferrer">
              Escribir ahora
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Taluna MX. Hecho a mano en México.</span>
          <span style={{ display: 'flex', gap: 20, opacity: 0.85 }}>
            <a href={`mailto:${email}`}>{email}</a>
            <span>Ecosistema por Konekt AI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
