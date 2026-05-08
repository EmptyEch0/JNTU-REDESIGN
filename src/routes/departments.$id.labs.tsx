import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { Microscope, MapPin, Monitor, Cpu, ChevronRight, Activity } from "lucide-react";

export const Route = createFileRoute("/departments/$id/labs")({
  component: LaboratoriesPage,
});

function LaboratoriesPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;

  if (!data) return <div>Loading...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header */}
      <div className="mb-12 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <Activity size={20} className="opacity-80" />
          <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">
            Research & Infrastructure
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Department{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Laboratories
          </span>
        </h2>
        <p className="mt-3 text-slate-500 max-w-2xl text-sm leading-relaxed">
          Advanced experimental facilities equipped with industry-standard tools to foster practical
          learning and innovative research.
        </p>
      </div>

      {/* Dynamic Lab Grid */}
      <div className="grid grid-cols-1 gap-12">
        {data.laboratories && data.laboratories.length > 0 ? (
          data.laboratories.map((lab: any) => (
            <div
              key={lab.id}
              className="group bg-white border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700"
            >
              <div className="flex flex-col xl:flex-row">
                {/* Visual Section: Identity & Location */}
                <div className="xl:w-[380px] p-8 bg-slate-50/50 border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 shadow-md ring-1 ring-black/5">
                      {lab.photo_url ? (
                        <img
                          src={lab.photo_url}
                          alt={lab.name}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-white text-slate-200">
                          <Microscope size={64} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full shadow-sm border border-white">
                          Active Lab
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {lab.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-4">
                      <MapPin size={14} className="text-blue-500" />
                      {lab.location || "Department Block"}
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed italic">
                    "
                    {lab.description ||
                      "Experimental facility dedicated to departmental academic excellence."}
                    "
                  </p>
                </div>

                {/* Data Section: Technical Specs */}
                <div className="flex-grow p-8 lg:p-12 bg-white relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                      <Cpu size={16} className="text-blue-500" /> Technical Resource Inventory
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-slate-200 group-hover:translate-x-1 transition-transform"
                    />
                  </div>

                  {lab.specs && lab.specs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lab.specs.map((spec: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                            <span className="text-[13px] font-bold text-slate-700">
                              {spec.item}
                            </span>
                          </div>
                          <span className="px-4 py-1 bg-white text-blue-600 text-[11px] font-black rounded-xl border border-slate-200 shadow-sm min-w-[45px] text-center">
                            {spec.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] p-10 text-center">
                      <Monitor className="text-slate-200 mb-4" size={40} />
                      <p className="text-slate-400 font-medium text-sm">
                        Hardware specifications are being cataloged.
                      </p>
                      <p className="text-slate-300 text-[10px] uppercase mt-1 tracking-widest">
                        Update Expected Soon
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-32 text-center">
            <Microscope className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">
              No laboratory records found for this department.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
