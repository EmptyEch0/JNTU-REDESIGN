import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { Shield, MessageSquare, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/women-empowerment")({
  head: () => ({
    meta: [
      { title: "Women Empowerment Cell — JNTU-GV CEV" },
      { name: "description", content: "A safe, supportive and ambitious environment for women on campus." },
      { property: "og:title", content: "Women Empowerment Cell — JNTU-GV CEV" },
      { property: "og:description", content: "Safety, mentorship, leadership and grievance redressal." },
    ],
  }),
  component: WomenPage,
});

const PILLARS = [
  { icon: Shield, title: "Safety & Redressal", desc: "Confidential grievance handling and proactive safety review." },
  { icon: MessageSquare, title: "Awareness Sessions", desc: "Regular talks on health, rights and personal finance." },
  { icon: Users, title: "Mentorship Circles", desc: "Senior students and faculty guide first-year women." },
  { icon: Sparkles, title: "Leadership Workshops", desc: "Skill-building for student council and club leadership." },
];

function WomenPage() {
  return (
    <>
      <PageHero eyebrow="Women Empowerment Cell" title="Safe. Supported. Ambitious." subtitle="A campus-wide cell that ensures every woman at JNTU-GV CEV has the safety, mentorship and platform to lead." />

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Pillars" title="Four commitments." /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {PILLARS.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 80}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift flex gap-5 h-full">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Cell Coordinators" title="People you can turn to." align="center" /></RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <RevealOnScroll><ProfileCard name="Dr. Ch. Bindu Madhuri" role="Convenor, WE Cell" detail="Primary point of contact for grievances and policy." badge="Convenor" /></RevealOnScroll>
            <RevealOnScroll delay={120}><ProfileCard name="Faculty Members" role="Cell Members" detail="A rotating committee of women faculty across departments." badge="Members" /></RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
