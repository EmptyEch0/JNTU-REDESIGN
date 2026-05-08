import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { NSS_SUBNAV } from "@/lib/site";
import cultureImg from "@/assets/culture.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNssGallery, addNssGalleryImage, deleteNssGalleryImage } from "@/funcs/nss";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const Route = createFileRoute("/nss")({
  head: () => ({
    meta: [
      { title: "NSS — JNTU-GV CEV" },
      {
        name: "description",
        content: "National Service Scheme at JNTU-GV CEV — service, leadership and community.",
      },
      { property: "og:title", content: "NSS at JNTU-GV CEV" },
      { property: "og:description", content: "Volunteer-led service projects across the year." },
    ],
  }),
  component: NSSLayout,
});

function NSSLayout() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["nss-gallery"],
    queryFn: () => getNssGallery(),
  });

  const addMutation = useMutation({
    mutationFn: addNssGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-gallery"] });
      toast.success("Slide image added successfully!");
      setNewSlideTitle("");
      setNewSlideUrl("");
      setShowAddModal(false);
    },
    onError: () => toast.error("Failed to add slide image."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNssGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-gallery"] });
      toast.success("Slide image deleted successfully!");
      if (currentIndex >= slides.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    onError: () => toast.error("Failed to delete slide image."),
  });

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || slides.length === 0 || showAddModal) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, showAddModal]);

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle.trim() || !newSlideUrl.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    addMutation.mutate({ data: { title: newSlideTitle, imageUrl: newSlideUrl } });
  };

  const handleDeleteSlide = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteMutation.mutate({ data: id });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="NSS"
        title="Not me, but you."
        subtitle="The National Service Scheme on campus is a quiet, consistent commitment to community — led entirely by students."
        image={cultureImg}
      />
      <SubNav items={NSS_SUBNAV} />

      {/* Shared Sliding Carousel */}
      <section className="pt-12 pb-6 container-narrow">
        <RevealOnScroll>
          <div
            className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-border shadow-elegant bg-card group/carousel"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {isLoading ? (
              <div className="absolute inset-0 grid place-items-center bg-card/50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : slides.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-muted-foreground gap-3">
                <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">No images available in the NSS Gallery.</p>
              </div>
            ) : (
              <>
                {/* Slides */}
                <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-out">
                  <img
                    src={slides[currentIndex].imageUrl}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex flex-col justify-end p-6 md:p-12" />

                  {/* Slide Info */}
                  <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-6 md:right-12 z-10 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-light px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                      NSS Initiative
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold mt-3 tracking-tight font-display drop-shadow-sm">
                      {slides[currentIndex].title}
                    </h2>
                  </div>

                  {/* Inline Delete Button for Admins */}
                  {isEditMode && (
                    <button
                      onClick={(e) => handleDeleteSlide(slides[currentIndex].id, e)}
                      className="absolute top-6 right-6 z-20 h-10 w-10 rounded-full bg-red-600/90 text-white hover:bg-red-700 grid place-items-center shadow-lg transition-transform hover:scale-105"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Left/Right Controls */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 grid place-items-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 grid place-items-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Dots indicator */}
                {slides.length > 1 && (
                  <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex gap-2">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          currentIndex === idx ? "w-6 bg-primary" : "w-2.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </RevealOnScroll>

        {/* Add New Slide Button for Admins */}
        {isEditMode && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Slide Image
            </button>
          </div>
        )}
      </section>

      {/* Slide Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-bold text-ink mb-4">Add Carousel Slide</h3>
            <form onSubmit={handleAddSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                  Slide Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="e.g., PULSE POLIO"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-ink transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  {addMutation.isPending ? "Adding..." : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Outlet for child routes */}
      <main className="pb-24">
        <Outlet />
      </main>
    </>
  );
}
