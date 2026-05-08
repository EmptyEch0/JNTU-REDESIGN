import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import labImg from "@/assets/lab.jpg";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProfileCard } from "@/components/ProfileCard";
import { SectionLabel } from "@/components/SectionLabel";
import * as Icons from "lucide-react";
import { Quote, Plus, Trash2, Save, X } from "lucide-react";
import { SubNav } from "@/components/SubNav";
import { RD_SUBNAV } from "@/lib/site";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getCoordinatorMessage,
  updateCoordinatorMessage,
  getFocusAreas,
  addFocusArea,
  updateFocusArea,
  deleteFocusArea,
  getFunders,
  addFunder,
  deleteFunder,
  getConsultancy,
  addConsultancy,
  updateConsultancy,
  deleteConsultancy,
  getCommittee,
  addMember,
  updateMember,
  deleteMember,
} from "@/funcs/rd";

export const Route = createFileRoute("/rd-cell/")({
  head: () => ({
    meta: [
      { title: "R&D Cell — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Research, funded projects, consultancy and the committee that drives R&D at JNTU-GV CEV.",
      },
    ],
  }),
  component: RDPage,
});

function RDPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedAreas, setEditedAreas] = useState<Record<number, any>>({});
  const [editedFunders, setEditedFunders] = useState<Record<number, any>>({});
  const [editedConsultancy, setEditedConsultancy] = useState<Record<number, any>>({});
  const [editedCommittee, setEditedCommittee] = useState<Record<number, any>>({});
  const [editedCoordinator, setEditedCoordinator] = useState<any>(null);

  const { data: coordinator } = useQuery({
    queryKey: ["rdCoordinator"],
    queryFn: () => getCoordinatorMessage(),
  });
  const { data: areas = [] } = useQuery({
    queryKey: ["rdFocusAreas"],
    queryFn: () => getFocusAreas(),
  });
  const { data: funders = [] } = useQuery({ queryKey: ["rdFunders"], queryFn: () => getFunders() });
  const { data: consultancy = [] } = useQuery({
    queryKey: ["rdConsultancy"],
    queryFn: () => getConsultancy(),
  });
  const { data: committee = [] } = useQuery({
    queryKey: ["rdCommittee"],
    queryFn: () => getCommittee(),
  });

  const saveAll = async () => {
    const promises = [
      ...Object.entries(editedAreas).map(([id, data]) =>
        updateFocusArea({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(editedConsultancy).map(([id, data]) =>
        updateConsultancy({ data: { id: parseInt(id), ...data } }),
      ),
      ...Object.entries(editedCommittee).map(([id, data]) =>
        updateMember({ data: { id: parseInt(id), ...data } }),
      ),
    ];

    if (editedCoordinator) {
      promises.push(
        updateCoordinatorMessage({ data: { id: coordinator.id, ...editedCoordinator } }),
      );
    }

    toast.promise(Promise.all(promises), {
      loading: "Saving changes...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdCoordinator"] });
        queryClient.invalidateQueries({ queryKey: ["rdFocusAreas"] });
        queryClient.invalidateQueries({ queryKey: ["rdFunders"] });
        queryClient.invalidateQueries({ queryKey: ["rdConsultancy"] });
        queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
        setEditedAreas({});
        setEditedFunders({});
        setEditedConsultancy({});
        setEditedCommittee({});
        setEditedCoordinator(null);
        return "All changes saved!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddArea = async () => {
    await addFocusArea({
      data: { title: "New Focus Area", description: "Description here...", icon: "FlaskConical" },
    });
    queryClient.invalidateQueries({ queryKey: ["rdFocusAreas"] });
  };

  const handleAddFunder = async () => {
    await addFunder({ data: { name: "NEW" } });
    queryClient.invalidateQueries({ queryKey: ["rdFunders"] });
  };

  const handleAddConsultancy = async () => {
    await addConsultancy({ data: { name: "New Partner", description: "Description..." } });
    queryClient.invalidateQueries({ queryKey: ["rdConsultancy"] });
  };

  const handleAddMember = async () => {
    await addMember({ data: { name: "New Member", role: "Role", detail: "Detail" } });
    queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
  };

  const hasChanges =
    Object.keys(editedAreas).length > 0 ||
    Object.keys(editedConsultancy).length > 0 ||
    Object.keys(editedCommittee).length > 0 ||
    editedCoordinator !== null;

  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="Research that earns its keep."
        subtitle="Funded projects, industry consultancy and a committee that turns ideas into outcomes."
        image={labImg}
      />
      <SubNav items={RD_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <SectionLabel
            eyebrow="R&D Cell Message"
            title="From the Research Coordinator."
            align="center"
          />
        </RevealOnScroll>
        <div className="mt-12 grid md:grid-cols-[280px_1fr] gap-10 items-center max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-card bg-card">
              <img
                src={editedCoordinator?.image ?? coordinator?.image}
                alt={coordinator?.name}
                className="h-full w-full object-cover"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <div className="relative p-8 rounded-3xl bg-card border border-border shadow-card h-full">
              <Quote className="h-8 w-8 text-primary/40 absolute -top-4 -left-4 bg-background rounded-full p-1.5 border border-border" />
              {isEditMode ? (
                <textarea
                  className="text-display text-xl md:text-2xl text-ink leading-snug w-full bg-primary/5 p-2 rounded outline-none h-24"
                  value={editedCoordinator?.quote ?? coordinator?.quote ?? ""}
                  onChange={(e) =>
                    setEditedCoordinator({ ...editedCoordinator, quote: e.target.value })
                  }
                />
              ) : (
                <p className="text-display text-xl md:text-2xl text-ink leading-snug">
                  "{coordinator?.quote}"
                </p>
              )}
              <div className="mt-6 pt-6 border-t border-border">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="font-semibold text-ink w-full bg-primary/5 p-1 rounded"
                      value={editedCoordinator?.name ?? coordinator?.name ?? ""}
                      onChange={(e) =>
                        setEditedCoordinator({ ...editedCoordinator, name: e.target.value })
                      }
                    />
                    <input
                      className="text-sm text-primary font-medium w-full bg-primary/5 p-1 rounded"
                      value={editedCoordinator?.role ?? coordinator?.role ?? ""}
                      onChange={(e) =>
                        setEditedCoordinator({ ...editedCoordinator, role: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-ink">{coordinator?.name}</p>
                    <div className="text-sm text-primary font-medium">{coordinator?.role}</div>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Focus areas" title="Where our research goes." />
        </RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {areas.map((a: any, i: number) => {
            const Icon = (Icons as any)[a.icon] || Icons.HelpCircle;
            return (
              <RevealOnScroll key={a.id} delay={i * 80}>
                <div className="p-7 bg-card rounded-2xl border border-border hover-lift flex gap-5 h-full relative group">
                  {isEditMode && (
                    <button
                      onClick={async () => {
                        if (confirm("Delete focus area?")) {
                          await deleteFocusArea({ data: { id: a.id } });
                          queryClient.invalidateQueries({ queryKey: ["rdFocusAreas"] });
                        }
                      }}
                      className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <div className="space-y-2">
                        <input
                          value={editedAreas[a.id]?.title ?? a.title}
                          onChange={(e) =>
                            setEditedAreas((p) => ({
                              ...p,
                              [a.id]: { ...p[a.id], title: e.target.value },
                            }))
                          }
                          className="w-full bg-transparent font-semibold border-b border-primary/20 outline-none focus:border-primary"
                        />
                        <textarea
                          value={editedAreas[a.id]?.description ?? a.description}
                          onChange={(e) =>
                            setEditedAreas((p) => ({
                              ...p,
                              [a.id]: { ...p[a.id], description: e.target.value },
                            }))
                          }
                          className="w-full bg-transparent text-sm text-muted-foreground outline-none border-b border-primary/10"
                          rows={2}
                        />
                        <input
                          value={editedAreas[a.id]?.icon ?? a.icon}
                          onChange={(e) =>
                            setEditedAreas((p) => ({
                              ...p,
                              [a.id]: { ...p[a.id], icon: e.target.value },
                            }))
                          }
                          className="w-full bg-transparent text-[10px] text-primary/40 outline-none"
                          placeholder="Lucide Icon Name"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-ink">{a.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">{a.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
          {isEditMode && (
            <button
              onClick={handleAddArea}
              className="p-7 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" /> Add Focus Area
            </button>
          )}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Funding agencies"
              title="Backed by national institutions."
              align="center"
            />
          </RevealOnScroll>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {funders.map((f: any, i: number) => (
              <RevealOnScroll key={f.id} delay={i * 60}>
                <div className="aspect-[3/2] rounded-2xl bg-card border border-border grid place-items-center hover-lift relative group">
                  {isEditMode && (
                    <button
                      onClick={async () => {
                        if (confirm("Delete funder?")) {
                          await deleteFunder({ data: { id: f.id } });
                          queryClient.invalidateQueries({ queryKey: ["rdFunders"] });
                        }
                      }}
                      className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <span className="text-display text-3xl text-primary">{f.name}</span>
                </div>
              </RevealOnScroll>
            ))}
            {isEditMode && (
              <button
                onClick={handleAddFunder}
                className="aspect-[3/2] rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" /> Add Funder
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Consultancy" title="Working with industry." />
        </RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {consultancy.map((c: any, i: number) => (
            <RevealOnScroll key={c.id} delay={i * 100}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift relative group h-full">
                {isEditMode && (
                  <button
                    onClick={async () => {
                      if (confirm("Delete consultancy?")) {
                        await deleteConsultancy({ data: { id: c.id } });
                        queryClient.invalidateQueries({ queryKey: ["rdConsultancy"] });
                      }
                    }}
                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="text-eyebrow">Industry Partner</div>
                {isEditMode ? (
                  <div className="space-y-3 mt-2">
                    <input
                      value={editedConsultancy[c.id]?.name ?? c.name}
                      onChange={(e) =>
                        setEditedConsultancy((p) => ({
                          ...p,
                          [c.id]: { ...p[c.id], name: e.target.value },
                        }))
                      }
                      className="w-full bg-transparent text-display text-2xl border-b border-primary/20 outline-none focus:border-primary"
                    />
                    <textarea
                      value={editedConsultancy[c.id]?.description ?? c.description}
                      onChange={(e) =>
                        setEditedConsultancy((p) => ({
                          ...p,
                          [c.id]: { ...p[c.id], description: e.target.value },
                        }))
                      }
                      className="w-full bg-transparent text-muted-foreground outline-none border-b border-primary/10"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-display text-2xl mt-2 text-ink">{c.name}</h3>
                    <p className="mt-3 text-muted-foreground">{c.description}</p>
                  </>
                )}
              </div>
            </RevealOnScroll>
          ))}
          {isEditMode && (
            <button
              onClick={handleAddConsultancy}
              className="p-7 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium h-full"
            >
              <Plus className="h-5 w-5" /> Add Consultancy
            </button>
          )}
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Committee" title="People who steer the cell." align="center" />
          </RevealOnScroll>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {committee.map((m: any, i: number) => (
              <RevealOnScroll key={m.id} delay={i * 50}>
                <div className="relative group h-full">
                  {isEditMode && (
                    <button
                      onClick={async () => {
                        if (confirm("Delete member?")) {
                          await deleteMember({ data: { id: m.id } });
                          queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
                        }
                      }}
                      className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {isEditMode ? (
                    <div className="p-6 rounded-2xl bg-card border border-primary/30 space-y-3 h-full">
                      <input
                        placeholder="Name"
                        value={editedCommittee[m.id]?.name ?? m.name}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], name: e.target.value },
                          }))
                        }
                        className="w-full bg-transparent font-bold border-b border-primary/20 outline-none"
                      />
                      <input
                        placeholder="Role"
                        value={editedCommittee[m.id]?.role ?? m.role}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], role: e.target.value },
                          }))
                        }
                        className="w-full bg-transparent text-sm border-b border-primary/10 outline-none"
                      />
                      <input
                        placeholder="Detail"
                        value={editedCommittee[m.id]?.detail ?? m.detail}
                        onChange={(e) =>
                          setEditedCommittee((p) => ({
                            ...p,
                            [m.id]: { ...p[m.id], detail: e.target.value },
                          }))
                        }
                        className="w-full bg-transparent text-sm border-b border-primary/5 outline-none"
                      />
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
                className="p-7 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium h-full"
              >
                <Plus className="h-5 w-5" /> Add Member
              </button>
            )}
          </div>
        </div>
      </section>

      {isEditMode && hasChanges && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <button
            onClick={saveAll}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"
          >
            <Save className="h-5 w-5" /> Save All Changes
          </button>
        </div>
      )}
    </>
  );
}
