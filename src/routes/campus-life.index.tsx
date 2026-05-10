import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";

import campusLifeImg from "@/assets/campus-life.jpg";
import cultureImg from "@/assets/culture.jpeg";
import sportsImg from "@/assets/Ground.jpg";

export const Route = createFileRoute("/campus-life/")({
  head: () => ({
    meta: [
      { title: "Campus Life — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Clubs, festivals, sports and the rhythm of student life on a residential campus.",
      },
      {
        property: "og:title",
        content: "Campus Life at JNTU-GV CEV",
      },
      {
        property: "og:description",
        content:
          "A residential campus full of culture, clubs and conversations.",
      },
      {
        property: "og:image",
        content: campusLifeImg,
      },
    ],
  }),
  component: CampusLifePage,
});

const PILLARS = [
  {
    title: "Cultural",
    desc: "Annual fests, music, dance, drama and the inter-college tournaments that come with them.",
    img: cultureImg,
    link: "/campus-life/music-club",
  },
  {
    title: "Technical",
    desc: "Coding clubs, hackathons, robotics and a steady cadence of departmental events.",
    img: campusLifeImg,
    link: "/campus-life/student-activity-club",
  },
  {
    title: "Sports",
    desc: "Daily play, weekly tournaments and an annual sports meet that brings the campus together.",
    img: sportsImg,
    link: "/sports",
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

      <SubNav items={CAMPUS_LIFE_SUBNAV} />

      <section className="py-20 container-narrow space-y-20">
        {PILLARS.map((p, i) => (
          <RevealOnScroll key={p.title}>
            <Link
              to={p.link}
              className={`grid lg:grid-cols-2 gap-10 items-center group cursor-pointer ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)]">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[4/3] object-cover w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="transition-all duration-300 group-hover:translate-x-1">
                <div className="text-eyebrow">
                  Pillar {String(i + 1).padStart(2, "0")}
                </div>

                <h2 className="text-display text-3xl md:text-5xl mt-3 text-ink">
                  {p.title}
                </h2>

                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
                  Explore More
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}

export default CampusLifePage;