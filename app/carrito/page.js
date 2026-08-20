'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/lib/products';

// =====================================================================
//  BOLSA / CARRITO
//  Mismo lenguaje visual del diseño: fondo ivory, líneas finas, botones
//  de pastilla y el pedido se cierra por WhatsApp.
// =====================================================================

const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868';

const EMPTY_FORM = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  direccion: '',
  colonia: '',
  cp: '',
  ciudad: '',
  estado: '',
  telefono: '',
  observaciones: '',
};

// Campos obligatorios (marcados con * en el formulario).
const REQUIRED = [
  'nombre',
  'apellidoPaterno',
  'correo',
  'direccion',
  'cp',
  'ciudad',
  'estado',
  'telefono',
];

export default function CarritoPage() {
  const { items, updateQty, removeItem, clear, subtotal, loaded } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function buildMessage() {
    const lines = items.map(
      (i) => `• ${i.qty}x ${i.name} — ${formatPrice(i.price * i.qty, i.currency)}`
    );
    const nombre = [form.nombre, form.apellidoPaterno, form.apellidoMaterno]
      .filter(Boolean)
      .join(' ');

    return (
      `Hola Taluna! 🛍️ Quiero hacer este pedido:\n\n` +
      `${lines.join('\n')}\n\n` +
      `Subtotal: ${formatPrice(subtotal)}\n` +
      `Envío: por confirmar\n\n` +
      `— Mis datos —\n` +
      `Nombre: ${nombre}\n` +
      `Correo: ${form.correo}\n` +
      `Teléfono: ${form.telefono}\n` +
      `Dirección: ${form.direccion}${form.colonia ? `, Col. ${form.colonia}` : ''}, CP ${form.cp}\n` +
      `Ciudad: ${form.ciudad}, ${form.estado}` +
      (form.observaciones ? `\nObservaciones: ${form.observaciones}` : '')
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!items.length) return;

    const missing = REQUIRED.filter((k) => !form[k].trim());
    if (missing.length) {
      setError('Por favor completa los campos obligatorios marcados con *.');
      return;
    }
    setError('');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Evita parpadeo antes de leer el carrito guardado.
  if (!loaded) {
    return (
      <>
        <div className="nav-space" />
        <p className="empty-note">Cargando tu bolsa…</p>
      </>
    );
  }

  // Carrito vacío.
  if (items.length === 0) {
    return (
      <>
        <div className="nav-space" />
        <div className="wrap section center">
          <span className="kicker">Tu bolsa</span>
          <h1 className="sec-title" style={{ margin: '12px 0 10px' }}>
            Todavía está <em>vacía.</em>
          </h1>
          <p className="lead" style={{ margin: '0 auto 30px' }}>
            Aún no has agregado ninguna pieza. Date una vuelta por el catálogo.
          </p>
          <Link href="/catalogo" className="btn btn--primary">
            Ver catálogo
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="nav-space" />

      <div className="wrap section--tight">
        <span className="kicker">Tu bolsa</span>
        <h1 className="sec-title" style={{ margin: '12px 0 30px' }}>
          Resumen de <em>tu pedido.</em>
        </h1>

        {/* Lista de productos */}
        <div>
          {items.map((item) => (
            <div key={item.slug} className="cart-line">
              <div className="cart-line__img">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="84px" />
                ) : (
                  <div className="imgph">{item.name}</div>
                )}
              </div>

              <div>
                <Link href={`/producto/${item.slug}`} className="cart-line__name">
                  {item.name}
                </Link>
                <p className="cart-line__meta">
                  {formatPrice(item.price, item.currency)} c/u
                </p>
                <button
                  onClick={() => removeItem(item.slug)}
                  className="cart-line__meta"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4 }}
                >
                  Quitar
                </button>
              </div>

              <div className="cart-line__right">
                <div className="qty">
                  <button onClick={() => updateQty(item.slug, item.qty - 1)} aria-label="Quitar uno">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.slug, item.qty + 1)} aria-label="Agregar uno">
                    +
                  </button>
                </div>
                <strong style={{ fontWeight: 500 }}>
                  {formatPrice(item.price * item.qty, item.currency)}
                </strong>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 26 }}>
          <div className="panel" style={{ width: '100%', maxWidth: 380 }}>
            <div className="totals">
              <div className="totals__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="totals__row">
                <span>Envío</span>
                <span>Se cotiza por WhatsApp</span>
              </div>
              <div className="totals__row totals__row--big">
                <span>Total</span>
                <span>{formatPrice(subtotal)} + envío</span>
              </div>
            </div>
            <button
              onClick={clear}
              style={{
                marginTop: 16,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 11,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--soft)',
              }}
            >
              Vaciar la bolsa
            </button>
          </div>
        </div>

        {/* Datos de compra */}
        <form onSubmit={handleSubmit} className="section--tight">
          <span className="kicker">Casi listo</span>
          <h2 className="sec-title" style={{ margin: '12px 0 8px', fontSize: 'clamp(22px, 3vw, 32px)' }}>
            Tus datos de <em>envío.</em>
          </h2>
          <p className="lead" style={{ marginBottom: 26 }}>
            Completa tus datos y enviamos el pedido por WhatsApp para confirmar envío y pago.
          </p>

          <div
            style={{
              display: 'grid',
              gap: 18,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            <Field label="Nombre(s)" required value={form.nombre} onChange={(v) => set('nombre', v)} />
            <Field label="Apellido paterno" required value={form.apellidoPaterno} onChange={(v) => set('apellidoPaterno', v)} />
            <Field label="Apellido materno" value={form.apellidoMaterno} onChange={(v) => set('apellidoMaterno', v)} />
            <Field label="Correo electrónico" required type="email" value={form.correo} onChange={(v) => set('correo', v)} />
            <Field label="Dirección" required value={form.direccion} onChange={(v) => set('direccion', v)} />
            <Field label="Colonia" value={form.colonia} onChange={(v) => set('colonia', v)} />
            <Field label="Código postal" required value={form.cp} onChange={(v) => set('cp', v)} />
            <Field label="Ciudad" required value={form.ciudad} onChange={(v) => set('ciudad', v)} />
            <Field label="Estado" required value={form.estado} onChange={(v) => set('estado', v)} />
            <Field label="Teléfono" required type="tel" value={form.telefono} onChange={(v) => set('telefono', v)} />
          </div>

          <div className="field" style={{ marginTop: 18 }}>
            <label>Observaciones</label>
            <textarea
              rows={3}
              value={form.observaciones}
              onChange={(e) => set('observaciones', e.target.value)}
              className="inp"
            />
          </div>

          {error && (
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--accent)' }}>{error}</p>
          )}

          <div
            style={{
              marginTop: 30,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Link href="/catalogo" className="btn btn--outline">
              Seguir comprando
            </Link>
            <button type="submit" className="btn btn--wa">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.86c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({ label, required, value, onChange, type = 'text' }) {
  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inp"
      />
    </div>
  );
}
