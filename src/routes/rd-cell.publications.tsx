import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { RD_SUBNAV } from "@/lib/site";
import { BookOpen, Plus, Trash2, Save, Edit3 } from "lucide-react";
import labImg from "@/assets/lab.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getPublications,
  addPublication,
  updatePublication,
  deletePublication,
  getPublicationStats,
  updatePublicationStat,
} from "@/funcs/rd";

export const Route = createFileRoute("/rd-cell/publications")({
  head: () => ({
    meta: [
      { title: "Research Publications — R&D Cell — JNTU-GV CEV" },
      { name: "description", content: "Selected publications by faculty across departments." },
    ],
  }),
  component: PublicationsPage,
});

function PublicationsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedPubs, setEditedPubs] = useState<Record<number, any>>({});
  const [editedStats, setEditedStats] = useState<Record<number, any>>({});

  const { data: publications = [] } = useQuery({
    queryKey: ["rdPublications"],
    queryFn: () => getPublications(),
  });
  const { data: stats = [] } = useQuery({
    queryKey: ["rdPublicationStats"],
    queryFn: () => getPublicationStats(),
  });

  const saveAll = async () => {
    const promises = [];

    Object.entries(editedPubs).forEach(([id, data]) => {
      promises.push(updatePublication({ data: { id: parseInt(id), ...data } }));
    });

    Object.entries(editedStats).forEach(([id, data]) => {
      promises.push(updatePublicationStat({ data: { id: parseInt(id), ...data } }));
    });

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving updates...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["rdPublications"] });
        queryClient.invalidateQueries({ queryKey: ["rdPublicationStats"] });
        setEditedPubs({});
        setEditedStats({});
        return "Publications updated!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddPub = async () => {
    await addPublication({
      data: { dept: "DEPT", title: "New Publication", authors: "Authors", venue: "Venue" },
    });
    queryClient.invalidateQueries({ queryKey: ["rdPublications"] });
  };

  const hasChanges = Object.keys(editedPubs).length > 0 || Object.keys(editedStats).length > 0;

  return (
    <>
      <PageHero
        eyebrow="R&D Cell"
        title="Research Publications"
        subtitle="Peer-reviewed journals, international conferences and patents."
        image={labImg}
      />
      
      <div className="container-narrow py-8 text-center border-b border-border">
        <img decoding="async" loading="lazy" 
          src="http://89.116.134.182:8080/local-assets/uploads/2020/08/image.png" 
          alt="Publications Chart" 
          className="mx-auto rounded-xl shadow-lg border border-border w-full max-w-4xl" 
        />
      </div>

      <SubNav items={RD_SUBNAV} />

      <section className="py-16 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          {stats.map((s: any) => (
            <div key={s.id} className="bg-card p-8 flex flex-col items-center">
              {isEditMode ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-eyebrow mb-1">{s.label}</div>
                  <input
                    type="number"
                    className="text-display text-2xl w-24 text-center bg-primary/5 rounded border border-primary/20"
                    value={editedStats[s.id]?.value ?? s.value}
                    onChange={(e) =>
                      setEditedStats((p) => ({ ...p, [s.id]: { value: parseInt(e.target.value) } }))
                    }
                  />
                </div>
              ) : (
                <StatCounter value={s.value} label={s.label} suffix={s.suffix} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 container-narrow">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-display text-3xl text-ink">Selected Publications</h2>
          {isEditMode && (
            <button
              onClick={handleAddPub}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              <Plus size={16} /> Add Publication
            </button>
          )}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {publications.map((p: any, i: number) => (
            <RevealOnScroll key={p.id} delay={i * 60}>
              <div
                className={`p-6 rounded-2xl bg-card border transition-all h-full relative group ${isEditMode ? "border-primary/30" : "border-border hover-lift"}`}
              >
                {isEditMode && (
                  <button
                    onClick={async () => {
                      if (confirm("Delete publication?")) {
                        await deletePublication({ data: { id: p.id } });
                        queryClient.invalidateQueries({ queryKey: ["rdPublications"] });
                      }
                    }}
                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditMode ? (
                      <>
                        <input
                          className="text-eyebrow w-full bg-primary/5 p-1 rounded"
                          value={editedPubs[p.id]?.dept ?? p.dept}
                          onChange={(e) =>
                            setEditedPubs((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], dept: e.target.value },
                            }))
                          }
                        />
                        <textarea
                          className="font-semibold text-ink mt-1 leading-snug w-full bg-primary/5 p-1 rounded"
                          value={editedPubs[p.id]?.title ?? p.title}
                          onChange={(e) =>
                            setEditedPubs((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], title: e.target.value },
                            }))
                          }
                          rows={2}
                        />
                        <input
                          className="text-sm text-muted-foreground w-full bg-primary/5 p-1 rounded"
                          value={editedPubs[p.id]?.authors ?? p.authors}
                          onChange={(e) =>
                            setEditedPubs((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], authors: e.target.value },
                            }))
                          }
                        />
                        <input
                          className="text-sm text-primary w-full bg-primary/5 p-1 rounded"
                          value={editedPubs[p.id]?.venue ?? p.venue}
                          onChange={(e) =>
                            setEditedPubs((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], venue: e.target.value },
                            }))
                          }
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-eyebrow">{p.dept}</div>
                        <h3 className="font-semibold text-ink mt-1 leading-snug">{p.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{p.authors}</p>
                        <p className="mt-1 text-sm text-primary">{p.venue}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {isEditMode && hasChanges && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
          <button
            onClick={saveAll}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold"
          >
            <Save className="h-5 w-5" /> Save Publication Updates
          </button>
        </div>
      )}
    </>
  );
}
