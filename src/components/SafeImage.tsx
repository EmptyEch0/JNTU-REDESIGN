import { useState, ImgHTMLAttributes } from "react";
import { getAssetUrl } from "@/lib/assets";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  fallbackName?: string;
  fallbackSrc?: string;
}

export function SafeImage({ src, fallbackName, fallbackSrc, alt, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Generate UI Avatar based on name if no specific fallback image is provided
  const nameForAvatar = fallbackName || alt || "User";
  const defaultPlaceholder = fallbackSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=2563EB&color=fff&bold=true&size=128`;

  // Resolve the primary URL. If missing or errored, use placeholder.
  let finalSrc = defaultPlaceholder;
  if (src && !hasError) {
    const resolved = getAssetUrl(src);
    if (resolved) {
      finalSrc = resolved;
    }
  }

  return (
    <img
      src={finalSrc}
      alt={alt || fallbackName}
      onError={(e) => {
        setHasError(true);
        // Fallback directly on element to prevent infinite loops if standard fallback also fails
        if (e.currentTarget.src !== defaultPlaceholder) {
          e.currentTarget.src = defaultPlaceholder;
        }
      }}
      {...props}
    />
  );
}
