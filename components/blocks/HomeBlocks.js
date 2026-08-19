import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import RichText, { plainText } from './RichText';
import { hrefFor, isExternal } from '@/lib/site-content';

// =====================================================================
//  BLOQUES DEL HOME
//  Cada bloque recibe { b } (lo que la dueña guardó en el Organizador) y
//  { ctx } (lo que sale del catálogo: productos, categorías, contacto…).
//  El diseño NO es editable a propósito: solo textos, fotos, botones,
//  el orden y si se muestra o no. Así la página siempre se ve bien.
// =====================================================================

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const igIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const waIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z" />
  </svg>
);

const POINT_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3v18M5 8l7-5 7 5M5 8v8l7 5 7-5V8" strokeLinejoin="round" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M20 7 9 18l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

// Botón cuyo destino es un lugar con nombre (nunca una URL suelta, para
// que no se pueda dejar un enlace roto desde el panel).
function Cta({ cta, contacto, className, children }) {
  const text = cta?.text?.trim();
  if (!text) return null;
  const href = hrefFor(cta.to, contacto);

  if (isExternal(cta.to)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {text}
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {text}
      {children}
    </Link>
  );
}

/* ===================== HERO ===================== */
function Hero({ b, ctx }) {
  const { products, heroFeat, contacto, formatPrice } = ctx;
  const media = b.media || {};
  const stats = b.stats || [];
  // Si eligieron foto pero no subieron ninguna, se queda el video.
  const heroImage = media.type === 'image' ? media.image : '';

  return (
    <section className="hero">
      <div className="hero__blob" />
      <div className="wrap hero__grid">
        <div className="hero__text">
          {b.eyebrow && (
            <span className="hero__eyebrow eyebrow reveal">
              <span className="dot" /> {b.eyebrow}
            </span>
          )}
          <h1 className="hero__title display reveal" data-d="1">
            <RichText text={b.title} />
          </h1>
          {b.lead && (
            <p className="hero__lead lead reveal" data-d="2">
              {b.lead}
            </p>
          )}
          <div className="hero__cta reveal" data-d="3">
            <Cta cta={b.cta1} contacto={contacto} className="btn btn--primary">
              {' '}
              {arrow}
            </Cta>
            <Cta cta={b.cta2} contacto={contacto} className="btn btn--ghost" />
          </div>
          {stats.length > 0 && (
            <div className="hero__meta reveal" data-d="4">
              {stats.map((s, i) => (
                <div key={i}>
                  {/* número vacío = se cuenta solo */}
                  <div className="n">{String(s.n ?? '').trim() || products.length}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hero__visual reveal" data-d="2">
          <div className="hero__media">
            {heroImage ? (
              <img
                className="hero__video"
                src={heroImage}
                alt={plainText(b.title) || 'Taluna'}
                loading="eager"
              />
            ) : (
              <video
                className="hero__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={media.poster || undefined}
                aria-label="Bolsa Taluna hecha a mano en movimiento"
              >
                <source src={media.src} type="video/mp4" />
              </video>
            )}
          </div>
          {b.showCap !== false && heroFeat && (
            <p className="hero__cap">
              <b>{heroFeat.name}</b> · piel y chaquira · desde{' '}
              {formatPrice(heroFeat.price, heroFeat.currency)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================== ARTESANAL (craft) ===================== */
function Craft({ b, ctx }) {
  return (
    <section className="craft reveal">
      {b.image && (
        <img
          className="craft__img"
          src={b.image}
          alt="Straps de chaquira tejida a mano con detalles de piel y herrajes de latón"
          loading="lazy"
        />
      )}
      <div className="craft__scrim" />
      <div className="wrap craft__inner">
        <div className="craft__panel liquid-glass-strong">
          {b.eyebrow && <span className="craft__eyebrow">{b.eyebrow}</span>}
          <h2 className="craft__title">
            <RichText text={b.title} />
          </h2>
          {b.text && <p className="craft__p">{b.text}</p>}
          {(b.chips || []).length > 0 && (
            <div className="craft__chips">
              {(b.chips || []).filter(Boolean).map((c, i) => (
                <span className="craft__chip liquid-glass" key={i}>
                  {c}
                </span>
              ))}
            </div>
          )}
          <Cta cta={b.cta} contacto={ctx.contacto} className="craft__cta liquid-glass-strong" />
        </div>
      </div>
    </section>
  );
}

/* ===================== CATEGORÍAS ===================== */
function Categorias({ b, ctx }) {
  const { categories, coverFor, contacto } = ctx;

  return (
    <section className="section" id="categorias">
      <div className="wrap">
        <div className="sec-head">
          <div className="reveal">
            {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            <h2 className="sec-title" style={{ marginTop: 14 }}>
              <RichText text={b.title} />
            </h2>
          </div>
          <Cta cta={b.cta} contacto={contacto} className="btn btn--ghost reveal">
            {' '}
            {arrow}
          </Cta>
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
  );
}

/* ===================== DESTACADOS ===================== */
function Destacados({ b, ctx }) {
  return (
    <section className="section section--tight" id="destacados">
      <div className="wrap">
        <div className="sec-head">
          <div className="reveal">
            {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            <h2 className="sec-title" style={{ marginTop: 14 }}>
              <RichText text={b.title} />
            </h2>
          </div>
          {b.lead && (
            <p className="lead reveal" data-d="1">
              {b.lead}
            </p>
          )}
        </div>
        <div className="pgrid">
          {ctx.featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== HISTORIA ===================== */
function Historia({ b }) {
  return (
    <section className="section" id="historia">
      <div className="wrap">
        <div className="story reveal">
          <div className="story__grid">
            <div className="story__media">
              {b.image1 && (
                <img className="story__img" src={b.image1} alt="Detalle artesanal Taluna" loading="lazy" />
              )}
              {b.image2 && <img className="float" src={b.image2} alt="Bolsa Taluna" loading="lazy" />}
            </div>
            <div className="story__body">
              {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
              <h2 className="sec-title">
                <RichText text={b.title} />
              </h2>
              {b.lead && <p className="lead">{b.lead}</p>}
              <div className="story__points">
                {(b.points || []).map((p, i) => (
                  <div className="story__point" key={i}>
                    <span className="ico">{POINT_ICONS[i % POINT_ICONS.length]}</span>
                    <div>
                      <h4>{p.t}</h4>
                      <p>{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== MATERIALES ===================== */
function Materiales({ b }) {
  return (
    <section className="section section--tight">
      <div className="wrap detail">
        <div className="detail__media reveal">
          {b.image && <img className="detail__img" src={b.image} alt="Detalle de la piel Taluna" loading="lazy" />}
        </div>
        <div className="reveal" data-d="1">
          {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
          <h2 className="sec-title" style={{ margin: '14px 0 18px' }}>
            <RichText text={b.title} />
          </h2>
          {b.lead && <p className="lead">{b.lead}</p>}
          <div className="matgrid">
            {(b.items || []).map((m, i) => (
              <div className="mat" key={i}>
                <div className="k">{m.k}</div>
                <div className="v">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== COMUNIDAD ===================== */
function Comunidad({ b, ctx }) {
  const { igImgs, contacto } = ctx;

  return (
    <section className="section section--tight" id="comunidad">
      <div className="wrap">
        <div className="sec-head">
          <div className="reveal">
            {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            <h2 className="sec-title" style={{ marginTop: 14 }}>
              <RichText text={b.title} />
            </h2>
          </div>
          {b.cta?.text && (
            <a
              className="btn btn--ghost reveal"
              href={contacto.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {igIcon}
              {b.cta.text}
            </a>
          )}
        </div>
        <div className="iggrid reveal">
          {igImgs.map((src, i) => (
            <a
              className="igtile"
              href={contacto.instagram}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
            >
              <img className="ig__img" src={src} alt={contacto.igHandle || '@talunamx'} loading="lazy" />
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
  );
}

/* ===================== CONTACTO ===================== */
function Contacto({ b, ctx }) {
  const { contacto, waHref } = ctx;

  return (
    <section className="section section--tight" id="contacto">
      <div className="wrap">
        <div className="contact reveal">
          <div className="contact__grid">
            <div className="contact__body">
              {b.eyebrow && (
                <span className="eyebrow" style={{ color: 'var(--clay-soft)' }}>
                  {b.eyebrow}
                </span>
              )}
              <h2 className="sec-title" style={{ margin: '14px 0 16px' }}>
                <RichText text={b.title} />
              </h2>
              {b.lead && (
                <p className="lead" style={{ color: 'rgba(235,225,209,.72)', maxWidth: '42ch' }}>
                  {b.lead}
                </p>
              )}
              <div className="contact__list">
                <a
                  className="contact__item"
                  href={waHref('Hola Taluna, me gustaría hacer un pedido.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ic">{waIcon}</span>
                  <div>
                    <div className="t1">WhatsApp</div>
                    <div className="t2">+52 {contacto.phones?.[0]}</div>
                  </div>
                </a>
                <a className="contact__item" href={contacto.instagram} target="_blank" rel="noopener noreferrer">
                  <span className="ic">{igIcon}</span>
                  <div>
                    <div className="t1">Instagram</div>
                    <div className="t2">{contacto.igHandle || '@talunamx'}</div>
                  </div>
                </a>
                <a className="contact__item" href={`mailto:${contacto.email}`}>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <div className="t1">Correo</div>
                    <div className="t2">{contacto.email}</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="contact__media">
              {b.image && <img className="contact__img" src={b.image} alt="Bolsa Taluna" loading="lazy" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ BLOQUES QUE LA DUEÑA PUEDE AGREGAR ============ */

// Franja de aviso: promociones, envíos, avisos de temporada.
function Aviso({ b, ctx }) {
  if (!b.text?.trim()) return null;
  return (
    <section className="aviso reveal">
      <div className="wrap aviso__in">
        <span className="aviso__text">
          <RichText text={b.text} />
        </span>
        <Cta cta={b.cta} contacto={ctx.contacto} className="aviso__cta" />
      </div>
    </section>
  );
}

// Texto + imagen: el bloque comodín para contar algo con una foto.
function TextoImagen({ b, ctx }) {
  return (
    <section className="section section--tight">
      <div className={`wrap detail${b.side === 'izquierda' ? ' detail--flip' : ''}`}>
        <div className="detail__media reveal">
          {b.image ? (
            <img className="detail__img" src={b.image} alt={plainText(b.title)} loading="lazy" />
          ) : (
            <div className="imgph" style={{ width: '100%', height: '100%' }}>
              {plainText(b.title)}
            </div>
          )}
        </div>
        <div className="reveal" data-d="1">
          {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
          <h2 className="sec-title" style={{ margin: '14px 0 18px' }}>
            <RichText text={b.title} />
          </h2>
          {b.text && <p className="lead">{b.text}</p>}
          <Cta cta={b.cta} contacto={ctx.contacto} className="btn btn--primary">
            {' '}
            {arrow}
          </Cta>
        </div>
      </div>
    </section>
  );
}

// Galería: puras fotos, para lookbook o novedades.
function Galeria({ b }) {
  const images = (b.images || []).filter(Boolean);
  if (!images.length) return null;

  return (
    <section className="section section--tight">
      <div className="wrap">
        {b.title && (
          <h2 className="sec-title reveal" style={{ marginBottom: 28 }}>
            <RichText text={b.title} />
          </h2>
        )}
        <div className="galeria reveal">
          {images.map((src, i) => (
            <div className="galeria__item" key={i}>
              <img src={src} alt={plainText(b.title) || 'Taluna'} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const BLOCKS = {
  hero: Hero,
  craft: Craft,
  categorias: Categorias,
  destacados: Destacados,
  historia: Historia,
  materiales: Materiales,
  comunidad: Comunidad,
  contacto: Contacto,
  aviso: Aviso,
  textoImagen: TextoImagen,
  galeria: Galeria,
};
