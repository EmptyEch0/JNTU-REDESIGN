import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV, DEPARTMENTS } from "@/lib/site";
import { Calendar, Download } from "lucide-react";
import img from "@/assets/library-interior.jpg";

export const Route = createFileRoute("/academics/time-tables")({
  head: () => ({
    meta: [
      { title: "Time Tables — Academics — JNTU-GV CEV" },
      { name: "description", content: "Latest class time tables for all departments and semesters." },
    ],
  }),
  component: TimeTablesPage,
});

const SEMS = ["I Year", "II Year", "III Year", "IV Year"];

function TimeTablesPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Time Tables" subtitle="Latest class schedules — by department and year." image={img} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow space-y-12">
        {DEPARTMENTS.slice(0, 6).map((d, di) => (
          <RevealOnScroll key={d.code} delay={di * 60}>
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-display text-2xl md:text-3xl text-ink">{d.name}</h3>
                <span className="text-eyebrow">{d.code}</span>
              </div>
              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SEMS.map((s) => (
                  <a key={s} href="#" className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover-lift">
                    <span className="flex items-center gap-2 text-ink"><Calendar className="h-4 w-4 text-primary" />{s}</span>
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}
