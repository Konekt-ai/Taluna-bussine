'use client';

import { useState } from 'react';
import Image from 'next/image';

// =====================================================================
//  GALERÍA DE LA FICHA DE PRODUCTO
//  Foto grande arriba y las miniaturas debajo, como en el diseño.
//  Las fotos son las que la dueña subió en el Organizador.
// =====================================================================

export default function ProductGallery({ images = [], name }) {
  const [i, setI] = useState(0);
  const shots = images.filter((im) => im?.url);

  if (!shots.length) {
    return (
      <div className="pdp__gallery">
        <div className="pdp__main">
          <div className="imgph">Foto próximamente</div>
        </div>
      </div>
    );
  }

  const active = shots[Math.min(i, shots.length - 1)];

  return (
    <div className="pdp__gallery">
      <div className="pdp__main">
        <Image
          src={active.url}
          alt={active.alt || name}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
          priority
        />
      </div>

      {shots.length > 1 && (
        <div className="pdp__thumbs">
          {shots.map((im, idx) => (
            <button
              key={im.url}
              className={`pdp__thumb${idx === i ? ' on' : ''}`}
              onClick={() => setI(idx)}
              aria-label={`Ver foto ${idx + 1} de ${name}`}
              aria-pressed={idx === i}
            >
              <img src={im.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
