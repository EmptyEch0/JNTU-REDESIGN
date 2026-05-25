import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { Trophy, Medal, Star, Rocket, GraduationCap, Plus, Trash2, Save, Type, Calendar, BookOpen } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { type DepartmentData } from "@/functions/departments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncAchievements } from "@/lib/departments";
import { toast } from "sonner";

export const Route = createFileRoute("/departments/$id/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id/achievements" });

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");

  // Local state for all achievements (un-grouped for easy editing)
  const [list, setList] = useState<any[]>(data?.achievements || []);

  useEffect(() => {
    if (data?.achievements) setList(data.achievements);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: any[]) => syncAchievements({ data: { deptId: data.id, achievementList: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Achievements updated successfully!");
    }
  });

  // FIX: Use useCallback with functional update pattern to avoid stale closures
  const updateItem = useCallback((id: string, field: string, value: string) => {
    setList(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const addItem = useCallback(() => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "New Achievement",
      subcategory: "General Achievements",
      year: new Date().getFullYear().toString(),
      course: "B.Tech",
      description: ""
    };
    setList(prev => [newItem, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setList(prev => prev.filter(item => item.id !== id));
  }, []);

  // FIX: Memoize the updateSubcategory function to prevent unnecessary re-renders
  const updateSubcategory = useCallback((oldSubcat: string, newSubcat: string) => {
    if (oldSubcat === newSubcat) return;
    setList(prev => prev.map(item =>
      item.subcategory === oldSubcat ? { ...item, subcategory: newSubcat } : item
    ));
  }, []);

  // Grouping logic remains for display - memoized to prevent recalculation on every keystroke
  const grouped = useMemo(() => {
    return list.reduce((acc: any, curr: any) => {
      const sub = curr.subcategory || "General Achievements";
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(curr);
      return acc;
    }, {});
  }, [list]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <Trophy size={20} />
            <span className="uppercase tracking-widest text-[10px] font-black italic">
              Excellence & Recognition
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900">
            Department{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Achievements
            </span>
          </h2>
        </div>

        {isEditMode && (
          <div className="flex gap-3">
            <button onClick={addItem} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
              <Plus size={18} /> New Achievement
            </button>
            <button onClick={() => mutation.mutate(list)} className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">
              <Save size={18} /> Save All
            </button>
          </div>
        )}
      </div>

      <div className="space-y-16">
        {Object.entries(grouped).map(([subcat, items]: [string, any]) => (
          <section key={subcat}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                {subcat.includes("Gold") ? <Medal size={18} /> : subcat.includes("Project") ? <Rocket size={18} /> : <Star size={18} />}
              </div>
              {isEditMode ? (
                <input
                  className="text-xl font-bold text-slate-800 bg-amber-50 border-b border-amber-200 outline-none px-2 py-1 rounded"
                  defaultValue={subcat}
                  onBlur={(e) => updateSubcategory(subcat, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                />
              ) : (
                <h3 className="text-xl font-bold text-slate-800">{subcat}</h3>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <div key={item.id} className={`group bg-white p-6 rounded-[2rem] border transition-all duration-500 relative ${isEditMode ? 'border-amber-200 ring-4 ring-amber-50/50' : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200'}`}>

                  {isEditMode && (
                    <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <GraduationCap size={20} />
                    </div>
                    {isEditMode ? (
                      <input
                        className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-full w-20 text-center outline-none focus:bg-amber-500 focus:text-white"
                        value={item.year}
                        onChange={(e) => updateItem(item.id, "year", e.target.value)}
                      />
                    ) : (
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        {item.year}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isEditMode ? (
                      <>
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                          <Type size={14} className="text-slate-400" />
                          <input
                            className="font-bold text-slate-900 text-lg w-full outline-none"
                            value={item.title}
                            onChange={(e) => updateItem(item.id, "title", e.target.value)}
                            placeholder="Achievement Title"
                          />
                        </div>
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                          <BookOpen size={14} className="text-slate-400" />
                          <input
                            className="text-blue-600 text-xs font-bold uppercase w-full outline-none"
                            value={item.course}
                            onChange={(e) => updateItem(item.id, "course", e.target.value)}
                            placeholder="Course/Program"
                          />
                        </div>
                        <textarea
                          className="w-full text-slate-500 text-sm italic leading-relaxed bg-slate-50 p-3 rounded-xl mt-2 outline-none focus:ring-1 focus:ring-amber-300"
                          value={item.description || ""}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Description..."
                          rows={3}
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                        <p className="text-blue-600 text-xs font-bold uppercase tracking-tight mb-3">{item.course}</p>
                        {item.description && (
                          <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-slate-500 text-sm italic leading-relaxed">"{item.description}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}