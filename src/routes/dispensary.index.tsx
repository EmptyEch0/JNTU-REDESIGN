import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import cultureImg from "@/assets/culture.jpeg";
import { getDispensaryData } from "@/funcs/dispensary.server";
import { 
  Building, 
  User, 
  Activity, 
  Sparkles, 
  Coffee, 
  Phone 
} from "lucide-react";

export const Route = createFileRoute("/dispensary/")({
  loader: async () => await getDispensaryData(),
  component: DispensaryPage,
});

function DispensaryPage() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState<"Doctors" | "Facilities" | "Supporting Staff">("Doctors");

  const doctors = data?.doctors ?? [];
  const facilities = data?.facilities ?? [];
  const medicines = data?.medicines ?? [];
  const staff = data?.staff ?? [];
  const drivers = data?.drivers ?? [];
  const images = data?.images ?? [];

  const getCarouselImages = () => images.map((i: any) => i.url);

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title="Dispensary"
        subtitle="Campus medical care & emergency support"
        image={images[0]?.url || cultureImg}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          <TabBtn 
            label="Doctors & Officers" 
            active={tab === "Doctors"} 
            onClick={() => setTab("Doctors")} 
            icon={User} 
          />
          <TabBtn 
            label="Facilities & Medicine" 
            active={tab === "Facilities"} 
            onClick={() => setTab("Facilities")} 
            icon={Sparkles} 
          />
          <TabBtn 
            label="Supporting Staff" 
            active={tab === "Supporting Staff"} 
            onClick={() => setTab("Supporting Staff")} 
            icon={Building} 
          />
        </div>

        <div className="space-y-8 max-w-5xl mx-auto animate-[fade-in_0.4s_ease-out]">
          <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />

          {/* ================= DOCTORS ================= */}
          {tab === "Doctors" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              {data?.info && (
                <Card title="Medical Officer in Charge" icon={User}>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <img
                      src={data?.info?.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250";
                      }}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200/50 shadow-sm shrink-0"
                      alt={data?.info?.hodName || "Medical Officer"}
                    />
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 mb-0.5">
                        {data?.info?.hodName || "Medical Officer"}
                      </h4>
                      <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">In-charge</p>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed italic">
                        "{data?.info?.message || "Providing essential medical support, first aid, basic medicines, and emergency assistance for the well-being of our students and staff."}"
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {doctors.length > 0 && (
                <Card title="Medical Officers & Doctors" icon={User}>
                  <DoctorTable data={doctors} />
                </Card>
              )}
            </div>
          )}

          {/* ================= FACILITIES ================= */}
          {tab === "Facilities" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Available Facilities" icon={Sparkles}>
                <FacilityList facilities={facilities} />
              </Card>

              {medicines.length > 0 && (
                <Card title="Medicines Stocked" icon={Coffee}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {medicines.map((m: any, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 px-4 py-3 rounded-xl hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ================= STAFF ================= */}
          {tab === "Supporting Staff" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              {staff.length > 0 && (
                <Card title="Medical Support Staff" icon={User}>
                  <StaffTable data={staff} />
                </Card>
              )}

              {drivers.length > 0 && (
                <Card title="Ambulance Services" icon={Activity} subtitle="🚑 Available 24/7 on Campus">
                  <AmbulanceTable data={drivers} />
                </Card>
              )}
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
        <img src={fallback} className="w-full h-full object-cover" alt="Dispensary fallback" />
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
            alt={`Dispensary view ${i + 1}`}
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

function DoctorTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Qualification</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Working Hours</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((d: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                  <img
                    src={d.img || "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150";
                    }}
                    className="w-full h-full object-cover"
                    alt={d.name}
                  />
                </div>
                {d.name}
              </td>
              <td className="py-3.5 text-sm text-slate-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {d.qualification}
                </span>
              </td>
              <td className="py-3.5 text-sm text-slate-500 font-medium">
                {d.workingHours}
              </td>
              <td className="py-3.5 text-sm font-semibold text-[oklch(0.42_0.18_265)]">
                {d.contact ? (
                  <a href={`tel:${d.contact}`} className="hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 inline text-[oklch(0.42_0.18_265)]/70" />
                    {d.contact}
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
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Qualification</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((s: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-slate-500 font-display text-xs font-bold shrink-0">
                  {s.name?.[0]}
                </div>
                {s.name}
              </td>
              <td className="py-3.5 text-sm text-slate-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {s.qualification}
                </span>
              </td>
              <td className="py-3.5 text-sm font-semibold text-[oklch(0.42_0.18_265)]">
                {s.contact ? (
                  <a href={`tel:${s.contact}`} className="hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 inline text-[oklch(0.42_0.18_265)]/70" />
                    {s.contact}
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

function AmbulanceTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Driver Name</th>
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Contact Number</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((d: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center font-display text-xs font-bold shrink-0">
                  {d.name?.[0]}
                </div>
                {d.name}
              </td>
              <td className="py-3.5 text-sm font-semibold text-emerald-600">
                {d.contact ? (
                  <a href={`tel:${d.contact}`} className="hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 inline text-emerald-500/70" />
                    {d.contact}
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
