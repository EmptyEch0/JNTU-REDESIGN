import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";
import supraja from "@/assets/mou-supraja.png";
import blackbuck from "@/assets/mou-blackbuck.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getMous, addMou, updateMou, deleteMou
} from "@/funcs/rd";
import { Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/rd-cell/mous")({
  head: () => ({
    meta: [
      { title: "MOUs — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Memoranda of Understanding signed with industry and research partners." },
    ],
  }),
  component: MOUsPage,
});

function MOUsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedMous, setEditedMous] = useState<Record<number, any>>({});

  const { data: mous = [] } = useQuery({ queryKey: ["rdMous"], queryFn: () => getMous() });

  const departmentMous = mous.filter((m: any) => m.type === "department");
  const certificateMous = mous.filter((m: any) => m.type === "certificate");

  const saveAll = async () => {
    const promises = Object.entries(editedMous).map(([id, data]) => 
      updateMou({ data: { id: parseInt(id), ...data } })
    );

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving MOUs...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdMous"] });
        setEditedMous({});
        return "MOUs updated!";
      },
      error: "Failed to save changes."
    });
  };

  const handleAddMou = async (type: "department" | "certificate") => {
    await addMou({ data: { 
      title: type === "department" ? "Department Name" : "MOU Title", 
      body: "Partnership details...", 
      type,
      badge: type === "certificate" ? "Partner" : "",
      img: type === "certificate" ? "/assets/mou-supraja.png" : ""
    } });
    queryClient.invalidateQueries({ queryKey: ["rdMous"] });
  };

  const hasChanges = Object.keys(editedMous).length > 0;

  return (
    <>
      <PageHero eyebrow="R&D Cell" title="MOUs" subtitle="Industry, research and innovation partnerships that power our work." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="flex justify-between items-end mb-10">
          <RevealOnScroll><SectionLabel eyebrow="Department-wise" title="Active partnerships" /></RevealOnScroll>
          {isEditMode && (
            <button onClick={() => handleAddMou("department")} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm"><Plus size={16} /> Add Partnership</button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {departmentMous.map((m: any, i: number) => (
            <RevealOnScroll key={m.id} delay={i * 100}>
              <div className={`p-7 rounded-2xl bg-card border transition-all h-full relative group ${isEditMode ? "border-primary/30" : "border-border hover-lift"}`}>
                {isEditMode && (
                  <button onClick={async () => { if(confirm("Delete MOU?")) { await deleteMou({ data: { id: m.id } }); queryClient.invalidateQueries({ queryKey: ["rdMous"] }); } }} className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="h-4 w-4" /></button>
                )}
                <div className="text-eyebrow">Partnership</div>
                {isEditMode ? (
                  <div className="space-y-4 mt-2">
                    <input className="text-display text-2xl text-ink w-full bg-primary/5 p-1 rounded" value={editedMous[m.id]?.title ?? m.title} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[m.id], title: e.target.value } }))} />
                    <textarea className="text-muted-foreground leading-relaxed w-full bg-primary/5 p-1 rounded" value={editedMous[m.id]?.body ?? m.body} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[prev.id], body: e.target.value } }))} rows={5} />
                  </div>
                ) : (
                  <>
                    <h3 className="text-display text-2xl text-ink mt-2">{m.title}</h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{m.body}</p>
                  </>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <div className="flex justify-between items-end mb-12">
            <RevealOnScroll><SectionLabel eyebrow="Partners" title="MOU certificates" align="center" /></RevealOnScroll>
            {isEditMode && (
              <button onClick={() => handleAddMou("certificate")} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm"><Plus size={16} /> Add Certificate</button>
            )}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {certificateMous.map((m: any, i: number) => (
              <RevealOnScroll key={m.id} delay={i * 120}>
                <div className={`group rounded-3xl overflow-hidden bg-card border transition-all relative ${isEditMode ? "border-primary/30" : "border-border shadow-[var(--shadow-card)] hover-lift"}`}>
                  {isEditMode && (
                    <button onClick={async () => { if(confirm("Delete certificate?")) { await deleteMou({ data: { id: m.id } }); queryClient.invalidateQueries({ queryKey: ["rdMous"] }); } }} className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="h-4 w-4" /></button>
                  )}
                  <div className="relative bg-sand-deep/30 p-6 grid place-items-center min-h-[300px]">
                    <img src={editedMous[m.id]?.img ?? m.img} alt={m.title} loading="lazy" className="max-h-72 object-contain group-hover:scale-[1.03] transition-transform duration-700" />
                    {isEditMode ? (
                      <div className="absolute bottom-4 inset-x-4">
                        <input className="w-full text-[10px] text-center bg-white p-1 rounded border border-primary/20" value={editedMous[m.id]?.img ?? m.img ?? ""} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[m.id], img: e.target.value } }))} placeholder="Image URL" />
                        <input className="w-full text-[10px] text-center bg-white p-1 rounded border border-primary/20 mt-1" value={editedMous[m.id]?.badge ?? m.badge ?? ""} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[m.id], badge: e.target.value } }))} placeholder="Badge text" />
                      </div>
                    ) : (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">{m.badge}</span>
                    )}
                  </div>
                  <div className="p-7">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <input className="text-display text-2xl text-ink w-full bg-primary/5 p-1 rounded" value={editedMous[m.id]?.title ?? m.title} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[m.id], title: e.target.value } }))} />
                        <textarea className="text-muted-foreground leading-relaxed w-full bg-primary/5 p-1 rounded" value={editedMous[m.id]?.body ?? m.body} onChange={e => setEditedMous(prev => ({ ...prev, [m.id]: { ...prev[m.id], body: e.target.value } }))} rows={4} />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-display text-2xl text-ink">{m.title}</h3>
                        <p className="mt-3 text-muted-foreground leading-relaxed">{m.body}</p>
                      </>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {isEditMode && hasChanges && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <button onClick={saveAll} className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"><Save className="h-5 w-5" /> Save MOUs</button>
        </div>
      )}
    </>
  );
}
