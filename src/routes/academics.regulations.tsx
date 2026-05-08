import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { FileText } from "lucide-react";
import img from "@/assets/library-interior.jpg";

export const Route = createFileRoute("/academics/regulations")({
  head: () => ({
    meta: [
      { title: "Academic Regulations — JNTU-GV CEV" },
      {
        name: "description",
        content: "Academic regulations: R20, R23 frameworks for UG and PG programs.",
      },
    ],
  }),
  component: RegulationsPage,
});

const REGS = [
  {
    code: "R23",
    scope: "B.Tech 2023 onwards",
    desc: "Outcome-based curriculum with reduced credit load and stronger industry electives.",
  },
  {
    code: "R20",
    scope: "B.Tech 2020-2022 batches",
    desc: "CBCS framework with mandatory courses, open electives and skill-oriented courses.",
  },
  {
    code: "R23 PG",
    scope: "M.Tech / MBA 2023 onwards",
    desc: "Project-heavy curriculum with two-semester capstone.",
  },
  {
    code: "Ph.D 2019",
    scope: "Doctoral program",
    desc: "Coursework + comprehensive viva + thesis with periodic DC reviews.",
  },
];

function RegulationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Academic Regulations"
        subtitle="The rules that shape every program — published, transparent, and student-first."
        image={img}
      />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid md:grid-cols-2 gap-5">
          {REGS.map((r, i) => (
            <RevealOnScroll key={r.code} delay={i * 80}>
              <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-display text-2xl text-ink">{r.code}</h3>
                </div>
                <div className="text-eyebrow mt-3">{r.scope}</div>
                <p className="mt-2 text-muted-foreground">{r.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
