'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/lib/products';

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
      <div className="shell py-16 text-center text-muted">Cargando carrito…</div>
    );
  }

  // Carrito vacío.
  if (items.length === 0) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Tu carrito está vacío</h1>
        <p className="mt-3 text-muted">Aún no has agregado ninguna pieza.</p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-full bg-wine px-6 py-3 text-cream transition-colors hover:bg-wineSoft"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-line bg-sand px-4 py-3 text-ink placeholder:text-muted focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';

  return (
    <div className="shell py-10">
      <h1 className="font-display text-4xl text-ink">Resumen de carrito</h1>

      {/* Lista de productos */}
      <div className="mt-8 overflow-hidden rounded-card border border-line">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-line bg-sand px-5 py-3 text-xs uppercase tracking-wide text-muted sm:grid">
          <span>Producto</span>
          <span className="text-center">Cantidad</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        {items.map((item) => (
          <div
            key={item.slug}
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto]"
          >
            {/* Producto */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-cream">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <Link
                  href={`/producto/${item.slug}`}
                  className="font-display text-lg leading-tight text-ink hover:text-wine"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted">{formatPrice(item.price, item.currency)} c/u</p>
              </div>
            </div>

            {/* Cantidad */}
            <div className="col-start-1 row-start-2 flex items-center gap-2 sm:col-start-auto sm:row-start-auto sm:justify-center">
              <button
                onClick={() => updateQty(item.slug, item.qty - 1)}
                aria-label="Quitar uno"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-sand"
              >
                −
              </button>
              <span className="w-8 text-center text-ink">{item.qty}</span>
              <button
                onClick={() => updateQty(item.slug, item.qty + 1)}
                aria-label="Agregar uno"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-sand"
              >
                +
              </button>
            </div>

            {/* Total línea */}
            <span className="row-start-1 text-right font-medium text-wine sm:row-start-auto">
              {formatPrice(item.price * item.qty, item.currency)}
            </span>

            {/* Eliminar */}
            <button
              onClick={() => removeItem(item.slug)}
              aria-label={`Eliminar ${item.name}`}
              className="justify-self-end text-muted transition-colors hover:text-wine"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="mt-6 flex flex-col items-end gap-1 text-sm">
        <div className="flex w-full max-w-xs justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between">
          <span className="text-muted">Envío</span>
          <span className="text-ink">Se cotiza por WhatsApp</span>
        </div>
        <div className="mt-2 flex w-full max-w-xs justify-between border-t border-line pt-2 text-base">
          <span className="font-medium text-ink">Total</span>
          <span className="font-medium text-wine">{formatPrice(subtotal)} + envío</span>
        </div>
        <button
          onClick={clear}
          className="mt-2 text-xs text-muted underline-offset-4 hover:text-wine hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Datos de compra */}
      <form onSubmit={handleSubmit} className="mt-12">
        <h2 className="font-display text-2xl text-ink">Datos de compra</h2>
        <p className="mt-1 text-sm text-muted">
          Completa tus datos y enviaremos el pedido por WhatsApp para confirmar envío y pago.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre(s)" required value={form.nombre} onChange={(v) => set('nombre', v)} className={inputClass} />
          <Field label="Apellido Paterno" required value={form.apellidoPaterno} onChange={(v) => set('apellidoPaterno', v)} className={inputClass} />
          <Field label="Apellido Materno" value={form.apellidoMaterno} onChange={(v) => set('apellidoMaterno', v)} className={inputClass} />
          <Field label="Correo electrónico" required type="email" value={form.correo} onChange={(v) => set('correo', v)} className={inputClass} />
          <Field label="Dirección" required value={form.direccion} onChange={(v) => set('direccion', v)} className={inputClass} />
          <Field label="Colonia" value={form.colonia} onChange={(v) => set('colonia', v)} className={inputClass} />
          <Field label="Código Postal" required value={form.cp} onChange={(v) => set('cp', v)} className={inputClass} />
          <Field label="Ciudad" required value={form.ciudad} onChange={(v) => set('ciudad', v)} className={inputClass} />
          <Field label="Estado" required value={form.estado} onChange={(v) => set('estado', v)} className={inputClass} />
          <Field label="Teléfono" required type="tel" value={form.telefono} onChange={(v) => set('telefono', v)} className={inputClass} />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-muted">Observaciones</label>
            <textarea
              rows={3}
              value={form.observaciones}
              onChange={(e) => set('observaciones', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-wine">{error}</p>}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-ink transition-colors hover:bg-sand"
          >
            ← Continuar comprando
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-cream transition-transform hover:scale-[1.02]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.86c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, value, onChange, type = 'text', className }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">
        {label} {required && <span className="text-wine">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
}
