import { getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import CatalogGrid from '@/components/CatalogGrid';
import Pic from '@/components/Pic';
import RichText, { plainText } from '@/components/blocks/RichText';

// El catálogo se refresca solo cada minuto (lo que la dueña guarda
// en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

export const metadata = {
  title: 'Catálogo · Taluna',
  description: 'Explora todas nuestras bolsas y straps artesanales hechos a mano en México.',
};

export default async function CatalogoPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  // El encabezado lo edita la dueña; {piezas} se cambia por el número real.
  const { eyebrow, title, lead, image, imageMobile } = content.catalogo;
  const leadText = String(lead || '').replace(/\{piezas\}/g, products.length);

  // Si no hay foto de portada guardada, usamos la primera foto real del
  // catálogo: la página nunca se ve vacía arriba.
  const cover = image || products.find((p) => p.images?.[0]?.url)?.images?.[0]?.url || null;

  return (
    <>
      {cover ? (
        <section className="cover" data-hero>
          <Pic
            className="cover__img"
            src={cover}
            mobile={image ? imageMobile : ''}
            alt={plainText(title)}
            priority
          />
          <div className="cover__scrim" />
          <div className="cover__body">
            {eyebrow && <span className="kicker">{eyebrow}</span>}
            <h1 className="cover__title">
              <RichText text={title} />
            </h1>
            {leadText && <p className="cover__lead">{leadText}</p>}
          </div>
        </section>
      ) : (
        <>
          <div className="nav-space" />
          <header className="wrap plainhead">
            {eyebrow && <span className="kicker">{eyebrow}</span>}
            <h1 className="sec-title">
              <RichText text={title} />
            </h1>
            {leadText && <p className="lead">{leadText}</p>}
          </header>
        </>
      )}

      <div className="wrap section--tight">
        <CatalogGrid products={products} categories={categories} />
      </div>
    </>
  );
}
