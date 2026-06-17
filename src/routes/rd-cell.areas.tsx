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
import {
  getDepartmentsWithAreas,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addArea,
  updateArea,
  deleteArea,
} from "@/funcs/rd";

export const Route = createFileRoute("/rd-cell/areas")({
  head: () => ({
    meta: [
      { title: "Areas of Research — R&D Cell — JNTU-GV CEV" },
      {
        name: "description",
        content: "Department-wise research interests across engineering and sciences.",
      },
    ],
  }),
  component: AreasPage,
});

function AreasPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedDepts, setEditedDepts] = useState<Record<number, any>>({});
  const [editedAreas, setEditedAreas] = useState<Record<number, any>>({});
  const [newDepts, setNewDepts] = useState<{ name: string; areas: string[] }[]>([]);
  const [newAreas, setNewAreas] = useState<Record<number, string[]>>({});

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["rdDepartments"],
    queryFn: () => getDepartmentsWithAreas(),
  });

  const handleDeptChange = (id: number, name: string) => {
    setEditedDepts((prev) => ({ ...prev, [id]: { ...prev[id], name } }));
  };

  const handleAreaChange = (id: number, area: string) => {
    setEditedAreas((prev) => ({ ...prev, [id]: { ...prev[id], area } }));
  };

  const handleAddArea = (deptId: number) => {
    setNewAreas((prev) => ({
      ...prev,
      [deptId]: [...(prev[deptId] || []), ""],
    }));
  };

  const handleNewAreaChange = (deptId: number, index: number, value: string) => {
    setNewAreas((prev) => {
      const updated = [...(prev[deptId] || [])];
      updated[index] = value;
      return { ...prev, [deptId]: updated };
    });
  };

  const handleRemoveNewArea = (deptId: number, index: number) => {
    setNewAreas((prev) => {
      const updated = [...(prev[deptId] || [])];
      updated.splice(index, 1);
      return { ...prev, [deptId]: updated };
    });
  };

  const saveAll = async () => {
    const promises = [
      ...Object.entries(editedDepts).map(([id, data]) =>
        updateDepartment({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(editedAreas).map(([id, data]) =>
        updateArea({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(newAreas).flatMap(([deptId, areas]) =>
        areas
          .filter((a) => a.trim())
          .map((a) => addArea({ data: { deptId: parseInt(deptId), area: a } })),
      ),
      ...newDepts
        .filter((d) => d.name.trim())
        .map(async (d) => {
          const [inserted] = await addDepartment({ data: { name: d.name } });
          if (d.areas.length > 0) {
            await Promise.all(
              d.areas
                .filter((a) => a.trim())
                .map((a) => addArea({ data: { deptId: inserted.id, area: a } })),
            );
          }
        }),
    ];

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdDepartments"] });
        setEditedDepts({});
        setEditedAreas({});
        setNewDepts([]);
        setNewAreas({});
        return "All changes saved!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleDeleteDept = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department and all its research areas?"))
      return;
    toast.promise(deleteDepartment({ data: { id } }), {
      loading: "Deleting department...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdDepartments"] });
        return "Department deleted!";
      },
      error: "Failed to delete department.",
    });
  };

  const handleDeleteArea = async (id: number) => {
    toast.promise(deleteArea({ data: { id } }), {
      loading: "Deleting area...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdDepartments"] });
        return "Area deleted!";
      },
      error: "Failed to delete area.",
    });
  };

  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="Areas of Research"
        subtitle="Department-wise interests — from power systems to deep learning to materials science."
        image={labImg}
      />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow space-y-16 relative">
        {isLoading ? (
          <div className="flex flex-col gap-12 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-24 bg-card rounded" />
                <div className="h-8 w-3/4 bg-card rounded" />
                <div className="flex gap-2">
                  <div className="h-10 w-32 bg-card rounded-full" />
                  <div className="h-10 w-40 bg-card rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {departments.map((d: any, di: number) => (
              <RevealOnScroll key={d.id} delay={di * 50}>
                <div className="group/dept">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-eyebrow">Department</div>
                      {isEditMode ? (
                        <input
                          value={editedDepts[d.id]?.name ?? d.name}
                          onChange={(e) => handleDeptChange(d.id, e.target.value)}
                          className="text-display text-2xl md:text-3xl text-ink mt-1 bg-transparent border-b border-dashed border-primary/30 focus:border-primary outline-none w-full"
                        />
                      ) : (
                        <h2 className="text-display text-2xl md:text-3xl text-ink mt-1">
                          {d.name}
                        </h2>
                      )}
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteDept(d.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {d.researchAreas.map((a: any) => (
                      <div key={a.id} className="relative group/area">
                        {isEditMode ? (
                          <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-card border border-primary/30">
                            <input
                              value={editedAreas[a.id]?.area ?? a.area}
                              onChange={(e) => handleAreaChange(a.id, e.target.value)}
                              className="bg-transparent text-sm text-ink outline-none min-w-[120px]"
                            />
                            <button
                              onClick={() => handleDeleteArea(a.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="px-4 py-2 rounded-full bg-card border border-border text-sm text-ink hover:border-primary/50 hover:-translate-y-0.5 transition-all">
                            {a.area}
                          </span>
                        )}
                      </div>
                    ))}

                    {/* New areas for existing dept */}
                    {newAreas[d.id]?.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary/5 border border-primary/50 border-dashed"
                      >
                        <input
                          autoFocus
                          placeholder="New area..."
                          value={a}
                          onChange={(e) => handleNewAreaChange(d.id, i, e.target.value)}
                          className="bg-transparent text-sm text-ink outline-none min-w-[120px]"
                        />
                        <button
                          onClick={() => handleRemoveNewArea(d.id, i)}
                          className="text-muted-foreground hover:text-ink"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {isEditMode && (
                      <button
                        onClick={() => handleAddArea(d.id)}
                        className="px-4 py-2 rounded-full border border-dashed border-primary/40 text-sm text-primary hover:bg-primary/5 transition-all flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add Area
                      </button>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}

            {/* New Departments */}
            {newDepts.map((nd, ni) => (
              <div
                key={ni}
                className="p-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4"
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="text-eyebrow text-primary/60">New Department</div>
                    <input
                      autoFocus
                      placeholder="Enter department name..."
                      value={nd.name}
                      onChange={(e) => {
                        const updated = [...newDepts];
                        updated[ni].name = e.target.value;
                        setNewDepts(updated);
                      }}
                      className="text-display text-2xl md:text-3xl text-ink mt-1 bg-transparent border-b border-primary/30 focus:border-primary outline-none w-full"
                    />
                  </div>
                  <button
                    onClick={() => setNewDepts((prev) => prev.filter((_, i) => i !== ni))}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}

            {isEditMode && (
              <div className="flex flex-col items-center gap-6 pt-8 border-t border-border/50">
                <button
                  onClick={() => setNewDepts((prev) => [...prev, { name: "", areas: [] }])}
                  className="px-8 py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-medium hover:bg-primary/5 hover:border-primary/50 transition-all flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Add New Department
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Save FAB */}
      {isEditMode &&
        (Object.keys(editedDepts).length > 0 ||
          Object.keys(editedAreas).length > 0 ||
          Object.keys(newAreas).length > 0 ||
          newDepts.length > 0) && (
          <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
            <button
              onClick={saveAll}
              className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"
            >
              <Save className="h-5 w-5" />
              Save All Changes
            </button>
          </div>
        )}
    </>
  );
}
