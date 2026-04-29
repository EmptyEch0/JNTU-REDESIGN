import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { RECRUITERS } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/placements")({
  head: () => ({
    meta: [
      { title: "Placements — JNTU-GV CEV" },
      { name: "description", content: "Top recruiters, placement statistics and training at JNTU-GV CEV." },
      { property: "og:title", content: "Placements at JNTU-GV CEV" },
      { property: "og:description", content: "85+ recruiters. 92% placement. Top package 42 LPA." },
      { property: "og:image", content: placementsImg },
    ],
  }),
  component: PlacementsPage,
});

const SECTORS = [
  { sector: "IT Services", share: "48%" },
  { sector: "Product Companies", share: "22%" },
  { sector: "Core Engineering", share: "18%" },
  { sector: "Consulting & Analytics", share: "12%" },
];

function PlacementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Placements & Training"
        title="From classroom to career — together."
        subtitle="A dedicated training and placement cell that prepares students from the second year and partners with recruiters across India."
      />

      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          <div className="bg-card p-8"><StatCounter value={420} label="Offers / Year" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={42} label="LPA Top Package" suffix="L" /></div>
          <div className="bg-card p-8"><StatCounter value={85} label="Recruiters" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Placement %" suffix="%" /></div>
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Recruiters" title="A roster that keeps growing." align="center" /></RevealOnScroll>
          <div className="mt-12">
            <MarqueeLogos items={RECRUITERS} />
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow grid lg:grid-cols-2 gap-12 items-center">
        <RevealOnScroll>
          <img src={placementsImg} alt="Placement event" loading="lazy" className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)]" />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <div className="text-eyebrow">Sector mix</div>
          <h2 className="text-display text-3xl md:text-5xl mt-3 text-ink">Where our graduates go.</h2>
          <div className="mt-8 space-y-3">
            {SECTORS.map((s, i) => (
              <div key={s.sector} className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover-lift">
                <div>
                  <div className="text-eyebrow">{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-semibold text-ink mt-1">{s.sector}</div>
                </div>
                <div className="text-display text-3xl text-primary">{s.share}</div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
