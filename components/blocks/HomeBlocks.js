import Link from 'next/link';
import Pic from '@/components/Pic';
import HeroMedia from '@/components/HeroMedia';
import ModelTabs from '@/components/ModelTabs';
import BestSellers from '@/components/BestSellers';
import ReelsRail from '@/components/ReelsRail';
import BuilderTeaser from '@/components/BuilderTeaser';
import RichText, { plainText } from './RichText';
import { hrefFor, isExternal } from '@/lib/site-content';

// =====================================================================
//  BLOQUES DEL INICIO
//  Porte fiel de src/routes/index.tsx del diseño (Artisan Migration).
//  El orden y los textos los controla la dueña desde el Organizador;
//  el diseño no se toca desde ahí, a propósito.
// =====================================================================

/* ---------------------------- iconos ---------------------------- */

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const arrowUp = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="9 7 17 7 17 15" />
  </svg>
);

/* --------------------------- botones ---------------------------- */

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

/* ========================= 1 · PORTADA ========================= */
function Hero({ b, ctx }) {
  const media = b.media || {};
  const tipo = media.type === 'image' && (media.image || media.imageMobile) ? 'image' : 'video';

  return (
    <section className="tl-hero" data-hero>
      <HeroMedia media={{ ...media, type: tipo }} alt={plainText(b.title) || 'Taluna'} />
      <div className="tl-hero__scrim" />

      <div className="tl-hero__in">
        <h1>
          <RichText text={b.title} />
        </h1>
        {b.lead && <p>{b.lead}</p>}
        <div className="tl-hero__cta">
          <Cta cta={b.cta1} contacto={ctx.contacto} className="tl-btn tl-btn--light" />
          <Cta cta={b.cta2} contacto={ctx.contacto} className="tl-btn tl-btn--onmedia" />
        </div>
      </div>
    </section>
  );
}

/* ================= 2 · COMBINACIÓN DEL MES ================= */
function Combinacion({ b }) {
  if (!b.image) return null;

  return (
    <section className="tl-sec tl-combo">
      <h2 className="reveal">
        <RichText text={b.title} />
      </h2>

      <div className="tl-combo__wrap reveal" data-d="1">
        <div className="tl-combo__box">
          <Pic src={b.image} mobile={b.imageMobile} alt={plainText(b.title)} />
          {b.tag && <span className="tl-combo__tag">{b.tag}</span>}
        </div>
        {b.cutout && <img className="tl-combo__cut" src={b.cutout} alt="" loading="lazy" aria-hidden="true" />}
      </div>
    </section>
  );
}

/* ==================== 3 · MÁS VENDIDOS ==================== */
function Destacados({ b, ctx }) {
  if (!ctx.featured.length) return null;

  return (
    <section className="tl-sec tl-best" id="destacados">
      <div className="tl-sec__head tl-best__head">
        <h2 className="tl-h2">
          <RichText text={b.title} />
        </h2>
        <Link href="/catalogo" className="tl-see">
          {arrowUp}
          Ver todo
        </Link>
      </div>

      <BestSellers products={ctx.featured} />
    </section>
  );
}

/* ============ 4 · EL STRAP CAMBIA TODO (campaña) ============ */
function Craft({ b, ctx }) {
  const media = b.media || {};
  const esVideo = media.type === 'video' && media.src;
  const foto = media.type === 'image' ? media.image || b.image : b.image;
  const fotoMovil = media.type === 'image' ? media.imageMobile || b.imageMobile : b.imageMobile;

  return (
    <section className="tl-sec tl-camp">
      <div className="tl-camp__b reveal">
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2">
          <RichText text={b.title} />
        </h2>
        {b.text && <p>{b.text}</p>}
        <Cta cta={b.cta} contacto={ctx.contacto} className="tl-ulink">
          {arrow}
        </Cta>
      </div>

      <div className="tl-camp__media reveal" data-d="1">
        {esVideo ? (
          <video autoPlay muted loop playsInline preload="metadata" poster={media.poster || undefined} aria-hidden="true">
            <source src={media.src} type="video/mp4" />
          </video>
        ) : (
          <Pic
            src={foto}
            mobile={fotoMovil}
            alt="Straps artesanales Taluna"
            fallback={<span className="tl-ph">{plainText(b.title)}</span>}
          />
        )}
      </div>
    </section>
  );
}

/* ==================== 5 · MODELOS TALUNA ==================== */
function Categorias({ b, ctx }) {
  const { products, categories } = ctx;
  const slug = b.categoria || categories[0]?.slug;
  const modelos = products.filter((p) => p.category_slug === slug).slice(0, 8);
  if (!modelos.length) return null;

  return (
    <section className="tl-sec tl-mod" id="categorias">
      <div className="tl-sec__head tl-mod__head">
        <h2 className="tl-h2">
          <RichText text={b.title} />
        </h2>
        <Cta cta={b.cta} contacto={ctx.contacto} className="tl-see tl-see--small">
          {arrowUp}
        </Cta>
      </div>

      <ModelTabs models={modelos} />
    </section>
  );
}

/* ============ BLOQUE EDITORIAL (foto grande con texto) ============ */
function EditorialBox({ b, ctx, alto = 500, alt }) {
  return (
    <section className="tl-sec tl-ed">
      <div className="tl-ed__box reveal" style={{ height: alto }}>
        <Pic
          src={b.image || b.image1}
          mobile={b.imageMobile || b.image1Mobile}
          alt={alt}
          fallback={<span className="tl-ph">{plainText(b.title)}</span>}
        />
        <div className="tl-ed__scrim" />

        <div className="tl-ed__b">
          {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
          <h2>
            <RichText text={b.title} />
          </h2>
          {(b.text || b.lead) && <p>{b.text || b.lead}</p>}

          {(b.chips || []).filter(Boolean).length > 0 && (
            <div className="tl-ed__chips">
              {(b.chips || []).filter(Boolean).map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          )}

          <Cta cta={b.cta} contacto={ctx.contacto} className="tl-ulink tl-ulink--light">
            {arrow}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ============= 6 · DETRÁS DE CADA STRAP (historia) ============= */
function Historia({ b, ctx }) {
  return <EditorialBox b={b} ctx={ctx} alto={500} alt="Artesana con strap tejido" />;
}

/* ============= BLOQUE EDITORIAL QUE SE PUEDE AGREGAR ============= */
function Editorial({ b, ctx }) {
  if (!b.image) return null;
  return <EditorialBox b={b} ctx={ctx} alto={540} alt={plainText(b.title) || 'Taluna'} />;
}

/* ==================== 7 · ARMA TU TALUNA ==================== */
function ArmaTuTaluna({ b, ctx }) {
  return (
    <section className="tl-sec tl-cfg" id="arma-tu-taluna">
      <div className="tl-cfg__head reveal">
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2">
          <RichText text={b.title} />
        </h2>
        {b.lead && <p>{b.lead}</p>}
      </div>

      <div className="reveal" data-d="1">
        <BuilderTeaser products={ctx.products} categories={ctx.categories} contacto={ctx.contacto} />
      </div>
    </section>
  );
}

/* ==================== 8 · INSTAGRAM ==================== */
function Comunidad({ b, ctx }) {
  const { igImgs, contacto } = ctx;
  const imgs = (b.images || []).filter(Boolean).length ? b.images.filter(Boolean) : igImgs;
  if (!imgs.length) return null;

  return (
    <section className="tl-sec tl-ig" id="comunidad">
      <div className="tl-ig__head reveal">
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2">
          <RichText text={b.title} />
        </h2>
      </div>

      <ReelsRail images={imgs} href={contacto.instagram} />

      <div className="tl-ig__foot reveal">
        <a className="tl-ulink" href={contacto.instagram} target="_blank" rel="noopener noreferrer">
          {b.cta?.text || 'Ver en Instagram'}
          {arrowUp}
        </a>
      </div>
    </section>
  );
}

/* ===== BLOQUES QUE LA DUEÑA PUEDE AGREGAR (mismo lenguaje visual) ===== */

// Contacto: WhatsApp, Instagram y correo.
function Contacto({ b, ctx }) {
  const { contacto, waHref } = ctx;

  const filas = [
    {
      t1: 'WhatsApp',
      t2: `+52 ${contacto.phones?.[0] || ''}`,
      href: waHref('Hola Taluna, me gustaría hacer un pedido.'),
      ico: (
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.3A8.5 8.5 0 1 1 21 11.5z" />
      ),
    },
    {
      t1: 'Instagram',
      t2: contacto.igHandle || '@talunamx',
      href: contacto.instagram,
      ico: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
        </>
      ),
    },
    {
      t1: 'Correo',
      t2: contacto.email,
      href: `mailto:${contacto.email}`,
      ico: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </>
      ),
    },
  ];

  return (
    <section className="tl-sec" id="contacto" style={{ padding: '46px 22px 10px' }}>
      <div className="reveal" style={{ textAlign: 'center', marginBottom: 24 }}>
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2" style={{ fontSize: 26 }}>
          <RichText text={b.title} />
        </h2>
        {b.lead && (
          <p
            style={{
              margin: '12px auto 0',
              maxWidth: '34ch',
              fontSize: 14,
              lineHeight: 1.6,
              fontWeight: 300,
              color: 'var(--tl-muted)',
            }}
          >
            {b.lead}
          </p>
        )}
      </div>

      <div className="reveal" data-d="1">
        {filas.map((f) => (
          <a
            key={f.t1}
            href={f.href}
            target={f.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '15px 2px',
              borderTop: '1px solid var(--tl-line)',
            }}
          >
            <span
              style={{
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 999,
                background: '#fff',
                border: '1px solid var(--tl-line-soft)',
                color: 'var(--tl-accent)',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {f.ico}
              </svg>
            </span>
            <span>
              <span
                style={{
                  display: 'block',
                  fontSize: 9.5,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: 'var(--tl-faint)',
                }}
              >
                {f.t1}
              </span>
              <span style={{ display: 'block', fontSize: 14.5, color: 'var(--tl-ink)' }}>{f.t2}</span>
            </span>
          </a>
        ))}
        <div style={{ borderTop: '1px solid var(--tl-line)' }} />
      </div>
    </section>
  );
}

// Franja delgada de aviso.
function Aviso({ b, ctx }) {
  if (!b.text?.trim()) return null;
  return (
    <section style={{ background: 'var(--tl-bar)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
          padding: '13px 22px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--tl-muted)',
          }}
          className="rich"
        >
          <RichText text={b.text} />
        </span>
        <Cta
          cta={b.cta}
          contacto={ctx.contacto}
          className="tl-ulink"
        />
      </div>
    </section>
  );
}

// Materiales: foto + lista de materiales.
function Materiales({ b }) {
  return (
    <section className="tl-sec" style={{ padding: '46px 22px 10px' }}>
      <div className="tl-media reveal" style={{ aspectRatio: '4 / 5', borderRadius: 22, marginBottom: 22 }}>
        <Pic src={b.image} mobile={b.imageMobile} alt="Materiales Taluna" fallback={<span className="tl-ph">Materiales</span>} />
      </div>

      <div className="reveal" data-d="1">
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2" style={{ fontSize: 26, marginBottom: 12 }}>
          <RichText text={b.title} />
        </h2>
        {b.lead && (
          <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: 'var(--tl-muted)' }}>
            {b.lead}
          </p>
        )}

        {(b.items || []).map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 18,
              padding: '14px 0',
              borderTop: '1px solid var(--tl-line)',
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--tl-ink)' }}>{m.k}</span>
            <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--tl-muted)', textAlign: 'right' }}>{m.v}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--tl-line)' }} />
      </div>
    </section>
  );
}

// Texto + imagen: el bloque comodín.
function TextoImagen({ b, ctx }) {
  return (
    <section className="tl-sec" style={{ padding: '46px 22px 10px' }}>
      <div className="tl-media reveal" style={{ aspectRatio: '4 / 5', borderRadius: 22, marginBottom: 22 }}>
        <Pic
          src={b.image}
          mobile={b.imageMobile}
          alt={plainText(b.title)}
          fallback={<span className="tl-ph">{plainText(b.title)}</span>}
        />
      </div>

      <div className="reveal" data-d="1">
        {b.eyebrow && <p className="tl-kicker">{b.eyebrow}</p>}
        <h2 className="tl-h2" style={{ fontSize: 26, marginBottom: 12 }}>
          <RichText text={b.title} />
        </h2>
        {b.text && (
          <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: 'var(--tl-muted)' }}>
            {b.text}
          </p>
        )}
        <Cta cta={b.cta} contacto={ctx.contacto} className="tl-ulink">
          {arrow}
        </Cta>
      </div>
    </section>
  );
}

// Galería de fotos.
function Galeria({ b }) {
  const images = (b.images || []).filter(Boolean);
  if (!images.length) return null;

  return (
    <section className="tl-sec" style={{ padding: '46px 0 10px' }}>
      {b.title && (
        <h2 className="tl-h2 reveal" style={{ fontSize: 26, padding: '0 22px', marginBottom: 20 }}>
          <RichText text={b.title} />
        </h2>
      )}
      <div
        data-stagger
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 16px' }}
      >
        {images.map((src, i) => (
          <div className="tl-media reveal" key={i} style={{ aspectRatio: '3 / 4', borderRadius: 3 }}>
            <img src={src} alt={plainText(b.title) || 'Taluna'} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

export const BLOCKS = {
  hero: Hero,
  combinacion: Combinacion,
  destacados: Destacados,
  craft: Craft,
  categorias: Categorias,
  historia: Historia,
  editorial: Editorial,
  armaTuTaluna: ArmaTuTaluna,
  comunidad: Comunidad,
  contacto: Contacto,
  materiales: Materiales,
  aviso: Aviso,
  textoImagen: TextoImagen,
  galeria: Galeria,
};
