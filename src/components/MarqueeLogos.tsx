interface Props {
  items: string[];
}

export function MarqueeLogos({ items }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track gap-8">
        {doubled.map((label, i) => (
          <div
            key={i}
            className="shrink-0 px-8 py-4 rounded-xl bg-card border border-border text-ink font-display text-xl tracking-tight hover:border-primary/40 hover:shadow-[var(--shadow-card)] transition-all"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
