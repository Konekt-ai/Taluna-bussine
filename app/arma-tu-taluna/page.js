import { getProducts, getCategories } from '@/lib/products';
import { getSiteContent } from '@/lib/site-content';
import BuilderTeaser from '@/components/BuilderTeaser';

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

  const hayBolsas = products.some((p) => p.category_slug === categories[0]?.slug);

  return (
    <>
      <div className="tl-space" />
      <section className="tl-cfg" style={{ paddingTop: 26 }}>
        <div className="tl-cfg__head">
          <p className="tl-kicker">Personalízalo</p>
          <h2 className="tl-h2" style={{ fontSize: 30 }}>
            Arma tu Taluna
          </h2>
          <p>Elige tu bolsa, su color y el strap que la hace tuya. El total se actualiza al instante.</p>
        </div>

        {hayBolsas ? (
          <BuilderTeaser products={products} categories={categories} contacto={content.contacto} />
        ) : (
          <p className="tl-empty">
            Todavía no hay piezas publicadas. Escríbenos por WhatsApp y te ayudamos.
          </p>
        )}
      </section>
    </>
  );
}
