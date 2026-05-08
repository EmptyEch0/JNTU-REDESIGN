import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { RD_SUBNAV } from "@/lib/site";
import { Quote, Plus, Trash2, Save, X, Edit3 } from "lucide-react";
import labImg from "@/assets/lab.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  const { data: mottos = [] } = useQuery({ queryKey: ["rdMottos"], queryFn: () => getMottos() });

  const saveAll = async () => {
    const promises = [];

    Object.entries(editedCommittee).forEach(([id, data]) => {
      promises.push(updateMember({ data: { id: parseInt(id), ...data } }));
    });

    Object.entries(editedMottos).forEach(([id, data]) => {
      promises.push(updateMotto({ data: { id: parseInt(id), ...data } }));
    });

    if (editedCoordinator) {
      promises.push(
        updateCoordinatorMessage({ data: { id: coordinator.id, ...editedCoordinator } }),
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
        return "All research info updated!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddMember = async () => {
    await addMember({ data: { name: "New Member", role: "Role", detail: "Detail" } });
    queryClient.invalidateQueries({ queryKey: ["rdCommittee"] });
  };

  const hasChanges =
    Object.keys(editedCommittee).length > 0 ||
    Object.keys(editedMottos).length > 0 ||
    editedCoordinator !== null;

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
        <div className="grid md:grid-cols-[300px_1fr] gap-10 items-start max-w-5xl mx-auto">
          <RevealOnScroll>
            <div className="relative group md:sticky md:top-32 text-center">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
                style={{ background: "var(--gradient-royal)" }}
              />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-elegant bg-card">
                <img
                  src={editedCoordinator?.image ?? coordinator?.image}
                  alt={coordinator?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-center font-bold text-ink bg-primary/5 p-1 rounded"
                      value={editedCoordinator?.name ?? coordinator?.name ?? ""}
                      onChange={(e) =>
                        setEditedCoordinator({ ...editedCoordinator, name: e.target.value })
                      }
                    />
                    <input
                      className="w-full text-center text-xs text-primary bg-primary/5 p-1 rounded"
                      value={editedCoordinator?.role ?? coordinator?.role ?? ""}
                      onChange={(e) =>
                        setEditedCoordinator({ ...editedCoordinator, role: e.target.value })
                      }
                    />
                    <input
                      className="w-full text-center text-[10px] text-muted-foreground bg-primary/5 p-1 rounded"
                      placeholder="Image URL"
                      value={editedCoordinator?.image ?? coordinator?.image ?? ""}
                      onChange={(e) =>
                        setEditedCoordinator({ ...editedCoordinator, image: e.target.value })
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
          <RevealOnScroll delay={120}>
            <div className="relative p-8 md:p-10 rounded-3xl bg-card border border-border shadow-elegant h-full">
              <Quote className="h-8 w-8 text-primary/40 absolute -top-4 -left-4 bg-background rounded-full p-1.5 border border-border" />
              {isEditMode ? (
                <textarea
                  className="w-full text-2xl md:text-3xl text-ink leading-snug bg-primary/5 p-2 rounded outline-none h-32"
                  value={editedCoordinator?.quote ?? coordinator?.quote ?? ""}
                  onChange={(e) =>
                    setEditedCoordinator({ ...editedCoordinator, quote: e.target.value })
                  }
                />
              ) : (
                <p className="text-display text-2xl md:text-3xl text-ink leading-snug">
                  "{coordinator?.quote}"
                </p>
              )}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-eyebrow">Coordinator's message</div>
                {isEditMode ? (
                  <textarea
                    className="mt-3 w-full text-muted-foreground leading-relaxed bg-primary/5 p-2 rounded outline-none h-48"
                    value={editedCoordinator?.message ?? coordinator?.message ?? ""}
                    onChange={(e) =>
                      setEditedCoordinator({ ...editedCoordinator, message: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {coordinator?.message}
                  </p>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

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
                        className="w-full bg-primary/5 p-1 rounded outline-none text-muted-foreground text-sm"
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
              className="p-7 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium h-full min-h-[200px]"
            >
              <Plus className="h-5 w-5" /> Add Member
            </button>
          )}
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
