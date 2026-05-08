import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import heroImg from "@/assets/hero-3.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIipcData, updateIipcData } from "@/funcs/studentCorner";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import { Save, X, Briefcase, Zap, Compass, BarChart } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/iipc")({
  head: () => ({
    meta: [
      { title: "Industry Institution Interaction Cell (IIPC) — JNTU-GV CEV" },
      {
        name: "description",
        content: "Bridging the gap between engineering classrooms and corporate industries.",
      },
    ],
  }),
  component: IipcPage,
});

function IipcPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: iipc, isLoading } = useQuery({
    queryKey: ["iipc-data"],
    queryFn: () => getIipcData(),
  });

  const updateMutation = useMutation({
    mutationFn: updateIipcData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iipc-data"] });
      setEditedData(null);
      toast.success("IIPC content updated successfully!");
    },
    onError: () => toast.error("Failed to update IIPC content."),
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: editedData });
  };

  if (isLoading || !iipc) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const data = editedData || iipc;
  const objectives = (data.objectives as string[]) || [];
  const activities = (data.activities as any[]) || [];

  const icons = [Briefcase, Zap, Compass, BarChart];

  return (
    <>
      <PageHero
        eyebrow="Student Corner — Initiatives"
        title="Industry Institution Interaction Cell"
        subtitle="Forging dynamic alliances with corporate leaders, arranging top-tier internships, and organizing real-world industrial visits."
        image={heroImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-16 container-narrow space-y-16">
        {/* About IIPC */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel eyebrow="Industry Linkages" title="About IIPC" />
            {isEditMode ? (
              <textarea
                className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[160px] focus:border-primary"
                value={data.about}
                onChange={(e) => setEditedData({ ...data, about: e.target.value })}
              />
            ) : (
              <p className="text-base text-muted-foreground leading-relaxed">{data.about}</p>
            )}
          </div>
        </RevealOnScroll>

        {/* Objectives & Statistics */}
        <div className="grid md:grid-cols-[1fr_400px] gap-16 items-start">
          <RevealOnScroll>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-ink">Objectives</h3>
              <ul className="grid gap-4">
                {objectives.map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3.5 items-start text-sm text-muted-foreground font-medium leading-relaxed"
                  >
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {isEditMode ? (
                      <input
                        className="w-full bg-primary/5 p-1 text-xs rounded outline-none border border-border"
                        value={obj}
                        onChange={(e) => {
                          const updated = [...objectives];
                          updated[idx] = e.target.value;
                          setEditedData({ ...data, objectives: updated });
                        }}
                      />
                    ) : (
                      <span>{obj}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* Quick Stats Block */}
          <RevealOnScroll delay={100}>
            <div className="p-6 bg-sand border border-border rounded-3xl space-y-6">
              <h4 className="font-bold text-ink text-sm uppercase tracking-wider">
                Industrial Ties
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                  <span className="block text-3xl font-extrabold text-primary font-display">
                    25+
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mt-1">
                    Active MoUs
                  </span>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                  <span className="block text-3xl font-extrabold text-primary font-display">
                    150+
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mt-1">
                    Internships
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Industrial Activities */}
        <div className="space-y-10 pt-8 border-t border-border">
          <RevealOnScroll>
            <SectionLabel eyebrow="Collaborative Actions" title="IIPC Key Activities" />
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activities.map((act, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <RevealOnScroll key={idx} delay={idx * 50}>
                  <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover-lift flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary grid place-items-center">
                        <Icon className="h-5 w-5 text-primary/70" />
                      </div>
                      {isEditMode ? (
                        <div className="space-y-2 pt-2">
                          <input
                            className="w-full bg-primary/5 border border-primary/20 rounded p-1.5 text-xs font-bold outline-none text-ink"
                            value={act.title}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[idx] = { ...act, title: e.target.value };
                              setEditedData({ ...data, activities: updated });
                            }}
                          />
                          <textarea
                            className="w-full bg-primary/5 border border-primary/20 rounded p-1.5 text-xs outline-none text-muted-foreground min-h-[60px]"
                            value={act.details}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[idx] = { ...act, details: e.target.value };
                              setEditedData({ ...data, activities: updated });
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-ink text-sm leading-tight">{act.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed font-sans">
                            {act.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Persistent admin controls */}
      {isEditMode && editedData && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedData(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium text-xs"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> Save Content
            </button>
          </div>
        </div>
      )}
    </>
  );
}
