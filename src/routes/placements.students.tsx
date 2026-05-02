import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/placements/students")({
  head: () => ({
    meta: [
      { title: "Students Placed — Placements — JNTU-GV CEV" },
      { name: "description", content: "Year-wise placement statistics and select offers." },
    ],
  }),
  component: StudentsPlacedPage,
});

const YEARS = [
  { year: "2023-24", offers: 432, top: "42 LPA", recruiters: 92 },
  { year: "2022-23", offers: 398, top: "38 LPA", recruiters: 84 },
  { year: "2021-22", offers: 360, top: "32 LPA", recruiters: 78 },
  { year: "2020-21", offers: 312, top: "24 LPA", recruiters: 71 },
];

const HIGHLIGHTS = [
  { name: "P. Harsha Vardhan", branch: "CSE", company: "Amazon", package: "42 LPA" },
  { name: "K. Anjali", branch: "ECE", company: "Cyient", package: "12 LPA" },
  { name: "B. Surya Teja", branch: "IT", company: "Deloitte", package: "11 LPA" },
  { name: "M. Lakshmi", branch: "EEE", company: "L&T", package: "9 LPA" },
  { name: "R. Karthik", branch: "MECH", company: "Hyundai", package: "8.5 LPA" },
  { name: "S. Divya", branch: "CSE", company: "Accenture", package: "8 LPA" },
];

function StudentsPlacedPage() {
  return (
    <>
      <PageHero eyebrow="Placements" title="Students Placed" subtitle="Year-on-year growth in offers, recruiters and packages." image={placementsImg} />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          <div className="bg-card p-8"><StatCounter value={1502} label="Total offers (4 yrs)" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={42} label="LPA Top Package" suffix="L" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Recruiters in 2023-24" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Placement %" suffix="%" /></div>
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Year on year" title="Placement trend" /></RevealOnScroll>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="min-w-full text-left">
              <thead className="bg-sand-deep/40 text-eyebrow">
                <tr>
                  <th className="px-6 py-4">Academic Year</th>
                  <th className="px-6 py-4">Offers</th>
                  <th className="px-6 py-4">Top Package</th>
                  <th className="px-6 py-4">Recruiters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {YEARS.map((y) => (
                  <tr key={y.year} className="hover:bg-sand/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{y.year}</td>
                    <td className="px-6 py-4 text-ink">{y.offers}</td>
                    <td className="px-6 py-4 text-primary font-semibold">{y.top}</td>
                    <td className="px-6 py-4 text-ink">{y.recruiters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll><SectionLabel eyebrow="Highlights" title="Notable offers" align="center" /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HIGHLIGHTS.map((h, i) => (
            <RevealOnScroll key={h.name} delay={i * 60}>
              <div className="p-6 rounded-2xl bg-card border border-border hover-lift h-full">
                <div className="text-eyebrow">{h.branch}</div>
                <h3 className="text-display text-xl text-ink mt-2">{h.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">{h.company}</span>
                  <span className="text-primary font-semibold">{h.package}</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
