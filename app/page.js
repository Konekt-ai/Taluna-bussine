import Link from 'next/link';
import { getProducts, getCategories, formatPrice } from '@/lib/products';
import { site } from '@/lib/site';
import ProductCard from '@/components/ProductCard';
import HomeEffects from '@/components/HomeEffects';

const ASSET = {
  heroVideo: '/design/taluna-hero-bag.mp4',
  heroPoster: '/design/taluna-hero-bag-poster.jpg',
  craft: '/design/craft-straps.jpg',
};

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const featured = (products.filter((p) => p.is_featured).length
    ? products.filter((p) => p.is_featured)
    : products
  ).slice(0, 4);

  const heroFeat = featured[0] || products[0];

  // Portada por categoría: primera foto real de un producto de esa categoría.
  const coverFor = (slug) =>
    products.find((p) => p.category_slug === slug && p.images?.[0]?.url)?.images?.[0]?.url || null;

  // Fotos reales para la comunidad (Instagram); si faltan, usamos el asset artesanal.
  const productImgs = products.map((p) => p.images?.[0]?.url).filter(Boolean);
  const igImgs = Array.from({ length: 5 }, (_, i) => productImgs[i] || ASSET.craft);

  const waHref = (msg) =>
    `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero__blob" />
        <div className="wrap hero__grid">
          <div className="hero__text">
            <span className="hero__eyebrow eyebrow reveal">
              <span className="dot" /> Hecho a mano en México
            </span>
            <h1 className="hero__title display reveal" data-d="1">
              Piel que se<br />vuelve <em>costumbre.</em>
            </h1>
            <p className="hero__lead lead reveal" data-d="2">
              Bolsas y straps de piel genuina con detalles tejidos y chaquira. Piezas hechas a
              mano, pensadas para acompañarte todos los días.
            </p>
            <div className="hero__cta reveal" data-d="3">
              <Link className="btn btn--primary" href="/catalogo">
                Explorar catálogo {arrow}
              </Link>
              <Link className="btn btn--ghost" href="/#historia">
                Nuestra historia
              </Link>
            </div>
            <div className="hero__meta reveal" data-d="4">
              <div>
                <div className="n">{products.length}</div>
                <div className="l">Modelos</div>
              </div>
              <div>
                <div className="n">100%</div>
                <div className="l">Piel genuina</div>
              </div>
              <div>
                <div className="n">MX</div>
                <div className="l">Hecho a mano</div>
              </div>
            </div>
          </div>

          <div className="hero__visual reveal" data-d="2">
            <div className="hero__media">
              <video
                className="hero__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={ASSET.heroPoster}
                aria-label="Bolsa Taluna hecha a mano en movimiento"
              >
                <source src={ASSET.heroVideo} type="video/mp4" />
              </video>
            </div>
            {heroFeat && (
              <p className="hero__cap">
                <b>{heroFeat.name}</b> · piel y chaquira · desde{' '}
                {formatPrice(heroFeat.price, heroFeat.currency)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===================== CRAFT — momento editorial (liquid glass) ===================== */}
      <section className="craft reveal">
        <img
          className="craft__img"
          src={ASSET.craft}
          alt="Straps de chaquira tejida a mano con detalles de piel y herrajes de latón"
          loading="lazy"
        />
        <div className="craft__scrim" />
        <div className="wrap craft__inner">
          <div className="craft__panel liquid-glass-strong">
            <span className="craft__eyebrow">Hecho a mano en México</span>
            <h2 className="craft__title">
              Detalles que cuentan <em>una historia.</em>
            </h2>
            <p className="craft__p">
              Chaquira, piel y tradición artesanal. Cada strap se teje cuenta por cuenta y se monta
              sobre piel genuina con herrajes de latón macizo.
            </p>
            <div className="craft__chips">
              <span className="craft__chip liquid-glass">Chaquira tejida</span>
              <span className="craft__chip liquid-glass">Piel genuina</span>
              <span className="craft__chip liquid-glass">Latón macizo</span>
            </div>
            <Link className="craft__cta liquid-glass-strong" href="/catalogo">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Descubrir los straps
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORÍAS ===================== */}
      <section className="section" id="categorias">
        <div className="wrap">
          <div className="sec-head">
            <div className="reveal">
              <span className="eyebrow">Explora por categoría</span>
              <h2 className="sec-title" style={{ marginTop: 14 }}>
                Compra por<br /><em>colección.</em>
              </h2>
            </div>
            <Link className="btn btn--ghost reveal" href="/catalogo">
              Ver todo el catálogo {arrow}
            </Link>
          </div>
          <div className="collections reveal">
            {categories.map((c, i) => {
              const cover = coverFor(c.slug);
              // Bento: la primera categoría es el tile protagonista, la segunda ancho.
              const sizeClass = i === 0 ? ' col-tile--xl' : i === 1 ? ' col-tile--wide' : '';
              return (
                <Link className={`col-tile${sizeClass}`} href="/catalogo" key={c.slug}>
                  {cover ? (
                    <img className="col-tile__img" src={cover} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="col-tile__ph imgph">{c.name}</div>
                  )}
                  <div className="col-tile__overlay" />
                  <div className="col-tile__body">
                    <div className="col-tile__name">{c.name}</div>
                    <span className="col-tile__cta">
                      {i === 0 ? 'Ver colección' : 'Explorar'}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== DESTACADOS ===================== */}
      <section className="section section--tight" id="destacados">
        <div className="wrap">
          <div className="sec-head">
            <div className="reveal">
              <span className="eyebrow">Favoritos de la temporada</span>
              <h2 className="sec-title" style={{ marginTop: 14 }}>
                Las más <em>queridas.</em>
              </h2>
            </div>
            <p className="lead reveal" data-d="1">
              Selección de las piezas que nuestras clientas no sueltan. Disponibilidad real, listas
              para enviar.
            </p>
          </div>
          <div className="pgrid">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HISTORIA ===================== */}
      <section className="section" id="historia">
        <div className="wrap">
          <div className="story reveal">
            <div className="story__grid">
              <div className="story__media">
                <img className="story__img" src={ASSET.craft} alt="Detalle artesanal Taluna" loading="lazy" />
                <img className="float" src={ASSET.heroPoster} alt="Bolsa Taluna" loading="lazy" />
              </div>
              <div className="story__body">
                <span className="eyebrow">Nuestra historia</span>
                <h2 className="sec-title">
                  Cada puntada<br />tiene un <em>nombre.</em>
                </h2>
                <p className="lead">
                  Taluna nace del trabajo de manos artesanas mexicanas. Combinamos tejido y chaquira
                  con piel seleccionada para crear piezas modernas que duran años, no temporadas.
                </p>
                <div className="story__points">
                  <div className="story__point">
                    <span className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 3v18M5 8l7-5 7 5M5 8v8l7 5 7-5V8" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <h4>Piel genuina seleccionada</h4>
                      <p>Materiales nobles que envejecen con carácter.</p>
                    </div>
                  </div>
                  <div className="story__point">
                    <span className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z" />
                        <circle cx="12" cy="12" r="2.4" />
                      </svg>
                    </span>
                    <div>
                      <h4>Hecho a mano, pieza por pieza</h4>
                      <p>Detalles tejidos y chaquira aplicados a mano.</p>
                    </div>
                  </div>
                  <div className="story__point">
                    <span className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M20 7 9 18l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <h4>Atención cercana</h4>
                      <p>Te acompañamos por WhatsApp en cada compra.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DETALLE / MATERIALES ===================== */}
      <section className="section section--tight">
        <div className="wrap detail">
          <div className="detail__media reveal">
            <img className="detail__img" src={ASSET.heroPoster} alt="Detalle de la piel Taluna" loading="lazy" />
          </div>
          <div className="reveal" data-d="1">
            <span className="eyebrow">Materiales</span>
            <h2 className="sec-title" style={{ margin: '14px 0 18px' }}>
              Lo que la<br />hace <em>especial.</em>
            </h2>
            <p className="lead">
              Nada es accidental. Elegimos cada material por su textura, su color y la forma en que
              envejece contigo.
            </p>
            <div className="matgrid">
              <div className="mat"><div className="k">100% piel</div><div className="v">Tacto suave, larga vida</div></div>
              <div className="mat"><div className="k">Telar</div><div className="v">Hilo de algodón teñido a mano</div></div>
              <div className="mat"><div className="k">Chaquira</div><div className="v">Cuentas aplicadas una a una</div></div>
              <div className="mat"><div className="k">Herrajes</div><div className="v">Acabado mate resistente</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== COMUNIDAD ===================== */}
      <section className="section section--tight" id="comunidad">
        <div className="wrap">
          <div className="sec-head">
            <div className="reveal">
              <span className="eyebrow">@talunamx</span>
              <h2 className="sec-title" style={{ marginTop: 14 }}>
                Comunidad <em>Taluna.</em>
              </h2>
            </div>
            <a className="btn btn--ghost reveal" href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Seguir en Instagram
            </a>
          </div>
          <div className="iggrid reveal">
            {igImgs.map((src, i) => (
              <a className="igtile" href={site.social.instagram} target="_blank" rel="noopener noreferrer" key={i}>
                <img className="ig__img" src={src} alt="@talunamx" loading="lazy" />
                <span className="igtile__ov">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CONTACTO ===================== */}
      <section className="section section--tight" id="contacto">
        <div className="wrap">
          <div className="contact reveal">
            <div className="contact__grid">
              <div className="contact__body">
                <span className="eyebrow" style={{ color: 'var(--clay-soft)' }}>Estamos cerca</span>
                <h2 className="sec-title" style={{ margin: '14px 0 16px' }}>
                  ¿Lista para tu<br /><em>próxima pieza?</em>
                </h2>
                <p className="lead" style={{ color: 'rgba(235,225,209,.72)', maxWidth: '42ch' }}>
                  Escríbenos por WhatsApp y te ayudamos a elegir. Hacemos envíos a todo México y
                  aceptamos pedidos personalizados.
                </p>
                <div className="contact__list">
                  <a className="contact__item" href={waHref('Hola Taluna, me gustaría hacer un pedido.')} target="_blank" rel="noopener noreferrer">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z" />
                      </svg>
                    </span>
                    <div><div className="t1">WhatsApp</div><div className="t2">+52 {site.phones[0]}</div></div>
                  </a>
                  <a className="contact__item" href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <div><div className="t1">Instagram</div><div className="t2">@talunamx</div></div>
                  </a>
                  <a className="contact__item" href={`mailto:${site.email}`}>
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div><div className="t1">Correo</div><div className="t2">{site.email}</div></div>
                  </a>
                </div>
              </div>
              <div className="contact__media">
                <img className="contact__img" src={ASSET.heroPoster} alt="Bolsa Taluna" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeEffects />
    </>
  );
}
