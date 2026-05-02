import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { RD_SUBNAV } from "@/lib/site";
import { Quote } from "lucide-react";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/rd-cell/about")({
  head: () => ({
    meta: [
      { title: "About Research — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Coordinator's message and Research Advisory Committee at JNTU-GV CEV." },
    ],
  }),
  component: AboutResearchPage,
});

const COMMITTEE = [
  { name: "Dr. Swami Naidu", role: "Principal", detail: "Chairman" },
  { name: "Dr. G. J. Naga Raju", role: "R&D Cell, Coordinator", detail: "Convener" },
  { name: "Dr. R. Rajeswara Rao", role: "Vice Principal", detail: "Member" },
  { name: "Mrs. A. Padmaja", role: "Head, EEE", detail: "Member" },
  { name: "Dr. C. Neelima Devi", role: "Head, Mechanical", detail: "Member" },
  { name: "Dr. K. C. B. Rao", role: "Head, ECE", detail: "Member" },
  { name: "Dr. A. S. N. Chakravarthy", role: "Head, CSE", detail: "Member" },
  { name: "Dr. G. Jaya Suma", role: "Head, IT", detail: "Member" },
  { name: "Dr. Ch. Srinivasa Rao", role: "Head, Civil", detail: "Member" },
  { name: "Dr. S. Kalesha Vali", role: "Head, BS & HSS", detail: "Member" },
];

const MOTTO = [
  "Encourage multidisciplinary collaborative research among faculty and with research institutes across the globe.",
  "Facilitate cutting-edge research in thrust areas identified by the departments.",
  "Organise scientific outreach programmes periodically to address research gaps through knowledge management.",
  "Promote industry-oriented research in diverse fields, integrating outcomes with real-world applications.",
];

function AboutResearchPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="About Research" subtitle="A culture of inquiry, collaboration and impact — built department by department." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="relative max-w-3xl mx-auto p-8 md:p-10 rounded-3xl bg-card border border-border shadow-[var(--shadow-elegant)]">
            <Quote className="h-8 w-8 text-primary/40 absolute -top-4 -left-4 bg-background rounded-full p-1.5 border border-border" />
            <p className="text-display text-2xl md:text-3xl text-ink leading-snug">
              "Research is to see what everybody else has seen, and to think what nobody else has thought."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— Albert Szent-Györgyi</p>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-eyebrow">Coordinator's message</div>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                JNTUK-UCEV strives towards inculcating research culture among its students and faculty by encouraging multi-disciplinary research activities in pace with global standards. With this intention, the R&D Cell has been established to lend support and guidance to researchers involved in academic as well as sponsored research. The research areas include all major disciplines with the ultimate aim of addressing the needs and challenges of society. The research community has several peer-reviewed journal publications and patents to its credit. The faculty members are actively engaged in carrying out research projects sanctioned by funding agencies including UGC, DST, DAE, NRB and undertake major consultancy projects with industry partners.
              </p>
              <p className="mt-4 font-semibold text-ink">Dr. G. Naga Raju</p>
              <div className="text-sm text-muted-foreground">Research Coordinator</div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Motto" title="The R&D Cell functions with these aims." align="center" /></RevealOnScroll>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {MOTTO.map((m, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover-lift h-full">
                  <div className="h-9 w-9 rounded-lg bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0 font-semibold">{i + 1}</div>
                  <p className="text-muted-foreground leading-relaxed">{m}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Research Advisory Committee" title="Members" align="center" /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMITTEE.map((m, i) => (
            <RevealOnScroll key={m.name} delay={i * 50}>
              <ProfileCard name={m.name} role={m.role} detail={m.detail} badge={`Member ${String(i + 1).padStart(2, "0")}`} />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
