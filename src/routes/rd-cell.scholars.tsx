import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/rd-cell/scholars")({
  head: () => ({
    meta: [
      { title: "Research Scholars under Supervision — JNTU-GV CEV" },
      { name: "description", content: "Ph.D scholars currently under supervision at JNTU-GV CEV." },
    ],
  }),
  component: ScholarsPage,
});

type Row = { scholar: string; supervisor: string; title: string; year: string; status: string };

const ROWS: Row[] = [
  { scholar: "K. Pavan Kumar", supervisor: "Dr. A. S. N. Chakravarthy", title: "Lightweight intrusion detection for IoT edge devices", year: "2021", status: "Submitted" },
  { scholar: "M. Srilatha", supervisor: "Dr. G. Jaya Suma", title: "Search-based software cost estimation using swarm intelligence", year: "2020", status: "Pre-submission" },
  { scholar: "B. Naveen", supervisor: "Dr. K. C. B. Rao", title: "VLSI architectures for real-time signal processing", year: "2022", status: "On going" },
  { scholar: "T. Lakshmi Prasanna", supervisor: "Dr. C. Neelima Devi", title: "Ageing behaviour of Al-SiC nano composites", year: "2021", status: "On going" },
  { scholar: "S. Ravi Teja", supervisor: "Mrs. A. Padmaja", title: "Robust controllers for hybrid micro-grids", year: "2022", status: "On going" },
  { scholar: "P. Anusha", supervisor: "Dr. Ch. Srinivasa Rao", title: "Deep learning for image and video forgery detection", year: "2020", status: "Submitted" },
  { scholar: "G. Sai Manikanta", supervisor: "Dr. G. J. Naga Raju", title: "PIXE-based biomedical trace element analysis", year: "2023", status: "On going" },
];

function ScholarsPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="Scholars under Supervision" subtitle="Ph.D scholars carrying our research forward, across departments." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-16 container-narrow">
        <RevealOnScroll>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <table className="min-w-full text-left">
              <thead className="bg-sand-deep/40 text-eyebrow">
                <tr>
                  <th className="px-6 py-4">Scholar</th>
                  <th className="px-6 py-4">Supervisor</th>
                  <th className="px-6 py-4">Thesis Title</th>
                  <th className="px-6 py-4">Reg. Year</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROWS.map((r, i) => (
                  <tr key={i} className="hover:bg-sand/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{r.scholar}</td>
                    <td className="px-6 py-4 text-ink">{r.supervisor}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.title}</td>
                    <td className="px-6 py-4 text-ink">{r.year}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
