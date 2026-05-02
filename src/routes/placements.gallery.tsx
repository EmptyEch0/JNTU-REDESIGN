import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";
import a from "@/assets/campus-life.jpg";
import b from "@/assets/library-interior.jpg";
import c from "@/assets/lab.jpg";
import d from "@/assets/sports.jpg";
import e from "@/assets/culture.jpg";
import f from "@/assets/hero-campus.jpg";

export const Route = createFileRoute("/placements/gallery")({
  head: () => ({
    meta: [
      { title: "Placements Gallery — JNTU-GV CEV" },
      { name: "description", content: "Moments from placement drives, talks and offer day at JNTU-GV CEV." },
    ],
  }),
  component: GalleryPage,
});

const ITEMS = [
  { src: a, caption: "Pre-placement talk — Tier 1 IT" },
  { src: b, caption: "Aptitude bootcamp" },
  { src: c, caption: "Technical interview drive" },
  { src: d, caption: "Group discussion round" },
  { src: e, caption: "Offer day celebrations" },
  { src: f, caption: "Recruiter campus tour" },
];

function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Placements" title="Gallery" subtitle="Drives, talks and the moment our students get the call." image={placementsImg} />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((it, i) => (
            <RevealOnScroll key={i} delay={i * 60}>
              <figure className="group relative overflow-hidden rounded-2xl border border-border bg-card hover-lift">
                <img src={it.src} alt={it.caption} loading="lazy" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-sm">{it.caption}</figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
