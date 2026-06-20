import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { PLACEMENTS_SUBNAV } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../lib/placements";
import { Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";

import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/placements/gallery")({
  head: () => ({
    meta: [
      { title: "Placements Gallery — JNTU-GV CEV" },
      {
        name: "description",
        content: "Moments from placement drives, talks and offer day at JNTU-GV CEV.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedItems, setEditedItems] = useState<Record<number, any>>({});

  const { data: items = [] } = useQuery({
    queryKey: ["placementGallery"],
    queryFn: () => getGallery(),
  });

  const saveAll = async () => {
    const promises = Object.entries(editedItems).map(([id, data]) =>
      updateGalleryItem({ data: { id: parseInt(id), ...data } }),
    );

    if (promises.length === 0) return;

    toast.promise(Promise.all(promises), {
      loading: "Saving gallery...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["placementGallery"] });
        setEditedItems({});
        return "Gallery updated!";
      },
      error: "Failed to save changes.",
    });
  };

  const handleAddItem = async () => {
    await addGalleryItem({
      data: { src: "", caption: "New Gallery Image" },
    });
    queryClient.invalidateQueries({ queryKey: ["placementGallery"] });
  };

  const hasChanges = Object.keys(editedItems).length > 0;

  return (
    <>
      <PageHero
        eyebrow="Placements"
        title="Gallery"
        subtitle="Drives, talks and the moment our students get the call."
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-display text-3xl text-ink">Campus Placement Moments</h2>
          {isEditMode && (
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20"
            >
              <Plus size={16} /> Add Image
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it: any, i: number) => (
            <RevealOnScroll key={it.id} delay={i * 60}>
              <div
                className={`group relative overflow-hidden rounded-2xl border transition-all h-full ${isEditMode ? "bg-amber-50/30 border-amber-200" : "bg-card border-border hover-lift"}`}
              >
                <figure className="relative h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-sand-deep/20">
                    <img
                      src={getAssetUrl(editedItems[it.id]?.src ?? it.src)}
                      alt={it.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {isEditMode ? (
                    <div className="p-4 space-y-3">
                      <AdminUpload
                        value={editedItems[it.id]?.src ?? it.src}
                        onChange={(newUrl) =>
                          setEditedItems((p) => ({
                            ...p,
                            [it.id]: { ...p[it.id], src: newUrl },
                          }))
                        }
                        module="placements"
                        category="gallery"
                      />
                      <textarea
                        className="w-full text-xs bg-white p-2 rounded border border-amber-100 outline-none"
                        value={editedItems[it.id]?.caption ?? it.caption}
                        onChange={(e) =>
                          setEditedItems((p) => ({
                            ...p,
                            [it.id]: { ...p[it.id], caption: e.target.value },
                          }))
                        }
                        rows={2}
                      />
                      <button
                        onClick={async () => {
                          if (confirm("Delete this image?")) {
                            await deleteGalleryItem({ data: { id: it.id } });
                            queryClient.invalidateQueries({ queryKey: ["placementGallery"] });
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-sm font-medium pt-10">
                      {it.caption}
                    </figcaption>
                  )}
                </figure>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {isEditMode && hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_2s_infinite]">
          <button
            onClick={saveAll}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-semibold border-2 border-white/20 backdrop-blur-sm"
          >
            <Save className="h-5 w-5" /> Save Gallery Changes
          </button>
        </div>
      )}
    </>
  );
}
