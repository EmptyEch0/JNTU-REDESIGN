import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import campusLifeImg from "@/assets/campus-life.jpg";
import cultureImg from "@/assets/culture.jpg";
import sportsImg from "@/assets/sports.jpg";

export const Route = createFileRoute("/campus-life")({
  head: () => ({
    meta: [
      { title: "Campus Life — JNTU-GV CEV" },
      {
        name: "description",
        content: "Clubs, festivals, sports and the rhythm of student life on a residential campus.",
      },
      { property: "og:title", content: "Campus Life at JNTU-GV CEV" },
      {
        property: "og:description",
        content: "A residential campus full of culture, clubs and conversations.",
      },
      { property: "og:image", content: campusLifeImg },
    ],
  }),
  component: CampusLifePage,
});

const PILLARS = [
  {
    title: "Cultural",
    desc: "Annual fests, music, dance, drama and the inter-college tournaments that come with them.",
    img: cultureImg,
  },
  {
    title: "Technical",
    desc: "Coding clubs, hackathons, robotics and a steady cadence of departmental events.",
    img: campusLifeImg,
  },
  {
    title: "Sports",
    desc: "Daily play, weekly tournaments and an annual sports meet that brings the campus together.",
    img: sportsImg,
  },
];

function CampusLifePage() {
  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="A campus that lives, all day."
        subtitle="Studies are only the beginning. The campus comes alive in clubs, fests, courts and the spaces in between."
        image={campusLifeImg}
      />

      <section className="py-20 container-narrow space-y-20">
        {PILLARS.map((p, i) => (
          <RevealOnScroll key={p.title}>
            <div
              className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)]"
              />
              <div>
                <div className="text-eyebrow">Pillar {String(i + 1).padStart(2, "0")}</div>
                <h2 className="text-display text-3xl md:text-5xl mt-3 text-ink">{p.title}</h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}
