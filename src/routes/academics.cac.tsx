import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ACADEMICS_SUBNAV } from "@/lib/site";
import { Users } from "lucide-react";
import img from "@/assets/lab.jpg";

export const Route = createFileRoute("/academics/cac")({
  head: () => ({
    meta: [
      { title: "College Academic Committee (CAC) — JNTU-GV CEV" },
      { name: "description", content: "Composition and role of the College Academic Committee at JNTU-GV CEV." },
    ],
  }),
  component: CACPage,
});

const MEMBERS = [
  { role: "Chairman", name: "Principal" },
  { role: "Convener", name: "Vice Principal" },
  { role: "Member", name: "Head, CSE" },
  { role: "Member", name: "Head, ECE" },
  { role: "Member", name: "Head, EEE" },
  { role: "Member", name: "Head, Mechanical" },
  { role: "Member", name: "Head, Civil" },
  { role: "Member", name: "Head, IT" },
  { role: "Member", name: "Head, BS & HSS" },
  { role: "Member", name: "Examination Branch Officer" },
];

function CACPage() {
  return (
    <>
      <PageHero eyebrow="Academics" title="College Academic Committee" subtitle="The CAC sets academic policy, monitors quality, and reviews program outcomes." image={img} />
      <SubNav items={ACADEMICS_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="text-eyebrow">Composition</div>
          <h2 className="text-display text-3xl md:text-4xl mt-2 text-ink">Who sits on the CAC</h2>
        </RevealOnScroll>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEMBERS.map((m, i) => (
            <RevealOnScroll key={m.name + i} delay={i * 50}>
              <div className="p-5 rounded-xl bg-card border border-border hover-lift flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-eyebrow text-xs">{m.role}</div>
                  <div className="text-ink font-medium">{m.name}</div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
