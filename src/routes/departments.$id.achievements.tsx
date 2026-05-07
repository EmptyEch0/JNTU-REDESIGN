import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Trophy, Medal, Star, Rocket, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/departments/$id/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as any;

  if (!data?.achievements) return <div>No achievements recorded.</div>;

  // Group achievements by subcategory for organized display
  const grouped = data.achievements.reduce((acc: any, curr: any) => {
    const sub = curr.subcategory || "General Achievements";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(curr);
    return acc;
  }, {});

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="mb-12 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 text-amber-500 mb-2">
          <Trophy size={20} />
          <span className="uppercase tracking-widest text-[10px] font-black italic">Excellence & Recognition</span>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900">
          Department <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Achievements</span>
        </h2>
      </div>

      <div className="space-y-16">
        {Object.entries(grouped).map(([subcat, list]: [string, any]) => (
          <section key={subcat}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                {subcat.includes("Gold") ? <Medal size={18} /> : subcat.includes("Project") ? <Rocket size={18} /> : <Star size={18} />}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{subcat}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((item: any) => (
                <div key={item.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <GraduationCap size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      {item.year}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-tight mb-3">{item.course}</p>
                  
                  {item.description && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <p className="text-slate-500 text-sm italic leading-relaxed">
                        "{item.description}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}