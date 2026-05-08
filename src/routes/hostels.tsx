import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import hostelImg from "@/assets/hostel.jpg";
import { getHostelData } from "@/funcs/hostel.server";
import {
  Building,
  Bed,
  Phone,
  User,
  Activity,
  Sparkles,
  Coffee,
  Utensils
} from "lucide-react";

export const Route = createFileRoute("/hostels")({
  loader: async () => await getHostelData(),
  component: HostelsPage,
});

function HostelsPage() {
  const data = Route.useLoaderData();

  const blocks = data?.blocks ?? [];
  const wardens = data?.wardens ?? [];
  const facilities = data?.facilities ?? [];
  const officer = data?.officer;
  const health = data?.health;
  const staff = data?.staff ?? [];
  const images = data?.images ?? [];

  const [tab, setTab] = useState<"office" | "girls" | "boys">("office");

  const getImages = (type: string) =>
    images.filter((img: any) => img.type === type).map((i: any) => i.url);

  // ✅ BLOCK FILTERS
  const girlsBlocks = blocks.filter((b: any) => b.type === "girls");
  const boysBlocks = blocks.filter((b: any) => b.type === "boys");

  // ✅ WARDENS FIXED
  const girlsWardens = wardens.filter((w: any) => w.hostelType === "girls");
  const boysWardens = wardens.filter((w: any) => w.hostelType === "boys");

  // ✅ FACILITIES FIXED
  const girlsFacilities = facilities.filter((f: any) => f.type === "girls");
  const boysFacilities = facilities.filter((f: any) => f.type === "boys");

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title="Hostels & Residences"
        subtitle={data?.about?.description || "Providing a comfortable, secure, and modern living experience for students."}
        image={getImages("office")[0] || hostelImg}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          <TabBtn
            label="Hostel Office"
            value="office"
            active={tab === "office"}
            onClick={() => setTab("office")}
            icon={Building}
          />
          <TabBtn
            label="Girls Hostel"
            value="girls"
            active={tab === "girls"}
            onClick={() => setTab("girls")}
            icon={Bed}
          />
          <TabBtn
            label="Boys Hostel"
            value="boys"
            active={tab === "boys"}
            onClick={() => setTab("boys")}
            icon={Bed}
          />
        </div>

        {/* ================= OFFICE ================= */}
        {tab === "office" && (
          <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
            <ImageCarousel images={getImages("office")} fallback={hostelImg} />

            {/* ABOUT */}
            <Card title="About Hostel Office" icon={Building}>
              <p className="text-base leading-relaxed text-slate-600">
                {data?.about?.description}
              </p>
            </Card>

            {/* OFFICER */}
            {officer && (
              <Card title="Officer in Charge" icon={User}>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <img
                    src={officer.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250";
                    }}
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="font-display font-bold text-lg text-slate-900 mb-0.5">{officer.name}</h4>
                    <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">{officer.role}</p>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      Overseeing administrative coordination, student welfare programs, residential operations, and university policy implementation at the hostels.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* WARDENS */}
            {girlsWardens.length > 0 && (
              <Card title="Girls Hostel Wardens" icon={User}>
                <WardenTable data={girlsWardens} />
              </Card>
            )}

            {boysWardens.length > 0 && (
              <Card title="Boys Hostel Wardens" icon={User}>
                <WardenTable data={boysWardens} />
              </Card>
            )}

            {/* STAFF */}
            {staff.length > 0 && (
              <Card title="Supporting Staff" icon={User}>
                <StaffTable data={staff} />
              </Card>
            )}
          </div>
        )}

        {/* ================= GIRLS ================= */}
        {tab === "girls" && (
          <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
            <ImageCarousel images={getImages("girls")} fallback="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000" />

            {girlsBlocks.map((b: any) => (
              <Card key={b.id} title={b.title} icon={Building}>
                <BlockInfo block={b} />
              </Card>
            ))}

            {girlsFacilities.length > 0 && (
              <Card title="Facilities Available" icon={Sparkles}>
                <FacilityList facilities={girlsFacilities} />
              </Card>
            )}

            {health && (
              <Card title="Health Assistant Services" icon={Activity}>
                <HealthTable health={health} />
              </Card>
            )}
          </div>
        )}

        {/* ================= BOYS ================= */}
        {tab === "boys" && (
          <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
            <ImageCarousel images={getImages("boys")} fallback="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000" />

            {boysBlocks.map((b: any) => (
              <Card key={b.id} title={b.title} icon={Building}>
                <BlockInfo block={b} />
              </Card>
            ))}

            {boysFacilities.length > 0 && (
              <Card title="Facilities Available" icon={Sparkles}>
                <FacilityList facilities={boysFacilities} />
              </Card>
            )}

            {health && (
              <Card title="Health Assistant Services" icon={Activity}>
                <HealthTable health={health} />
              </Card>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function TabBtn({ label, active, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 active:scale-95 border cursor-pointer ${active
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
        <img src={fallback} className="w-full h-full object-cover" alt="Hostel fallback" />
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
            alt={`Hostel view ${i + 1}`}
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

function WardenTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Designation</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((w: any) => (
            <tr key={w.id} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-[oklch(0.42_0.18_265)] font-display text-xs font-bold shrink-0">
                  {w.name?.[0]}
                </div>
                {w.name}
              </td>
              <td className="py-3.5 text-sm text-slate-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {w.designation || "Warden"}
                </span>
              </td>
              <td className="py-3.5 text-sm font-semibold text-[oklch(0.42_0.18_265)]">
                {w.phone ? (
                  <a href={`tel:${w.phone}`} className="hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 inline text-[oklch(0.42_0.18_265)]/70" />
                    {w.phone}
                  </a>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((s: any) => (
            <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-slate-500 font-display text-xs font-bold shrink-0">
                  {s.name?.[0]}
                </div>
                {s.name}
              </td>
              <td className="py-3.5 text-sm text-slate-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {s.role || "Supporting Staff"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockInfo({ block }: any) {
  return (
    <div className="grid grid-cols-3 gap-2 divide-x divide-slate-100 bg-slate-50/50 rounded-xl py-4 border border-slate-100/80">
      <div className="text-center">
        <div className="text-2xl font-display font-bold text-slate-900">{block.rooms}</div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Total Rooms</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-display font-bold text-slate-900">{block.diningHall || "0"}</div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Dining Halls</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-display font-bold text-slate-900">{block.kitchen || "0"}</div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Kitchens</div>
      </div>
    </div>
  );
}

function FacilityList({ facilities }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {facilities.map((f: any) => (
        <div
          key={f.id}
          className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 px-4 py-3 rounded-xl hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[oklch(0.42_0.18_265)] group-hover:scale-110 transition-transform shrink-0" />
          <span className="text-sm font-medium text-slate-700">{f.name}</span>
        </div>
      ))}
    </div>
  );
}

function HealthTable({ health }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y divide-slate-50">
          <tr className="hover:bg-slate-50/40 transition-colors">
            <th className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-1/3">Staff Incharge</th>
            <td className="py-4 font-semibold text-slate-900 text-sm flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center font-display text-xs font-bold shrink-0">
                {health.name?.[0]}
              </div>
              {health.name}
            </td>
          </tr>
          <tr className="hover:bg-slate-50/40 transition-colors">
            <th className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Timings / Availability</th>
            <td className="py-4 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Activity className="w-3.5 h-3.5 mr-1.5 animate-pulse text-emerald-600" />
                {health.timing}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}