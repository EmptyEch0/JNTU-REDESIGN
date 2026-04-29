import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { Heart, Leaf, Users, BookOpen } from "lucide-react";

export const Route = createFileRoute("/nss")({
  head: () => ({
    meta: [
      { title: "NSS — JNTU-GV CEV" },
      { name: "description", content: "National Service Scheme at JNTU-GV CEV — service, leadership and community." },
      { property: "og:title", content: "NSS at JNTU-GV CEV" },
      { property: "og:description", content: "Volunteer-led service projects across the year." },
    ],
  }),
  component: NSSPage,
});

const ACTIVITIES = [
  { icon: Heart, title: "Blood Donation Drives", desc: "Quarterly camps with district hospitals." },
  { icon: Leaf, title: "Plantation & Cleanups", desc: "Campus and village green initiatives." },
  { icon: Users, title: "Community Outreach", desc: "Education and awareness in nearby villages." },
  { icon: BookOpen, title: "Adult Literacy", desc: "Volunteer teaching for nearby communities." },
];

function NSSPage() {
  return (
    <>
      <PageHero eyebrow="NSS" title="Not me, but you." subtitle="The National Service Scheme on campus is a quiet, consistent commitment to community — led entirely by students." />

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="What we do" title="Service, every semester." /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {ACTIVITIES.map((a, i) => (
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
    </>
  );
}
