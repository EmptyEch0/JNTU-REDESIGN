import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProfileCard } from "@/components/ProfileCard";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { Droplets, Dumbbell, UtensilsCrossed, Wifi, Shield, Sparkles } from "lucide-react";
import hostelImg from "@/assets/hostel.jpg";

export const Route = createFileRoute("/hostels")({
  head: () => ({
    meta: [
      { title: "Hostels — JNTU-GV CEV" },
      { name: "description", content: "Residential life at JNTU-GV CEV — UG and PG hostels with full amenities." },
      { property: "og:title", content: "Hostels at JNTU-GV CEV" },
      { property: "og:description", content: "318+ rooms across UG Boys, PG Boys and Girls residences with RO water, gym and dining." },
      { property: "og:image", content: hostelImg },
    ],
  }),
  component: HostelsPage,
});

const TABS = [
  { key: "ug-boys", label: "UG Boys", rooms: 109, warden: { name: "Dr. K. Srinivasa Rao", role: "Chief Warden, UG Boys" } },
  { key: "pg-boys", label: "PG Boys", rooms: 96, warden: { name: "Dr. M. Ramesh Babu", role: "Chief Warden, PG Boys" } },
  { key: "girls", label: "Girls", rooms: 113, warden: { name: "Dr. Ch. Bindu Madhuri", role: "Chief Warden, Girls Hostel" } },
];

const FACILITIES = [
  { icon: Droplets, title: "RO Drinking Water", desc: "Filtered drinking water on every floor." },
  { icon: UtensilsCrossed, title: "Dining Hall", desc: "Hygienic mess with rotating multi-cuisine menus." },
  { icon: Dumbbell, title: "Gym & Recreation", desc: "Fitness equipment and indoor games." },
  { icon: Wifi, title: "Wi-Fi Connectivity", desc: "Campus-wide internet across all blocks." },
  { icon: Shield, title: "24×7 Security", desc: "Manned entry, biometric access for residents." },
  { icon: Sparkles, title: "Housekeeping", desc: "Daily cleaning of common areas." },
];

function HostelsPage() {
  const [tab, setTab] = useState(TABS[0].key);
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <>
      <PageHero
        eyebrow="Hostels"
        title="A campus that feels like home."
        subtitle="Three residential blocks, 318+ rooms, full-time wardens and the small comforts that turn a building into a home."
      />

      {/* Stats */}
      <section className="py-20 container-narrow">
        <div className="grid grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          {TABS.map((t) => (
            <div key={t.key} className="bg-card p-8 text-center">
              <StatCounter value={t.rooms} label={`${t.label} Rooms`} />
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 container-narrow">
        <div className="flex flex-wrap gap-2 justify-center">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                  : "bg-card text-foreground border border-border hover:border-primary/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <RevealOnScroll className="mt-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img src={hostelImg} alt={`${active.label} hostel`} loading="lazy" className="rounded-3xl aspect-[4/3] object-cover w-full" />
            <div>
              <div className="text-eyebrow">{active.label} Residence</div>
              <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                {active.rooms} rooms · full-time warden support
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                The {active.label.toLowerCase()} hostel is led by {active.warden.name}, supported by a deputy warden team and dedicated health assistants. Rooms are designed for focused study and easy living.
              </p>
              <div className="mt-6">
                <ProfileCard name={active.warden.name} role={active.warden.role} badge="Chief Warden" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="In every block" title="The everyday essentials, well-handled." align="center" />
          </RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FACILITIES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 60}>
                <div className="bg-card p-6 rounded-2xl border border-border hover-lift h-full">
                  <div className="h-11 w-11 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Health team */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Health Assistants" title="Care, around the clock." align="center" />
        </RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <RevealOnScroll>
            <ProfileCard name="Sri Venkata Krishna" role="Health Assistant" detail="On-site first response and routine care for resident students." badge="Hostel Care" />
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <ProfileCard name="Ms. G. Krishna Veni" role="Health Assistant" detail="Coordinates clinic visits and student wellness checks." badge="Hostel Care" />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
