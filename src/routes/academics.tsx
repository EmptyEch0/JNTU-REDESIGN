import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ArrowRight, BookOpen, Calendar, FileCheck2, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics — JNTU-GV CEV" },
      { name: "description", content: "Programs, curriculum, calendar and examinations at JNTU-GV CEV." },
      { property: "og:title", content: "Academics at JNTU-GV CEV" },
      { property: "og:description", content: "UG, PG and doctoral programs across seven engineering disciplines." },
    ],
  }),
  component: AcademicsPage,
});

const PROGRAMS = [
  { tier: "Undergraduate", title: "B.Tech", desc: "Four-year engineering programs across CSE, ECE, EEE, Mech, Civil, IT.", years: "4 years" },
  { tier: "Postgraduate", title: "M.Tech / MBA", desc: "Specialised master's tracks led by research-active faculty.", years: "2 years" },
  { tier: "Doctoral", title: "Ph.D", desc: "Research streams in core and interdisciplinary areas.", years: "3-5 years" },
];

const PILLARS = [
  { icon: BookOpen, title: "Outcome-Based Curriculum", desc: "Every course maps to measurable program outcomes." },
  { icon: Calendar, title: "Structured Calendar", desc: "Predictable semesters, mid-terms and end-of-term reviews." },
  { icon: FileCheck2, title: "Transparent Examinations", desc: "JNTU-GV evaluation framework with internal & external review." },
  { icon: GraduationCap, title: "Mentorship First", desc: "Every student is assigned a faculty mentor across years." },
];

function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="A program built around what graduates actually need."
        subtitle="From foundational sciences to capstone industry projects, our curriculum is designed for depth, hands-on practice and lifelong learning."
      />

      <section className="py-24 container-narrow">
        <div className="grid md:grid-cols-3 gap-5">
          {PROGRAMS.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 100}>
              <div className="group h-full p-8 rounded-3xl bg-card border border-border hover-lift relative overflow-hidden">
                <div className="text-eyebrow">{p.tier}</div>
                <h3 className="text-display text-3xl mt-3 text-ink">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <div className="mt-6 text-sm font-medium text-primary">{p.years}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-24 bg-sand">
        <div className="container-narrow grid md:grid-cols-2 gap-5">
          {PILLARS.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 80}>
              <div className="flex gap-5 p-7 rounded-2xl bg-card border border-border hover-lift">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-display text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-24 container-narrow text-center">
        <Link to="/departments" className="btn-primary">Explore departments <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </>
  );
}
