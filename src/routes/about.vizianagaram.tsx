import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, MapPin, Music, Crown, Landmark } from "lucide-react";
import vizImg from "@/assets/vizianagaram.jpg";

export const Route = createFileRoute("/about/vizianagaram")({
  head: () => ({
    meta: [
      { title: "About Vizianagaram — JNTU-GV CEV" },
      { name: "description", content: "Vizianagaram – the City of Victory. 500 years of glorious past, rich cultural heritage, and the cultural capital of Andhra Pradesh." },
      { property: "og:title", content: "About Vizianagaram" },
      { property: "og:description", content: "The cultural capital of Andhra Pradesh with 500 years of heritage." },
    ],
  }),
  component: VizPage,
});

const PERSONALITIES = [
  { name: "Dr. P.V.G. Raju", desc: "The Raja Saheb who renounced his Zamindari without compensation for the cause of education." },
  { name: "Sri Gurajada Apparao", desc: "The great social reformer and literary icon." },
  { name: "Sri Adibhatla Narayana Das", desc: "The celebrated poet and singer." },
  { name: "Kodi Rammurthy", desc: "The legendary wrestler who brought glory to the region." },
  { name: "Dwaram Venkataswamy Naidu", desc: "Renowned violinist and musician." },
  { name: "Gantasala Venkateswara Rao", desc: "The divine singer and legendary playback artist." },
];

function VizPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Vizianagaram — The City of Victory"
        subtitle="500 years of glorious past and rich cultural heritage made Vizianagaram the cultural capital of Andhra Pradesh."
        image={vizImg}
      />

      <section className="py-24 md:py-32 container-narrow grid lg:grid-cols-2 gap-16 items-start">
        <RevealOnScroll>
          <img src={vizImg} alt="Vizianagaram Clock Tower" loading="lazy" className="rounded-3xl aspect-[3/4] object-cover w-full shadow-[var(--shadow-elegant)] hover:scale-[1.02] transition-transform duration-700" />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          <div className="text-eyebrow flex items-center gap-2"><MapPin className="h-3 w-3" /> The City</div>
          <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">A city steeped in history</h2>
          <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Vizianagaram is the main city of the Vizianagaram District of North Eastern Andhra Pradesh in Southern India. An important centre for commerce and education, the city is located 18 km inland from the Bay of Bengal and 42 km to the northeast of Visakhapatnam. Vizianagaram translates to the "city of victory".
            </p>
            <p>
              It is, at present, the largest municipality of Andhra Pradesh in terms of population. As of 2011 Census of India, the town had a population of 227,533.
            </p>
            <p>
              The climate of Vizianagaram is characterized by high humidity nearly all the year round, with oppressive summers and good seasonal rainfall. The summer season extends from March to May, followed by the southwest monsoon season, which continues to September.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* Cultural Heritage */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Heritage" title="Eminent personalities" subtitle="Many luminaries have added new dimensions of glory to Vizianagaram." align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONALITIES.map((p, i) => (
              <RevealOnScroll key={p.name} delay={i * 80}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                    {i < 2 ? <Crown className="h-5 w-5" /> : i < 4 ? <Landmark className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                  </div>
                  <h3 className="text-base font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Fort & Education */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <div className="text-eyebrow">Education Legacy</div>
            <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">The citadel of education</h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              The Raja Saheb Dr. P.V.G. Raju who inherits the socialistic fervor and the spirit of religious tolerance from his ancestors renounced his Zamindari without taking any compensation and their fort is now entirely becoming the citadel of education which houses one of the oldest colleges — Maharaja College (1879) — in India.
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              The talented musicians Dwaram Venkata Swami Naidu, Saluri Rajeswara Rao hail from this place. The divine singers Gantasala and Suseela who were the proud students of Maharaja College of Music added indescribable grace to the art of singing.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* Transport */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Connectivity" title="Transportation" />
          </RevealOnScroll>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { title: "Roadways", desc: "APSRTC operates bus services from Vizianagaram to all major cities and towns in the state." },
              { title: "Railways", desc: "Vizianagaram railway station is on the Khurda Road-Visakhapatnam section of Howrah-Chennai main line. Many important trains halt here." },
              { title: "Airport", desc: "The nearest airport is in Visakhapatnam which is about 62 km from Vizianagaram." },
            ].map((t, i) => (
              <RevealOnScroll key={t.title} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full">
                  <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                  <p className="mt-3 text-muted-foreground">{t.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container-narrow text-center">
        <Link to="/about/how-to-reach" className="btn-primary">How to Reach Campus <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </>
  );
}
