import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Award, Compass, Heart, Sparkles } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JNTU-GV CEV" },
      { name: "description", content: "Learn about the history, vision and people behind JNTU-GV College of Engineering Vizianagaram." },
      { property: "og:title", content: "About JNTU-GV CEV" },
      { property: "og:description", content: "A premier engineering college in Andhra Pradesh." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Compass, title: "Rigour", desc: "An academic culture that values depth over noise." },
  { icon: Heart, title: "Care", desc: "Mentors who know your name and your work." },
  { icon: Sparkles, title: "Curiosity", desc: "Labs and clubs that reward asking why." },
  { icon: Award, title: "Excellence", desc: "A century of alumni shaping industry and academia." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A college built on quiet ambition."
        subtitle="JNTU-GV College of Engineering Vizianagaram is a constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram — established to serve the engineering aspirations of the north coastal districts of Andhra Pradesh." image={campusImg}
      />
      <section className="py-24 md:py-32 container-narrow grid lg:grid-cols-2 gap-16 items-center">
        <RevealOnScroll>
          <img src={campusImg} alt="Campus" loading="lazy" className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)]" />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <div className="text-eyebrow">Our story</div>
          <h2 className="text-display text-3xl md:text-5xl mt-3 text-ink">A campus designed for depth.</h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Set on a green, residential campus, JNTU-GV CEV brings together students from across India for a four-year journey of academic, technical and personal growth. Our programs combine the rigour of a public university with the intimacy of a teaching-first institution.
          </p>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            From foundational mathematics to capstone industry projects, every year is layered with hands-on labs, mentorship and a wider community of 1,450 students.
          </p>
        </RevealOnScroll>
      </section>

      <section className="py-24 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="What we value" title="Four ideas guide everything we do." align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <RevealOnScroll key={v.title} delay={i * 80}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full">
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-display text-xl text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container-narrow text-center">
        <Link to="/admissions" className="btn-primary">Begin your journey <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </>
  );
}
