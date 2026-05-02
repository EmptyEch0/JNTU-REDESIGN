import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/rd-cell/projects")({
  head: () => ({
    meta: [
      { title: "Research Projects — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Funded research projects across departments at JNTU-GV CEV." },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  title: string;
  pi: string;
  agency: string;
  amount: string;
  period: string;
  status: "Completed" | "On going";
};

const SECTIONS: { dept: string; projects: Project[] }[] = [
  {
    dept: "Department of Mechanical Engineering",
    projects: [
      {
        title: "Synthesis and Characterization of nano red mud reinforced aluminium composites",
        pi: "Prof. G. Swami Naidu",
        agency: "UGC",
        amount: "₹ 13.902 L",
        period: "2013–2016",
        status: "Completed",
      },
      {
        title: "Novel ECAR technique to produce AA5083 aluminium alloy with high deformation homogeneity for naval applications",
        pi: "Prof. G. Swami Naidu",
        agency: "NRB",
        amount: "₹ 33.628 L",
        period: "2019–2021",
        status: "On going",
      },
      {
        title: "Development and mechanical characterization of Aluminium Silicon Carbide MMC with soft computing tools",
        pi: "Dr. C. Neelima Devi",
        agency: "DST",
        amount: "₹ 24.05 L",
        period: "2012–2015",
        status: "Completed",
      },
      {
        title: "Novel ECAR technique for AA5083 aluminium alloy (Co-PI)",
        pi: "Mr. K. Srinivasa Prasad (Co-PI)",
        agency: "NRB",
        amount: "₹ 33.628 L",
        period: "2019–2021",
        status: "On going",
      },
    ],
  },
  {
    dept: "Department of Electronics & Communication Engineering",
    projects: [
      {
        title: "Development of Digital Image and Video Forgery Detection System",
        pi: "Dr. Ch. Srinivasa Rao",
        agency: "RUSA",
        amount: "₹ 7.85 L",
        period: "—",
        status: "On going",
      },
    ],
  },
  {
    dept: "Department of Computer Science Engineering",
    projects: [
      {
        title: "MRI Coronary Artery Detection Applying Deep Learning techniques",
        pi: "Mr. D. D. V. Sivaram Rolangi",
        agency: "EXAWIZARDS",
        amount: "₹ 5.00 L",
        period: "3 Months",
        status: "Completed",
      },
      {
        title: "Improving Semantic Segmentation Model Accuracy using MS COCO and PascalVOC Datasets",
        pi: "Mr. D. D. V. Sivaram Rolangi",
        agency: "EXAWIZARDS",
        amount: "₹ 2.50 L",
        period: "10 Months",
        status: "Completed",
      },
    ],
  },
  {
    dept: "Department of Basic Sciences & HSS",
    projects: [
      {
        title: "Diagnosis of ovarian cancer using decision tree classification of trace elemental data via ion beam analysis",
        pi: "Dr. G. J. Naga Raju (Young Scientist)",
        agency: "DST, New Delhi (SR/FTP/PS-139/2011)",
        amount: "₹ 21.84 L",
        period: "11-12-2013 to 11-12-2016",
        status: "Completed",
      },
    ],
  },
];

function StatusBadge({ s }: { s: Project["status"] }) {
  const isDone = s === "Completed";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isDone ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-primary" : "bg-accent"}`} />
      {s}
    </span>
  );
}

function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="Research Projects" subtitle="Funded projects from UGC, DST, DAE, NRB, RUSA and industry partners." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow space-y-14">
        {SECTIONS.map((sec, si) => (
          <RevealOnScroll key={sec.dept} delay={si * 60}>
            <div>
              <div className="text-eyebrow">Department</div>
              <h2 className="text-display text-2xl md:text-3xl text-ink mt-1">{sec.dept}</h2>
              <div className="mt-6 grid lg:grid-cols-2 gap-5">
                {sec.projects.map((p, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border hover-lift h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-ink leading-snug">{p.title}</h3>
                      <StatusBadge s={p.status} />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div><dt className="text-eyebrow text-xs">Principal Investigator</dt><dd className="text-ink mt-0.5">{p.pi}</dd></div>
                      <div><dt className="text-eyebrow text-xs">Funding Agency</dt><dd className="text-ink mt-0.5">{p.agency}</dd></div>
                      <div><dt className="text-eyebrow text-xs">Amount</dt><dd className="text-primary font-semibold mt-0.5">{p.amount}</dd></div>
                      <div><dt className="text-eyebrow text-xs">Period</dt><dd className="text-ink mt-0.5">{p.period}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}
