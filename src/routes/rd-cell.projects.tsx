import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { RD_SUBNAV } from "@/lib/site";
import labImg from "@/assets/lab.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";
import { getProjects, addProject, updateProject, deleteProject } from "@/funcs/rd";

export const Route = createFileRoute("/rd-cell/projects")({
  head: () => ({
    meta: [
      { title: "Research Projects — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Funded research projects across departments at JNTU-GV CEV." },
    ],
  }),
  component: ProjectsPage,
});

function StatusBadge({ s }: { s: string }) {
  const isDone = s === "Completed";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isDone ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-primary" : "bg-accent"}`} />
      {s}
    </span>
  );
}

function ProjectsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedProjects, setEditedProjects] = useState<Record<number, any>>({});

  const { data: departments = [], isLoading } = useQuery({ 
    queryKey: ["rdProjects"], 
    queryFn: () => getProjects() 
  });

  const saveAll = async () => {
    const promises = Object.entries(editedProjects).map(([id, data]) => 
      updateProject({ data: { id: parseInt(id), ...data } })
    );

    toast.promise(Promise.all(promises), {
      loading: "Saving changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdProjects"] });
        setEditedProjects({});
        return "Projects updated!";
      },
      error: "Failed to save changes."
    });
  };

  const handleAddProject = async (deptId: number) => {
    await addProject({ data: { deptId, title: "New Project", pi: "PI Name", agency: "Agency", amount: "₹ 0.00 L", period: "—", status: "On going" } });
    queryClient.invalidateQueries({ queryKey: ["rdProjects"] });
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject({ data: { id } });
    queryClient.invalidateQueries({ queryKey: ["rdProjects"] });
  };

  return (
    <>
      <PageHero eyebrow="R&D Cell" title="Research Projects" subtitle="Funded projects from UGC, DST, DAE, NRB, RUSA and industry partners." image={labImg} />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow space-y-14">
        {isLoading ? (
          <div className="animate-pulse space-y-10">
            {[1, 2].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-64 bg-card rounded" />
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="h-40 bg-card rounded-2xl" />
                  <div className="h-40 bg-card rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          departments.map((dept: any, di: number) => (
            <RevealOnScroll key={dept.id} delay={di * 60}>
              <div>
                <div className="text-eyebrow">Department</div>
                <h2 className="text-display text-2xl md:text-3xl text-ink mt-1">{dept.name}</h2>
                <div className="mt-6 grid lg:grid-cols-2 gap-5">
                  {dept.projects.map((p: any, i: number) => (
                    <div key={p.id} className="p-6 rounded-2xl bg-card border border-border hover-lift h-full relative group">
                      {isEditMode && (
                        <button onClick={() => handleDeleteProject(p.id)} className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 className="h-4 w-4" /></button>
                      )}
                      
                      {isEditMode ? (
                        <div className="space-y-4">
                          <textarea value={editedProjects[p.id]?.title ?? p.title} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], title: e.target.value } }))} className="w-full bg-transparent font-semibold text-ink leading-snug border-b border-primary/20 outline-none" rows={2} />
                          <div className="flex gap-2">
                            <select value={editedProjects[p.id]?.status ?? p.status} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], status: e.target.value } }))} className="bg-primary/5 text-xs p-1 rounded border border-primary/20">
                              <option value="On going">On going</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div><dt className="text-eyebrow text-xs">PI</dt><input value={editedProjects[p.id]?.pi ?? p.pi} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], pi: e.target.value } }))} className="w-full bg-transparent border-b border-primary/10 text-xs" /></div>
                            <div><dt className="text-eyebrow text-xs">Agency</dt><input value={editedProjects[p.id]?.agency ?? p.agency} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], agency: e.target.value } }))} className="w-full bg-transparent border-b border-primary/10 text-xs" /></div>
                            <div><dt className="text-eyebrow text-xs">Amount</dt><input value={editedProjects[p.id]?.amount ?? p.amount} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], amount: e.target.value } }))} className="w-full bg-transparent border-b border-primary/10 text-xs" /></div>
                            <div><dt className="text-eyebrow text-xs">Period</dt><input value={editedProjects[p.id]?.period ?? p.period} onChange={e => setEditedProjects(prev => ({ ...prev, [p.id]: { ...prev[p.id], period: e.target.value } }))} className="w-full bg-transparent border-b border-primary/10 text-xs" /></div>
                          </dl>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-ink leading-snug">{p.title}</h3>
                            <StatusBadge s={p.status} />
                          </div>
                          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div><dt className="text-eyebrow text-xs">Principal Investigator</dt><dd className="text-ink mt-0.5">{p.pi}</dd></div>
                            <div><dt className="text-eyebrow text-xs">Funding Agency</dt><dd className="text-ink mt-0.5">{p.agency}</dd></div>
                            <div><dt className="text-eyebrow text-xs">Amount</dt><dd className="text-primary font-semibold mt-0.5">{p.amount}</dd></div>
                            <div><dt className="text-eyebrow text-xs">Period</dt><dd className="text-ink mt-0.5">{p.period}</dd></div>
                          </dl>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => handleAddProject(dept.id)} className="p-6 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium h-full"><Plus className="h-5 w-5" /> Add Project</button>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))
        )}
      </section>

      {isEditMode && Object.keys(editedProjects).length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <button onClick={saveAll} className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"><Save className="h-5 w-5" /> Save Projects</button>
        </div>
      )}
    </>
  );
}
