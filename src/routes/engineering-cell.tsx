import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getEngineeringData } from "@/funcs/engineer.server";
import {
  Building,
  Hammer,
  Zap,
  Eye,
  User,
  Phone,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/engineering-cell")({
  loader: async () => await getEngineeringData(),
  component: EngineeringCellPage,
});

function EngineeringCellPage() {
  const data = Route.useLoaderData() as any;
  const content = data?.content || {};
  const construction = data?.construction || [];
  const electrical = data?.electrical || {};
  const civilStaff = data?.civilStaff || [];
  const electricalStaff = data?.electricalStaff || [];

  const [tab, setTab] = useState("Overview");

  const engineeringTabs = [
    { id: "Overview", label: "Overview", icon: Building },
    { id: "Construction Activities", label: "Construction", icon: Hammer },
    { id: "PE (Elec) Section", label: "Electrical Section", icon: Zap },
    { id: "Vision & Mission", label: "Vision & Mission", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.972_0.012_85)] text-slate-800 pb-20">
      <PageHero
        title={content?.title || "Engineering Cell"}
        subtitle="Planning, construction, and technical campus infrastructure maintenance."
        image={electrical?.img || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000"}
      />

      <section className="container-narrow py-12">
        {/* TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
          {engineeringTabs.map((t) => (
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
          
          {/* ================= OVERVIEW ================= */}
          {tab === "Overview" && (
            <div className="animate-[fade-in_0.4s_ease-out]">
              <Card title="Overview & Scope" icon={Building}>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {content?.description || "No description available"}
                </p>
              </Card>
            </div>
          )}

          {/* ================= CONSTRUCTION ================= */}
          {tab === "Construction Activities" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <Card title="Construction Activities" icon={Hammer}>
                {!construction.length ? (
                  <p className="text-slate-500 italic text-sm">No construction activities available.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {construction.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50/80 border border-slate-100 px-4 py-3.5 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span className="text-sm font-medium text-slate-700 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card title="Engineering Cell Staff" icon={User}>
                <ModernTable
                  headers={["#", "Name", "Designation"]}
                  rows={civilStaff.map((s: any, i: number) => [i + 1, s.name, s.designation])}
                />
              </Card>
            </div>
          )}

          {/* ================= ELECTRICAL ================= */}
          {tab === "PE (Elec) Section" && (
            <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile */}
                <Card title="Section In-charge" icon={User} className="h-full">
                  <div className="flex flex-col items-center text-center pt-2">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 shadow-sm">
                      <img
                        src={electrical?.img || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250";
                        }}
                        alt={electrical?.engineer || "Engineer"}
                      />
                    </div>
                    <h4 className="font-display font-bold text-lg text-slate-900 mb-1">
                      {electrical?.engineer || "Dr. A. Padmaja"}
                    </h4>
                    <p className="text-[oklch(0.42_0.18_265)] font-semibold text-xs tracking-wider uppercase">
                      {electrical?.designation || "Project Engineer"}
                    </p>
                  </div>
                </Card>
                
                {/* Details */}
                <div className="md:col-span-2">
                  <Card title={electrical?.title || "Electrical Section"} icon={Zap} className="h-full">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {electrical?.description || "Ensuring smooth and consistent power availability and maintenance services for university complexes."}
                    </p>
                  </Card>
                </div>
              </div>

              <Card title="Electrical Supporting Staff" icon={User}>
                <ModernTable
                  headers={["#", "Name", "Designation"]}
                  rows={electricalStaff.map((s: any, i: number) => [i + 1, s.name, s.designation])}
                />
              </Card>
            </div>
          )}

          {/* ================= VISION ================= */}
          {tab === "Vision & Mission" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fade-in_0.4s_ease-out]">
              <Card title="Vision" icon={Eye}>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{content?.vision || "To maintain a state-of-the-art physical environment enabling academic and research excellence."}"
                </p>
              </Card>
              <Card title="Mission" icon={Sparkles}>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content?.mission || "Committed to ensuring reliable, secure and modern power and building infrastructure across the campus."}
                </p>
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

function ModernTable({ headers, rows }: { headers: string[]; rows: any[][] }) {
  if (!rows.length) {
    return <p className="text-slate-500 text-sm italic">No data recorded.</p>;
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

export default EngineeringCellPage;