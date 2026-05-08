import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import sportsImg from "@/assets/sports.jpg";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Sports — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Outdoor and indoor sports facilities, tournaments and a fitness culture on campus.",
      },
      { property: "og:title", content: "Sports at JNTU-GV CEV" },
      { property: "og:description", content: "Cricket, athletics, indoor games and a campus gym." },
      { property: "og:image", content: sportsImg },
    ],
  }),
  component: SportsPage,
});

const SPORTS = [
  { name: "Cricket", desc: "Full-size ground hosting inter-college tournaments." },
  { name: "Athletics", desc: "Track events, long jump and throwing pits." },
  { name: "Volleyball", desc: "Outdoor courts open through the day." },
  { name: "Basketball", desc: "Half and full-court games every evening." },
  { name: "Badminton", desc: "Indoor wooden courts with regular practice." },
  { name: "Table Tennis", desc: "Multiple tables in the indoor sports hall." },
  { name: "Chess", desc: "Active club with regular tournaments." },
  { name: "Gymnasium", desc: "Cardio and strength equipment for residents." },
];

function SportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sports"
        title="Engineers who run, swing, jump — and play to win."
        subtitle="A robust sports culture on campus, with facilities for every game and a calendar full of events."
        image={sportsImg}
      />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <img
            src={sportsImg}
            alt="Sports ground"
            loading="lazy"
            className="rounded-3xl aspect-[16/8] object-cover w-full shadow-[var(--shadow-elegant)]"
          />
        </RevealOnScroll>
      </section>

      <section className="py-16 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="On offer" title="Eight disciplines, one fitness culture." />
        </RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPORTS.map((s, i) => (
            <RevealOnScroll key={s.name} delay={i * 50}>
              <div className="p-6 bg-card rounded-2xl border border-border hover-lift h-full">
                <div className="text-eyebrow">Sport {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-display text-xl mt-2 text-ink">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
