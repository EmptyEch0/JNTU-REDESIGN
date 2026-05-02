import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { Download, FileText } from "lucide-react";
import img from "@/assets/lab.jpg";

export const Route = createFileRoute("/academics/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Academics — JNTU-GV CEV" },
      { name: "description", content: "Forms, applications and academic documents available for download." },
    ],
  }),
  component: DownloadsPage,
});

const FILES = [
  { name: "Bonafide Certificate Application", size: "120 KB" },
  { name: "Transfer Certificate Form", size: "180 KB" },
  { name: "Original Degree Application", size: "210 KB" },
  { name: "Migration Certificate Form", size: "95 KB" },
  { name: "Re-Evaluation Form", size: "140 KB" },
  { name: "Improvement Form", size: "150 KB" },
  { name: "Fee Concession Form", size: "85 KB" },
  { name: "Hostel Application Form", size: "230 KB" },
  { name: "No-Dues Clearance Form", size: "75 KB" },
];

function DownloadsPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="Downloads" subtitle="Forms, applications and academic documents — all in one place." image={img} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FILES.map((f, i) => (
            <RevealOnScroll key={f.name} delay={i * 50}>
              <a href="#" className="group p-5 rounded-2xl bg-card border border-border hover-lift flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all"><FileText className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="font-medium text-ink">{f.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">PDF · {f.size}</div>
                </div>
                <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
