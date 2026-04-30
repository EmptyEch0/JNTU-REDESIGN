import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  image?: string;
}

export function PageHero({ eyebrow, title, subtitle, children, image }: Props) {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-royal)]" />
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
          loading="eager"
        />
      )}
      <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
      <div
        aria-hidden
        className="absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="container-narrow relative z-10 text-white">
        <div className="mb-5 animate-[fade-up_0.6s_ease-out]"><Breadcrumbs /></div>
        {eyebrow && (
          <div className="text-eyebrow !text-white/70 mb-3 animate-[fade-up_0.6s_ease-out_0.1s_both]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-display text-4xl md:text-6xl max-w-4xl animate-[fade-up_0.7s_ease-out_0.15s_both]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl animate-[fade-up_0.7s_ease-out_0.25s_both]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 animate-[fade-up_0.7s_ease-out_0.35s_both]">{children}</div>}
      </div>
    </section>
  );
}
