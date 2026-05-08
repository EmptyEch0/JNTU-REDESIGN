import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV, DEPARTMENTS } from "@/lib/site";
import { BookOpen, Download } from "lucide-react";
import img from "@/assets/library-interior.jpg";

export const Route = createFileRoute("/academics/syllabus")({
  head: () => ({
    meta: [
      { title: "Syllabus — Academics — JNTU-GV CEV" },
      { name: "description", content: "Department-wise syllabus for UG and PG programs." },
    ],
  }),
  component: SyllabusPage,
});

function SyllabusPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Syllabus"
        subtitle="Course-wise curriculum mapped to program outcomes — downloadable per department."
        image={img}
      />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((d, i) => (
            <RevealOnScroll key={d.code} delay={i * 60}>
              <div className="group p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-eyebrow mt-4">{d.code}</div>
                <h3 className="font-semibold text-ink mt-1">{d.name}</h3>
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-primary font-medium"
                >
                  <Download className="h-4 w-4" /> Syllabus (R23)
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
