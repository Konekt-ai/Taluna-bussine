'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

// =====================================================================
//  CARRITO · datos de envío
//  El pedido se cierra por WhatsApp, que es como vende Taluna.
// =====================================================================

const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5213331292868';

function precio(v, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(v || 0);
}

const EMPTY = {
  nombre: '', apellidoPaterno: '', apellidoMaterno: '', correo: '',
  direccion: '', colonia: '', cp: '', ciudad: '', estado: '', telefono: '', observaciones: '',
};

const REQUIRED = ['nombre', 'apellidoPaterno', 'correo', 'direccion', 'cp', 'ciudad', 'estado', 'telefono'];

export default function CarritoPage() {
  const { items, updateQty, removeItem, clear, subtotal, loaded } = useCart();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function mensaje() {
    const lineas = items.map(
      (i) => `• ${i.qty}x ${i.name}${i.detalle ? ` (${i.detalle})` : ''} — ${precio(i.price * i.qty, i.currency)}`
    );
    const nombre = [form.nombre, form.apellidoPaterno, form.apellidoMaterno].filter(Boolean).join(' ');
    return (
      `Hola Taluna! 🛍️ Quiero hacer este pedido:\n\n${lineas.join('\n')}\n\n` +
      `Subtotal: ${precio(subtotal)}\nEnvío: por confirmar\n\n— Mis datos —\n` +
      `Nombre: ${nombre}\nCorreo: ${form.correo}\nTeléfono: ${form.telefono}\n` +
      `Dirección: ${form.direccion}${form.colonia ? `, Col. ${form.colonia}` : ''}, CP ${form.cp}\n` +
      `Ciudad: ${form.ciudad}, ${form.estado}` +
      (form.observaciones ? `\nObservaciones: ${form.observaciones}` : '')
    );
  }

  function enviar(e) {
    e.preventDefault();
    if (!items.length) return;
    const faltan = REQUIRED.filter((k) => !form[k].trim());
    if (faltan.length) {
      setError('Por favor completa los campos marcados con *.');
      return;
    }
    setError('');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(mensaje())}`, '_blank', 'noopener,noreferrer');
  }

  if (!loaded) {
    return (
      <>
        <div className="tl-space" />
        <p className="tl-empty">Cargando tu carrito…</p>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <div className="tl-space" />
        <div className="tl-cfg__head" style={{ padding: '30px 22px 60px' }}>
          <p className="tl-kicker">Tu carrito</p>
          <h2 className="tl-h2" style={{ fontSize: 28, margin: '0 0 12px' }}>
            Todavía está vacío
          </h2>
          <p style={{ marginBottom: 26 }}>Aún no has agregado ninguna pieza.</p>
          <Link href="/arma-tu-taluna" className="tl-btn tl-btn--dark">
            Arma tu Taluna
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tl-space" />
      <div className="tl-cart">
        <h1>Resumen del pedido</h1>

        {items.map((item) => (
          <div className="tl-cartline" key={item.id}>
            <div className="tl-cartline__img">
              {item.image ? <img src={item.image} alt="" /> : <span className="tl-ph">{item.name}</span>}
            </div>
            <div>
              <p className="tl-dwline__kind">{item.kind}</p>
              <Link href={`/producto/${item.slug}`} className="tl-dwline__name" style={{ display: 'block' }}>
                {item.name}
              </Link>
              {item.detalle && <p className="tl-dwline__meta">{item.detalle}</p>}
              <p className="tl-dwline__price">{precio(item.price, item.currency)} c/u</p>

              <div className="tl-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Quitar uno">−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Agregar uno">+</button>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ border: 'none', width: 'auto', padding: '0 10px', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tl-soft)' }}
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="tl-totals">
          <div>
            <span>Subtotal</span>
            <span>{precio(subtotal)}</span>
          </div>
          <div>
            <span>Envío</span>
            <span>Se cotiza por WhatsApp</span>
          </div>
          <div className="big">
            <span>Total</span>
            <span>{precio(subtotal)} + envío</span>
          </div>
          <button
            onClick={clear}
            style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tl-soft)', textAlign: 'left' }}
          >
            Vaciar el carrito
          </button>
        </div>

        <form onSubmit={enviar} style={{ marginTop: 40 }}>
          <p className="tl-kicker">Casi listo</p>
          <h2 className="tl-h2" style={{ fontSize: 24, margin: '10px 0 8px' }}>
            Tus datos de envío
          </h2>
          <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: 'var(--tl-muted)' }}>
            Completa tus datos y enviamos el pedido por WhatsApp para confirmar envío y pago.
          </p>

          {[
            ['nombre', 'Nombre(s)', true],
            ['apellidoPaterno', 'Apellido paterno', true],
            ['apellidoMaterno', 'Apellido materno', false],
            ['correo', 'Correo electrónico', true, 'email'],
            ['direccion', 'Dirección', true],
            ['colonia', 'Colonia', false],
            ['cp', 'Código postal', true],
            ['ciudad', 'Ciudad', true],
            ['estado', 'Estado', true],
            ['telefono', 'Teléfono', true, 'tel'],
          ].map(([k, label, req, type]) => (
            <div className="tl-field" key={k}>
              <label htmlFor={k}>
                {label} {req && <span style={{ color: 'var(--tl-accent)' }}>*</span>}
              </label>
              <input
                id={k}
                className="tl-input"
                type={type || 'text'}
                value={form[k]}
                onChange={(e) => set(k, e.target.value)}
              />
            </div>
          ))}

          <div className="tl-field">
            <label htmlFor="obs">Observaciones</label>
            <textarea
              id="obs"
              className="tl-input"
              rows={3}
              value={form.observaciones}
              onChange={(e) => set('observaciones', e.target.value)}
            />
          </div>

          {error && <p style={{ margin: '4px 0 14px', fontSize: 13, color: '#B5544E' }}>{error}</p>}

          <button type="submit" className="tl-btn tl-btn--dark tl-btn--block" style={{ marginTop: 8 }}>
            Enviar pedido por WhatsApp
          </button>
          <Link href="/catalogo" className="tl-btn tl-btn--outline tl-btn--block" style={{ marginTop: 10 }}>
            Seguir comprando
          </Link>
        </form>
      </div>
    </>
  );
}
