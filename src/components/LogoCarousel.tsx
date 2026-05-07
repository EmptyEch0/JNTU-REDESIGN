interface Logo {
  name: string;
  url: string;
}

interface Props {
  logos: Logo[];
  speed?: number; // seconds per loop
  reverse?: boolean;
}

export function LogoCarousel({ logos, speed = 60, reverse = false }: Props) {
  const doubled = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex w-max gap-6"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            title={logo.name}
            className="shrink-0 w-44 h-24 rounded-2xl bg-card border border-border flex items-center justify-center p-4 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={logo.url}
              alt={logo.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                const fallback = document.createElement("span");
                fallback.textContent = logo.name;
                fallback.className = "text-ink text-sm font-medium text-center";
                t.parentElement?.appendChild(fallback);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
