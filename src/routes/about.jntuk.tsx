import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, ExternalLink, School, MapPin, Building2, Users } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";

export const Route = createFileRoute("/about/jntuk")({
  head: () => ({
    meta: [
      { title: "About JNTUK — JNTU-GV CEV" },
      { name: "description", content: "Jawaharlal Nehru Technological University Kakinada – the parent university of JNTU-GV CEV, established in 1946." },
      { property: "og:title", content: "About JNTUK" },
      { property: "og:description", content: "History and legacy of JNTUK since 1946." },
    ],
  }),
  component: JntukPage,
});

const FACTS = [
  { icon: School, title: "Est. 1946", desc: "Originally 'The College of Engineering – Vizagapatnam'" },
  { icon: MapPin, title: "110 Acres", desc: "Sprawling campus in the port city of Kakinada" },
  { icon: Building2, title: "2 Constituent Colleges", desc: "UCEK (Autonomous) Kakinada & UCEV Vizianagaram" },
  { icon: Users, title: "268 Affiliated Colleges", desc: "Under the jurisdiction of 8 districts" },
];

function JntukPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Jawaharlal Nehru Technological University Kakinada"
        subtitle="The parent university — a legacy of engineering education since 1946."
        image={campusImg}
      />

      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto">
            <div className="text-eyebrow">History</div>
            <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">From a single college to a multi-campus university</h2>
            <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Jawaharlal Nehru Technological University Kakinada (JNTUK) was initially incepted with the name "The College of Engineering – Vizagapatnam" in 1946. The university grew out of that college.
              </p>
              <p>
                Spread over a sprawling campus of 110 acres in the port city of Kakinada, the college became a constituent unit of JNTU Hyderabad in 1972. Subject to the bifurcation of JNTU, it was notified as JNTUK by the act of legislature in 2008 as a separate university.
              </p>
              <p>
                JNTUK has two constituent colleges under its fold: University College of Engineering (Autonomous) Kakinada and University College of Engineering Vizianagaram. The university has nearly 268 affiliated colleges under the jurisdiction of 8 districts.
              </p>
            </div>
            <a
              href="https://www.jntuk.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex items-center gap-2"
            >
              Visit JNTUK Website <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </RevealOnScroll>
      </section>

      {/* Facts */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Key facts" title="JNTUK at a glance" align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FACTS.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-display text-xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/institution" className="btn-ghost">About Institution <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/about/vizianagaram" className="btn-primary">About Vizianagaram <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
