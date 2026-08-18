import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  Plane,
  Globe,
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
} from "@/components/AdminEditPanel";

const airportDayImg = "/images/airport/bhogapuram-airport-day.png";
const airportNightImg = "/images/airport/bhogapuram-airport-night.jpg";

export const Route = createFileRoute("/about/airport-connectivity")({
  loader: async () => await getPageContent({ data: "airport-connectivity" }),
  head: () => ({
    meta: [
      { title: "Airport Connectivity — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Strategically located approximately 36 km from Alluri Sitarama Raju International Airport (Bhogapuram Airport), unlocking domestic & global connectivity for JNTU-GV.",
      },
      { property: "og:title", content: "Airport Connectivity — JNTU-GV CEV" },
      {
        property: "og:description",
        content:
          "Strategic aviation connectivity near Alluri Sitarama Raju International Airport (Bhogapuram Airport) for JNTU-GV College of Engineering Vizianagaram.",
      },
      { property: "og:image", content: airportNightImg },
    ],
  }),
  component: AirportConnectivityPage,
});

const DEFAULTS = {
  heroEyebrow: "Strategic Location",
  heroTitle: "Airport Connectivity",
  heroSubtitle:
    "Strategically located near Alluri Sitarama Raju International Airport (Bhogapuram Airport) — connecting JNTU-GV with India and the world.",
  introLead:
    "JNTU-GV College of Engineering, Vizianagaram enjoys a strategic location approximately 36 km from Alluri Sitarama Raju International Airport (Bhogapuram Airport), the major new aviation gateway serving the North Andhra region.",
  introSub:
    "The airport's proximity provides enhanced accessibility to the campus for students, faculty, researchers, industry professionals, parents, visitors and international guests.",
  gatewayTitle: "A Gateway to JNTU-GV",
  gatewayContent:
    "With the development of Bhogapuram Airport, the region is gaining stronger connectivity with major cities and destinations across India and beyond. This creates new opportunities for academic collaboration, industry interaction, research partnerships, conferences and institutional visits.",
};

const IMPACT_AREAS = [
  {
    icon: GraduationCap,
    title: "Academic Collaboration",
    desc: "Easy access for visiting professors, guest lecturers, eminent researchers, university partners, and international academic delegations.",
    accent: "from-blue-600/15 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Briefcase,
    title: "Industry Interaction",
    desc: "Accelerated accessibility for corporate recruiters, Fortune 500 tech leaders, industry experts, and innovation partners conducting on-campus recruitment.",
    accent: "from-amber-600/15 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Globe,
    title: "National & International Exposure",
    desc: "Better connectivity for students and faculty participating in premier hackathons, conferences, internships, student exchange programs, and international research symposiums.",
    accent: "from-indigo-600/15 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Users,
    title: "Campus Visits",
    desc: "A streamlined, convenient travel corridor for parents, prospective students, distinguished alumni, conference dignitaries, and institutional guests.",
    accent: "from-emerald-600/15 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

function AirportConnectivityPage() {
  const records = (Route.useLoaderData() as any[]) || [];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const introRec = records.find((r) => r.sectionKey === "intro");
  const gatewayRec = records.find((r) => r.sectionKey === "gateway");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    introLead: introRec?.title || DEFAULTS.introLead,
    introSub: introRec?.content || DEFAULTS.introSub,
    gatewayTitle: gatewayRec?.title || DEFAULTS.gatewayTitle,
    gatewayContent: gatewayRec?.content || DEFAULTS.gatewayContent,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      introLead: introRec?.title || DEFAULTS.introLead,
      introSub: introRec?.content || DEFAULTS.introSub,
      gatewayTitle: gatewayRec?.title || DEFAULTS.gatewayTitle,
      gatewayContent: gatewayRec?.content || DEFAULTS.gatewayContent,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "airport-connectivity",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "intro") {
        await updatePageSection({
          data: {
            page: "airport-connectivity",
            sectionKey: "intro",
            title: editTexts.introLead,
            content: editTexts.introSub,
          },
        });
      } else if (section === "gateway") {
        await updatePageSection({
          data: {
            page: "airport-connectivity",
            sectionKey: "gateway",
            title: editTexts.gatewayTitle,
            content: editTexts.gatewayContent,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  return (
    <>
      {isEditMode && <AdminModeBanner label="Airport Connectivity Editor Active" />}

      <PageHero
        eyebrow="Location & Global Reach"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={airportNightImg}
      />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Section">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-4">
              <AdminField label="Hero Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                />
              </AdminField>
              <AdminField label="Hero Subtitle">
                <AdminTextarea
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  rows={2}
                />
              </AdminField>
            </div>
          </AdminPanel>
        </section>
      )}

      {/* Strategic Location Overview */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container-narrow">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Plane className="h-3.5 w-3.5" />
                  Alluri Sitarama Raju International Airport
                </div>

                {isEditMode ? (
                  <AdminPanel>
                    <AdminPanelHeader title="Edit Intro Content">
                      <AdminSaveButton onClick={() => handleSaveSection("intro")} label="Save Intro" />
                    </AdminPanelHeader>
                    <div className="space-y-4">
                      <AdminField label="Strategic Location Main Paragraph">
                        <AdminTextarea
                          value={editTexts.introLead}
                          onChange={(e) => setEditTexts({ ...editTexts, introLead: e.target.value })}
                          rows={4}
                        />
                      </AdminField>
                      <AdminField label="Accessibility Follow-up Paragraph">
                        <AdminTextarea
                          value={editTexts.introSub}
                          onChange={(e) => setEditTexts({ ...editTexts, introSub: e.target.value })}
                          rows={3}
                        />
                      </AdminField>
                    </div>
                  </AdminPanel>
                ) : (
                  <>
                    <h2 className="text-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight text-ink font-bold">
                      Strategically Located Near Alluri Sitarama Raju International Airport
                    </h2>

                    <p className="text-lg md:text-xl text-ink font-medium leading-relaxed">
                      {editTexts.introLead}
                    </p>

                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {editTexts.introSub}
                    </p>
                  </>
                )}

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-xs">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      36
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        Distance
                      </div>
                      <div className="text-sm font-bold text-ink">KM to Campus</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-xs">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        Region
                      </div>
                      <div className="text-sm font-bold text-ink">North Andhra Gateway</div>
                    </div>
                  </div>

                  <Link
                    to="/about/how-to-reach"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
                  >
                    View campus directions <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Day View Airport Image Card */}
              <div className="lg:col-span-5">
                <div className="relative group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-elegant)]">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={airportDayImg}
                      alt="Bhogapuram International Airport daylight terminal view"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 bg-card/95 backdrop-blur-sm border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-ink text-sm">Bhogapuram International Airport</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Modern terminal & apron view
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                        Modern Aviation Hub
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Gateway Section with Night Visual */}
      <section className="py-20 bg-sand/60 relative">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Night View Airport Image */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={airportNightImg}
                      alt="Alluri Sitarama Raju International Airport illuminated architectural view"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 bg-card/95 backdrop-blur-sm border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-ink text-sm">State-of-the-Art Architecture</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Alluri Sitarama Raju International Airport
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-primary/10 text-primary rounded-full">
                        Bhogapuram
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div className="flex items-center gap-2 text-2xl">
                  <span>🌐</span>
                  <span className="text-xs uppercase font-bold tracking-wider text-primary">
                    Global Connectivity
                  </span>
                </div>

                {isEditMode ? (
                  <AdminPanel>
                    <AdminPanelHeader title="Edit Gateway Section">
                      <AdminSaveButton onClick={() => handleSaveSection("gateway")} label="Save Gateway" />
                    </AdminPanelHeader>
                    <div className="space-y-4">
                      <AdminField label="Section Heading">
                        <AdminInput
                          value={editTexts.gatewayTitle}
                          onChange={(e) => setEditTexts({ ...editTexts, gatewayTitle: e.target.value })}
                        />
                      </AdminField>
                      <AdminField label="Section Description">
                        <AdminTextarea
                          value={editTexts.gatewayContent}
                          onChange={(e) =>
                            setEditTexts({ ...editTexts, gatewayContent: e.target.value })
                          }
                          rows={5}
                        />
                      </AdminField>
                    </div>
                  </AdminPanel>
                ) : (
                  <>
                    <h3 className="text-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
                      {editTexts.gatewayTitle}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {editTexts.gatewayContent}
                    </p>
                  </>
                )}

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm text-ink">Academic Delegations</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Seamless global & national visits for researchers and professors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm text-ink">Corporate Recruitment</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Direct travel corridor for industry recruiters and leaders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Why It Matters to JNTU-GV */}
      <section className="py-24 bg-background relative">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Institutional Impact"
              title="🎓 Why It Matters to JNTU-GV"
              align="center"
            />
            <p className="mt-4 text-center text-ink font-medium max-w-3xl mx-auto text-base md:text-lg">
              The airport's proximity strengthens the university's position as an accessible centre
              for technical education, innovation and research in North Andhra Pradesh.
            </p>
          </RevealOnScroll>

          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {IMPACT_AREAS.map((item, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="bg-card rounded-3xl p-8 border border-border shadow-[var(--shadow-card)] hover-lift h-full flex flex-col justify-between relative overflow-hidden group">
                  <div
                    className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${item.accent} rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-125`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`h-14 w-14 rounded-2xl ${item.iconBg} grid place-items-center mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="h-7 w-7" />
                    </div>

                    <h4 className="text-display text-xl sm:text-2xl font-bold text-ink">
                      {item.title}
                    </h4>

                    <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-5 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Key Institutional Pillar</span>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation CTA */}
      <section className="py-16 bg-sand/40 border-t border-border">
        <div className="container-narrow text-center">
          <h4 className="text-display text-2xl font-bold text-ink mb-3">Explore Further</h4>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Discover more about our institution, heritage city, and how to reach the campus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about/institution" className="btn-secondary">
              About Institution <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about/how-to-reach" className="btn-primary">
              How to Reach Campus <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about/vizianagaram" className="btn-secondary">
              About Vizianagaram <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
