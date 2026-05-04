import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  getPlacementYears, 
  getPlacementHighlights, 
  updatePlacementYear, 
  deletePlacementYear, 
  updatePlacementHighlight, 
  deletePlacementHighlight 
} from "../lib/placements";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export const Route = createFileRoute("/placements/students")({
  head: () => ({
    meta: [
      { title: "Students Placed — Placements — JNTU-GV CEV" },
      { name: "description", content: "Year-wise placement statistics and select offers." },
    ],
  }),
  component: StudentsPlacedPage,
});

function StudentsPlacedPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  
  // Local state for tracking changes before saving
  const [editedYears, setEditedYears] = useState<Record<number, any>>({});
  const [editedHighlights, setEditedHighlights] = useState<Record<number, any>>({});

  const { data: years, isLoading: isLoadingYears, isError: isErrorYears } = useQuery({
    queryKey: ['placementYears'],
    queryFn: () => getPlacementYears(),
  });

  const { data: highlights, isLoading: isLoadingHighlights, isError: isErrorHighlights } = useQuery({
    queryKey: ['placementHighlights'],
    queryFn: () => getPlacementHighlights(),
  });

  const deleteYearMutation = useMutation({
    mutationFn: (id: number) => deletePlacementYear({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementYears'] });
      toast.success("Statistic deleted");
    }
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: (id: number) => deletePlacementHighlight({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementHighlights'] });
      toast.success("Highlight deleted");
    }
  });

  const handleYearChange = (id: number, field: string, value: any) => {
    setEditedYears(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleHighlightChange = (id: number, field: string, value: any) => {
    setEditedHighlights(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const saveAllChanges = async () => {
    const totalChanges = Object.keys(editedYears).length + Object.keys(editedHighlights).length;
    if (totalChanges === 0) return;

    const promise = Promise.all([
      ...Object.entries(editedYears).map(([id, data]) => 
        updatePlacementYear({ data: { id: parseInt(id), ...data } })
      ),
      ...Object.entries(editedHighlights).map(([id, data]) => 
        updatePlacementHighlight({ data: { id: parseInt(id), ...data } })
      )
    ]);

    toast.promise(promise, {
      loading: 'Saving all changes...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['placementYears'] });
        queryClient.invalidateQueries({ queryKey: ['placementHighlights'] });
        setEditedYears({});
        setEditedHighlights({});
        return 'All changes saved successfully!';
      },
      error: 'Failed to save changes.'
    });
  };

  const hasUnsavedChanges = Object.keys(editedYears).length > 0 || Object.keys(editedHighlights).length > 0;

  // Warning before leaving with unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  return (
    <>
      <PageHero eyebrow="Placements" title="Students Placed" subtitle="Year-on-year growth in offers, recruiters and packages." image={placementsImg} />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)]">
          <div className="bg-card p-8"><StatCounter value={1502} label="Total offers (4 yrs)" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={42} label="LPA Top Package" suffix="L" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Recruiters in 2023-24" suffix="+" /></div>
          <div className="bg-card p-8"><StatCounter value={92} label="Placement %" suffix="%" /></div>
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll><SectionLabel eyebrow="Year on year" title="Placement trend" /></RevealOnScroll>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="min-w-full text-left">
              <thead className="bg-sand-deep/40 text-eyebrow">
                <tr>
                  <th className="px-6 py-4">Academic Year</th>
                  <th className="px-6 py-4">Offers</th>
                  <th className="px-6 py-4">Top Package</th>
                  <th className="px-6 py-4">Recruiters</th>
                  {isAdmin && isEditMode && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingYears ? (
                  <tr>
                    <td colSpan={isAdmin && isEditMode ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground italic">Loading placement trends...</td>
                  </tr>
                ) : isErrorYears ? (
                  <tr>
                    <td colSpan={isAdmin && isEditMode ? 5 : 4} className="px-6 py-12 text-center text-red-500 italic">Error loading placement data.</td>
                  </tr>
                ) : years?.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin && isEditMode ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground italic">No placement data available yet.</td>
                  </tr>
                ) : (
                  years?.map((y) => (
                    <tr 
                      key={y.id} 
                      className={`transition-colors ${isEditMode ? "bg-amber-50/50 hover:bg-amber-100/50" : "hover:bg-sand/60"}`}
                    >
                      <td className="px-6 py-4 font-semibold text-ink">
                        {isEditMode ? (
                          <input 
                            value={editedYears[y.id]?.year ?? y.year} 
                            onChange={(e) => handleYearChange(y.id, "year", e.target.value)}
                            className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm"
                          />
                        ) : y.year}
                      </td>
                      <td className="px-6 py-4 text-ink">
                        {isEditMode ? (
                          <input 
                            type="number"
                            value={editedYears[y.id]?.offers ?? y.offers} 
                            onChange={(e) => handleYearChange(y.id, "offers", parseInt(e.target.value))}
                            className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm"
                          />
                        ) : y.offers}
                      </td>
                      <td className="px-6 py-4 text-primary font-semibold">
                        {isEditMode ? (
                          <input 
                            value={editedYears[y.id]?.top ?? y.top} 
                            onChange={(e) => handleYearChange(y.id, "top", e.target.value)}
                            className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm"
                          />
                        ) : y.top}
                      </td>
                      <td className="px-6 py-4 text-ink">
                        {isEditMode ? (
                          <input 
                            type="number"
                            value={editedYears[y.id]?.recruiters ?? y.recruiters} 
                            onChange={(e) => handleYearChange(y.id, "recruiters", parseInt(e.target.value))}
                            className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm"
                          />
                        ) : y.recruiters}
                      </td>
                      {isAdmin && isEditMode && (
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => { if(confirm("Delete this stat?")) deleteYearMutation.mutate(y.id); }}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Row"
                          >
                            🗑️
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 container-narrow mb-20">
        <RevealOnScroll><SectionLabel eyebrow="Highlights" title="Notable offers" align="center" /></RevealOnScroll>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoadingHighlights ? (
            <div className="col-span-full py-20 text-center text-muted-foreground italic">Loading student highlights...</div>
          ) : isErrorHighlights ? (
            <div className="col-span-full py-20 text-center text-red-500 italic">Error loading highlights.</div>
          ) : highlights?.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground italic">No highlights recorded yet.</div>
          ) : (
            highlights?.map((h, i) => (
              <RevealOnScroll key={h.id} delay={i * 60}>
                <div className={`p-6 rounded-2xl border transition-all h-full relative group ${
                  isEditMode 
                  ? "bg-amber-50/50 border-amber-200 shadow-sm" 
                  : "bg-card border-border hover-lift"
                }`}>
                  {isAdmin && isEditMode && (
                    <button 
                      onClick={() => { if(confirm("Delete this highlight?")) deleteHighlightMutation.mutate(h.id); }}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1 z-10"
                      title="Delete Highlight"
                    >
                      🗑️
                    </button>
                  )}
                  <div className="text-eyebrow">
                    {isEditMode ? (
                      <input 
                        value={editedHighlights[h.id]?.branch ?? h.branch} 
                        onChange={(e) => handleHighlightChange(h.id, "branch", e.target.value)}
                        className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm text-xs"
                      />
                    ) : h.branch}
                  </div>
                  <h3 className="text-display text-xl text-ink mt-2">
                    {isEditMode ? (
                      <input 
                        value={editedHighlights[h.id]?.name ?? h.name} 
                        onChange={(e) => handleHighlightChange(h.id, "name", e.target.value)}
                        className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm"
                      />
                    ) : h.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-muted-foreground flex-1">
                      {isEditMode ? (
                        <input 
                          value={editedHighlights[h.id]?.company ?? h.company} 
                          onChange={(e) => handleHighlightChange(h.id, "company", e.target.value)}
                          className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full shadow-sm text-sm"
                        />
                      ) : h.company}
                    </span>
                    <span className="text-primary font-semibold whitespace-nowrap">
                      {isEditMode ? (
                        <input 
                          value={editedHighlights[h.id]?.package ?? h.package} 
                          onChange={(e) => handleHighlightChange(h.id, "package", e.target.value)}
                          className="bg-white border border-amber-200 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-24 text-right shadow-sm text-sm"
                        />
                      ) : h.package}
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            ))
          )}
        </div>
      </section>

      {/* Floating Save Button */}
      {isAdmin && isEditMode && hasUnsavedChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_2s_infinite]">
          <button 
            onClick={saveAllChanges}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(var(--primary-rgb),0.4)] hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 border-2 border-white/20 backdrop-blur-sm"
          >
            <span className="text-xl">💾</span>
            Save All Changes
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-1">
              {Object.keys(editedYears).length + Object.keys(editedHighlights).length}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
