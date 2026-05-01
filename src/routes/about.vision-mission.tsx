import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Eye, Target, Shield, BookOpen } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";
import ugcImg from "@/assets/ugc-certificate.png";

export const Route = createFileRoute("/about/vision-mission")({
  head: () => ({
    meta: [
      { title: "Vision & Mission — JNTU-GV CEV" },
      { name: "description", content: "Vision, Mission and UGC recognition of JNTU-GV College of Engineering Vizianagaram." },
      { property: "og:title", content: "Vision & Mission — JNTU-GV CEV" },
      { property: "og:description", content: "Our guiding principles and UGC 2(f) & 12(B) recognition." },
    ],
  }),
  component: VisionMissionPage,
});

const MISSIONS = [
  {
    icon: BookOpen,
    text: "To provide high quality technical education through a creative balance of academia and industry by adopting highly effective teaching learning processes.",
  },
  {
    icon: Target,
    text: "To promote multidisciplinary research with a global perspective to attain professional excellence.",
  },
  {
    icon: Shield,
    text: "To establish standards that inculcate ethical and moral values that contribute to growth in the Career and development of society.",
  },
];

function VisionMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Vision & Mission"
        subtitle="Guiding principles that shape our pursuit of engineering excellence."
        image={campusImg}
      />

      {/* Vision */}
      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 w-16 rounded-2xl bg-[var(--gradient-royal)] text-white grid place-items-center mx-auto mb-6">
              <Eye className="h-7 w-7" />
            </div>
            <div className="text-eyebrow">Our Vision</div>
            <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">A premier institution for the future</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              To emerge as a premier technical Institution in the field of engineering and research with a focus to produce professionally competent and socially sensitive engineers capable of working in a multidisciplinary global environment.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* Mission */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Our Mission" title="Three pillars of our purpose" align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {MISSIONS.map((m, i) => (
              <RevealOnScroll key={i} delay={i * 120}>
                <div className="bg-card rounded-2xl p-8 border border-border hover-lift h-full group">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-3">Mission {i + 1}</div>
                  <p className="text-ink leading-relaxed">{m.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* UGC Recognition */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Recognition" title="UGC 2(f) & 12(B) Status" align="center" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="bg-card rounded-2xl p-8 border border-border hover-lift">
                <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> UGC Recognition
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  The College is eligible to receive Central assistance in terms of the Rules framed under Section 12(B) of the UGC Act, 1956. The college has been recognized under Section 2(f) and 12(B) of the UGC Act.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border hover-lift">
                <h3 className="text-lg font-semibold text-ink">Key Details</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">College Name</span>
                    <span className="text-ink font-medium text-right">JNTUK University College of Engineering, Vizianagaram</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Year of Establishment</span>
                    <span className="text-ink font-medium">2007</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-ink font-medium">Aided & Constituent College</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Recognition</span>
                    <span className="text-ink font-medium">Section 2(f) & 12(B)</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={ugcImg}
                alt="UGC Recognition certificate under Section 2(f) and 12(B)"
                loading="lazy"
                className="rounded-2xl border border-border shadow-[var(--shadow-elegant)] w-full hover:scale-[1.02] transition-transform duration-700"
              />
              <p className="mt-3 text-xs text-muted-foreground text-center">UGC Recognition Letter — November 2016</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/institution" className="btn-primary">About Institution <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/about/jntuk" className="btn-ghost">About JNTUK <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
