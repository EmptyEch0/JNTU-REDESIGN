import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { GraduationCap } from "lucide-react";
import campusImg from "@/assets/campus-life.jpg";

export const Route = createFileRoute("/academics/programs")({
  head: () => ({
    meta: [
      { title: "Programs Offered — Academics — JNTU-GV CEV" },
      { name: "description", content: "Undergraduate, postgraduate and doctoral programs offered at JNTU-GV CEV." },
    ],
  }),
  component: ProgramsPage,
});

const UG = [
  { code: "CSE", name: "B.Tech Computer Science & Engineering", intake: 180 },
  { code: "ECE", name: "B.Tech Electronics & Communication", intake: 120 },
  { code: "EEE", name: "B.Tech Electrical & Electronics", intake: 60 },
  { code: "MECH", name: "B.Tech Mechanical Engineering", intake: 60 },
  { code: "CIVIL", name: "B.Tech Civil Engineering", intake: 60 },
  { code: "IT", name: "B.Tech Information Technology", intake: 60 },
];
const PG = [
  { code: "CSE", name: "M.Tech Computer Science", intake: 18 },
  { code: "VLSI", name: "M.Tech VLSI System Design", intake: 18 },
  { code: "PE", name: "M.Tech Power Electronics", intake: 18 },
  { code: "TE", name: "M.Tech Thermal Engineering", intake: 18 },
  { code: "MBA", name: "Master of Business Administration", intake: 60 },
];
const PHD = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Sciences & Humanities",
];

function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Programs Offered" subtitle="A full ladder from undergraduate to doctoral, taught by research-active faculty." image={campusImg} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="text-eyebrow">Undergraduate</div>
          <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">B.Tech — 4 years</h2>
        </RevealOnScroll>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {UG.map((p, i) => (
            <RevealOnScroll key={p.code} delay={i * 60}>
              <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="text-eyebrow">{p.code}</div>
                <h3 className="font-semibold text-ink mt-2">{p.name}</h3>
                <div className="mt-4 text-sm text-primary">Intake: {p.intake}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="text-eyebrow">Postgraduate</div>
            <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">M.Tech & MBA — 2 years</h2>
          </RevealOnScroll>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PG.map((p, i) => (
              <RevealOnScroll key={p.code} delay={i * 60}>
                <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                  <div className="text-eyebrow">{p.code}</div>
                  <h3 className="font-semibold text-ink mt-2">{p.name}</h3>
                  <div className="mt-4 text-sm text-primary">Intake: {p.intake}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="text-eyebrow">Doctoral</div>
          <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">Ph.D — Research streams</h2>
        </RevealOnScroll>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHD.map((d, i) => (
            <RevealOnScroll key={d} delay={i * 50}>
              <div className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border hover-lift">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-ink">{d}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
