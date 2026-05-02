import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";
import supraja from "@/assets/mou-supraja.png";
import blackbuck from "@/assets/mou-blackbuck.png";

export const Route = createFileRoute("/rd-cell/mous")({
  head: () => ({
    meta: [
      { title: "MOUs — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Memoranda of Understanding signed with industry and research partners." },
    ],
  }),
  component: MOUsPage,
});

const ENTRIES = [
  {
    dept: "Department of Electrical & Electronics Engineering",
    body: "A Memorandum of Understanding (MOU) has been signed with M/s Sarda Metals & Alloys Ltd., Visakhapatnam to exchange expertise for mutual benefit and growth — in the areas of Industrial Visits, In-plant Training, Internships, Projects, Research & Development, Placements and Establishing Advanced Labs.",
  },
  {
    dept: "Department of Mechanical Engineering",
    body: "A tie-up has been made and MOUs signed with industries like Tata Consultancy Services Limited. The MOU with TCS on Tata Affirmative Action Program (TAAP) aims to improve the employability of students. A second MOU with M/s Sarda Metals & Alloys Ltd., Visakhapatnam covers Industrial Visits, In-plant Training, Internships, Projects, R&D, Placements and Establishing Advanced Labs.",
  },
];

const CSE = [
  {
    title: "MOU with Supraja Technologies",
    body: "ISO 9001:2015 Certified Company. Supports establishment and running of the B.Tech program in CSE: Internships / project work, industry orientation / practical training, expert lectures, joint R&D and consultancy, identification of development projects, and student visits to Supraja Technologies premises.",
    img: supraja,
    badge: "Centre of Excellence",
  },
  {
    title: "MOU with Blackbuck Technologies",
    body: "Action plan for establishing a Centre of Excellence for Emerging Technologies. Covers (i) Job skills, (ii) Innovation ecosystem through courses & initiatives, (iii) Industry interaction. Programs include Connected FDPs, Connected Workshops, Incubation Centre & Innovation Lab, Career Guidance & Industry Mentorship, Entrepreneurship Support, Webinars, Guest Lectures and Hackathons / Ideathons.",
    img: blackbuck,
    badge: "Innovation Partner",
  },
];

function MOUsPage() {
  return (
    <>
      <PageHero eyebrow="R&D Cell" title="MOUs" subtitle="Industry, research and innovation partnerships that power our work." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Department-wise" title="Active partnerships" /></RevealOnScroll>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {ENTRIES.map((e, i) => (
            <RevealOnScroll key={i} delay={i * 100}>
              <div className="p-7 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="text-eyebrow">Partnership</div>
                <h3 className="text-display text-2xl text-ink mt-2">{e.dept}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{e.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Department of Computer Science" title="MOU certificates" align="center" /></RevealOnScroll>
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {CSE.map((c, i) => (
              <RevealOnScroll key={c.title} delay={i * 120}>
                <div className="group rounded-3xl overflow-hidden bg-card border border-border shadow-[var(--shadow-card)] hover-lift">
                  <div className="relative bg-sand-deep/30 p-6 grid place-items-center">
                    <img src={c.img} alt={c.title} loading="lazy" className="max-h-72 object-contain group-hover:scale-[1.03] transition-transform duration-700" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">{c.badge}</span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-display text-2xl text-ink">{c.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
