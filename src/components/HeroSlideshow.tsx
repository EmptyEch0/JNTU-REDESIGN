import { useEffect, useState, type ReactNode } from "react";

interface Props {
  images: { src: string; alt: string }[];
  interval?: number; // ms
  overlay?: string;
  minHeight?: string;
  children?: ReactNode;
}

export function HeroSlideshow({
  images,
  interval = 6000,
  overlay,
  minHeight = "100svh",
  children,
}: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="relative overflow-hidden" style={{ minHeight }}>
      {/* Layered images crossfade */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out will-change-[opacity,transform]"
            style={{
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1.05)" : "scale(1)",
              transitionProperty: "opacity, transform",
              transitionDuration: i === active ? "1500ms, 7000ms" : "1500ms, 0ms",
            }}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        ))}
      </div>

      {overlay && <div className="absolute inset-0 pointer-events-none" style={{ background: overlay }} />}

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
