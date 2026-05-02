import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import img from "@/assets/campus-life.jpg";

export const Route = createFileRoute("/academics/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — Academics — JNTU-GV CEV" },
      { name: "description", content: "Admission process for B.Tech, M.Tech, MBA and Ph.D at JNTU-GV CEV." },
    ],
  }),
  component: AdmissionsPage,
});

const STREAMS = [
  { name: "B.Tech", entry: "AP EAPCET / JEE Main", through: "APSCHE counselling" },
  { name: "M.Tech", entry: "GATE / AP PGECET", through: "APSCHE counselling" },
  { name: "MBA", entry: "AP ICET", through: "APSCHE counselling" },
  { name: "Ph.D", entry: "JNTU-GV Research Entrance Test", through: "Direct application" },
];

const STEPS = [
  "Qualify the relevant entrance examination",
  "Register for APSCHE / JNTU-GV counselling",
  "Web options & seat allotment",
  "Online fee payment & document verification",
  "Report at the college on the notified date",
];

function AdmissionsPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Admissions" subtitle="A clear, counselling-based admission process aligned with APSCHE and JNTU-GV norms." image={img} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow grid lg:grid-cols-2 gap-10">
        <RevealOnScroll>
          <div className="text-eyebrow">Entry routes</div>
          <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">How to join us</h2>
          <div className="mt-8 space-y-3">
            {STREAMS.map((s) => (
              <div key={s.name} className="p-5 rounded-2xl bg-card border border-border hover-lift">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-ink">{s.name}</h3>
                  <span className="text-sm text-primary">{s.through}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Entry: {s.entry}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={120}>
          <div className="text-eyebrow">Step by step</div>
          <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">The process</h2>
          <ol className="mt-8 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-4 p-4 rounded-xl bg-card border border-border hover-lift">
                <div className="h-8 w-8 rounded-lg bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0 font-semibold">{i + 1}</div>
                <span className="text-ink">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link to="/contact" className="btn-primary">Talk to admissions <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
