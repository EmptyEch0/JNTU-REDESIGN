import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import { Mail, Quote, Target, Users, Plus, Trash2, Save } from "lucide-react";
import placementsImg from "@/assets/placements-bg.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getTPO,
  updateTPO,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  getRecruiters,
  addRecruiter,
  deleteRecruiter,
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../lib/placements";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export const Route = createFileRoute("/placements/training")({
  head: () => ({
    meta: [
      { title: "Training & Placement Cell — JNTU-GV CEV" },
      {
        name: "description",
        content: "Vision, mission and team behind the Training & Placement Cell at JNTU-GV CEV.",
      },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();

  // Local state for tracking changes
  const [editedTPO, setEditedTPO] = useState<any>(null);
  const [editedGoals, setEditedGoals] = useState<Record<number, any>>({});
  const [editedStaff, setEditedStaff] = useState<Record<number, any>>({});

  const { data: tpoData, isLoading: isLoadingTPO } = useQuery({
    queryKey: ["tpo"],
    queryFn: () => getTPO(),
  });
  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: () => getGoals(),
  });
  const { data: recruiters, isLoading: isLoadingRecruiters } = useQuery({
    queryKey: ["recruiters"],
    queryFn: () => getRecruiters(),
  });
  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff(),
  });

  // Initialize editedTPO when data arrives
  useEffect(() => {
    if (tpoData) setEditedTPO(null);
  }, [tpoData]);

  const saveAllChanges = async () => {
    const promises = [];
    if (editedTPO) promises.push(updateTPO({ data: { id: tpoData.id, ...editedTPO } }));

    Object.entries(editedGoals).forEach(([id, data]) => {
      promises.push(updateGoal({ data: { id: parseInt(id), ...data } }));
    });

    Object.entries(editedStaff).forEach(([id, data]) => {
      promises.push(updateStaff({ data: { id: parseInt(id), ...data } }));
    });

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving all changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["tpo"] });
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        setEditedTPO(null);
        setEditedGoals({});
        setEditedStaff({});
        return "All changes saved successfully!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddGoal = async () => {
    const text = prompt("Enter new goal:");
    if (text) {
      await addGoal({ data: { text } });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal added");
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (confirm("Delete this goal?")) {
      await deleteGoal({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal deleted");
    }
  };

  const handleAddRecruiter = async () => {
    const name = prompt("Enter company name:");
    if (name) {
      await addRecruiter({ data: { name } });
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success("Recruiter added");
    }
  };

  const handleDeleteRecruiter = async (id: number) => {
    if (confirm("Delete this recruiter?")) {
      await deleteRecruiter({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success("Recruiter deleted");
    }
  };

  const handleAddStaff = async () => {
    const name = prompt("Enter staff name:");
    const role = prompt("Enter role:");
    if (name && role) {
      await addStaff({ data: { name, role } });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member added");
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (confirm("Delete this staff member?")) {
      await deleteStaff({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff deleted");
    }
  };

  const hasUnsavedChanges =
    editedTPO !== null ||
    Object.keys(editedGoals).length > 0 ||
    Object.keys(editedStaff).length > 0;

  return (
    <>
      <PageHero
        eyebrow="Placements"
        title="Training & Placement Cell"
        subtitle="Fostering excellence through industry collaboration and student empowerment."
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 bg-white">
        <div className="container-narrow grid md:grid-cols-2 gap-16 items-start">
          <RevealOnScroll>
            <div
              className={`p-8 rounded-3xl border transition-all relative group ${isEditMode ? "bg-amber-50/50 border-amber-200" : "bg-card border-border shadow-[var(--shadow-elegant)]"}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group/img">
                  <img
                    src={editedTPO?.image ?? tpoData?.image}
                    alt={tpoData?.name}
                    className="w-48 h-48 rounded-2xl object-cover shadow-lg mb-6"
                  />
                  {isEditMode && (
                    <input
                      className="mt-2 text-[10px] w-full p-1 border border-amber-200 rounded bg-white"
                      placeholder="Image URL"
                      value={editedTPO?.image ?? tpoData?.image ?? ""}
                      onChange={(e) => setEditedTPO({ ...editedTPO, image: e.target.value })}
                    />
                  )}
                </div>
                <div className="space-y-2 w-full">
                  {isEditMode ? (
                    <input
                      className="text-2xl font-bold text-ink bg-white border border-amber-200 rounded px-2 py-1 w-full text-center"
                      value={editedTPO?.name ?? tpoData?.name ?? ""}
                      onChange={(e) => setEditedTPO({ ...editedTPO, name: e.target.value })}
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-ink">{tpoData?.name}</h3>
                  )}

                  {isEditMode ? (
                    <input
                      className="text-primary font-medium bg-white border border-amber-200 rounded px-2 py-1 w-full text-center text-sm"
                      value={editedTPO?.designation ?? tpoData?.designation ?? ""}
                      onChange={(e) => setEditedTPO({ ...editedTPO, designation: e.target.value })}
                    />
                  ) : (
                    <p className="text-primary font-medium">{tpoData?.designation}</p>
                  )}

                  <div className="flex items-center justify-center gap-2 text-muted-foreground pt-4">
                    <Mail size={16} />
                    {isEditMode ? (
                      <input
                        className="bg-white border border-amber-200 rounded px-2 py-1 w-full text-sm"
                        value={editedTPO?.email ?? tpoData?.email ?? ""}
                        onChange={(e) => setEditedTPO({ ...editedTPO, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{tpoData?.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="relative pt-12">
              <Quote className="absolute top-0 left-0 text-primary/10 w-24 h-24 -z-10" />
              <SectionLabel eyebrow="Officer's Message" title="A Vision for Success" />
              <div
                className={`mt-6 text-lg text-ink leading-relaxed font-serif italic p-4 rounded-xl transition-all ${isEditMode ? "bg-amber-50/50 border border-amber-200" : ""}`}
              >
                {isEditMode ? (
                  <textarea
                    className="w-full h-48 p-3 rounded-lg border border-amber-200 bg-white focus:outline-none"
                    value={editedTPO?.message ?? tpoData?.message ?? ""}
                    onChange={(e) => setEditedTPO({ ...editedTPO, message: e.target.value })}
                  />
                ) : (
                  <p>"{tpoData?.message}"</p>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Strategic Focus" title="Goals of the T&P Cell" align="center" />
          </RevealOnScroll>

          <div className="mt-12 grid gap-6">
            {goals?.map((goal, idx) => (
              <RevealOnScroll key={goal.id} delay={idx * 50}>
                <div
                  className={`flex gap-6 p-6 rounded-2xl border transition-all relative group ${isEditMode ? "bg-white border-amber-200 shadow-sm" : "bg-card border-border"}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Target size={24} />
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <textarea
                        className="w-full p-2 border border-amber-100 rounded focus:outline-none bg-amber-50/30"
                        value={editedGoals[goal.id]?.text ?? goal.text}
                        onChange={(e) =>
                          setEditedGoals({ ...editedGoals, [goal.id]: { text: e.target.value } })
                        }
                      />
                    ) : (
                      <p className="text-ink leading-relaxed">{goal.text}</p>
                    )}
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-400 hover:text-red-600 self-start"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </RevealOnScroll>
            ))}
            {isEditMode && (
              <button
                onClick={handleAddGoal}
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold hover:bg-primary/5 transition-all"
              >
                <Plus size={20} /> Add New Goal
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Recruitment Partners" title="Major Recruiters" align="center" />
          </RevealOnScroll>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recruiters?.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border text-center font-medium transition-all group relative ${isEditMode ? "bg-amber-50/50 border-amber-200" : "bg-sand border-transparent hover:border-primary hover:bg-white"}`}
              >
                {rec.name}
                {isEditMode && (
                  <button
                    onClick={() => handleDeleteRecruiter(rec.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditMode && (
              <button
                onClick={handleAddRecruiter}
                className="p-4 rounded-xl border-2 border-dashed border-primary/30 text-primary flex items-center justify-center gap-2 hover:bg-primary/5"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Our Team" title="Supporting Staff" align="center" />
          </RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff?.map((s) => (
              <div
                key={s.id}
                className={`p-6 rounded-2xl border transition-all relative group ${isEditMode ? "bg-white border-amber-200 shadow-sm" : "bg-card border-border"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <div className="space-y-2">
                        <input
                          className="w-full text-sm font-bold bg-amber-50/30 p-1 border border-amber-100 rounded"
                          value={editedStaff[s.id]?.name ?? s.name}
                          onChange={(e) =>
                            setEditedStaff({
                              ...editedStaff,
                              [s.id]: { ...editedStaff[s.id], name: e.target.value },
                            })
                          }
                        />
                        <input
                          className="w-full text-xs text-muted-foreground bg-amber-50/30 p-1 border border-amber-100 rounded"
                          value={editedStaff[s.id]?.role ?? s.role}
                          onChange={(e) =>
                            setEditedStaff({
                              ...editedStaff,
                              [s.id]: { ...editedStaff[s.id], role: e.target.value },
                            })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-ink">{s.name}</h4>
                        <p className="text-sm text-muted-foreground">{s.role}</p>
                      </>
                    )}
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => handleDeleteStaff(s.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isEditMode && (
              <button
                onClick={handleAddStaff}
                className="p-6 rounded-2xl border-2 border-dashed border-primary/30 text-primary flex items-center justify-center gap-2 hover:bg-primary/5 h-full min-h-[80px]"
              >
                <Plus size={20} /> Add Staff Member
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Floating Save Button */}
      {isAdmin && isEditMode && hasUnsavedChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_2s_infinite]">
          <button
            onClick={saveAllChanges}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 border-2 border-white/20 backdrop-blur-sm"
          >
            <Save size={20} />
            Save All Training Updates
          </button>
        </div>
      )}
    </>
  );
}
