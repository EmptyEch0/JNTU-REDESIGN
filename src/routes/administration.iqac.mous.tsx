import { createFileRoute } from "@tanstack/react-router";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssetUrl } from "@/lib/assets";
import { getIqacMous, addIqacMou, updateIqacMou, deleteIqacMou } from "../funcs/leadership";
import { Handshake, ArrowUpRight, Building2, MapPin, Plus, Trash2, Save, X, Edit3 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/administration/iqac/mous")({
  head: () => ({
    meta: [
      { title: "IQAC MOUs — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Institutional collaborations and strategic partnerships at JNTU-GV CEV.",
      },
    ],
  }),
  component: MousPage,
});

function MousPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();

  const [editedMous, setEditedMous] = useState<Record<number, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newMou, setNewMou] = useState({
    title: "",
    description: "",
    image: "hero-carousal/hero-campus.jpg",
  });

  const { data: mous = [], isLoading } = useQuery({
    queryKey: ["iqac", "mous"],
    queryFn: () => getIqacMous(),
  });

  const addMutation = useMutation({
    mutationFn: (data: { title: string; description: string; image: string }) =>
      addIqacMou({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "mous"] });
      setNewMou({
        title: "",
        description: "",
        image: "hero-carousal/hero-campus.jpg",
      });
      setIsAdding(false);
      toast.success("MOU added successfully!");
    },
    onError: () => {
      toast.error("Failed to add MOU.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIqacMou({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iqac", "mous"] });
      toast.success("MOU deleted!");
    },
    onError: () => {
      toast.error("Failed to delete MOU.");
    },
  });

  const handleSaveMou = async (id: number) => {
    const changes = editedMous[id];
    if (!changes) return;
    try {
      await updateIqacMou({ data: { id, ...changes } });
      queryClient.invalidateQueries({ queryKey: ["iqac", "mous"] });
      setEditedMous((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
      toast.success("MOU updated successfully!");
    } catch {
      toast.error("Failed to update MOU.");
    }
  };

  return (
    <section className="py-12 md:py-20">
      <RevealOnScroll>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20 shrink-0">
                <Handshake className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink tracking-tight">Collaborations & MOUs</h3>
                <p className="text-muted-foreground mt-1 text-base">
                  Strategic partnerships driving innovation and student placement.
                </p>
              </div>
            </div>

            {isEditMode && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add MOU
              </button>
            )}
          </div>

          {isEditMode && isAdding && (
            <div className="mb-12 p-6 rounded-3xl bg-amber-500/5 border-2 border-amber-500/20 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/10 text-amber-900 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" /> Add New Institutional MOU
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                      MOU Title *
                    </label>
                    <input
                      placeholder="e.g. MOU with Tech Mahindra"
                      value={newMou.title}
                      onChange={(e) => setNewMou({ ...newMou, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Details of collaboration..."
                      value={newMou.description}
                      onChange={(e) => setNewMou({ ...newMou, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                    MOU Banner Image
                  </label>
                  <div className="h-48 rounded-2xl overflow-hidden border border-amber-500/30 bg-white">
                    <AdminUpload
                      value={newMou.image}
                      onChange={(newUrl) => setNewMou({ ...newMou, image: newUrl })}
                      module="administration"
                      category="iqac-mous"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-500/10">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newMou.title || !newMou.description) {
                      toast.error("Please provide Title and Description.");
                      return;
                    }
                    addMutation.mutate(newMou);
                  }}
                  className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow"
                >
                  Save MOU
                </button>
              </div>
            </div>
          )}

          <div className="space-y-16">
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground animate-pulse">
                Loading partnerships...
              </div>
            ) : mous?.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No active MOUs configured yet.
              </div>
            ) : (
              mous?.map((mou: any) => {
                const isEdited = !!editedMous[mou.id];
                const titleVal = editedMous[mou.id]?.title ?? mou.title;
                const descVal = editedMous[mou.id]?.description ?? mou.description;
                const imgVal = editedMous[mou.id]?.image ?? mou.image;

                return (
                  <div
                    key={mou.id}
                    className="group bg-card rounded-[48px] border border-border overflow-hidden shadow-elegant hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {isEditMode && (
                      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/30 shadow-lg">
                        {isEdited && (
                          <button
                            onClick={() => handleSaveMou(mou.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition"
                          >
                            <Save className="h-3.5 w-3.5" /> Save
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Delete MOU "${mou.title}"?`)) {
                              deleteMutation.mutate(mou.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Landscape Image Header */}
                    <div className="relative aspect-[16/7] md:aspect-[21/9] overflow-hidden">
                      {isEditMode ? (
                        <AdminUpload
                          value={imgVal}
                          onChange={(newUrl) =>
                            setEditedMous((p) => ({
                              ...p,
                              [mou.id]: { ...p[mou.id], image: newUrl },
                            }))
                          }
                          module="administration"
                          category="iqac-mous"
                          className="w-full h-full"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent z-10" />
                          <img
                            decoding="async"
                            loading="lazy"
                            src={getAssetUrl(imgVal)}
                            alt={titleVal}
                            className="h-full w-full object-cover scale-105 group-hover:scale-100 transition-all duration-300"
                          />
                          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold mb-4 uppercase tracking-[0.2em] shadow-lg">
                              Active Collaboration
                            </div>
                            <h4 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                              {titleVal}
                            </h4>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-16">
                      {isEditMode && (
                        <div className="mb-6 space-y-2">
                          <label className="text-[10px] font-bold text-amber-900 uppercase">
                            MOU Title
                          </label>
                          <input
                            value={titleVal}
                            onChange={(e) =>
                              setEditedMous((p) => ({
                                ...p,
                                [mou.id]: { ...p[mou.id], title: e.target.value },
                              }))
                            }
                            className="w-full p-2.5 rounded-xl border border-amber-500/30 font-bold text-xl text-ink bg-white"
                          />
                        </div>
                      )}

                      <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">
                        <div className="space-y-8">
                          {isEditMode ? (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-amber-900 uppercase">
                                MOU Description / Objectives
                              </label>
                              <textarea
                                rows={6}
                                value={descVal}
                                onChange={(e) =>
                                  setEditedMous((p) => ({
                                    ...p,
                                    [mou.id]: { ...p[mou.id], description: e.target.value },
                                  }))
                                }
                                className="w-full p-3 rounded-2xl border border-amber-500/30 text-base leading-relaxed bg-white outline-none"
                              />
                            </div>
                          ) : (
                            <div className="prose prose-lg text-muted-foreground max-w-none">
                              {descVal.split("\n\n").map((para: string, i: number) => (
                                <p key={i} className="leading-relaxed text-lg">
                                  {para}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-8">
                          <div className="p-8 rounded-[32px] bg-muted/30 border border-border/50 space-y-6">
                            <div className="flex items-center gap-3 text-ink font-bold">
                              <Building2 className="h-5 w-5 text-primary" />
                              Partnership Details
                            </div>
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                <span className="text-sm text-muted-foreground font-medium">
                                  Skill & Capability Development
                                </span>
                              </div>
                              <div className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                <span className="text-sm text-muted-foreground font-medium">
                                  Industry-Academia Collaboration
                                </span>
                              </div>
                              <div className="flex gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                <span className="text-sm text-muted-foreground font-medium">
                                  Student Internships & Placements
                                </span>
                              </div>
                            </div>
                            <div className="pt-6 border-t border-border/50">
                              <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-default group/link">
                                Explore Center
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 px-6 text-muted-foreground">
                            <MapPin className="h-5 w-5 text-primary/40" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              Vizianagaram Campus
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
