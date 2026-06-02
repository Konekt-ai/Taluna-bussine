const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca + tagline */}
        <div className="lg:col-span-2">
          <span className="font-display text-2xl text-ink">
            Taluna<span className="text-wine">.</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Taluna MX ofrece productos de calidad, apoyando a nuestros artesanos
            mexicanos.
          </p>
          <a
            href="https://www.instagram.com/talunamx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Taluna"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @talunamx
          </a>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-display text-lg text-ink">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href="mailto:contacto@talunamx.com"
                className="transition-colors hover:text-ink"
              >
                contacto@talunamx.com
              </a>
            </li>
            <li>
              <a href="tel:+523331292868" className="transition-colors hover:text-ink">
                Tel: 33 3129 2868
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="font-display text-lg text-ink">Dirección</h3>
          <address className="mt-3 not-italic text-sm text-muted">
            El Greco 471
            <br />
            Residencial Juan Manuel, C.P. 44680
            <br />
            Guadalajara, Jalisco, México
          </address>
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
