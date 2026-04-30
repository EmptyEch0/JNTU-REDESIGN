import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProfileCard } from "@/components/ProfileCard";
import { SectionLabel } from "@/components/SectionLabel";
import { Stethoscope, Pill, Ambulance, HeartPulse } from "lucide-react";
import cultureImg from "@/assets/culture.jpg";

export const Route = createFileRoute("/dispensary")({
  head: () => ({
    meta: [
      { title: "Dispensary — JNTU-GV CEV" },
      { name: "description", content: "On-campus medical care, first aid and student wellness." },
      { property: "og:title", content: "Dispensary at JNTU-GV CEV" },
      { property: "og:description", content: "Doctor visits, common medicines and emergency response on campus." },
    ],
  }),
  component: DispensaryPage,
});

const SERVICES = [
  { icon: Stethoscope, title: "Doctor Consultations", desc: "Visiting medical officer with scheduled hours." },
  { icon: Pill, title: "Common Medicines", desc: "Essential medication for routine ailments." },
  { icon: Ambulance, title: "Emergency Referral", desc: "Rapid referral to partner hospitals in Vizianagaram." },
  { icon: HeartPulse, title: "Wellness Checks", desc: "Periodic health screenings for residents." },
];

function DispensaryPage() {
  return (
    <>
      <PageHero eyebrow="Dispensary" title="Care that meets you on campus." subtitle="A small, focused clinic for the everyday — and a swift response when something more is needed." image={cultureImg} />

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Services" title="What we offer." /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {SERVICES.map((s, i) => (
            <RevealOnScroll key={s.title} delay={i * 80}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift flex gap-5">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Health Team" title="People who keep us well." align="center" /></RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <RevealOnScroll>
              <ProfileCard name="Sri Venkata Krishna" role="Health Assistant" detail="First response, daily care and routine support for residents." badge="Care Team" />
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <ProfileCard name="Ms. G. Krishna Veni" role="Health Assistant" detail="Coordinates wellness checks and clinic referrals." badge="Care Team" />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
