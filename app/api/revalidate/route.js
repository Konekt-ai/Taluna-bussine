import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// =====================================================================
//  Refresco inmediato del catálogo.
//  El Organizador llama aquí cada vez que se guarda algo, para que el
//  cambio (una foto nueva, un precio) se vea al momento en la tienda y
//  no haya que esperar el refresco automático de cada minuto.
//
//  Se protege con REVALIDATE_SECRET (la misma que se pone en el
//  Organizador como STORE_REVALIDATE_SECRET). Si no está configurada,
//  la ruta queda desactivada y no pasa nada: la tienda se sigue
//  actualizando sola cada minuto.
// =====================================================================

export const dynamic = 'force-dynamic';

const PATHS = ['/', '/catalogo', '/producto/[slug]'];

function handle(request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'no-configurado' }, { status: 501 });
  }

  const url = new URL(request.url);
  const given = url.searchParams.get('secret') || request.headers.get('x-revalidate-secret');
  if (given !== expected) {
    return NextResponse.json({ error: 'secreto-invalido' }, { status: 401 });
  }

  for (const path of PATHS) revalidatePath(path, 'page');
  return NextResponse.json({ ok: true, revalidated: PATHS });
}

export async function POST(request) {
  return handle(request);
}

// GET permitido para poder probarlo desde el navegador.
export async function GET(request) {
  return handle(request);
}
