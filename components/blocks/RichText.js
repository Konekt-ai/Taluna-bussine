import { Fragment } from 'react';

// Convierte el texto que escribe la dueña en el Organizador:
//   · un salto de línea  -> renglón nuevo
//   · *entre asteriscos* -> cursiva de adorno (el acento de la marca)
// Nunca se interpreta HTML: lo que escriba es texto y nada más.
export default function RichText({ text }) {
  const lines = String(text ?? '').split('\n');

  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/\*([^*]+)\*/g).map((part, pi) =>
            pi % 2 ? <em key={pi}>{part}</em> : <Fragment key={pi}>{part}</Fragment>
          )}
        </Fragment>
      ))}
    </>
  );
}

// Misma idea pero devolviendo texto plano (para <title>, alt, etc.)
export function plainText(text) {
  return String(text ?? '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ')
    .trim();
}
