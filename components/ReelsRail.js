// Tira horizontal de piezas verticales (9:16), como los reels del diseño.
export default function ReelsRail({ images = [], href }) {
  return (
    <div className="tl-ig__rail tl-scroll" data-stagger>
      {images.map((src, i) => (
        <a
          key={i}
          className="reveal"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver en Instagram"
        >
          <div className="tl-ig__tile">
            <img src={src} alt="" loading="lazy" />
          </div>
        </a>
      ))}
    </div>
  );
}
