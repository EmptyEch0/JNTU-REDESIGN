import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlacementYears, getPlacementHighlights, addPlacementYear, addPlacementHighlight } from "../lib/placements";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/admin/placements")({
  component: AdminPlacementsPage,
});

function AdminPlacementsPage() {
  const queryClient = useQueryClient();
  const [yearForm, setYearForm] = useState({ year: "", offers: 0, top: "", recruiters: 0 });
  const [highlightForm, setHighlightForm] = useState({ name: "", branch: "", company: "", package: "" });

  const { data: years } = useQuery({ queryKey: ['placementYears'], queryFn: () => getPlacementYears() });
  const { data: highlights } = useQuery({ queryKey: ['placementHighlights'], queryFn: () => getPlacementHighlights() });

  const addYearMutation = useMutation({
    mutationFn: (data: any) => addPlacementYear({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementYears'] });
      setYearForm({ year: "", offers: 0, top: "", recruiters: 0 });
    }
  });

  const addHighlightMutation = useMutation({
    mutationFn: (data: any) => addPlacementHighlight({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementHighlights'] });
      setHighlightForm({ name: "", branch: "", company: "", package: "" });
    }
  });

  return (
    <div className="min-h-screen bg-sand/30 pb-20">
      <PageHero eyebrow="Dashboard" title="Placement Admin" subtitle="Manage placement statistics and student highlights." />

      <div className="container-narrow mt-10 space-y-12">
        {/* Years Section */}
        <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-6">Yearly Statistics</h2>
          <form 
            onSubmit={(e) => { e.preventDefault(); addYearMutation.mutate(yearForm); }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Year (e.g. 2024-25)" 
              value={yearForm.year} 
              onChange={e => setYearForm({...yearForm, year: e.target.value})}
              required
            />
            <input 
              type="number" 
              className="p-3 rounded-lg border border-border" 
              placeholder="Offers" 
              value={yearForm.offers || ""} 
              onChange={e => setYearForm({...yearForm, offers: parseInt(e.target.value)})}
              required
            />
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Top Package (e.g. 45 LPA)" 
              value={yearForm.top} 
              onChange={e => setYearForm({...yearForm, top: e.target.value})}
              required
            />
            <input 
              type="number" 
              className="p-3 rounded-lg border border-border" 
              placeholder="Recruiters" 
              value={yearForm.recruiters || ""} 
              onChange={e => setYearForm({...yearForm, recruiters: parseInt(e.target.value)})}
              required
            />
            <button 
              type="submit" 
              className="md:col-span-4 bg-primary text-white p-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              disabled={addYearMutation.isPending}
            >
              {addYearMutation.isPending ? "Adding..." : "Add Year Stat"}
            </button>
          </form>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-sand-deep/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Offers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Top</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Recruiters</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {years?.map(y => (
                  <tr key={y.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{y.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{y.offers}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{y.top}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{y.recruiters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-6">Student Highlights</h2>
          <form 
            onSubmit={(e) => { e.preventDefault(); addHighlightMutation.mutate(highlightForm); }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Student Name" 
              value={highlightForm.name} 
              onChange={e => setHighlightForm({...highlightForm, name: e.target.value})}
              required
            />
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Branch" 
              value={highlightForm.branch} 
              onChange={e => setHighlightForm({...highlightForm, branch: e.target.value})}
              required
            />
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Company" 
              value={highlightForm.company} 
              onChange={e => setHighlightForm({...highlightForm, company: e.target.value})}
              required
            />
            <input 
              className="p-3 rounded-lg border border-border" 
              placeholder="Package" 
              value={highlightForm.package} 
              onChange={e => setHighlightForm({...highlightForm, package: e.target.value})}
              required
            />
            <button 
              type="submit" 
              className="md:col-span-4 bg-primary text-white p-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              disabled={addHighlightMutation.isPending}
            >
              {addHighlightMutation.isPending ? "Adding..." : "Add Highlight"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights?.map(h => (
              <div key={h.id} className="p-4 rounded-xl border border-border bg-sand/10">
                <div className="font-bold text-ink">{h.name}</div>
                <div className="text-sm text-muted-foreground">{h.branch} • {h.company}</div>
                <div className="text-primary font-bold mt-1">{h.package}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
