import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { DEPARTMENTS } from "@/lib/site";
import { ArrowRight, Cpu, Radio, Zap, Cog, Building, Network, Briefcase } from "lucide-react";
import labImg from "@/assets/lab.jpg";

const ICONS = {
  CSE: Cpu,
  ECE: Radio,
  EEE: Zap,
  MECH: Cog,
  CIVIL: Building,
  IT: Network,
  MBA: Briefcase,
} as const;

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
        image={labImg}
      />
      <section className="py-24 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((d, i) => {
            const Icon = ICONS[d.code as keyof typeof ICONS] ?? Cpu;
            return (
              <RevealOnScroll key={d.code} delay={i * 60}>
                <article className="group h-full rounded-3xl bg-card border border-border hover-lift relative overflow-hidden">
                  {/* Cover */}
                  <div className={`relative h-40 bg-gradient-to-br ${d.accent} overflow-hidden`}>
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-25 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 30%, white, transparent 55%), radial-gradient(circle at 70% 70%, white, transparent 50%)",
                      }}
                    />
                    <div aria-hidden className="absolute inset-0 opacity-[0.12]" style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }} />
                    <div className="absolute inset-0 p-6 flex items-start justify-between text-white">
                      <div className="text-display text-4xl font-semibold opacity-95">{d.code}</div>
                      <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-md grid place-items-center group-hover:bg-white group-hover:text-primary transition-all duration-500">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink">{d.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>

                    <div className="mt-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                      <span><span className="text-primary font-semibold">B.Tech</span> · UG</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span><span className="text-primary font-semibold">M.Tech</span> · PG</span>
                    </div>

                    <Link to="/departments" className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary story-link">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>
    </>
  );
}
