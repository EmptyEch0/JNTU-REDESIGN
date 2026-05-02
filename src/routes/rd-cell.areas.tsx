import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";

export const Route = createFileRoute("/rd-cell/areas")({
  head: () => ({
    meta: [
      { title: "Areas of Research — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Department-wise research interests across engineering and sciences." },
    ],
  }),
  component: AreasPage,
});

const DEPTS: { dept: string; areas: string[] }[] = [
  {
    dept: "Department of Electrical & Electronics Engineering",
    areas: [
      "Large Scale Uncertain Systems",
      "Order reduction of Large Scale Systems",
      "Uncertain Systems, Soft Computing Techniques",
      "Interval Systems",
      "Robust Controllers",
      "Control Application of Power Systems",
      "Adaptive Power System Stabilizers",
      "Power Quality",
      "Distributed Generation",
      "Smart Grids and Micro Grids",
      "Automatic Generation Control",
      "Hybrid Power Systems",
      "Soft Computing Methods — Adaptive controllers",
    ],
  },
  {
    dept: "Department of Mechanical Engineering",
    areas: [
      "Mechanical Vibrations",
      "Robot Kinematics",
      "Nano Composites & Materials",
      "Material Technology, Metals and Alloys",
      "Deformation behaviour, Severe Plastic Deformation",
      "Metal forming, Composite Materials",
      "Nano materials & characterization, Nano Technology",
      "CAD/CAM, Machine Design",
      "Advanced Manufacturing Techniques",
      "Thermal Engineering, Fluid Mechanics, Heat Transfer",
      "Computational Fluid Dynamics",
      "Computer Integrated Manufacturing, 3D Printing",
      "High Speed Machining, Production Technology",
      "Metrology, Soft Computing Techniques",
    ],
  },
  {
    dept: "Department of Electronics & Communication Engineering",
    areas: [
      "Microwave and Radar Communications",
      "Image Processing",
      "VLSI & Signal Processing",
      "Communications and Signal Processing",
      "VLSI and Embedded Systems",
      "Embedded Systems & VLSI Signal Processing",
      "VLSI System Design",
      "Signal Processing & Embedded Systems",
    ],
  },
  {
    dept: "Department of Computer Science Engineering",
    areas: [
      "Computer Networks, Network Security",
      "Data Security, Cyber Security, Cloud Privacy",
      "Digital Forensics & Biometrics",
      "Image Processing & Soft Computing",
      "Speech Processing, Pattern Recognition",
      "Cloud Computing, Compilers & Parallel Computing",
      "Cyber Crimes, Security & Forensics",
      "Pattern Recognition, Data Mining",
      "Biometrics & Soft Computing",
      "Speech Processing, Data Mining, DBMS",
      "Machine Learning, Wireless Sensor Networks, IoT",
    ],
  },
  {
    dept: "Department of Information Technology",
    areas: [
      "Data Mining, Soft Computing",
      "Machine Learning, Mobile Computing, IoT",
      "Deep Learning, Computational Intelligence",
      "Software Cost Estimation",
      "Search-based Software Engineering",
      "Evolutionary Computation & Swarm Intelligence",
      "Web & Data Mining",
      "Soft Computing & Neural Networks",
    ],
  },
  {
    dept: "Department of BS & HSS",
    areas: [
      "Algebra, Lattice Theory, Mathematical Modeling",
      "Operations Research",
      "ELT — methods and materials, Language and Literature",
      "Statistical Analysis in disease prediction",
      "Atomic and Applied Physics",
      "Finance & Human Resource Management",
      "Organic Synthesis, Analytical Chemistry",
    ],
  },
];

function AreasPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="Areas of Research" subtitle="Department-wise interests — from power systems to deep learning to materials science." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow space-y-12">
        {DEPTS.map((d, di) => (
          <RevealOnScroll key={d.dept} delay={di * 50}>
            <div>
              <div className="text-eyebrow">Department</div>
              <h2 className="text-display text-2xl md:text-3xl text-ink mt-1">{d.dept}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {d.areas.map((a) => (
                  <span key={a} className="px-4 py-2 rounded-full bg-card border border-border text-sm text-ink hover:border-primary/50 hover:-translate-y-0.5 transition-all">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}
