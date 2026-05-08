interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionLabel({ eyebrow, title, subtitle, align = "left", light }: Props) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <div className={`text-eyebrow ${light ? "!text-white/70" : ""}`}>{eyebrow}</div>}
      <h2 className={`text-display text-3xl md:text-5xl mt-3 ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg ${light ? "text-white/75" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
