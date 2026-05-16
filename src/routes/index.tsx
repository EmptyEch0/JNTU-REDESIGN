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
  Eye,
  Target,
  Shield,
  Quote,
  CheckCircle2,
  Users,
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
import cultureImg from "@/assets/culture.jpeg";
import placementsImg from "@/assets/placements-bg.jpg";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { ParallaxBg } from "@/components/ParallaxBg";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { SectionLabel } from "@/components/SectionLabel";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { STATS, DEPARTMENTS, RECRUITERS } from "@/lib/site";
import { useQuery } from "@tanstack/react-query";
import { getLeadershipData } from "@/funcs/leadership";

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
  const { data: principal } = useQuery({
    queryKey: ["leadership", "principal"],
    queryFn: () => getLeadershipData({ data: "principal" }),
  });

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
            <div className="text-eyebrow !text-white/80 animate-[fade-up_0.7s_ease-out_0.3s_both] flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                Vizianagaram, AP
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Established in 2007</span>
            </div>
            <h1 className="text-display text-5xl sm:text-6xl md:text-8xl mt-4 max-w-5xl animate-[fade-up_0.9s_ease-out_0.5s_both]">
              Engineering tomorrow,
              <br />
              <span className="italic text-white/85">together.</span>
            </h1>
            <p className="mt-6 text-base md:text-xl text-white/80 max-w-2xl leading-relaxed animate-[fade-up_0.9s_ease-out_0.8s_both]">
              A constituent college of JNTU-GV, approved by AICTE New Delhi, and recognized by UGC
              under section 2(f) & 12(B) of UGC Act 1956 — shaping the future of engineering since 2007.
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

      {/* ABOUT, VISION & PRINCIPAL SECTION */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-glow)" }}
        />
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="container-narrow">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left Content: Who we are, Vision & Mission */}
            <div className="lg:col-span-8 space-y-10">
              <RevealOnScroll>
                <div className="text-eyebrow">Who we are</div>
                <h2 className="text-display text-4xl md:text-6xl mt-3 text-ink leading-[1.1]">
                  Building <span className="italic text-primary">excellence</span>,<br />
                  shaping futures.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Established in 2007 as a constituent college of JNTU-GV, our institution is 
                  recognized by UGC under section 2(f) & 12(B) and approved by AICTE. We bring 
                  together rigorous academics and a thriving research community.
                </p>
              </RevealOnScroll>

              <div className="space-y-6">
                <RevealOnScroll delay={100}>
                  <div className="group p-8 rounded-[32px] bg-white border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-500">
                    <div className="flex gap-6 items-start">
                      <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Eye className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ink mb-2">Our Vision</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          To emerge as a premier technical Institution in the field of engineering and 
                          research, with a dedicated focus on producing professionally competent and 
                          socially sensitive engineers capable of thriving in a multidisciplinary 
                          global environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                  <div className="group p-8 rounded-[32px] bg-white border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-500">
                    <div className="flex gap-6 items-start">
                      <div className="h-12 w-12 shrink-0 rounded-2xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ink mb-2">Core Mission</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We are committed to providing high-quality technical education through a 
                          creative balance of academia and industry. By adopting highly effective 
                          teaching-learning processes and promoting multidisciplinary research, 
                          we inculcate ethical and moral values that contribute to professional 
                          growth and societal development.
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll delay={300}>
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <Link to="/about/vision-mission" className="story-link inline-flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                    View full mandate <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="h-px w-12 bg-border hidden sm:block" />
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <Shield className="h-3.5 w-3.5" /> AICTE Approved
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right Content: Principal Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <RevealOnScroll delay={200}>
                <div className="relative group mx-auto max-w-[380px]">
                  {/* Decorative blobs */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
                  
                  <div className="relative bg-card rounded-[40px] p-6 md:p-8 border border-border shadow-elegant overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                    <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden mb-6 border border-white/50 shadow-inner group/img bg-slate-100">
                      {principal?.image ? (
                        <img 
                          src={principal.image} 
                          alt={principal.name} 
                          className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover/img:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center bg-slate-50">
                          <Users className="h-12 w-12 text-slate-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold text-white uppercase tracking-widest">
                           <CheckCircle2 className="h-3 w-3" /> {principal?.designation?.split(',')[0] || "Principal"}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-black mb-2">Leadership</div>
                        <h3 className="text-2xl font-bold text-ink leading-tight">{principal?.name || "Dr. K. Chandra Bhushana Rao"}</h3>
                        <p className="text-muted-foreground text-sm font-medium mt-1">
                          {principal?.designation?.includes(',') ? principal.designation.split(',').slice(1).join(',') : "Principal, JNTU-GV CEV"}
                        </p>
                      </div>
                      
                      <div className="relative">
                        <Quote className="h-10 w-10 text-primary/10 absolute -top-4 -left-4 -z-10" />
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "{principal?.quote || "Our goal is to produce engineers who are not only technically competent but also socially sensitive to global challenges."}"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border flex items-center justify-between">
                        <Link to="/administration/principal" className="btn-primary !px-6 !py-3 !text-[11px]">
                          Principal's Desk <ArrowRight className="h-4 w-4" />
                        </Link>
                        <div className="flex flex-col items-end">
                           <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">Member</div>
                           <div className="text-[11px] font-black text-ink">IEEE Senior Member</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Stats integrated as a lower strip */}
          <RevealOnScroll delay={400} className="mt-20 lg:mt-28">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-[32px] overflow-hidden border border-border shadow-sm">
              {STATS.map((s, i) => (
                <div key={s.label} className="bg-white p-8 lg:p-10 hover:bg-slate-50 transition-colors group">
                  <StatCounter value={s.value} label={s.label} />
                  <div className="mt-2 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              ))}
            </div>
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

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {FACILITIES.map((f, i) => {
              return (
                <RevealOnScroll key={f.title} delay={i * 80}>
                  <Link
                    to={f.to}
                    className="group relative block rounded-3xl overflow-hidden h-[340px] hover-lift"
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
