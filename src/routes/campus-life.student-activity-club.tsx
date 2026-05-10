import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";
import { getStudentActivityData } from "@/funcs/studentactivity.server";
import cultureImg from "@/assets/culture.jpg";
import { 
  Building, 
  Sparkles, 
  User, 
  Trophy, 
  Activity, 
  ArrowRight,
  Music 
} from "lucide-react";

export const Route = createFileRoute("/campus-life/student-activity-club")({
  loader: async () => await getStudentActivityData(),
  component: StudentActivityClubPage,
});

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200";

function StudentActivityClubPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Overview");
  const path = useRouterState({ select: (s) => s.location.pathname });

  const clubs = Array.isArray(data?.clubs) ? data.clubs : [];

  // Generate dynamic tabs list
  const TABS = ["Overview", ...clubs.map((c: any) => c.name)];

  // Helper to resolve specific icons
  const getTabIcon = (t: string) => {
    if (t === "Overview") return Sparkles;
    if (t.toLowerCase().includes("music")) return Music;
    if (t.toLowerCase().includes("vykya")) return User;
    if (t.toLowerCase().includes("constelle")) return Trophy;
    return Activity;
  };

  // Collect slide images dynamically: 
  // If Overview, collect heroImage fields from all clubs. If inside a specific club, collect its images.
  const getCarouselImages = () => {
    if (tab === "Overview") {
      const heroImgs = clubs.map((c: any) => c.heroImage).filter(Boolean);
      return heroImgs.length > 0 ? heroImgs : [DEFAULT_IMAGE];
    }
    const activeClub = clubs.find((c: any) => c.name === tab);
    const clubImgs = activeClub?.images?.map((img: any) => img.url) || [];
    return clubImgs.length > 0 ? clubImgs : (activeClub?.heroImage ? [activeClub.heroImage] : [DEFAULT_IMAGE]);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero 
        eyebrow="Student Community"
        title="Student Activity Clubs" 
        subtitle="Fostering communication, technical skills, and physical well-being through student-led initiatives." 
        image={clubs?.[0]?.heroImage || DEFAULT_IMAGE}
      />
      <SubNav items={CAMPUS_LIFE_SUBNAV} />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          {TABS.map((t) => (
            <TabBtn 
              key={t}
              label={t} 
              active={tab === t} 
              onClick={() => setTab(t)} 
              icon={getTabIcon(t)} 
            />
          ))}
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={DEFAULT_IMAGE} />

          {/* ================= OVERVIEW ================= */}
          {tab === "Overview" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Student Activity Clubs" icon={Sparkles}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Welcome to the University Student Activity Clubs. Our active student-led initiatives provide platforms for student voices, 
                  peer learning, and creative talent incubation. By collaborating across departments and years, students build lifelong networks, 
                  technical proficiency, and robust leadership skills. Explore our active clubs below to find your community and grow your passions!
                </p>
              </Card>

              {/* Dynamic Quick Explore Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club: any) => (
                  <div 
                    key={club.id} 
                    onClick={() => setTab(club.name)} 
                    className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-4">
                      {club.category || "Student Club"}
                    </span>
                    <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-[oklch(0.42_0.18_265)] transition-colors mb-2">
                      {club.name}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
                      {club.description}
                    </p>
                    <span className="text-[oklch(0.42_0.18_265)] font-semibold text-xs flex items-center gap-1">
                      Explore Club <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                ))}
              </div>

              {clubs.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic text-sm bg-white rounded-2xl border border-slate-200/60 p-6">
                  No active student clubs retrieved from database. Run seeding to add clubs.
                </div>
              )}
            </div>
          )}

          {/* ================= DYNAMIC CLUB TAB SHOWCASE ================= */}
          {tab !== "Overview" && (() => {
            const activeClub = clubs.find((c: any) => c.name === tab);
            if (!activeClub) return null;

            return (
              <Card title={activeClub.name} icon={getTabIcon(tab)}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2 space-y-4">
                    {activeClub.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                        {activeClub.badge}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-2xl text-slate-900">
                      {activeClub.title || "Club Mission & Activities"}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {activeClub.description}
                    </p>
                  </div>
                  {activeClub.heroImage && (
                    <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                      <img 
                        src={activeClub.heroImage} 
                        className="w-full h-full object-cover" 
                        alt={`${activeClub.name} Hero`} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Subsections list (if defined in content) */}
                {activeClub.sections?.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100 space-y-12">
                    {activeClub.sections.map((sec: any, idx: number) => (
                      <div key={sec.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className={`${sec.image ? "" : "col-span-2"} ${idx % 2 === 1 && sec.image ? "md:order-2" : ""}`}>
                          <h4 className="font-display font-bold text-xl text-slate-900 mb-3">{sec.heading}</h4>
                          <p className="text-slate-600 leading-relaxed text-sm">{sec.content}</p>
                        </div>
                        {sec.image && (
                          <div className={`aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm ${idx % 2 === 1 ? "md:order-1" : ""}`}>
                            <img 
                              src={sec.image} 
                              className="w-full h-full object-cover" 
                              alt={sec.heading || "Section Detail"} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_IMAGE;
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })()}

        </div>
      </section>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function TabBtn({ label, active, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 active:scale-95 border cursor-pointer ${
        active
          ? "bg-[oklch(0.42_0.18_265)] text-white border-transparent shadow-sm"
          : "bg-white border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
      }`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {label}
    </button>
  );
}

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 hover:shadow-md transition-all duration-300 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          {Icon && <Icon className="w-5 h-5 text-[oklch(0.42_0.18_265)]" />}
          <div>
            <h3 className="font-display font-semibold text-lg md:text-xl text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function ImageCarousel({ images, fallback }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay, images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-100 mb-8 aspect-[16/6] min-h-[240px] max-h-[380px] bg-slate-100">
        <img src={fallback} className="w-full h-full object-cover" alt="Club fallback" />
      </div>
    );
  }

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-md border border-slate-150 mb-8 aspect-[16/6] min-h-[240px] max-h-[380px] bg-slate-100 group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="w-full h-full relative">
        {images.map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt={`Club view ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentIndex === i ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer z-10"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer z-10"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  currentIndex === index 
                    ? "w-6 bg-white" 
                    : "w-1.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentActivityClubPage;
