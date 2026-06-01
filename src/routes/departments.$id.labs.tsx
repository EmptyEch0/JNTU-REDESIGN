import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import {
  Microscope, MapPin, Monitor, Cpu, ChevronRight, Activity,
  Plus, Trash2, Save, Image as ImageIcon, Layout
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncLaboratories } from "@/lib/departments";
import { toast } from "sonner";

export const Route = createFileRoute("/departments/$id/labs")({
  component: LaboratoriesPage,
});

function LaboratoriesPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id/labs" });

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");
  const [labList, setLabList] = useState<any[]>(data?.laboratories || []);

  useEffect(() => {
    if (data?.laboratories) setLabList(data.laboratories);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: any[]) => syncLaboratories({ data: { deptId: data.id, labList: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Laboratories updated successfully!");
    }
  });

  // Lab Management
  const addLab = () => {
    const newLab = {
      id: crypto.randomUUID(),
      name: "New Laboratory",
      description: "Enter lab description here...",
      location: "Block Name, Floor",
      photo_url: "",
      specs: [{ item: "New Equipment", count: "1" }]
    };
    setLabList([...labList, newLab]);
  };

  const removeLab = (id: string | number) => {
    setLabList(labList.filter(l => l.id !== id));
  };

  const updateLab = (id: string | number, field: string, value: any) => {
    setLabList(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Specs (JSONB) Management
  const addSpec = (labId: string | number) => {
    setLabList(prev => prev.map(l => {
      if (l.id === labId) {
        const specs = Array.isArray(l.specs) ? l.specs : [];
        return { ...l, specs: [...specs, { item: "New Item", count: "0" }] };
      }
      return l;
    }));
  };

  const updateSpec = (labId: string | number, specIdx: number, field: string, value: string) => {
    setLabList(prev => prev.map(l => {
      if (l.id === labId) {
        const newSpecs = [...l.specs];
        newSpecs[specIdx] = { ...newSpecs[specIdx], [field]: value };
        return { ...l, specs: newSpecs };
      }
      return l;
    }));
  };

  const removeSpec = (labId: string | number, specIdx: number) => {
    setLabList(prev => prev.map(l => {
      if (l.id === labId) {
        return { ...l, specs: l.specs.filter((_: any, i: number) => i !== specIdx) };
      }
      return l;
    }));
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header */}
      <div className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Activity size={20} className="opacity-80" />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">Research & Infrastructure</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Department <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Laboratories</span>
          </h2>
        </div>

        {isEditMode && (
          <div className="flex gap-3">
            <button onClick={addLab} className="flex items-center gap-2 bg-slate-100 text-slate-900 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
              <Plus size={18} /> Add Laboratory
            </button>
            <button onClick={() => mutation.mutate(labList)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">
              <Save size={18} /> Save Inventory
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {labList.map((lab: any) => (
          <div key={lab.id} className={`group bg-white border rounded-[3rem] overflow-hidden transition-all duration-700 relative ${isEditMode ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-200 shadow-sm hover:shadow-2xl'}`}>

            {isEditMode && (
              <button onClick={() => removeLab(lab.id)} className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 z-20 transition-transform active:scale-90">
                <Trash2 size={18} />
              </button>
            )}

            <div className="flex flex-col xl:flex-row">
              {/* Visual Section */}
              <div className="xl:w-[400px] p-8 bg-slate-50/50 border-r border-slate-100">
                <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-6 shadow-md border-4 border-white">
                  {lab.photo_url ? (
                    <img src={lab.photo_url} alt={lab.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-white text-slate-200">
                      <Microscope size={64} strokeWidth={1} />
                    </div>
                  )}
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                      <div className="w-full">
                        <label className="text-[10px] text-white font-bold uppercase mb-1 block flex items-center gap-1"><ImageIcon size={12} /> Photo URL</label>
                        <input className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] p-2 rounded-lg outline-none placeholder:text-white/50" value={lab.photo_url || ""} onChange={(e) => updateLab(lab.id, "photo_url", e.target.value)} placeholder="https://..." />
                      </div>
                    </div>
                  )}
                </div>

                {isEditMode ? (
                  <div className="space-y-3">
                    <input className="text-2xl font-black text-slate-900 w-full bg-transparent border-b border-blue-200 outline-none" value={lab.name} onChange={(e) => updateLab(lab.id, "name", e.target.value)} placeholder="Lab Name" />
                    <div className="flex items-center gap-2 text-blue-600 bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                      <MapPin size={14} />
                      <input className="text-[10px] font-bold uppercase tracking-wider w-full outline-none" value={lab.location || ""} onChange={(e) => updateLab(lab.id, "location", e.target.value)} placeholder="Location" />
                    </div>
                    <textarea className="w-full text-slate-500 text-sm italic leading-relaxed bg-white border border-slate-200 p-3 rounded-2xl outline-none" rows={3} value={lab.description || ""} onChange={(e) => updateLab(lab.id, "description", e.target.value)} placeholder="Description" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{lab.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-4">
                      <MapPin size={14} className="text-blue-500" /> {lab.location || "Department Block"}
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed italic">"{lab.description}"</p>
                  </>
                )}
              </div>

              {/* Technical Inventory Section */}
              <div className="flex-grow p-8 lg:p-12 bg-white relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                    <Cpu size={16} className="text-blue-500" /> Technical Resource Inventory
                  </div>
                  {isEditMode && (
                    <button onClick={() => addSpec(lab.id)} className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                      <Plus size={14} /> Add Item
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lab.specs && lab.specs.map((spec: any, idx: number) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-300 ${isEditMode ? 'bg-blue-50/50 border border-blue-200' : 'bg-slate-50 border border-slate-100 hover:border-blue-200'}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        {isEditMode ? (
                          <input className="text-[13px] font-bold text-slate-700 bg-transparent outline-none w-full border-b border-transparent focus:border-blue-400" value={spec.item} onChange={(e) => updateSpec(lab.id, idx, "item", e.target.value)} />
                        ) : (
                          <span className="text-[13px] font-bold text-slate-700">{spec.item}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {isEditMode ? (
                          <>
                            <input className="w-12 px-2 py-1 bg-white text-blue-600 text-[11px] font-black rounded-lg border border-blue-200 text-center outline-none" value={spec.count} onChange={(e) => updateSpec(lab.id, idx, "count", e.target.value)} />
                            <button onClick={() => removeSpec(lab.id, idx)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                          </>
                        ) : (
                          <span className="px-4 py-1 bg-white text-blue-600 text-[11px] font-black rounded-xl border border-slate-200 shadow-sm">{spec.count}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!lab.specs || lab.specs.length === 0) && !isEditMode && (
                    <div className="col-span-full py-10 text-center text-slate-300 text-sm">Specs coming soon...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}