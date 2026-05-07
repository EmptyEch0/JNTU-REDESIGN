import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Users, Building, BookOpen, Award } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/about/institution")({
  head: () => ({
    meta: [
      { title: "About Institution — JNTU-GV CEV" },
      { name: "description", content: "JNTU-GV College of Engineering Vizianagaram – a constituent college established in 2007, spread across 80 acres in Dwarapudi." },
      { property: "og:title", content: "About JNTU-GV CEV" },
      { property: "og:description", content: "Imparting technological education since 2007 across 80 acres." },
    ],
  }),
  component: InstitutionPage,
});

const HIGHLIGHTS = [
  { icon: Building, title: "80 Acres", desc: "State-of-the-art campus in Dwarapudi panchayat" },
  { icon: Users, title: "1,450+ Students", desc: "Across 7 engineering disciplines and management" },
  { icon: BookOpen, title: "Est. 2007", desc: "Serving Andhra Pradesh's technological aspirations" },
  { icon: Award, title: "Constituent College", desc: "Under JNTU-GV Vizianagaram" },
];

function InstitutionPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="JNTU-GV College of Engineering Vizianagaram"
        subtitle="A constituent engineering college playing a vital role in imparting technological education in Andhra Pradesh."
        image={campusImg}
      />

      {/* Main content */}
      <section className="py-24 md:py-32 container-narrow grid lg:grid-cols-2 gap-16 items-start">
        <RevealOnScroll>
          <img src={campusImg} alt="JNTU-GV Campus aerial view" loading="lazy" className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)] hover:scale-[1.02] transition-transform duration-700" />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <div className="text-eyebrow">Our Institution</div>
          <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">Engineering excellence since 2007</h2>
          <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              JNTU-GV College of Engineering Vizianagaram is one of the constituent Engineering Colleges of JNTU-GV playing a vital role in imparting Technological Education in the state of Andhra Pradesh since its establishment in the year 2007.
            </p>
            <p>
              The state-of-the-art campus is spread across 80 Acres in Dwarapudi panchayat at a distance of 8 KMs from Vizianagaram. It functions under the directions of Executive Council, Vice Chancellor and Registrar of JNTU-GV Vizianagaram.
            </p>
            <p>
              Principal is the executive head of the institution and Chairman of the College Academic Committee comprising all professors and heads of the departments. The Vice Principal, Heads of the departments and Members of College Academic Committee help in academic administration and effective functioning of the Institution.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="At a glance" title="Key highlights" align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <RevealOnScroll key={h.title} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <h.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-display text-xl text-ink">{h.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Administration */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Administration" title="Governance structure" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover-lift group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Executive Council</h3>
              <p className="mt-2 text-muted-foreground">The institution functions under the directions of the Executive Council, Vice Chancellor and Registrar of JNTU-GV Vizianagaram.</p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border hover-lift group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Academic Committee</h3>
              <p className="mt-2 text-muted-foreground">The College Academic Committee, chaired by the Principal, comprises all professors and heads of departments ensuring academic excellence.</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* CTA */}
      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/jntuk" className="btn-primary">About JNTUK <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/about/vizianagaram" className="btn-secondary">About Vizianagaram <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
