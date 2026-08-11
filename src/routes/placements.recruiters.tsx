import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { LogoCarousel } from "@/components/LogoCarousel";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";
import { getAssetUrl } from "@/lib/assets";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getRecruiters, addRecruiter, updateRecruiter, deleteRecruiter } from "@/funcs/recruiters";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/placements/recruiters")({
  head: () => ({
    meta: [
      { title: "Our Recruiters — Placements — JNTU-GV CEV" },
      { name: "description", content: "Companies that recruit from JNTU-GV CEV." },
    ],
  }),
  component: RecruitersPage,
});

function RecruitersPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedRecruiters, setEditedRecruiters] = useState<Record<number, any>>({});

  const { data: recruiters = [], isLoading } = useQuery({
    queryKey: ["recruiters"],
    queryFn: () => getRecruiters(),
  });

  const handleRecruiterChange = (id: number, field: string, value: string) => {
    setEditedRecruiters((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveAllChanges = async () => {
    if (Object.keys(editedRecruiters).length === 0) return;

    const promise = Promise.all(
      Object.entries(editedRecruiters).map(([id, data]) =>
        updateRecruiter({ data: { id: parseInt(id), ...data } }),
      ),
    );

    toast.promise(promise, {
      loading: "Saving recruiter updates...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["recruiters"] });
        setEditedRecruiters({});
        return "All recruiters updated!";
      },
      error: "Failed to save updates.",
    });
  };

  const handleAddRecruiter = async () => {
    const name = prompt("Enter company name:");
    if (name) {
      await addRecruiter({ data: { name, url: "" } });
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success("Recruiter added. Upload their logo below.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this recruiter?")) {
      await deleteRecruiter({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success("Recruiter removed");
    }
  };

  const half = Math.ceil(recruiters.length / 2);
  const row1 = recruiters.slice(0, half);
  const row2 = recruiters.slice(half);

  return (
    <>
      <PageHero
        eyebrow="Placements"
        title="Our Recruiters"
        subtitle="We are proud to be associated with some of the most prestigious names in the industry."
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 bg-white overflow-hidden">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Partnerships" title="Leading recruiters" align="center" />
          </RevealOnScroll>
        </div>
        <div className="mt-10 space-y-2">
          <LogoCarousel logos={row1} speed={70} />
          <LogoCarousel logos={row2} speed={80} reverse />
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex justify-between items-end mb-8">
              <SectionLabel eyebrow="Directory" title={`All ${recruiters.length} recruiters`} />
              {isEditMode && (
                <button
                  onClick={handleAddRecruiter}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                  <Plus size={16} /> Add Recruiter
                </button>
              )}
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-muted-foreground italic">
                Loading recruiter directory...
              </div>
            ) : (
              recruiters.map((logo, i) => (
                <RevealOnScroll key={logo.id} delay={(i % 12) * 30}>
                  <div
                    title={logo.name}
                    className={`aspect-[4/3] rounded-xl border flex flex-col items-center justify-center p-3 transition-all relative group ${
                      isEditMode
                        ? "bg-amber-50/50 border-amber-200 shadow-sm"
                        : "bg-card border-border hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] hover-lift"
                    }`}
                  >
                    {isEditMode ? (
                      <div className="w-full space-y-2">
                        <input
                          className="w-full text-[10px] p-1 border border-amber-100 rounded bg-white text-center font-bold"
                          value={editedRecruiters[logo.id]?.name ?? logo.name}
                          onChange={(e) => handleRecruiterChange(logo.id, "name", e.target.value)}
                        />
                        <AdminUpload
                          value={editedRecruiters[logo.id]?.url ?? logo.url}
                          onChange={(newUrl) => handleRecruiterChange(logo.id, "url", newUrl)}
                          module="placements"
                          category="recruiters"
                          className="text-[10px]"
                        />
                        <button
                          onClick={() => handleDelete(logo.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ) : (
                      <img decoding="async"
                        src={getAssetUrl(logo.url)}
                        alt={logo.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-all duration-200"
                      />
                    )}
                  </div>
                </RevealOnScroll>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Floating Save Button */}
      {isAdmin && isEditMode && Object.keys(editedRecruiters).length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_2s_infinite]">
          <button
            onClick={saveAllChanges}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 border-2 border-white/20 backdrop-blur-sm"
          >
            <Save size={20} />
            Save Directory Updates
          </button>
        </div>
      )}
    </>
  );
}
