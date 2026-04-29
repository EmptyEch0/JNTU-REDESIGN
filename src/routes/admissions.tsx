import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ArrowRight, FileText, ClipboardList, IndianRupee, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — JNTU-GV CEV" },
      { name: "description", content: "How to apply, eligibility, fees and the admissions process at JNTU-GV CEV." },
      { property: "og:title", content: "Admissions at JNTU-GV CEV" },
      { property: "og:description", content: "Eligibility, process and key dates for B.Tech, M.Tech and MBA programs." },
    ],
  }),
  component: AdmissionsPage,
});

const STEPS = [
  { icon: ClipboardList, title: "Eligibility check", desc: "Confirm program-specific eligibility (rank, qualifying exam)." },
  { icon: FileText, title: "Application", desc: "Apply through the JNTU-GV / state counselling portal." },
  { icon: IndianRupee, title: "Fee payment", desc: "Pay tuition and hostel fees through the official portal." },
  { icon: CheckCircle2, title: "Confirmation", desc: "Report on campus on the assigned date with documents." },
];

function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Your seat at JNTU-GV CEV."
        subtitle="Admissions are governed by JNTU-GV and the state counselling process. Here's a clear overview to get you started."
      >
        <div className="flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-primary">Talk to admissions <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/academics" className="btn-ghost">View programs</Link>
        </div>
      </PageHero>

      <section className="py-24 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <RevealOnScroll key={s.title} delay={i * 80}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift h-full">
                <div className="text-eyebrow">Step {String(i + 1).padStart(2, "0")}</div>
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mt-4">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-display text-xl mt-4 text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
