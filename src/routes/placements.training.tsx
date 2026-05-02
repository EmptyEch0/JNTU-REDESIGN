import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV, RECRUITERS_2017_18 } from "@/lib/site";
import { Mail, Quote, Target, Users } from "lucide-react";
import vakula from "@/assets/vakula.jpg";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/placements/training")({
  head: () => ({
    meta: [
      { title: "Training & Placement Cell — JNTU-GV CEV" },
      { name: "description", content: "Vision, mission and team behind the Training & Placement Cell at JNTU-GV CEV." },
    ],
  }),
  component: TrainingPage,
});

const GOALS = [
  "Build domain-knowledge based human resource by imparting contemporary technical skills and social ethics, initiating excellent industry-institute collaboration for the wellbeing of society.",
  "Assist students to develop and clarify their academic and career interests, and their short and long-term goals through individual counselling and group sessions.",
  "Assist students for industrial training at the end of the sixth semester.",
  "Act as a link between students, alumni, and the employment community to assist students in obtaining placement in reputed companies.",
];

function TrainingPage() {
  return (
    <>
      <PageHero eyebrow="Placements" title="Training & Placement Cell" subtitle="Training and placing technically competent professionals who serve industry and society." image={placementsImg} />
      <SubNav items={PLACEMENTS_SUBNAV} />

      {/* TPO message */}
      <section className="py-20 container-narrow">
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
          <RevealOnScroll>
            <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)] bg-card">
              <img src={vakula} alt="Dr. V. S. Vakula, Training & Placement Officer" className="w-full aspect-[3/4] object-cover" loading="lazy" />
              <div className="p-5 text-center">
                <h3 className="text-display text-xl text-ink">Dr. V. S. Vakula</h3>
                <div className="text-eyebrow mt-1">Training & Placement Officer</div>
                <a href="mailto:tpo@jntugvcev.edu.in" className="mt-3 inline-flex items-center gap-2 text-sm text-primary"><Mail className="h-4 w-4" /> tpo@jntugvcev.edu.in</a>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <div className="text-eyebrow">Vision</div>
            <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">Train. Develop. Place.</h2>
            <div className="relative mt-6 p-7 rounded-2xl bg-card border border-border">
              <Quote className="h-7 w-7 text-primary/40 absolute -top-3 -left-3 bg-background rounded-full p-1 border border-border" />
              <p className="text-lg leading-relaxed text-ink">
                "The vision of the Training and Placement Cell is to train and develop technically competent professionals to serve as a valuable resource for industry and society."
              </p>
              <p className="mt-4 text-sm text-muted-foreground">— Dr. V. S. Vakula, Training & Placement Officer</p>
            </div>

            <div className="mt-10">
              <div className="text-eyebrow">Mission & Goals</div>
              <h3 className="text-display text-2xl md:text-3xl mt-2 text-ink">What we work towards</h3>
              <ul className="mt-6 space-y-3">
                {GOALS.map((g, i) => (
                  <li key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border hover-lift">
                    <div className="h-8 w-8 rounded-lg bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0 font-semibold">{i + 1}</div>
                    <p className="text-muted-foreground leading-relaxed">{g}</p>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Aim & objectives */}
      <section className="py-20 bg-sand">
        <div className="container-narrow grid md:grid-cols-2 gap-5">
          <RevealOnScroll>
            <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
              <Target className="h-7 w-7 text-primary" />
              <h3 className="text-display text-2xl text-ink mt-4">Aim of the TPO</h3>
              <p className="mt-3 text-muted-foreground">To create a structured pathway from classroom learning to a meaningful first job — by combining technical training, soft skills and recruiter relationships.</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
              <Users className="h-7 w-7 text-primary" />
              <h3 className="text-display text-2xl text-ink mt-4">Supporting Staff</h3>
              <ul className="mt-4 space-y-2 text-ink">
                <li className="flex justify-between"><span>Mr. Mahesh</span><span className="text-eyebrow text-xs">Helper</span></li>
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Companies visited 2017-18 — horizontal marquee */}
      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Companies Visited" title="Recruiters in 2017–2018" align="center" />
        </RevealOnScroll>
        <div className="mt-12 relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track gap-6">
            {[...RECRUITERS_2017_18, ...RECRUITERS_2017_18].map((r, i) => (
              <div key={i} className="shrink-0 px-7 py-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-[var(--shadow-card)] transition-all">
                <div className="text-display text-lg text-ink whitespace-nowrap">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
