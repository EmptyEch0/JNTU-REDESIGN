import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import labImg from "@/assets/lab.jpg";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProfileCard } from "@/components/ProfileCard";
import { SectionLabel } from "@/components/SectionLabel";
import { FlaskConical, Cpu, Atom, Building2 } from "lucide-react";
import { SubNav } from "@/components/SubNav";
import { RD_SUBNAV } from "@/lib/site";

export const Route = createFileRoute("/rd-cell/")({
  head: () => ({
    meta: [
      { title: "R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Research, funded projects, consultancy and the committee that drives R&D at JNTU-GV CEV." },
      { property: "og:title", content: "R&D Cell at JNTU-GV CEV" },
      { property: "og:description", content: "Funded by UGC, DST, DAE, NRB. Consultancy with industry partners." },
    ],
  }),
  component: RDPage,
});

const AREAS = [
  { icon: Cpu, title: "AI & Embedded Systems", desc: "Edge intelligence, IoT, signal processing." },
  { icon: Atom, title: "Materials & Energy", desc: "Renewable energy, advanced materials, thermal systems." },
  { icon: Building2, title: "Sustainable Infrastructure", desc: "Smart construction, geotech, water systems." },
  { icon: FlaskConical, title: "Applied Sciences", desc: "Computational chemistry, applied math, physics." },
];

const FUNDERS = ["UGC", "DST", "DAE", "NRB"];
const CONSULTANCY = [
  { name: "Supraja Technologies", desc: "Joint product engineering and embedded systems work." },
  { name: "Sarda Metals & Alloys Ltd.", desc: "Materials testing and process consultancy." },
];

const COMMITTEE = [
  { name: "Dr. Swami Naidu", role: "R&D Coordinator", detail: "Leads cell strategy and proposal review." },
  { name: "Dr. G. J. Naga Raju", role: "Member", detail: "Sciences research and grants liaison." },
  { name: "Dr. R. Rajeswara Rao", role: "Member", detail: "Engineering research and industry consultancy." },
];

function RDPage() {
  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="Research that earns its keep."
        subtitle="Funded projects, industry consultancy and a committee that turns ideas into outcomes." image={labImg}
      />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Focus areas" title="Where our research goes." /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {AREAS.map((a, i) => (
            <RevealOnScroll key={a.title} delay={i * 80}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift flex gap-5 h-full">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                  <a.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Funding agencies" title="Backed by national institutions." align="center" /></RevealOnScroll>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {FUNDERS.map((f, i) => (
              <RevealOnScroll key={f} delay={i * 60}>
                <div className="aspect-[3/2] rounded-2xl bg-card border border-border grid place-items-center hover-lift">
                  <span className="text-display text-3xl text-primary">{f}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Consultancy" title="Working with industry." /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {CONSULTANCY.map((c, i) => (
            <RevealOnScroll key={c.name} delay={i * 100}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift">
                <div className="text-eyebrow">Industry Partner</div>
                <h3 className="text-display text-2xl mt-2 text-ink">{c.name}</h3>
                <p className="mt-3 text-muted-foreground">{c.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Committee" title="People who steer the cell." align="center" /></RevealOnScroll>
          <div className="mt-12 relative">
            <div aria-hidden className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-6">
              {COMMITTEE.map((m, i) => (
                <RevealOnScroll key={m.name} delay={i * 100}>
                  <div className={`md:grid md:grid-cols-2 md:gap-12 items-center ${i % 2 ? "" : ""}`}>
                    <div className={i % 2 ? "md:order-2" : ""}>
                      <ProfileCard name={m.name} role={m.role} detail={m.detail} badge={`Member ${String(i + 1).padStart(2, "0")}`} />
                    </div>
                    <div className="hidden md:block" />
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
