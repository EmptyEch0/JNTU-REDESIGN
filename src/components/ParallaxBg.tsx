import { useEffect, useRef, type CSSProperties } from "react";

interface Props {
  src: string;
  alt?: string;
  speed?: number; // 0.1 - 0.5 recommended
  className?: string;
  overlay?: string; // CSS gradient/color
  children?: React.ReactNode;
  minHeight?: string;
}

export function ParallaxBg({
  src,
  alt = "",
  speed = 0.3,
  className = "",
  overlay,
  children,
  minHeight = "70vh",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const c = containerRef.current;
        const img = imgRef.current;
        if (!c || !img) return;
        const rect = c.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        img.style.transform = `translate3d(0, ${center * -speed}px, 0) scale(1.15)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight } as CSSProperties}
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
