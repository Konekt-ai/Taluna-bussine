import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import BuilderTeaser from '@/components/BuilderTeaser';

// El catálogo se refresca solo cada minuto (lo que la dueña guarda
// en el Organizador aparece aquí sin volver a desplegar).
export const revalidate = 60;

export const metadata = {
  title: 'Arma tu Taluna · Personaliza tu bolsa artesanal',
  description:
    'Elige bolsa, color y strap artesanal para crear tu Taluna única. El total se actualiza al instante.',
};

export default async function ArmaTuTalunaPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  const bolsasSlug = categories[0]?.slug;
  const hayBolsas = products.some((p) => p.category_slug === bolsasSlug);

  return (
    <>
      <div className="nav-space" />

      <div className="wrap section--tight">
        <Link href="/" className="pdp__back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 5 8 12 15 19" />
          </svg>
          Volver al inicio
        </Link>

        <div className="ig-head">
          <span className="kicker">Personalízalo</span>
          <h1 className="sec-title">
            Arma tu <em>Taluna.</em>
          </h1>
          <p className="lead" style={{ margin: '12px auto 0' }}>
            Elige tu bolsa, su color y el strap que la hace tuya. El total se
            actualiza al instante y lo cerramos por WhatsApp.
          </p>
        </div>

        {hayBolsas ? (
          <BuilderTeaser
            products={products}
            categories={categories}
            contacto={content.contacto}
            compact={false}
          />
        ) : (
          <p className="empty-note">
            Todavía no hay piezas publicadas para armar tu Taluna. Escríbenos por
            WhatsApp y te ayudamos.
          </p>
        )}
      </div>
    </>
  );
}
