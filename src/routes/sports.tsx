import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSportsData } from "@/funcs/sports.server";
import { PageHero } from "@/components/PageHero";
import sportsImg from "@/assets/sports.jpg";
import {
  Trophy,
  Users,
  User,
  Map,
  Dumbbell,
  Info,
  Building,
  Phone,
  Mail
} from "lucide-react";

export const Route = createFileRoute("/sports")({
  loader: async () => await getSportsData(),
  component: SportsPage,
});

function SportsPage() {
  const data: any = Route.useLoaderData();
  const [tab, setTab] = useState("Overview");
  const images = data?.images || [];
  const getCarouselImages = () => images.map((i: any) => i.url);

  const sportsTabs = [
    { id: "Overview", label: "Overview", icon: Info },
    { id: "Staff", label: "Staff & Faculty", icon: Users },
    { id: "Achievements", label: "Achievements", icon: Trophy },
    { id: "Play Fields", label: "Play Fields", icon: Map },
    { id: "Gymnasium", label: "Gymnasium", icon: Dumbbell },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title="Sports & Games"
        subtitle="Fostering physical health, teamwork, and athletic excellence."
        image={images[0]?.url || sportsImg}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          {sportsTabs.map((t) => (
            <TabBtn
              key={t.id}
              label={t.label}
              active={tab === t.id}
              onClick={() => setTab(t.id)}
              icon={t.icon}
            />
          ))}
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={sportsImg} />

          {/* ================= OVERVIEW ================= */}
          {tab === "Overview" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Department of Physical Education" icon={Building}>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                  The Department of Physical Education provides training facilities for all the students and staff of this Institute. It has excellent infrastructure facilities for both outdoor and indoor games. The outdoor games include Badminton, Ball badminton, Basketball, Cricket, Football, Kabaddi, Kho-Kho, Hand Ball, Hockey, Tennis, Throw ball and Volley Ball.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                  The sports ground accommodates a 200mts standard track, an excellent pavilion and facilities for all athletic events. The Indoor Games provide Chess, Caroms, Gymnastics, Badminton, Table Tennis, Weight Lifting and 16 & 12 station multi-Gyms.
                </p>
                
                <h4 className="font-display font-bold text-slate-900 mb-3">Core Activities</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Intramural and Extramural competitions",
                    "Inter-university tournament training",
                    "Coaching camps & campus events",
                    "Staff fitness events"
                  ].map((act, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.42_0.18_265)] shrink-0"/>
                      {act}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* ================= STAFF ================= */}
          {tab === "Staff" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              {data?.info && (
                <Card title="Sports Coordinator" icon={User}>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img
                      src={data?.info?.img}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250";
                      }}
                      className="w-32 h-40 md:w-40 md:h-48 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                      alt={data?.info?.name}
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-xl text-slate-900 mb-0.5">
                        {data?.info?.name}
                      </h4>
                      <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase mb-2">
                        {data?.info?.designation || "Sports Coordinator"}
                      </p>
                      <p className="text-xs text-slate-500 italic mb-4">"{data?.info?.message || "Promoting fitness and sportsman spirit across our student community."}"</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {data?.info?.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {data?.info?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-8">
                <Card title="Faculty Members" icon={Users}>
                  <ModernTable
                    headers={["#", "Name", "Designation"]}
                    rows={data?.faculty?.map((item: any, index: number) => [
                      index + 1,
                      item.name,
                      item.designation
                    ])}
                  />
                </Card>

                <Card title="Non-Teaching Staff" icon={Users}>
                  <ModernTable
                    headers={["#", "Name", "Designation"]}
                    rows={data?.nonTeaching?.map((item: any, index: number) => [
                      index + 1,
                      item.name,
                      item.designation
                    ])}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* ================= ACHIEVEMENTS ================= */}
          {tab === "Achievements" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Recent Sports Achievements" icon={Trophy}>
                <ModernTable
                  headers={["Student", "Branch", "Game", "Tournament", "Venue"]}
                  rows={data?.achievements?.map((item: any) => [
                    item.student,
                    item.branch,
                    item.game,
                    item.tournament,
                    item.venue
                  ])}
                />
              </Card>
            </div>
          )}

          {/* ================= PLAY FIELDS ================= */}
          {tab === "Play Fields" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Campus Play Fields Inventory" icon={Map}>
                <ModernTable
                  headers={["#", "Field / Ground Name", "Count"]}
                  rows={data?.fields?.map((item: any, idx: number) => [
                    idx + 1,
                    item.name,
                    item.qty
                  ])}
                />
              </Card>
            </div>
          )}

          {/* ================= GYMNASIUM ================= */}
          {tab === "Gymnasium" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Gymnasium Equipment & Assets" icon={Dumbbell}>
                <ModernTable
                  headers={["#", "Item Details", "Quantity", "Estimated Value"]}
                  rows={data?.gym?.map((item: any, idx: number) => [
                    idx + 1,
                    item.name,
                    item.qty,
                    item.cost || "-"
                  ])}
                />
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
        <img src={fallback} className="w-full h-full object-cover" alt="Fallback view" />
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
            alt={`Slide ${i + 1}`}
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
  if (!rows || !rows.length) {
    return <p className="text-slate-500 text-sm italic">No data listed.</p>;
  }
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

export default SportsPage;