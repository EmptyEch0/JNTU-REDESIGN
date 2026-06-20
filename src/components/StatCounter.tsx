import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ value, label, suffix = "", duration = 1600 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setCount(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.disconnect(); // stop observing after triggering animation
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="group">
      <div className="text-display text-5xl md:text-6xl text-primary tabular-nums">
        {count.toLocaleString()}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  );
}
