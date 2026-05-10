import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLibraryData } from "@/funcs/library.server";
import { PageHero } from "@/components/PageHero";
import {
  User,
  BookOpen,
  Building,
  Monitor,
  Newspaper,
  Users,
  Clock,
  Video,
  Info
} from "lucide-react";

export const Route = createFileRoute("/library")({
  loader: async () => await getLibraryData(),
  component: LibraryPage,
});

function LibraryPage() {
  const data: any = Route.useLoaderData();

  const content = data?.content || {};
  const sections = data?.sections || [];
  const stats = data?.stats || [];
  const meta = data?.meta || [];
  const images = data?.images || [];
  const team = data?.team || [];

  const [tab, setTab] = useState("About Library");

  const titleStats = stats.filter((item: any) => item.category === "titles");
  const periodicals = stats.filter((item: any) => item.category === "periodicals");
  const digitalItems = meta.filter((item: any) => item.category === "digital");
  const magazines = meta.filter((item: any) => item.category === "magazine");
  const newspapers = meta.filter((item: any) => item.category === "newspaper");

  const getCarouselImages = () => images.map((i: any) => i.url);

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title="University Library"
        subtitle="Knowledge repository, digital access, and reading support."
        image={images[0]?.url || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000"}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          <TabBtn
            label="About Library"
            active={tab === "About Library"}
            onClick={() => setTab("About Library")}
            icon={Info}
          />
          <TabBtn
            label="Titles & Volumes"
            active={tab === "Titles & Volumes"}
            onClick={() => setTab("Titles & Volumes")}
            icon={BookOpen}
          />
          <TabBtn
            label="Periodicals"
            active={tab === "Periodicals"}
            onClick={() => setTab("Periodicals")}
            icon={Newspaper}
          />
          <TabBtn
            label="Digital Library"
            active={tab === "Digital Library"}
            onClick={() => setTab("Digital Library")}
            icon={Monitor}
          />
          <TabBtn
            label="Team"
            active={tab === "Team"}
            onClick={() => setTab("Team")}
            icon={Users}
          />
          <TabBtn
            label="Ekeeda Video Library"
            active={tab === "Ekeeda Video Library"}
            onClick={() => setTab("Ekeeda Video Library")}
            icon={Video}
          />
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel 
            images={getCarouselImages()} 
            fallback="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000" 
          />

          {/* ================= ABOUT ================= */}
          {tab === "About Library" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              
              {/* OFFICER INFO */}
              <Card title="Officer Message" icon={User}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={content?.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250";
                    }}
                    className="w-32 h-40 md:w-40 md:h-52 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                    alt={content?.officer_name || "Officer"}
                  />
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-xl text-slate-900 mb-0.5">
                      {content?.officer_name || "Librarian"}
                    </h4>
                    <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase mb-3">
                      {content?.designation || "Officer In Charge"}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{content?.message}"
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card title="Overview" icon={Building} className="h-full">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {content?.about}
                    </p>
                  </Card>
                </div>
                <div>
                  <Card title="Working Hours" icon={Clock} className="h-full">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-medium text-slate-700">Mon - Sat</span>
                        <span className="text-slate-600 text-xs font-semibold">
                          {content?.working_time || "08:00 AM - 08:00 PM"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-medium text-slate-700">Sunday</span>
                        <span className="text-slate-600 text-xs font-semibold">09:00 AM - 01:00 PM</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {sections.length > 0 && (
                <Card title="Library Sections & Areas" icon={Building}>
                  <ModernTable
                    headers={["#", "Section", "Area", "Location"]}
                    rows={sections.map((item: any, index: number) => [
                      index + 1,
                      item.section,
                      item.area,
                      item.location
                    ])}
                  />
                </Card>
              )}
            </div>
          )}

          {/* ================= TITLES ================= */}
          {tab === "Titles & Volumes" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Branch Wise - Titles & Volumes" icon={BookOpen}>
                <ModernTable
                  headers={["Branch", "Titles", "Volumes"]}
                  rows={titleStats.map((item: any) => [
                    item.name,
                    item.value1,
                    item.value2
                  ])}
                />
              </Card>
            </div>
          )}

          {/* ================= PERIODICALS ================= */}
          {tab === "Periodicals" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Department Wise Periodicals" icon={Newspaper}>
                <ModernTable
                  headers={["Department", "Count"]}
                  rows={periodicals.map((item: any) => [item.name, item.value1])}
                />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Popular Magazines" icon={Newspaper}>
                  <div className="grid gap-2.5">
                    {magazines.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 px-4 py-2.5 rounded-xl hover:bg-white transition-all text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.42_0.18_265)]" />
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Newspapers" icon={Newspaper}>
                  <div className="grid gap-2.5">
                    {newspapers.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 px-4 py-2.5 rounded-xl hover:bg-white transition-all text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ================= DIGITAL LIBRARY ================= */}
          {tab === "Digital Library" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="About Digital Library" icon={Monitor}>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content?.digital_description}
                </p>
              </Card>

              <Card title="Digital Resources Available" icon={Monitor}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {digitalItems.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-50/80 border border-slate-100 px-5 py-3.5 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[oklch(0.42_0.18_265)] shrink-0">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ================= TEAM ================= */}
          {tab === "Team" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Library Supporting Team" icon={Users}>
                <ModernTable
                  headers={["Name", "Qualification", "Designation"]}
                  rows={team.map((item: any) => [
                    item.name,
                    item.qualification,
                    item.designation
                  ])}
                />
              </Card>
            </div>
          )}

          {/* ================= EKEEDA ================= */}
          {tab === "Ekeeda Video Library" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Ekeeda Digital Portal" icon={Video} className="text-center py-12">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.42_0.18_265)]/10 flex items-center justify-center text-[oklch(0.42_0.18_265)] mx-auto mb-6">
                    <Video className="w-8 h-8" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                    Ekeeda Video Library
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    Access curated online video lectures, tutorials, and high-quality academic learning resources through the Ekeeda integrated digital learning platform.
                  </p>
                  <button className="px-6 py-2.5 rounded-full bg-[oklch(0.42_0.18_265)] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm">
                    Access Portal
                  </button>
                </div>
              </Card>
            </div>
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
        <img src={fallback} className="w-full h-full object-cover" alt="Carousel fallback" />
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
            alt={`View ${i + 1}`}
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
            {images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  currentIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ModernTable({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 px-2 text-sm text-slate-700 font-medium">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LibraryPage;