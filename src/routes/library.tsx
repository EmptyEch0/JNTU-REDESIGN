import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getLibraryData } from "@/funcs/library.server";
import cultureImg from "@/assets/culture.jpg";
import { 
  Building, 
  User, 
  Sparkles, 
  Coffee, 
  Phone 
} from "lucide-react";

export const Route = createFileRoute("/library")({
  loader: async () => await getLibraryData(),
  component: LibraryPage,
});

const TABS = [
  "About Library",
  "Titles & Volumes",
  "Periodicals",
  "Digital Library",
  "Team",
  "Ekedaa Video Library",
];

function LibraryPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("About Library");

  const images = data?.images ?? [];
  const getCarouselImages = () => images.map((i: any) => i.url);

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero 
        title="Central Library" 
        subtitle="The heart of academic excellence and research" 
        image={images[0]?.url || cultureImg}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          {TABS.map((t) => (
            <TabBtn 
              key={t}
              label={t === "Ekedaa Video Library" ? "Ekeeda Videos" : t} 
              active={tab === t} 
              onClick={() => setTab(t)} 
              icon={t === "Team" ? User : t === "About Library" ? Building : Sparkles} 
            />
          ))}
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />

          {/* ================= ABOUT LIBRARY ================= */}
          {tab === "About Library" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              {/* DYNAMIC SIDEBAR OFFICER WIDGET */}
              {data?.info && (
                <Card title="Library Officer in Charge" icon={User}>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <img
                      src={data?.info?.img || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250";
                      }}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                      alt={data?.info?.officerName || "Library Officer"}
                    />
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 mb-0.5">
                        {data?.info?.officerName || "Officer In-Charge"}
                      </h4>
                      <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">
                        {data?.info?.designation || "Library In-Charge"}
                      </p>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed italic">
                        "{data?.info?.message || "Welcome to the central library. There's always more to the story..."}"
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* ABOUT OVERVIEW */}
              <Card title="About Central Library" icon={Sparkles}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {data?.about || "The Central Library plays a vital role in academic growth. It has a large collection of books across various branches."}
                </p>
              </Card>

              {/* SECTIONS */}
              {data?.sections && data?.sections.length > 0 && (
                <Card title="Library Sections" icon={Building}>
                  <LibrarySectionsTable data={data.sections} />
                </Card>
              )}

              {/* WORKING HOURS */}
              <Card title="Working Hours & Schedules" icon={Coffee}>
                <WorkingHoursGrid hours={data?.hours} />
              </Card>
            </div>
          )}

          {/* ================= TITLES & VOLUMES ================= */}
          {tab === "Titles & Volumes" && (
            <Card title="Books Collection" icon={Building}>
              <BooksCollectionTable data={data?.titles || []} />
            </Card>
          )}

          {/* ================= PERIODICALS ================= */}
          {tab === "Periodicals" && (
            <Card title="Journals & Magazines" icon={Sparkles}>
              <PeriodicalsTable data={data?.periodicals || []} />
            </Card>
          )}

          {/* ================= DIGITAL LIBRARY ================= */}
          {tab === "Digital Library" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Digital Library Resources" icon={Sparkles}>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
                  {data?.digital || "Network connectivity allows access to e-journals and e-resources."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(data?.digitalItems || []).map((d: any) => (
                    <div key={d.id} className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 px-4 py-3 rounded-xl hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                      <Sparkles className="w-3.5 h-3.5 text-[oklch(0.42_0.18_265)] shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{d.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ================= TEAM ================= */}
          {tab === "Team" && (
            <Card title="Library Staff & Team" icon={User}>
              <TeamTable data={data?.team || []} />
            </Card>
          )}

          {/* ================= EKEEDA VIDEO LIBRARY ================= */}
          {tab === "Ekedaa Video Library" && (
            <Card title="Ekeeda Video Library" icon={Sparkles}>
              <div className="text-center py-10 max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-[oklch(0.42_0.18_265)] grid place-items-center mx-auto mb-2 font-bold text-lg">
                  ▶
                </div>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Ekedaa provides comprehensive online video lectures, expert tutorials, and digital learning resources to supplement your academic journey.
                </p>
                <button className="mt-4 px-6 py-2.5 bg-[oklch(0.42_0.18_265)] text-white rounded-full font-medium text-xs hover:shadow-md transition-shadow cursor-pointer">
                  Access Portal
                </button>
              </div>
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
        <img src={fallback} className="w-full h-full object-cover" alt="Library fallback" />
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
            alt={`Library view ${i + 1}`}
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
            {images.map((_, index: number) => (
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

function LibrarySectionsTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">S.No</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Section</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Area (Sq.m)</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((s: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{s.section}</td>
              <td className="py-3.5 text-sm text-slate-600 font-medium">{s.area}</td>
              <td className="py-3.5 text-sm text-slate-500">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {s.location}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkingHoursGrid({ hours }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
      <div className="text-center p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Working Days</span>
        <span className="text-sm font-semibold text-slate-800">{hours?.workingDays || "Mon - Sat"}</span>
      </div>
      <div className="text-center p-3 border-y sm:border-y-0 sm:border-x border-slate-200/60">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Working Hours</span>
        <span className="text-sm font-semibold text-slate-800">{hours?.workingTime || "08:00 AM - 08:00 PM"}</span>
      </div>
      <div className="text-center p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Book Transactions</span>
        <span className="text-sm font-semibold text-slate-800">{hours?.transactionTime || "08:30 AM - 04:30 PM"}</span>
      </div>
    </div>
  );
}

function BooksCollectionTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Branch</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Titles</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Volumes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((t: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{t.name}</td>
              <td className="py-3.5 text-sm font-bold text-indigo-600 text-center">{t.value1}</td>
              <td className="py-3.5 text-sm font-bold text-[oklch(0.42_0.18_265)] text-center">{t.value2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PeriodicalsTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Department</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((p: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm">{p.name}</td>
              <td className="py-3.5 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {p.value1}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Qualification</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Designation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((t: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-[oklch(0.42_0.18_265)] font-display text-xs font-bold shrink-0">
                  {t.name?.[0]}
                </div>
                {t.name}
              </td>
              <td className="py-3.5 text-sm text-slate-600">{t.qualification}</td>
              <td className="py-3.5 text-sm text-slate-500 font-semibold">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {t.designation}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LibraryPage;