import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { RD_SUBNAV } from "@/lib/site";
import { BookOpen } from "lucide-react";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/rd-cell/publications")({
  head: () => ({
    meta: [
      { title: "Research Publications — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Selected publications by faculty across departments." },
    ],
  }),
  component: PublicationsPage,
});

const PUBS = [
  { dept: "ECE", title: "A robust DCT-based digital image forgery detection scheme using deep features", venue: "Multimedia Tools and Applications, 2023", authors: "Ch. Srinivasa Rao et al." },
  { dept: "CSE", title: "Hybrid CNN-LSTM model for real-time intrusion detection in IoT networks", venue: "IEEE IoT Journal, 2023", authors: "A. S. N. Chakravarthy et al." },
  { dept: "EEE", title: "Order reduction of large-scale interval systems using moment matching", venue: "Springer LNEE, 2022", authors: "A. Padmaja et al." },
  { dept: "MECH", title: "Mechanical and microstructural characterization of nano red mud Al-MMC", venue: "Materials Today: Proceedings, 2022", authors: "G. Swami Naidu, C. Neelima Devi" },
  { dept: "IT", title: "Evolutionary computation for software cost estimation: a survey", venue: "ACM Computing Surveys, 2022", authors: "G. Jaya Suma et al." },
  { dept: "BS & HSS", title: "Trace elemental analysis of ovarian tissue using PIXE and decision-tree classification", venue: "Nuclear Instruments and Methods B, 2021", authors: "G. J. Naga Raju et al." },
];

function PublicationsPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="Research Publications" subtitle="Peer-reviewed journals, international conferences and patents." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-16 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          <div className="bg-card p-8"><StatCounter value={420} label="Journal papers" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={180} label="Conference papers" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={28} label="Patents filed" /></div>
          <div className="bg-card p-8"><StatCounter value={12} label="Books / chapters" /></div>
        </div>
      </section>

      <section className="py-16 container-narrow">
        <div className="grid lg:grid-cols-2 gap-5">
          {PUBS.map((p, i) => (
            <RevealOnScroll key={i} delay={i * 60}>
              <div className="p-6 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0"><BookOpen className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="text-eyebrow">{p.dept}</div>
                    <h3 className="font-semibold text-ink mt-1 leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.authors}</p>
                    <p className="mt-1 text-sm text-primary">{p.venue}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
