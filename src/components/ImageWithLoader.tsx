import { useState, useEffect, useRef, ImgHTMLAttributes } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageWithLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  smartFit?: boolean;
  priority?: boolean;
}

// Global in-memory cache set to track already loaded image URLs across re-renders
const globalLoadedImages = new Set<string>();

/**
 * Preload an image programmatically so browser caches it early
 */
export function preloadImage(src: string) {
  if (!src || globalLoadedImages.has(src)) return;
  const img = new Image();
  img.src = src;
  img.onload = () => globalLoadedImages.add(src);
}

export function ImageWithLoader({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  aspectRatio,
  fallbackSrc = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500",
  smartFit = false,
  priority = false,
  loading,
  ...props
}: ImageWithLoaderProps) {
  const [hasError, setHasError] = useState(false);
  const displaySrc = hasError ? fallbackSrc : src;

  const [isLoaded, setIsLoaded] = useState(() => globalLoadedImages.has(displaySrc));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (globalLoadedImages.has(displaySrc)) {
      setIsLoaded(true);
      return;
    }

    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        globalLoadedImages.add(displaySrc);
        setIsLoaded(true);
      } else {
        setHasError(true);
        setIsLoaded(true);
      }
    }
  }, [displaySrc]);

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 ${wrapperClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading Skeleton & Spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <ImageIcon className="h-4 w-4 opacity-60" />
          </div>
        </div>
      )}

      {/* Smart Ambient Blurred Backdrop for non-standard aspect ratios */}
      {smartFit && isLoaded && (
        <img
          src={displaySrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-40 brightness-75 pointer-events-none select-none"
        />
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : loading || "lazy"}
        // @ts-expect-error - fetchPriority is supported in modern browsers
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => {
          globalLoadedImages.add(displaySrc);
          setIsLoaded(true);
        }}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`relative z-10 transition-opacity duration-300 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${smartFit ? "w-full h-full object-contain p-1" : className}`}
        {...props}
      />
    </div>
  );
}

