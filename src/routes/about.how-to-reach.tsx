import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Bus, Train, Plane, Navigation, MapPin } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";
import campusMap from "@/assets/campus-map.png";

export const Route = createFileRoute("/about/how-to-reach")({
  head: () => ({
    meta: [
      { title: "How to Reach — JNTU-GV CEV" },
      { name: "description", content: "Directions to JNTU-GV College of Engineering Vizianagaram campus – by road, rail and air." },
      { property: "og:title", content: "How to Reach JNTU-GV CEV" },
      { property: "og:description", content: "Driving directions, bus routes and transport options to reach the campus." },
    ],
  }),
  component: HowToReachPage,
});

const TRANSPORT = [
  {
    icon: Bus,
    title: "By Bus",
    desc: "From Vizianagaram APSRTC Bus Complex, board any bus going in Saluru – Bobbili Route and disembark at JNTU Bus Stop (around 5.5 KM) and walk 1.5 KM west to reach the Campus.",
    alt: "Or hire an auto-rickshaw from any major point in Vizianagaram to JNTUK UCEV Campus (charges around ₹100/-)",
  },
  {
    icon: Train,
    title: "By Train",
    desc: "Vizianagaram railway junction is on the Chennai–Howrah line. Trains like Visakha Express, Konark Express, Howrah Express, East Coast Express, Hirakhand Express and Dhanbad Express halt here.",
  },
  {
    icon: Plane,
    title: "By Air",
    desc: "The nearest domestic airport is at Visakhapatnam at a distance of 62 km and the nearest international airport is at Shamshabad, Hyderabad at a distance of nearly 640 km.",
  },
];

const DIRECTIONS = [
  { step: "Head west on Bus Stand Rd towards Railway Station Rd", dist: "180 m" },
  { step: "Continue straight at Mayura Junction (Traffic Signals)", dist: "130 m" },
  { step: "At the roundabout, take the 2nd exit and stay on NH 43. Pass by Police Barracks (on the left in 1.1 km)", dist: "5.2 km" },
  { step: "Pass by Collectorate Junction, KL Puram and RTA Office", dist: "" },
  { step: "Continue on JNTUK-Campus Rd to your destination", dist: "2.2 km / 5 min" },
  { step: "Turn left onto JNTUK-Campus Rd", dist: "1.5 km" },
  { step: "Continue straight to reach UCEV", dist: "" },
];

function HowToReachPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="How to Reach Campus"
        subtitle="Located across NH43, well connected to all major cities and towns."
        image={campusImg}
      />

      {/* Transport modes */}
      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Getting here" title="Multiple ways to reach us" />
        </RevealOnScroll>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TRANSPORT.map((t, i) => (
            <RevealOnScroll key={t.title} delay={i * 120}>
              <div className="bg-card rounded-2xl p-8 border border-border hover-lift h-full group">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-5 group-hover:scale-110 transition-transform duration-500">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{t.desc}</p>
                {t.alt && <p className="mt-3 text-sm text-primary font-medium">{t.alt}</p>}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Driving directions */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Driving Directions"
              title="From APSRTC Bus Station, Vizianagaram"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <div className="mt-10 bg-card rounded-2xl border border-border p-8 max-w-2xl">
              <ol className="space-y-4">
                {DIRECTIONS.map((d, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                        {i + 1}
                      </div>
                      {i < DIRECTIONS.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-ink font-medium">{d.step}</p>
                      {d.dist && <p className="text-sm text-muted-foreground mt-1">{d.dist}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Map */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Campus Map" title="Location overview" align="center" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 flex justify-center">
            <img
              src={campusMap}
              alt="Directions map showing route from Vizianagaram to JNTUK UCEV campus"
              loading="lazy"
              className="rounded-3xl border border-border shadow-[var(--shadow-elegant)] max-w-2xl w-full hover:scale-[1.01] transition-transform duration-700"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> JNTU-GV College of Engineering, Dwarapudi, Vizianagaram – 535003
          </p>
        </RevealOnScroll>
      </section>

      {/* Embedded map */}
      <section className="pb-24 container-narrow">
        <RevealOnScroll>
          <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)] aspect-[16/9] bg-sand">
            <iframe
              title="Campus location on map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=83.32%2C18.10%2C83.50%2C18.18&layer=mapnik&marker=18.1418%2C83.4115"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-16 container-narrow text-center">
        <Link to="/contact" className="btn-primary">Contact Us <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </>
  );
}
