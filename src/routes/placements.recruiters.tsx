import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV, RECRUITERS, RECRUITERS_2017_18 } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/placements/recruiters")({
  head: () => ({
    meta: [
      { title: "Our Recruiters — Placements — JNTU-GV CEV" },
      { name: "description", content: "Companies that recruit from JNTU-GV CEV." },
    ],
  }),
  component: RecruitersPage,
});

const TIERS = [
  { tier: "Tier 1 — Product & MNCs", logos: ["Amazon", "TCS", "Wipro", "Hyundai", "L&T", "Cyient", "Deloitte"] },
  { tier: "Tier 2 — Services & Consulting", logos: ["Infosys", "Cognizant", "Accenture", "Capgemini", "Tech Mahindra", "HCL", "Mphasis"] },
  { tier: "Core & Embedded", logos: ["SoCtronics", "Medha", "Efftronics", "Apps Associates", "Nalsoft"] },
  { tier: "Software & Innovation", logos: ["Miracle Software", "Grey Campus", "Cerium", "Zebi", "Sail Software Solutions"] },
];

function RecruitersPage() {
  return (
    <>
      <PageHero eyebrow="Placements" title="Our Recruiters" subtitle="A growing network of product, services, core engineering and consulting employers." image={placementsImg} />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-16 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="On campus" title="Recruiters that visit every year" align="center" />
        </RevealOnScroll>
        <div className="mt-10">
          <MarqueeLogos items={RECRUITERS} />
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow space-y-10">
          {TIERS.map((t, i) => (
            <RevealOnScroll key={t.tier} delay={i * 80}>
              <div>
                <div className="text-eyebrow">{t.tier}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {t.logos.map((l) => (
                    <span key={l} className="px-5 py-3 rounded-xl bg-card border border-border text-ink font-medium hover:border-primary/50 hover:-translate-y-0.5 transition-all">{l}</span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-16 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Archive" title="Companies visited in 2017-18" />
        </RevealOnScroll>
        <div className="mt-8 flex flex-wrap gap-2">
          {RECRUITERS_2017_18.map((r) => (
            <span key={r} className="px-4 py-2 rounded-full bg-card border border-border text-sm text-ink">{r}</span>
          ))}
        </div>
      </section>
    </>
  );
}
