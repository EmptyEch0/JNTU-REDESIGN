import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { DEPARTMENTS } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments — JNTU-GV CEV" },
      { name: "description", content: "Seven engineering and management departments at JNTU-GV CEV." },
      { property: "og:title", content: "Departments at JNTU-GV CEV" },
      { property: "og:description", content: "CSE, ECE, EEE, Mech, Civil, IT and MBA — meet the people and programs." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Seven departments. One academic culture."
        subtitle="Each department is led by faculty who teach with conviction, mentor with care and research with rigour."
      />
      <section className="py-24 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((d, i) => (
            <RevealOnScroll key={d.code} delay={i * 60}>
              <article className="group h-full p-7 rounded-3xl bg-card border border-border hover-lift relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                  style={{ background: "var(--primary)" }}
                />
                <div className="relative">
                  <div className="text-display text-5xl text-primary">{d.code}</div>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{d.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary story-link">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
