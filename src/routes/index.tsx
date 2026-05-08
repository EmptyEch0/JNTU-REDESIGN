import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowDown,
  Bell,
  MapPin,
  GraduationCap,
  Building2,
  BookOpen,
  Trophy,
  Stethoscope,
  FlaskConical,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import campusLifeImg from "@/assets/campus-life.jpg";
import labImg from "@/assets/lab.jpg";
import hostelImg from "@/assets/hostel.jpg";
import sportsImg from "@/assets/sports.jpg";
import libraryImg from "@/assets/library-interior.jpg";
import cultureImg from "@/assets/culture.jpg";
import placementsImg from "@/assets/placements-bg.jpg";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { ParallaxBg } from "@/components/ParallaxBg";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { SectionLabel } from "@/components/SectionLabel";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { STATS, DEPARTMENTS, RECRUITERS } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JNTU-GV CEV — Engineering Tomorrow, Together" },
      {
        name: "description",
        content:
          "JNTU-GV College of Engineering Vizianagaram: a premier institution for engineering, research and innovation in Andhra Pradesh.",
      },
      { property: "og:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      {
        property: "og:description",
        content: "1450 students. 7 disciplines. One ambition — engineering tomorrow.",
      },
    ],
  }),
  component: HomePage,
});

const FACILITIES = [
  {
    title: "Hostels",
    desc: "318+ rooms across UG & PG residences with modern amenities.",
    img: hostelImg,
    to: "/hostels",
    icon: Building2,
  },
  {
    title: "Library",
    desc: "A quiet, well-stocked knowledge commons open all day.",
    img: libraryImg,
    to: "/library",
    icon: BookOpen,
  },
  {
    title: "Sports",
    desc: "Cricket, athletics, indoor games and a fitness gym.",
    img: sportsImg,
    to: "/sports",
    icon: Trophy,
  },
  {
    title: "Dispensary",
    desc: "On-campus medical care with full-time health assistants.",
    img: cultureImg,
    to: "/dispensary",
    icon: Stethoscope,
  },
  {
    title: "R&D Cell",
    desc: "Funded research with UGC, DST, DAE and NRB.",
    img: labImg,
    to: "/rd-cell",
    icon: FlaskConical,
  },
  {
    title: "Placements",
    desc: "Top recruiters every year — TCS, Infosys, Amazon and more.",
    img: placementsImg,
    to: "/placements",
    icon: Briefcase,
  },
];

function HomePage() {
  return (
    <>
      {/* HERO — auto-rotating slideshow */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <HeroSlideshow
          images={[
            { src: heroImg, alt: "JNTU-GV campus at golden hour" },
            { src: hero2, alt: "Aerial view of campus at sunset" },
            { src: hero3, alt: "Students walking through campus" },
            { src: hero4, alt: "Library at dusk" },
          ]}
          interval={6500}
          minHeight="100svh"
          overlay="linear-gradient(180deg, oklch(0.18 0.05 260 / 0.55) 0%, oklch(0.18 0.05 260 / 0.35) 40%, oklch(0.18 0.05 260 / 0.85) 100%)"
        >
          <div className="container-narrow h-full min-h-[100svh] flex flex-col justify-end pt-32 pb-32 md:pb-36 text-white">
            <div className="text-eyebrow !text-white/80 animate-[fade-up_0.7s_ease-out_0.3s_both]">
              <MapPin className="inline h-3 w-3 mr-1.5 -mt-0.5" />
              Vizianagaram, Andhra Pradesh
            </div>
            <h1 className="text-display text-5xl sm:text-6xl md:text-8xl mt-4 max-w-5xl animate-[fade-up_0.9s_ease-out_0.5s_both]">
              Engineering tomorrow,
              <br />
              <span className="italic text-white/85">together.</span>
            </h1>
            <p className="mt-6 text-base md:text-xl text-white/80 max-w-2xl leading-relaxed animate-[fade-up_0.9s_ease-out_0.8s_both]">
              A constituent college of JNTU-GV — where 1,450 minds learn, build and shape the future
              of engineering on a campus that lives and breathes ideas.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 animate-[fade-up_0.9s_ease-out_1s_both]">
              <Link to="/admissions" className="btn-primary">
                Admissions <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/campus-life" className="btn-ghost">
                Explore Campus
              </Link>
              <Link to="/notices" className="btn-ghost">
                <Bell className="h-4 w-4" /> Notices
              </Link>
            </div>
          </div>
        </HeroSlideshow>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite] z-20 pointer-events-none">
          <span>Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </section>

      {/* ABOUT + STATS SPLIT */}
      <section className="py-24 md:py-36 relative">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="container-narrow grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <RevealOnScroll className="lg:col-span-6">
            <div className="text-eyebrow">Who we are</div>
            <h2 className="text-display text-4xl md:text-6xl mt-3 text-ink">
              A campus where <span className="italic text-primary">curiosity</span> meets craft.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Established as a constituent college of Jawaharlal Nehru Technological University
              Gurajada Vizianagaram, our campus brings together rigorous academics, practical labs,
              and a thriving residential community. From first-year orientation to final-year
              placements, every step is designed for depth.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We believe great engineering is born in the everyday — in honest classrooms, in
              late-night lab benches, in the quiet of the library at dawn.
            </p>
            <Link
              to="/about"
              className="story-link mt-8 inline-flex items-center gap-2 text-primary font-medium"
            >
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-6" delay={150}>
            <div className="grid grid-cols-2 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
              {STATS.map((s) => (
                <div key={s.label} className="bg-card p-8 md:p-10">
                  <StatCounter value={s.value} label={s.label} />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              A residential campus by design — most students live, learn and grow on-site.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* DEPARTMENTS — horizontal scroll */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Departments"
              title="Seven disciplines, one rigorous mind."
              subtitle="From the foundational sciences to applied engineering, each department is led by faculty who teach, research and mentor in equal measure."
            />
          </RevealOnScroll>
        </div>
        <RevealOnScroll className="mt-12" delay={150}>
          <div className="overflow-x-auto pb-6 [scrollbar-width:thin] snap-x snap-mandatory">
            <div className="flex gap-5 px-[max(1.25rem,calc((100vw-1280px)/2+2rem))]">
              {DEPARTMENTS.map((d, i) => (
                <Link
                  key={d.code}
                  to="/departments"
                  className="snap-start group shrink-0 w-[280px] md:w-[340px] aspect-[3/4] relative rounded-3xl overflow-hidden bg-[var(--gradient-royal)] hover-lift"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                      background: `radial-gradient(circle at ${20 + i * 12}% ${30 + i * 8}%, white, transparent 60%)`,
                    }}
                  />
                  <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-eyebrow !text-white/70">
                        Dept {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="h-10 w-10 rounded-full grid place-items-center bg-white/15 backdrop-blur-md group-hover:bg-white group-hover:text-primary transition-all duration-500">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-display text-5xl md:text-6xl font-semibold opacity-90">
                        {d.code}
                      </div>
                      <div className="mt-3 text-base font-medium leading-snug">{d.name}</div>
                      <div className="mt-2 text-sm text-white/70">{d.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* FACILITIES — interactive showcase */}
      <section className="py-24 md:py-32">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <SectionLabel
                eyebrow="Facilities"
                title="Everything you need, on campus."
                subtitle="Hover to see more. Click any tile to step inside."
              />
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-5">
            {FACILITIES.map((f, i) => {
              const span = [
                "md:col-span-3 md:row-span-2",
                "md:col-span-3",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-3",
              ][i];
              const tall = i === 0;
              return (
                <RevealOnScroll key={f.title} className={span} delay={i * 80}>
                  <Link
                    to={f.to}
                    className={`group relative block rounded-3xl overflow-hidden ${tall ? "h-[480px] md:h-full min-h-[440px]" : "h-[260px]"} hover-lift`}
                  >
                    <img
                      src={f.img}
                      alt={f.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                    <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-2 text-eyebrow !text-white/70 mb-2">
                        <f.icon className="h-3.5 w-3.5" /> Facility
                      </div>
                      <h3 className="text-display text-2xl md:text-3xl">{f.title}</h3>
                      <p className="mt-2 text-sm text-white/75 max-w-md max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                        {f.desc}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:text-white">
                        Explore{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE — parallax */}
      <ParallaxBg
        src={campusLifeImg}
        alt="Students on campus"
        speed={0.35}
        minHeight="80vh"
        overlay="linear-gradient(135deg, oklch(0.20 0.10 265 / 0.7), oklch(0.18 0.10 285 / 0.55))"
      >
        <div className="h-full min-h-[80vh] flex items-center">
          <div className="container-narrow text-white">
            <RevealOnScroll>
              <div className="max-w-2xl">
                <div className="text-eyebrow !text-white/70">Campus Life</div>
                <h2 className="text-display text-4xl md:text-6xl mt-3">
                  Where studies end and stories begin.
                </h2>
                <p className="mt-6 text-lg text-white/80 leading-relaxed">
                  A residential campus that hums with cultural fests, technical clubs, NSS drives,
                  sports tournaments and quiet conversations under the trees. There is rhythm here —
                  and room for every kind of student.
                </p>
                <Link to="/campus-life" className="btn-ghost mt-8">
                  Step inside <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </ParallaxBg>

      {/* PLACEMENTS */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Placements"
              title="From classroom to career."
              subtitle="Year after year, our students land roles at leading consulting, product and core engineering firms."
            />
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border">
            <RevealOnScroll className="bg-card p-8">
              <StatCounter value={420} label="Offers / Year" suffix="+" />
            </RevealOnScroll>
            <RevealOnScroll className="bg-card p-8" delay={80}>
              <StatCounter value={42} label="LPA Top Package" suffix="L" />
            </RevealOnScroll>
            <RevealOnScroll className="bg-card p-8" delay={160}>
              <StatCounter value={85} label="Recruiters" suffix="+" />
            </RevealOnScroll>
            <RevealOnScroll className="bg-card p-8" delay={240}>
              <StatCounter value={92} label="Placement %" suffix="%" />
            </RevealOnScroll>
          </div>

          <div className="mt-14">
            <div className="text-eyebrow text-center mb-4">Trusted by recruiters</div>
            <MarqueeLogos items={RECRUITERS} />
          </div>

          <div className="mt-10 text-center">
            <Link to="/placements" className="btn-primary">
              View placements report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="py-24 md:py-32">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <SectionLabel eyebrow="Gallery" title="A campus, in moments." />
              <Link
                to="/gallery"
                className="story-link text-primary font-medium inline-flex items-center gap-2"
              >
                Open gallery <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mt-12" delay={120}>
            <div className="grid grid-cols-12 gap-4 md:gap-5">
              <img
                src={cultureImg}
                alt="Cultural fest"
                loading="lazy"
                className="col-span-12 md:col-span-7 aspect-[16/10] w-full object-cover rounded-3xl hover-lift"
              />
              <img
                src={labImg}
                alt="Lab"
                loading="lazy"
                className="col-span-12 md:col-span-5 aspect-[16/10] w-full object-cover rounded-3xl hover-lift"
              />
              <img
                src={sportsImg}
                alt="Sports"
                loading="lazy"
                className="col-span-6 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
              />
              <img
                src={libraryImg}
                alt="Library"
                loading="lazy"
                className="col-span-6 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
              />
              <img
                src={hostelImg}
                alt="Hostel"
                loading="lazy"
                className="col-span-12 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-24">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[40px] bg-[oklch(0.18_0.04_255)] p-10 md:p-16 text-white shadow-[var(--shadow-elegant)] border border-white/5">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
              />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="max-w-xl">
                  <div className="text-eyebrow !text-white/60 flex items-center gap-2">
                    Contact Us
                  </div>
                  <h3 className="text-display text-4xl md:text-5xl mt-4">
                    Have questions? <br />
                    <span className="text-primary-glow">We're here to help.</span>
                  </h3>
                  <p className="mt-6 text-white/50 leading-relaxed max-w-md">
                    Reach out to our administrative office for admissions, academic inquiries, or
                    general information.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
                  <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
                      Contact Number
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-glow shadow-inner">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold tracking-tight">
                        08922 277388
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
                      Email Support
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-glow shadow-inner">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold tracking-tight">
                        principal@jntugv.edu.in
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
