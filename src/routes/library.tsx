import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { BookOpen, Wifi, Search, Globe } from "lucide-react";
import libraryImg from "@/assets/library-interior.jpg";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — JNTU-GV CEV" },
      { name: "description", content: "A modern academic library with 50,000+ books, journals and digital resources." },
      { property: "og:title", content: "Library at JNTU-GV CEV" },
      { property: "og:description", content: "A quiet knowledge commons with print, digital and journal access." },
      { property: "og:image", content: libraryImg },
    ],
  }),
  component: LibraryPage,
});

const FEATURES = [
  { icon: BookOpen, title: "Print Collection", desc: "Engineering, sciences, humanities and reference texts." },
  { icon: Globe, title: "E-Journals", desc: "Access to IEEE Xplore, ASME, Springer, Elsevier." },
  { icon: Search, title: "OPAC Search", desc: "Online catalogue for instant book lookup." },
  { icon: Wifi, title: "Wi-Fi Reading Zones", desc: "Quiet study areas with reliable connectivity." },
];

function LibraryPage() {
  return (
    <>
      <PageHero eyebrow="Library" title="A quiet place that does serious work." subtitle="Open from morning to late evening — a knowledge commons that anchors academic life on campus." image={libraryImg} />

      <section className="py-20 container-narrow grid md:grid-cols-2 gap-10 items-center">
        <RevealOnScroll>
          <img src={libraryImg} alt="Library interior" loading="lazy" className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)]" />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <div className="grid grid-cols-2 gap-px bg-border rounded-3xl overflow-hidden border border-border">
            <div className="bg-card p-6"><StatCounter value={52000} label="Books" suffix="+" /></div>
            <div className="bg-card p-6"><StatCounter value={120} label="Journals" /></div>
            <div className="bg-card p-6"><StatCounter value={8000} label="E-Books" suffix="+" /></div>
            <div className="bg-card p-6"><StatCounter value={250} label="Reading Seats" /></div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-24 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Resources" title="What you'll find inside." align="center" /></RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 80}>
                <div className="bg-card p-6 rounded-2xl border border-border hover-lift h-full">
                  <div className="h-11 w-11 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
