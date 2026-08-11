import { createFileRoute, useRouter } from "@tanstack/react-router";
import { imageUrl, getAssetUrl } from "@/lib/assets";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { getCampusGallery, addCampusGalleryItem, deleteCampusGalleryItem } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
} from "@/components/AdminEditPanel";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
const campusLifeImg = imageUrl("campus-life/campus-life.jpg");
import labImg from "@/assets/lab.jpg";
import hostelImg from "@/assets/hostel.jpg";
import sportsImg from "@/assets/sports.jpg";
import libraryImg from "@/assets/library-interior.jpg";
import cultureImg from "@/assets/culture.jpeg";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/gallery")({
  loader: async () => await getCampusGallery(),
  head: () => ({
    meta: [
      { title: "Gallery — JNTU-GV CEV" },
      { name: "description", content: "Moments from across the JNTU-GV Vizianagaram campus." },
      { property: "og:title", content: "Gallery — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Pictures from campus, classrooms, labs, sports and culture.",
      },
      { property: "og:image", content: campusImg },
    ],
  }),
  component: GalleryPage,
});

const DEFAULT_IMAGES = [
  { id: -1, src: campusImg, caption: "Campus aerial" },
  { id: -2, src: cultureImg, caption: "Cultural fest" },
  { id: -3, src: labImg, caption: "Engineering lab" },
  { id: -4, src: libraryImg, caption: "Library reading hall" },
  { id: -5, src: campusLifeImg, caption: "Students on campus" },
  { id: -6, src: sportsImg, caption: "Sports ground" },
  { id: -7, src: hostelImg, caption: "Hostel building" },
  { id: -8, src: placementsImg, caption: "Placements event" },
];

// Strips any old absolute VPS host (with or without :8080) down to a
// relative "uploads/..." path before it's ever saved to the DB. Anything
// that's already relative, or a genuinely external URL (e.g. Unsplash),
// passes through untouched.
function normalizeSrcForStorage(src: string): string {
  const trimmed = src.trim();
  const legacyHostPattern = /^https?:\/\/89\.116\.134\.182(:\d+)?\/local-assets\//;
  if (legacyHostPattern.test(trimmed)) {
    return trimmed.replace(legacyHostPattern, "");
  }
  return trimmed;
}

function GalleryPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const images = records.length > 0 ? records : DEFAULT_IMAGES;

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault();
    if (!newImage.src) {
      toast.error("Please provide a valid image URL.");
      return;
    }
    const tId = toast.loading("Adding photo to gallery...");
    try {
      await addCampusGalleryItem({
        src: normalizeSrcForStorage(newImage.src),
        caption: newImage.caption || "Campus Moment",
      });
      toast.success("Photo added successfully!", { id: tId });
      setNewImage({ src: "", caption: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to add photo.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    if (id < 0) {
      toast.error("Default photos cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this photo from the campus gallery?")) return;
    const tId = toast.loading("Deleting photo...");
    try {
      await deleteCampusGalleryItem({ id });
      toast.success("Photo deleted successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete photo.", { id: tId });
    }
  }

  return (
    <>
      {isEditMode && <AdminModeBanner label="Campus Gallery Editor Active" />}

      <PageHero
        eyebrow="Gallery"
        title="A campus, in moments."
        subtitle="A growing visual record of the rhythms, faces and seasons of life at JNTU-GV CEV."
        image={cultureImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      {isEditMode && (
        <section className="container-narrow py-10">
          <AdminPanel>
            <AdminPanelHeader title="Upload / Log New Gallery Photo" />
            <form onSubmit={handleAddImage} className="mt-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <AdminField label="Image Asset URL">
                  <AdminInput
                    placeholder="uploads/photo-gallery/img.jpg or full https:// URL"
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                  />
                </AdminField>
                <AdminField label="Caption / Description">
                  <AdminInput
                    placeholder="e.g. Annual Sports Meet 2026"
                    value={newImage.caption}
                    onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  />
                </AdminField>
              </div>

              {newImage.src && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-sm">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Live Preview</span>
                  <img decoding="async" loading="lazy"
                    src={getAssetUrl(normalizeSrcForStorage(newImage.src))}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500";
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold font-sans"
              >
                <Plus className="h-4 w-4" /> Add Photo to Gallery
              </button>
            </form>
          </AdminPanel>
        </section>
      )}

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {images.map((img, i) => (
              <div
                key={img.id || i}
                className="break-inside-avoid mb-5 overflow-hidden rounded-2xl hover-lift relative group"
              >
                <img decoding="async"
                  src={getAssetUrl(img.src)}
                  alt={img.caption || "Campus Moment"}
                  loading="lazy"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />

                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <p className="text-xs font-semibold tracking-wide uppercase text-primary-glow">Moment</p>
                    <p className="text-sm font-medium mt-1">{img.caption}</p>
                  </div>
                )}

                {isEditMode && img.id > 0 && (
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-4 right-4 p-2.5 bg-rose-600/90 text-white rounded-full hover:bg-rose-700 hover:scale-110 shadow-lg transition-all"
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
