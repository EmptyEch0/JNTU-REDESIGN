import { useEffect, useState } from "react";
import { getAssetUrl } from "@/lib/assets";

interface Props {
  images: string[];
  fallback: string;
}

export function ImageCarousel({ images, fallback }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoplay, images]);

  useEffect(() => {
    setVisited((prev) => {
      if (prev[currentIndex]) return prev;
      return { ...prev, [currentIndex]: true };
    });
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[21/9] md:aspect-[16/6] min-h-[180px] md:min-h-[240px] max-h-[280px] md:max-h-[340px] w-full bg-slate-200 flex items-center justify-center overflow-hidden">
        <img src={fallback} className="w-full h-full object-cover opacity-90" alt="Fallback" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div 
      className="relative aspect-[21/9] md:aspect-[16/6] min-h-[180px] md:min-h-[240px] max-h-[280px] md:max-h-[340px] w-full bg-slate-900 overflow-hidden group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="w-full h-full relative">
        {images.map((img: string, i: number) => {
          if (!visited[i]) return null;
          return (
            <img
              key={i}
              src={getAssetUrl(img)}
              alt={`Slide view ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${currentIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              onError={(e) => { e.currentTarget.src = fallback; }}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-20" />
      {images.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentIndex((p) => (p - 1 + images.length) % images.length)} 
            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow cursor-pointer z-30 text-center grid place-items-center transition"
          >
            ‹
          </button>
          <button 
            onClick={() => setCurrentIndex((p) => (p + 1) % images.length)} 
            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow cursor-pointer z-30 text-center grid place-items-center transition"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-black/10 px-3 py-1 rounded-full z-30">
            {images.map((_: any, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)} 
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
