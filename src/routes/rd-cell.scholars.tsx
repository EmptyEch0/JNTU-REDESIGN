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
import { getScholarsGroupedByDept, addScholar, updateScholar, deleteScholar } from "@/funcs/rd";

export const Route = createFileRoute("/rd-cell/scholars")({
  head: () => ({
    meta: [
      { title: "Scholars under Supervision — R&D Cell — JNTU-GV CEV" },
      {
        name: "description",
        content: "Ph.D scholars carrying our research forward, across departments.",
      },
    ],
  }),
  component: ScholarsPage,
});

function ScholarsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedScholars, setEditedScholars] = useState<Record<number, any>>({});

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["rdScholars"],
    queryFn: () => getScholarsGroupedByDept(),
  });

  const saveAll = async () => {
    const promises = Object.entries(editedScholars).map(([id, data]) =>
      updateScholar({ data: { id: parseInt(id), ...data } }),
    );

    toast.promise(Promise.all(promises), {
      loading: "Saving changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdScholars"] });
        setEditedScholars({});
        return "Scholars updated!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddScholar = async (deptId: number) => {
    await addScholar({
      data: {
        deptId,
        scholarName: "New Scholar",
        rollNo: "",
        supervisor: "Supervisor Name",
        researchTitle: "Research Title",
        regYear: "2024",
        status: "On going",
      },
    });
    queryClient.invalidateQueries({ queryKey: ["rdScholars"] });
  };

  const handleDeleteScholar = async (id: number) => {
    if (!confirm("Delete this scholar record?")) return;
    await deleteScholar({ data: { id } });
    queryClient.invalidateQueries({ queryKey: ["rdScholars"] });
  };

  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="Scholars under Supervision"
        subtitle="Ph.D scholars carrying our research forward, across departments."
        image={labImg}
      />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow space-y-20">
        {isLoading ? (
          <div className="animate-pulse space-y-10">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-64 bg-card rounded" />
                <div className="h-64 bg-card rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          departments.map((dept: any, di: number) => (
            <RevealOnScroll key={dept.id} delay={di * 60}>
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-border pb-4">
                  <div>
                    <div className="text-eyebrow">Department</div>
                    <h2 className="text-display text-2xl md:text-3xl text-ink mt-1">{dept.name}</h2>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => handleAddScholar(dept.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-semibold"
                    >
                      <Plus className="h-4 w-4" /> Add Scholar
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-elegant">
                  <table className="min-w-full text-left border-collapse">
                    <thead className="bg-sand-deep/40 text-eyebrow text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Scholar</th>
                        <th className="px-6 py-4 font-semibold">Supervisor</th>
                        <th className="px-6 py-4 font-semibold">Research Title</th>
                        <th className="px-6 py-4 font-semibold">Year</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        {isEditMode && <th className="px-6 py-4 font-semibold w-10"></th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {dept.scholars.map((s: any) => (
                        <tr key={s.id} className="hover:bg-sand-deep/10 transition-colors group">
                          <td className="px-6 py-4 align-top">
                            {isEditMode ? (
                              <div className="space-y-1">
                                <input
                                  value={editedScholars[s.id]?.scholarName ?? s.scholarName}
                                  onChange={(e) =>
                                    setEditedScholars((p) => ({
                                      ...p,
                                      [s.id]: { ...p[s.id], scholarName: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-primary/5 p-1 rounded outline-none focus:ring-1 ring-primary/30"
                                />
                                <input
                                  placeholder="Roll No"
                                  value={editedScholars[s.id]?.rollNo ?? s.rollNo}
                                  onChange={(e) =>
                                    setEditedScholars((p) => ({
                                      ...p,
                                      [s.id]: { ...p[s.id], rollNo: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-primary/5 p-1 rounded outline-none text-xs text-muted-foreground"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-semibold text-ink">{s.scholarName}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {s.rollNo}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top">
                            {isEditMode ? (
                              <input
                                value={editedScholars[s.id]?.supervisor ?? s.supervisor}
                                onChange={(e) =>
                                  setEditedScholars((p) => ({
                                    ...p,
                                    [s.id]: { ...p[s.id], supervisor: e.target.value },
                                  }))
                                }
                                className="w-full bg-primary/5 p-1 rounded outline-none"
                              />
                            ) : (
                              <div className="text-ink">{s.supervisor}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top max-w-md">
                            {isEditMode ? (
                              <textarea
                                value={editedScholars[s.id]?.researchTitle ?? s.researchTitle}
                                onChange={(e) =>
                                  setEditedScholars((p) => ({
                                    ...p,
                                    [s.id]: { ...p[s.id], researchTitle: e.target.value },
                                  }))
                                }
                                className="w-full bg-primary/5 p-1 rounded outline-none text-xs"
                                rows={3}
                              />
                            ) : (
                              <div className="text-muted-foreground leading-relaxed italic">
                                "{s.researchTitle}"
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top">
                            {isEditMode ? (
                              <input
                                value={editedScholars[s.id]?.regYear ?? s.regYear}
                                onChange={(e) =>
                                  setEditedScholars((p) => ({
                                    ...p,
                                    [s.id]: { ...p[s.id], regYear: e.target.value },
                                  }))
                                }
                                className="w-20 bg-primary/5 p-1 rounded outline-none"
                              />
                            ) : (
                              <div className="text-ink font-medium">{s.regYear || "—"}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-top">
                            {isEditMode ? (
                              <input
                                value={editedScholars[s.id]?.status ?? s.status}
                                onChange={(e) =>
                                  setEditedScholars((p) => ({
                                    ...p,
                                    [s.id]: { ...p[s.id], status: e.target.value },
                                  }))
                                }
                                className="w-full bg-primary/5 p-1 rounded outline-none"
                              />
                            ) : (
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.status?.toLowerCase().includes("awarded") ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}
                              >
                                {s.status}
                              </span>
                            )}
                          </td>
                          {isEditMode && (
                            <td className="px-6 py-4 align-top">
                              <button
                                onClick={() => handleDeleteScholar(s.id)}
                                className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {dept.scholars.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-muted-foreground italic"
                          >
                            No scholars listed for this department yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </RevealOnScroll>
          ))
        )}
      </section>

      {isEditMode && Object.keys(editedScholars).length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <button
            onClick={saveAll}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"
          >
            <Save className="h-5 w-5" /> Save All Scholars
          </button>
        </div>
      )}
    </>
  );
}
