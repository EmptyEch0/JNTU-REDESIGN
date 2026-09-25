import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { RD_SUBNAV } from "@/lib/site";
import { Quote, Plus, Trash2, Save, X, Edit3, UserCheck, Shield } from "lucide-react";
import labImg from "@/assets/lab.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getCommittee,
  addMember,
  updateMember,
  deleteMember,
  getCoordinatorMessage,
  updateCoordinatorMessage,
  getMottos,
  updateMotto,
} from "@/funcs/rd";

import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/rd-cell/about")({
  head: () => ({
    meta: [
      { title: "About Research — R&D Cell — JNTU-GV CEV" },
      {
        name: "description",
        content: "Coordinator's message and Research Advisory Committee at JNTU-GV CEV.",
      },
    ],
  }),
  component: AboutResearchPage,
});

function AboutResearchPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedCommittee, setEditedCommittee] = useState<Record<number, any>>({});
  const [editedMottos, setEditedMottos] = useState<Record<number, any>>({});
  const [editedCoordinator, setEditedCoordinator] = useState<any>(null);

  const { data: committee = [] } = useQuery({
    queryKey: ["rdCommittee"],
    queryFn: () => getCommittee(),
  });

  const { data: coordinator } = useQuery({
    queryKey: ["rdCoordinator"],
    queryFn: () => getCoordinatorMessage(),
  });

  const { data: mottos = [] } = useQuery({
    queryKey: ["rdMottos"],
    queryFn: () => getMottos(),
  });

  const saveCoordinator = async () => {
    if (!editedCoordinator) return;
    try {
      await updateCoordinatorMessage({
        data: {
          id: coordinator?.id,
          name: editedCoordinator.name ?? coordinator?.name ?? "Dr. G. Naga Raju",
          role: editedCoordinator.role ?? coordinator?.role ?? "Research Coordinator",
          quote: editedCoordinator.quote ?? coordinator?.quote ?? "",
          message: editedCoordinator.message ?? coordinator?.message ?? "",
          image: editedCoordinator.image ?? coordinator?.image ?? "",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["rdCoordinator"] });
      setEditedCoordinator(null);
      toast.success("R&D Coordinator profile updated successfully!");
    } catch {
      toast.error("Failed to update coordinator profile.");
    }
  };

  const saveAll = async () => {
    const promises: Promise<any>[] = [];

    Object.entries(editedCommittee).forEach(([id, data]) => {
      promises.push(updateMember({ data: { id: parseInt(id), ...data } }));
    });

    Object.entries(editedMottos).forEach(([id, data]) => {
      promises.push(updateMotto({ data: { id: parseInt(id), ...data } }));
    });

    if (editedCoordinator) {
      promises.push(
        updateCoordinatorMessage({
          data: {
            id: coordinator?.id,
            name: editedCoordinator.name ?? coordinator?.name,
            role: editedCoordinator.role ?? coordinator?.role,
            quote: editedCoordinator.quote ?? coordinator?.quote,
            message: editedCoordinator.message ?? coordinator?.message,
            image: editedCoordinator.image ?? coordinator?.image,
          },
        })
      );
    }

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
        queryClient.invalidateQueries({ queryKey: ["rdCoordinator"] });
        queryClient.invalidateQueries({ queryKey: ["rdMottos"] });
        setEditedCommittee({});
        setEditedMottos({});
        setEditedCoordinator(null);
        return "All research information saved!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddMember = async () => {
    await addMember({ data: { name: "New Member", role: "Committee Member", detail: "Department" } });
    queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
    toast.success("Member added to advisory committee");
  };

  const hasChanges =
    Object.keys(editedCommittee).length > 0 ||
    Object.keys(editedMottos).length > 0 ||
    editedCoordinator !== null;

  const coordinatorName = editedCoordinator?.name ?? coordinator?.name ?? "Dr. G. Naga Raju";
  const coordinatorRole = editedCoordinator?.role ?? coordinator?.role ?? "Research Coordinator";
  const coordinatorQuote =
    editedCoordinator?.quote ??
    coordinator?.quote ??
    "Research is to see what everybody else has seen, and to think what nobody else has thought.";
  const coordinatorMsg =
    editedCoordinator?.message ??
    coordinator?.message ??
    "JNTUK-UCEV strives towards inculcating research culture among its students and faculty...";
  const coordinatorImg = editedCoordinator?.image ?? coordinator?.image ?? "";

  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="About Research"
        subtitle="A culture of inquiry, collaboration and impact — built department by department."
        image={labImg}
      />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start max-w-5xl mx-auto">
          {/* Coordinator Photo & Identity */}
          <RevealOnScroll>
            <div className="relative group md:sticky md:top-32 text-center">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
                style={{ background: "var(--gradient-royal)" }}
              />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-elegant bg-card flex flex-col items-center justify-center">
                {isEditMode ? (
                  <AdminUpload
                    value={coordinatorImg}
                    onChange={(newUrl) =>
                      setEditedCoordinator((prev: any) => ({
                        ...prev,
                        image: newUrl,
                      }))
                    }
                    module="research-development"
                    category="coordinator"
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    decoding="async"
                    loading="lazy"
                    src={getAssetUrl(coordinatorImg)}
                    alt={coordinatorName}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="mt-4">
                {isEditMode ? (
                  <div className="space-y-2 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
                    <div>
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Coordinator Name
                      </label>
                      <input
                        className="w-full font-bold text-ink bg-white border border-amber-500/30 px-3 py-1.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                        value={coordinatorName}
                        placeholder="Coordinator Name"
                        onChange={(e) =>
                          setEditedCoordinator((prev: any) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Designation / Role
                      </label>
                      <input
                        className="w-full text-xs text-primary font-semibold bg-white border border-amber-500/30 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20"
                        value={coordinatorRole}
                        placeholder="Designation / Role"
                        onChange={(e) =>
                          setEditedCoordinator((prev: any) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-ink text-lg">{coordinatorName}</p>
                    <div className="text-sm text-primary font-semibold">{coordinatorRole}</div>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* Coordinator Message & Quote */}
          <RevealOnScroll delay={120}>
            <div className="relative p-8 md:p-10 rounded-3xl bg-card border border-border shadow-elegant h-full flex flex-col justify-between">
              <div>
                <Quote className="h-8 w-8 text-primary/40 absolute -top-4 -left-4 bg-background rounded-full p-1.5 border border-border" />
                
                {isEditMode ? (
                  <div className="space-y-1 mb-6">
                    <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                      Lead Quote
                    </label>
                    <textarea
                      className="w-full text-xl md:text-2xl text-ink leading-snug bg-white border border-amber-500/30 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 resize-none h-28"
                      value={coordinatorQuote}
                      placeholder="Coordinator Quote"
                      onChange={(e) =>
                        setEditedCoordinator((prev: any) => ({
                          ...prev,
                          quote: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <p className="text-display text-2xl md:text-3xl text-ink leading-snug">
                    "{coordinatorQuote}"
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-eyebrow">Coordinator's message</div>
                  {isEditMode ? (
                    <div className="mt-3 space-y-1">
                      <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                        Detailed Message
                      </label>
                      <textarea
                        className="w-full text-muted-foreground leading-relaxed bg-white border border-amber-500/30 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 h-44 text-sm"
                        value={coordinatorMsg}
                        placeholder="Coordinator Message"
                        onChange={(e) =>
                          setEditedCoordinator((prev: any) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {coordinatorMsg}
                    </p>
                  )}
                </div>
              </div>

              {isEditMode && editedCoordinator !== null && (
                <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-end">
                  <button
                    onClick={saveCoordinator}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow hover:bg-amber-700 transition"
                  >
                    <Save className="h-4 w-4" /> Save Coordinator Details
                  </button>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Motto"
              title="The R&D Cell functions with these aims."
              align="center"
            />
          </RevealOnScroll>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {mottos.map((m: any, i: number) => (
              <RevealOnScroll key={m.id} delay={i * 80}>
                <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover-lift h-full group">
                  <div className="h-9 w-9 rounded-lg bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0 font-semibold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <textarea
                        className="w-full bg-white border border-amber-500/30 p-2 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-amber-500/20"
                        value={editedMottos[m.id]?.text ?? m.text}
                        onChange={(e) =>
                          setEditedMottos((p) => ({ ...p, [m.id]: { text: e.target.value } }))
                        }
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">{m.text}</p>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Committee Members */}
      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Research Advisory Committee" title="Members" align="center" />
        </RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {committee.map((m: any, i: number) => (
            <RevealOnScroll key={m.id} delay={i * 50}>
              <div className="relative group h-full">
                {isEditMode && (
                  <button
                    onClick={async () => {
                      if (confirm(`Delete member "${m.name}"?`)) {
                        await deleteMember({ data: { id: m.id } });
                        queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
                        toast.success("Member removed");
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-80 hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {isEditMode ? (
                  <div className="p-6 rounded-2xl bg-card border border-amber-500/30 space-y-3 h-full shadow-xs">
                    <div>
                      <label className="text-[9px] font-bold text-amber-900 uppercase block mb-0.5">
                        Name
                      </label>
                      <input
                        placeholder="Member Name"
                        value={editedCommittee[m.id]?.name ?? m.name}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], name: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-amber-500/20 px-2.5 py-1.5 rounded-lg font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-amber-900 uppercase block mb-0.5">
                        Role
                      </label>
                      <input
                        placeholder="Role / Title"
                        value={editedCommittee[m.id]?.role ?? m.role}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], role: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-amber-900 uppercase block mb-0.5">
                        Detail / Designation
                      </label>
                      <input
                        placeholder="Detail (e.g. Dept / Convener)"
                        value={editedCommittee[m.id]?.detail ?? m.detail}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], detail: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                ) : (
                  <ProfileCard
                    name={m.name}
                    role={m.role}
                    detail={m.detail}
                    badge={`Member ${String(i + 1).padStart(2, "0")}`}
                  />
                )}
              </div>
            </RevealOnScroll>
          ))}
          {isEditMode && (
            <button
              onClick={handleAddMember}
              className="p-7 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium h-full min-h-[200px] cursor-pointer"
            >
              <Plus className="h-5 w-5" /> Add Committee Member
            </button>
          )}
        </div>
      </section>

      {/* Floating Save All Changes Bar */}
      {isEditMode && hasChanges && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={saveAll}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-sm tracking-wide border-2 border-white/20"
          >
            <Save className="h-5 w-5" /> Save All Research Info
          </button>
        </div>
      )}
    </>
  );
}
