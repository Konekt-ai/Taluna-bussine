import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Pic from '@/components/Pic';
import HeroMedia from '@/components/HeroMedia';
import ModelTabs from '@/components/ModelTabs';
import BuilderTeaser from '@/components/BuilderTeaser';
import RichText, { plainText } from './RichText';
import { hrefFor, isExternal } from '@/lib/site-content';

// =====================================================================
//  BLOQUES DEL HOME
//  Cada bloque recibe { b } (lo que la dueña guardó en el Organizador) y
//  { ctx } (lo que sale del catálogo: productos, categorías, contacto…).
//  El diseño NO es editable a propósito: solo textos, fotos, botones,
//  el orden y si se muestra o no. Así la página siempre se ve bien.
//
//  El look es el del diseño aprobado (trabajo_grafico): fondo ivory,
//  tipografía Figtree, etiquetas chiquitas en mayúsculas, foto grande a
//  sangre y enlaces subrayados en vez de botones de colores.
// =====================================================================

/* ---------------------------- iconos ---------------------------- */

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

const igIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
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

/* --------------------------- botones ---------------------------- */

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

// Cabecera de sección: etiqueta + título a la izquierda, enlace a la derecha.
function SecHead({ b, ctx, link }) {
  return (
    <div className="sec-head">
      <div className="sec-head__t reveal">
        {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
        <h2 className="sec-title">
          <RichText text={b.title} />
        </h2>
        {b.lead && <p className="lead">{b.lead}</p>}
      </div>
      {link && (
        <Cta cta={b.cta} contacto={ctx.contacto} className="seelink reveal">
          {arrowUp}
        </Cta>
      )}
    </div>
  );
}

/* ===================== HERO ===================== */
function Hero({ b, ctx }) {
  const { products, heroFeat, contacto, formatPrice } = ctx;
  const media = b.media || {};
  const stats = (b.stats || []).filter((s) => s && (s.n || s.l));
  // Si eligieron foto pero no subieron ninguna, se queda el video.
  const tipo = media.type === 'image' && (media.image || media.imageMobile) ? 'image' : 'video';

  return (
    <section className="hero" data-hero>
      {/* Elige sola la versión de celular o la de pantalla grande */}
      <HeroMedia media={{ ...media, type: tipo }} alt={plainText(b.title) || 'Taluna'} />

      <div className="hero__scrim" />

      <div className="hero__in">
        <div className="hero__inner">
          {b.eyebrow && <span className="kicker hero__eyebrow">{b.eyebrow}</span>}

          <h1 className="hero__title">
            <RichText text={b.title} />
          </h1>

          {b.lead && <p className="hero__lead">{b.lead}</p>}

          <div className="hero__cta">
            <Cta cta={b.cta1} contacto={contacto} className="btn btn--light" />
            <Cta cta={b.cta2} contacto={contacto} className="btn btn--onmedia" />
          </div>

          {stats.length > 0 && (
            <div className="hero__meta">
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
      </div>

      {b.showCap !== false && heroFeat && (
        <p className="hero__cap">
          <b>{heroFeat.name}</b>
          <br />
          desde {formatPrice(heroFeat.price, heroFeat.currency)}
        </p>
      )}
    </section>
  );
}

/* ============ BLOQUE EDITORIAL (foto grande a sangre) ============ */
// Lo comparten "Artesanal" y el bloque "Editorial" que la dueña puede
// agregar: misma caja, mismos textos encima de la foto.
function EditorialBox({ b, ctx, alt }) {
  return (
    <section className="section--tight editorial">
      <div className="wrap">
        <div className="editorial__box reveal">
          <Pic
            className="editorial__img"
            src={b.image}
            mobile={b.imageMobile}
            alt={alt}
            fallback={<div className="imgph">{plainText(b.title)}</div>}
          />
          <div className="editorial__scrim" />

          <div className="editorial__body">
            {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
            <h2 className="editorial__title">
              <RichText text={b.title} />
            </h2>
            {(b.text || b.lead) && <p className="editorial__text">{b.text || b.lead}</p>}

            {(b.chips || []).filter(Boolean).length > 0 && (
              <div className="editorial__chips">
                {(b.chips || []).filter(Boolean).map((c, i) => (
                  <span className="editorial__chip" key={i}>
                    {c}
                  </span>
                ))}
              </div>
            )}

            <Cta cta={b.cta} contacto={ctx.contacto} className="ulink ulink--light">
              {arrow}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== CAMPAÑA · texto a la izquierda, cápsula a la derecha ========== */
function Craft({ b, ctx }) {
  // Acepta foto o video: si la dueña subió video, se reproduce en la cápsula.
  const media = b.media || {};
  const esVideo = media.type === 'video' && media.src;
  const foto = media.type === 'image' ? media.image || b.image : b.image;
  const fotoMovil = media.type === 'image' ? media.imageMobile || b.imageMobile : b.imageMobile;

  return (
    <section className="section campaign">
      <div className="wrap campaign__grid">
        <div className="campaign__body reveal">
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title">
            <RichText text={b.title} />
          </h2>
          {b.text && <p className="lead">{b.text}</p>}

          {(b.chips || []).filter(Boolean).length > 0 && (
            <div className="campaign__chips">
              {(b.chips || []).filter(Boolean).map((c, i) => (
                <span className="campaign__chip" key={i}>
                  {c}
                </span>
              ))}
            </div>
          )}

          <Cta cta={b.cta} contacto={ctx.contacto} className="ulink">
            {arrow}
          </Cta>
        </div>

        <div className="campaign__media reveal" data-d="1">
          {esVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={media.poster || undefined}
              aria-hidden="true"
            >
              <source src={media.src} type="video/mp4" />
            </video>
          ) : (
            <Pic
              src={foto}
              mobile={fotoMovil}
              alt="Straps de chaquira tejida a mano"
              fallback={<div className="imgph">{plainText(b.title)}</div>}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Editorial({ b, ctx }) {
  // Sin foto no tiene sentido: el bloque entero es la foto.
  if (!b.image) return null;
  return <EditorialBox b={b} ctx={ctx} alt={plainText(b.title) || 'Taluna'} />;
}

/* =============== COMBINACIÓN DEL MES (foto ancha) =============== */
function Combinacion({ b, ctx }) {
  if (!b.image) return null;

  return (
    <section className="section--tight combo">
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 24 }}>
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title" style={{ marginTop: 10 }}>
            <RichText text={b.title} />
          </h2>
        </div>

        <div style={{ position: 'relative' }} className="reveal" data-d="1">
          <div className="combo__box">
            <Pic
              className="combo__img"
              src={b.image}
              mobile={b.imageMobile}
              alt={plainText(b.title)}
            />
            {b.tag && <span className="combo__tag">{b.tag}</span>}
          </div>

          {/* Producto recortado que sale del encuadre */}
          {b.cutout && (
            <img className="combo__cut" src={b.cutout} alt="" loading="lazy" aria-hidden="true" />
          )}
        </div>

        {b.cta?.text && (
          <div style={{ marginTop: 40 }} className="reveal" data-d="2">
            <Cta cta={b.cta} contacto={ctx.contacto} className="ulink">
              {arrow}
            </Cta>
          </div>
        )}
      </div>
    </section>
  );
}

/* =============== MODELOS TALUNA (pestañas por modelo) =============== */
function Categorias({ b, ctx }) {
  const { products, categories } = ctx;
  // Los modelos son los productos de una categoría (por defecto, la primera:
  // normalmente "Bolsas"). La dueña puede apuntar a otra desde el Organizador.
  const slug = b.categoria || categories[0]?.slug;
  const modelos = products.filter((p) => p.category_slug === slug).slice(0, 8);
  if (!modelos.length) return null;

  return (
    <section className="section" id="categorias">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head__t reveal">
            {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
            <h2 className="sec-title">
              <RichText text={b.title} />
            </h2>
          </div>
          <Cta cta={b.cta} contacto={ctx.contacto} className="seelink reveal">
            {arrowUp}
          </Cta>
        </div>

        <div className="reveal">
          <ModelTabs models={modelos} />
        </div>
      </div>
    </section>
  );
}

/* ===================== DESTACADOS ===================== */
// La cuadrícula compacta del diseño: tres por renglón en el celular.
function Destacados({ b, ctx }) {
  if (!ctx.featured.length) return null;

  return (
    <section className="section section--tight" id="destacados">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head__t reveal">
            {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
            <h2 className="sec-title">
              <RichText text={b.title} />
            </h2>
            {b.lead && <p className="lead">{b.lead}</p>}
          </div>
          <Link href="/catalogo" className="seelink reveal">
            {arrowUp}
            Ver todo
          </Link>
        </div>

        <div className="pgrid pgrid--compact" data-stagger>
          {ctx.featured.map((p) => (
            <div className="reveal" key={p.slug}>
              <ProductCard product={p} variant="min" />
            </div>
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
        <div className="story__grid">
          <div className="story__media reveal">
            <Pic
              className="story__img"
              src={b.image1}
              mobile={b.image1Mobile}
              alt="Detalle artesanal Taluna"
              fallback={<div className="story__img imgph">Taluna</div>}
            />
            {b.image2 && (
              <img className="story__float" src={b.image2} alt="Bolsa Taluna" loading="lazy" />
            )}
          </div>

          <div className="story__body reveal" data-d="1">
            {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
            <h2 className="sec-title">
              <RichText text={b.title} />
            </h2>
            {b.lead && <p className="lead">{b.lead}</p>}

            <div className="story__points">
              {(b.points || []).map((p, i) => (
                <div className="story__point" key={i}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
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
    </section>
  );
}

/* ===================== MATERIALES ===================== */
function Materiales({ b }) {
  return (
    <section className="section section--tight">
      <div className="wrap detail">
        <div className="detail__media reveal">
          <Pic
            className="detail__img"
            src={b.image}
            mobile={b.imageMobile}
            alt="Detalle de la piel Taluna"
            fallback={<div className="imgph">Materiales</div>}
          />
        </div>

        <div className="reveal" data-d="1">
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title" style={{ margin: '12px 0 16px' }}>
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
  // Si la dueña subió fotos propias al bloque, esas mandan.
  const imgs = (b.images || []).filter(Boolean).length ? b.images.filter(Boolean) : igImgs;
  if (!imgs.length) return null;

  return (
    <section className="section section--tight" id="comunidad">
      <div className="wrap">
        <div className="ig-head reveal">
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title">
            <RichText text={b.title} />
          </h2>
        </div>

        <div className="rail rail--bleed ig-rail" data-stagger>
          {imgs.map((src, i) => (
            <a
              className="igtile"
              href={contacto.instagram}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
            >
              <div className="igtile__box">
                <img src={src} alt={contacto.igHandle || '@talunamx'} loading="lazy" />
                <span className="igtile__ov">{igIcon}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="ig-foot reveal">
          <a className="ulink" href={contacto.instagram} target="_blank" rel="noopener noreferrer">
            {b.cta?.text || 'Ver en Instagram'}
            {arrowUp}
          </a>
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
          <div className="contact__body">
            {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
            <h2 className="sec-title" style={{ margin: '12px 0 16px' }}>
              <RichText text={b.title} />
            </h2>
            {b.lead && <p className="lead">{b.lead}</p>}

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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
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
            <Pic
              className="contact__img"
              src={b.image}
              mobile={b.imageMobile}
              alt="Bolsa Taluna"
              fallback={<div className="imgph">Taluna</div>}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== ARMA TU TALUNA ===================== */
function ArmaTuTaluna({ b, ctx }) {
  return (
    <section className="section section--tight" id="arma-tu-taluna">
      <div className="wrap">
        <div className="ig-head reveal">
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title">
            <RichText text={b.title} />
          </h2>
          {b.lead && <p className="lead" style={{ margin: '12px auto 0' }}>{b.lead}</p>}
        </div>

        <div className="reveal" data-d="1">
          <BuilderTeaser
            products={ctx.products}
            categories={ctx.categories}
            contacto={ctx.contacto}
          />
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
    <section className="aviso">
      <div className="wrap aviso__in">
        <span className="aviso__text rich">
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
          <Pic
            className="detail__img"
            src={b.image}
            mobile={b.imageMobile}
            alt={plainText(b.title)}
            fallback={<div className="imgph">{plainText(b.title)}</div>}
          />
        </div>

        <div className="reveal" data-d="1">
          {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
          <h2 className="sec-title" style={{ margin: '12px 0 16px' }}>
            <RichText text={b.title} />
          </h2>
          {b.text && <p className="lead">{b.text}</p>}
          <div style={{ marginTop: 26 }}>
            <Cta cta={b.cta} contacto={ctx.contacto} className="ulink">
              {arrow}
            </Cta>
          </div>
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
        <div className="galeria" data-stagger>
          {images.map((src, i) => (
            <div className="galeria__item reveal" key={i}>
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
  armaTuTaluna: ArmaTuTaluna,
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
  editorial: Editorial,
  combinacion: Combinacion,
};
