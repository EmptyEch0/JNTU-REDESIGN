import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";
import { getMusicClubData } from "@/funcs/music.server";
import cultureImg from "@/assets/culture.jpeg";
import { 
  Building, 
  Sparkles, 
  User, 
  Activity, 
  Music 
} from "lucide-react";

export const Route = createFileRoute("/campus-life/music-club")({
  loader: async () => await getMusicClubData(),
  component: MusicClubPage,
});

const TABS = [
  "Overview",
  "Equipment Available",
  "Club Members",
];

function MusicClubPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("Overview");

  const content = data?.content || {};
  const faculty = data?.facultyCoordinator || {};
  const students = data?.studentCoordinators || [];
  const equipment = data?.equipment || [];
  const members = data?.members || [];
  const images = data?.images || [];

  const getCarouselImages = () => images.map((i: any) => i.url);

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title={content?.title || "Music Club"}
        subtitle={content?.subtitle || "Campus music activities and cultural performances"}
        image={images?.[0]?.url || cultureImg}
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
              icon={
                t === "Overview" ? Sparkles : 
                t === "Equipment Available" ? Music : User
              } 
            />
          ))}
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />

          {/* ================= OVERVIEW ================= */}
          {tab === "Overview" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              
              {/* FACULTY COORDINATOR */}
              {faculty?.name && (
                <Card title="Music Club Coordinator" icon={User}>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <img
                      src={faculty.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250";
                      }}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                      alt={faculty.name}
                    />
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 mb-0.5">
                        {faculty.name}
                      </h4>
                      <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">
                        {faculty.designation || "Club Coordinator"}
                      </p>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed italic">
                        "{content?.message || "Music gives a soul to the universe, wings to the mind, flight to the imagination and life to everything."}"
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* OBJECTIVES */}
              <Card title="Objectives of Music Club" icon={Sparkles}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {content?.objectives || "Offer young people an opportunity for musical expression, cultivate interest, develop discipline, and build exceptional performance skills."}
                </p>
              </Card>

              {/* JOINING PROCESS */}
              <Card title="Process to Join" icon={Building}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {content?.process || "Students can join through club coordinators. Regular weekly practice sessions are held, guided by experienced faculty members."}
                </p>
              </Card>

              {/* STUDENT COORDINATORS */}
              {students.length > 0 && (
                <Card title="Student Coordinators" icon={User}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.map((s: any, i: number) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 grid place-items-center font-bold text-xs">
                          {s.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{s.gender} Coordinator {s.branch ? `• ${s.branch}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ================= EQUIPMENT ================= */}
          {tab === "Equipment Available" && (
            <Card title="Club Instruments & Equipment" icon={Music}>
              <EquipmentTable data={equipment} />
            </Card>
          )}

          {/* ================= CLUB MEMBERS ================= */}
          {tab === "Club Members" && (
            <Card title="Active Music Club Members" icon={User}>
              <MembersTable data={members} />
            </Card>
          )}

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
        <img src={fallback} className="w-full h-full object-cover" alt="Music fallback" />
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
            alt={`Music view ${i + 1}`}
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

/* ---------- TABLES ---------- */

function EquipmentTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Item</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((e: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{e.item}</td>
              <td className="py-3.5 text-sm font-bold text-indigo-600 text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {e.cost}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MembersTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Instrument</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Branch & Year</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((m: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-[oklch(0.42_0.18_265)] font-display text-xs font-bold shrink-0">
                  {m.name?.[0]}
                </div>
                {m.name}
              </td>
              <td className="py-3.5 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {m.instrument}
                </span>
              </td>
              <td className="py-3.5 text-sm text-slate-500 font-semibold">
                {m.branch} {m.year ? `• ${m.year} Year` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MusicClubPage;