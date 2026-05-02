import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { Award } from "lucide-react";
import img from "@/assets/campus-life.jpg";

export const Route = createFileRoute("/academics/scholarships")({
  head: () => ({
    meta: [
      { title: "Scholarships — Academics — JNTU-GV CEV" },
      { name: "description", content: "Government and institutional scholarships available to students at JNTU-GV CEV." },
    ],
  }),
  component: ScholarshipsPage,
});

const ITEMS = [
  { name: "Jagananna Vidya Deevena", who: "Eligible SC, ST, BC, Minority and EBC students", covers: "Full tuition fee reimbursement" },
  { name: "Jagananna Vasathi Deevena", who: "Same eligibility as JVD", covers: "Hostel & maintenance allowance" },
  { name: "Post Matric Scholarship (Govt. of India)", who: "SC/ST students", covers: "Tuition + maintenance" },
  { name: "Merit Scholarships", who: "Top 5% rank holders", covers: "Annual cash award" },
  { name: "Sports Scholarships", who: "State / National level athletes", covers: "Tuition concession" },
];

function ScholarshipsPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Scholarships" subtitle="Financial support so that talent — not tuition — decides who studies here." image={img} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid md:grid-cols-2 gap-5">
          {ITEMS.map((s, i) => (
            <RevealOnScroll key={s.name} delay={i * 70}>
              <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h3 className="text-display text-xl text-ink">{s.name}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground"><strong className="text-ink">Eligibility:</strong> {s.who}</p>
                <p className="mt-1 text-sm text-muted-foreground"><strong className="text-ink">Covers:</strong> {s.covers}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
