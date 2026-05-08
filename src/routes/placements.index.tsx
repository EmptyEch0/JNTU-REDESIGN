import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { RECRUITERS, PLACEMENTS_SUBNAV } from "@/lib/site";
import { SubNav } from "@/components/SubNav";
import placementsImg from "@/assets/placements-bg.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTPO, updateTPO, getGoals, getPlacementYears } from "../lib/placements";
import { useAdmin } from "@/context/AdminContext";
import { Mail, Quote, Target, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/placements/")({
  head: () => ({
    meta: [
      { title: "Placements — JNTU-GV CEV" },
      { name: "description", content: "Top recruiters, placement statistics and training at JNTU-GV CEV." },
    ],
  }),
  component: PlacementsPage,
});

function PlacementsPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedTPO, setEditedTPO] = useState<any>(null);

  const { data: tpoData } = useQuery({ queryKey: ['tpo'], queryFn: () => getTPO() });
  const { data: goals } = useQuery({ queryKey: ['goals'], queryFn: () => getGoals() });
  const { data: years } = useQuery({ queryKey: ['placementYears'], queryFn: () => getPlacementYears() });

  const latestStats = years?.[0] || { offers: 420, top: "42 LPA", recruiters: 85 };

  const saveTPO = async () => {
    if (!editedTPO) return;
    toast.promise(updateTPO({ data: { id: tpoData?.id, ...editedTPO } }), {
      loading: 'Saving...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['tpo'] });
        setEditedTPO(null);
        return 'Saved successfully!';
      },
      error: 'Failed to save.'
    });
  };

  return (
    <>
      <PageHero
        eyebrow="Placements & Training"
        title="From classroom to career — together."
        subtitle="A dedicated training and placement cell that prepares students and partners with recruiters across India." 
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          <div className="bg-card p-8"><StatCounter value={latestStats.offers} label="Offers / Year" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={parseInt(latestStats.top as string) || 42} label="LPA Top Package" suffix="L" /></div>
          <div className="bg-card p-8"><StatCounter value={latestStats.recruiters} label="Recruiters" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Placement %" suffix="%" /></div>
        </div>
      </section>

      {/* TPO Highlight Section */}
      <section className="py-20 bg-white">
        <div className="container-narrow grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <div className={`p-8 rounded-3xl border transition-all relative ${isEditMode ? "bg-amber-50/50 border-amber-200 shadow-sm" : "bg-card border-border shadow-md"}`}>
                <div className="flex flex-col items-center text-center">
                  <img src={editedTPO?.image ?? tpoData?.image} alt={tpoData?.name} className="w-40 h-40 rounded-2xl object-cover shadow-lg mb-6" />
                  <div className="space-y-2 w-full">
                    {isEditMode ? (
                      <input 
                        className="text-xl font-bold text-ink bg-white border border-amber-200 rounded px-2 py-1 w-full text-center" 
                        value={editedTPO?.name ?? tpoData?.name ?? ""} 
                        onChange={e => setEditedTPO({...editedTPO, name: e.target.value})}
                      />
                    ) : <h3 className="text-xl font-bold text-ink">{tpoData?.name}</h3>}
                    
                    <p className="text-primary font-medium text-sm">{tpoData?.designation}</p>
                    
                    <div className="flex items-center justify-center gap-2 text-muted-foreground pt-4">
                      <Mail size={14} />
                      <span className="text-xs">{tpoData?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
          
          <div className="lg:col-span-7">
            <RevealOnScroll delay={100}>
              <div className="relative">
                <Quote className="absolute -top-10 -left-6 text-primary/10 w-20 h-20 -z-10" />
                <SectionLabel eyebrow="Officer's Message" title="Placing the Future" />
                <div className={`mt-6 text-lg text-ink leading-relaxed font-serif italic p-4 rounded-xl transition-all ${isEditMode ? "bg-amber-50/50 border border-amber-200" : ""}`}>
                  {isEditMode ? (
                    <textarea 
                      className="w-full h-32 p-3 rounded-lg border border-amber-200 bg-white focus:outline-none"
                      value={editedTPO?.message ?? tpoData?.message ?? ""}
                      onChange={e => setEditedTPO({...editedTPO, message: e.target.value})}
                    />
                  ) : <p>"{tpoData?.message}"</p>}
                </div>
                {isEditMode && editedTPO && (
                  <button onClick={saveTPO} className="mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">
                    <Save size={16} /> Save Message
                  </button>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Vision & Goals" title="Aim and Objectives of TPO" align="center" /></RevealOnScroll>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {goals?.slice(0, 4).map((goal, idx) => (
              <RevealOnScroll key={goal.id} delay={idx * 50}>
                <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm h-full">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Target size={20} />
                  </div>
                  <p className="text-sm text-ink leading-relaxed">{goal.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Recruiters" title="A roster that keeps growing." align="center" /></RevealOnScroll>
          <div className="mt-12">
            <MarqueeLogos items={RECRUITERS} />
          </div>
        </div>
      </section>
    </>
  );
}
