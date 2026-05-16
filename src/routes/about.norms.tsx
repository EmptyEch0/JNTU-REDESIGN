import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { FileText, Download, ShieldCheck, Building2, ExternalLink } from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";

export const Route = createFileRoute("/about/norms")({
  head: () => ({
    meta: [
      { title: "Norms & Recognition — JNTU-GV CEV" },
      {
        name: "description",
        content: "Official recognition, UGC status and establishment norms of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: NormsPage,
});

const DOCUMENTS = [
  {
    title: "UGC 2(f) & 12(B) Recognition",
    desc: "Official certificate recognizing the institution under the UGC Act, 1956.",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/UGC-1-747x1024-1.pdf",
    category: "Recognition",
    icon: ShieldCheck,
  },
  {
    title: "University Establishment Order (MS14)",
    desc: "Government Order (GO MS. No. 14) regarding the establishment of the university.",
    url: "https://jntugvcev.edu.in//wp-content/uploads/2021/03/13022019HE_MS14.pdf",
    category: "Government Order",
    icon: Building2,
  },
];

function NormsPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Norms & Recognition"
        subtitle="Official certifications and government mandates that define our institutional framework."
        image={heroImg}
      />

      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <SectionLabel 
            eyebrow="Certification" 
            title="Institutional Recognition" 
            subtitle="As a constituent college of a state-funded university, we adhere to the highest standards of academic and administrative compliance."
          />
        </RevealOnScroll>

        <div className="mt-16 grid gap-6 max-w-4xl">
          {DOCUMENTS.map((doc, i) => (
            <RevealOnScroll key={doc.title} delay={i * 100}>
              <a 
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] bg-white border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-500"
              >
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <doc.icon className="h-8 w-8" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2">
                    {doc.category}
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doc.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-ink text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                  <Download className="h-4 w-4" />
                  Download PDF
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ExternalLink className="h-4 w-4 text-primary" />
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        {/* UGC Details Strip */}
        <RevealOnScroll delay={300} className="mt-20">
          <div className="rounded-[40px] bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
             <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold leading-tight">UGC 12(B) and 2(f) Recognition</h2>
                   <p className="mt-6 text-white/60 leading-relaxed">
                     JNTU-GV College of Engineering Vizianagaram is recognized by the University Grants Commission (UGC) 
                     under Section 2(f) and 12(B) of the UGC Act, 1956. This recognition makes the college 
                     eligible for central assistance and grants for research and development activities.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-primary-glow">2(f)</div>
                      <div className="text-xs uppercase tracking-widest text-white/40 mt-2">UGC Recognized</div>
                   </div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-primary-glow">12(B)</div>
                      <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Grant Eligible</div>
                   </div>
                </div>
             </div>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
