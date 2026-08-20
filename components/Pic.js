// =====================================================================
//  FOTO QUE RECONOCE EL DISPOSITIVO
//  Si la dueña subió una versión "para celular" de la foto, el navegador
//  la usa en pantallas chicas y la normal en tablet y computadora. Lo
//  decide el propio navegador con <picture>, antes de pintar: no hay
//  parpadeo ni se descargan las dos.
//
//  El corte (la relación de aspecto) lo pone el marco con las variables
//  --ar-* de app/globals.css, que también cambian por dispositivo.
// =====================================================================

const MOBILE = '(max-width: 640px)';

export default function Pic({
  src,
  mobile,
  alt = '',
  className,
  priority = false,
  sizes,
  fallback = null,
}) {
  if (!src && !mobile) return fallback;

  const img = (
    <img
      className={className}
      src={src || mobile}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' } : {})}
      {...(sizes ? { sizes } : {})}
    />
  );

  // Sin versión de celular no hace falta envolver nada.
  if (!mobile || !src) return img;

  return (
    <picture>
      <source media={MOBILE} srcSet={mobile} />
      {img}
    </picture>
  );
}
