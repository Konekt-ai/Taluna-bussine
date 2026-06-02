import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca + tagline + redes */}
        <div className="lg:col-span-2">
          <span className="font-display text-2xl text-ink">
            Taluna<span className="text-wine">.</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Bolsas y straps 100% de piel, hechas a mano por artesanas mexicanas.
            Cada pieza, una obra de arte.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <SocialLink href={site.social.instagram} label="Instagram de Taluna">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialLink>
            <SocialLink href={site.social.tiktok} label="TikTok de Taluna">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.5 3a5.6 5.6 0 0 0 4.5 4.5v2.6a8.2 8.2 0 0 1-4.5-1.36v6.06a6.3 6.3 0 1 1-6.3-6.3c.22 0 .43.02.64.05v2.74a3.6 3.6 0 1 0 2.96 3.54V3h2.7z" />
              </svg>
            </SocialLink>
            <SocialLink href={site.social.facebook} label="Facebook de Taluna">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </SocialLink>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-display text-lg text-ink">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:+52${p.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-ink"
                >
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Tienda física */}
        <div>
          <h3 className="font-display text-lg text-ink">Tienda</h3>
          <address className="mt-3 not-italic text-sm text-muted">
            {site.store.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={site.store.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-wine underline-offset-4 hover:underline"
          >
            Cómo llegar →
          </a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Taluna MX · Hecho a mano en México.</span>
          <span className="opacity-70">Ecosistema por Konekt AI</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted transition-colors hover:text-ink"
    >
      {children}
    </a>
  );
}
