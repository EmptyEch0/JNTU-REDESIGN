import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { updateDepartment } from "@/lib/departments";
import { type DepartmentData } from "@/functions/departments";
import {
  Target,
  Lightbulb,
  BookOpenText,
  Save,
  Plus,
  Trash2,
  ImageIcon,
  Type,
  Tag,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SafeImage } from "@/components/SafeImage";
import { AdminUpload } from "@/components/AdminEditPanel";
import { syncGallery } from "@/lib/departments";

export const Route = createFileRoute("/departments/$id/")({
  component: AboutPage,
});

/* ------------------------------------------------------------------ */
/*  Hero Carousel — mimics a website homepage hero/banner slider       */
/*  Click the right half of the slide to advance, left half to go back */
/*  No visible arrow buttons; dots + autoplay for a polished feel      */
/* ------------------------------------------------------------------ */

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
  is_highlight?: boolean;
}

function HeroCarousel({
  images,
  allImages,
  isEditMode,
  onAdd,
  onRemove,
  onUpdate,
  onSave,
  onToggleHighlight,
}: {
  images: GalleryImage[];
  allImages: GalleryImage[];
  isEditMode: boolean;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onSave: () => void;
  onToggleHighlight: (id: string, value: boolean) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const nonHighlighted = allImages.filter((img) => !img.is_highlight);
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setCurrent(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay, paused while editing
  useEffect(() => {
    if (isEditMode || count <= 1) return;
    timeoutRef.current = setTimeout(() => next(), 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, isEditMode, count, next]);

  // Keep index in range if list shrinks
  useEffect(() => {
    if (current >= count) setCurrent(0);
  }, [count, current]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditMode) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const isRightSide = clickX > rect.width / 2;
    if (isRightSide) next();
    else prev();
  };

  if (count === 0 && !isEditMode) {
    return null;
  }

  const active = images[current];

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="text-blue-600 h-6 w-6" />
          <h2 className="text-2xl font-semibold text-gray-900">Highlights</h2>
        </div>
        <div className="flex items-center gap-3">
          {isEditMode && (
            <>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest px-2 py-1 bg-amber-100 rounded">
                Editing Mode
              </span>
              <button
                onClick={onAdd}
                className="flex items-center gap-2 bg-slate-100 text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-slate-200 transition-all"
              >
                <Plus size={14} /> Add Slide
              </button>
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-2 bg-slate-100 text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-slate-200 transition-all"
              >
                <ImageIcon size={14} /> From Gallery
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-blue-700 transition-all"
              >
                <Save size={14} /> Save Highlights
              </button>
            </>
          )}
        </div>
      </div>

      {/* Picker: pull in existing gallery pictures that aren't highlights yet */}
      {isEditMode && pickerOpen && (
        <div className="mb-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 mb-3">
            Add an existing gallery picture as a highlight
          </p>
          {nonHighlighted.length === 0 ? (
            <p className="text-sm text-slate-400">
              Every gallery picture is already a highlight, or your gallery is empty.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {nonHighlighted.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    onToggleHighlight(img.id, true);
                  }}
                  className="group relative rounded-lg overflow-hidden border border-slate-200 bg-white text-left hover:border-blue-400 transition-colors"
                >
                  <div className="w-full h-20 bg-slate-200 flex items-center justify-center overflow-hidden">
                    {img.image_url ? (
                      <SafeImage
                        src={img.image_url}
                        alt={img.title || "Gallery image"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-slate-400" />
                    )}
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {img.title || "Untitled"}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                      <Plus size={10} className="inline -mt-0.5" /> Add
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slide viewport */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`relative w-full overflow-hidden rounded-2xl bg-gray-900 select-none border border-gray-200 shadow-lg ${
          isEditMode ? "" : "cursor-pointer"
        }`}
        style={{ aspectRatio: "16 / 7" }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {image.image_url ? (
              <SafeImage
                src={image.image_url}
                alt={image.title || "Highlight image"}
                loading={index === current ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                <ImageIcon size={40} />
              </div>
            )}

            {!isEditMode && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-8">
                {image.category && (
                  <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    {image.category}
                  </span>
                )}
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-1 max-w-2xl">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-slate-300 text-sm max-w-xl line-clamp-2 italic">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Left / right click affordance hints (subtle, no explicit arrow icons) */}
        {!isEditMode && count > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 w-1/2 z-20 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/15 backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-white rotate-45" />
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 z-20 group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/15 backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-2.5 h-2.5 border-r-2 border-t-2 border-white rotate-45" />
              </div>
            </div>
          </>
        )}

        {/* Dots */}
        {!isEditMode && count > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {count === 0 && isEditMode && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500">
            <ImageIcon size={40} />
            <p className="text-sm">No highlights yet. Click "Add Slide" or "From Gallery" to create one.</p>
          </div>
        )}
      </div>

      {/* Edit panel — card list, one per slide, expand to edit */}
      {isEditMode && (
        <div className="mt-5 space-y-3">
          {images.length === 0 && (
            <div className="p-8 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center text-sm text-amber-700">
              No highlights yet. Click "Add Slide" or "From Gallery" above to create one.
            </div>
          )}

          {images.map((img, index) => {
            const isOpen = index === current;
            return (
              <div
                key={img.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isOpen ? "border-blue-300 shadow-md bg-white" : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <button
                  onClick={() => setCurrent(index)}
                  className="w-full flex items-center gap-4 p-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    {img.image_url ? (
                      <SafeImage
                        src={img.image_url}
                        alt={img.title || "Slide"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {img.title || "Untitled slide"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {img.category || "No category"}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0 ${
                      isOpen ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isOpen ? "Editing" : "Edit"}
                  </span>

                  <span
                    className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-2 border-t border-slate-100 space-y-4 bg-white">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <ImageIcon size={13} /> Slide image
                      </label>
                      <AdminUpload
                        value={img.image_url}
                        onChange={(newUrl: string) => onUpdate(img.id, "image_url", newUrl)}
                        module="departments"
                        category="gallery"
                        placeholder="Upload image"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                          <Type size={13} /> Title
                        </label>
                        <input
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none font-medium text-slate-800 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                          value={img.title}
                          onChange={(e) => onUpdate(img.id, "title", e.target.value)}
                          placeholder="e.g. Annual Tech Fest 2026"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                          <Tag size={13} /> Category
                        </label>
                        <input
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none font-medium text-blue-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                          value={img.category}
                          onChange={(e) => onUpdate(img.id, "category", e.target.value)}
                          placeholder="e.g. Events"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Description</label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none text-slate-600 min-h-[70px] resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        value={img.description}
                        onChange={(e) => onUpdate(img.id, "description", e.target.value)}
                        placeholder="Brief details about this slide..."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onToggleHighlight(img.id, false)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-white hover:bg-slate-500 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        Remove from Highlights
                      </button>
                      <button
                        onClick={() => onRemove(img.id)}
                        className="flex items-center gap-1.5 text-red-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        <Trash2 size={13} /> Delete slide
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main About/Index page                                             */
/* ------------------------------------------------------------------ */

function AboutPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  const { id: routeSlug } = useParams({ from: "/departments/$id" });
  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(routeSlug || "");

  const [editData, setEditData] = useState<Partial<DepartmentData>>({});
  const [galleryList, setGalleryList] = useState<GalleryImage[]>((data as any)?.gallery || []);

  useEffect(() => {
    if (data) setEditData(data);
  }, [data]);

  useEffect(() => {
    if ((data as any)?.gallery) setGalleryList((data as any).gallery);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: data.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("Department details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update department details.");
    },
  });

  const galleryMutation = useMutation({
    mutationFn: (payload: GalleryImage[]) =>
      syncGallery({ data: { deptId: data.id, galleryList: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("Highlights updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update highlights.");
    },
  });

  if (!data) return <div>Loading...</div>;

  const handleSave = (field: keyof DepartmentData, value: string) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
    mutation.mutate({ [field]: value });
  };

  const addSlide = () => {
    const newImage: GalleryImage = {
      id: crypto.randomUUID(),
      title: "New Highlight",
      image_url: "",
      category: "Events",
      description: "",
      is_highlight: true,
    };
    setGalleryList([newImage, ...galleryList]);
  };

  const removeSlide = (id: string) => {
    setGalleryList(galleryList.filter((img) => img.id !== id));
  };

  const updateSlide = (id: string, field: string, value: string) => {
    setGalleryList((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const toggleHighlight = (id: string, value: boolean) => {
    setGalleryList((prev) =>
      prev.map((img) => (img.id === id ? { ...img, is_highlight: value } : img))
    );
  };

  const saveGallery = () => {
    galleryMutation.mutate(galleryList);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-10">

          {/* About Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpenText className="text-blue-600 h-6 w-6" />
                <h2 className="text-2xl font-semibold text-gray-900">About the Department</h2>
              </div>
              {isEditMode && (
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest px-2 py-1 bg-amber-100 rounded">
                  Editing Mode
                </span>
              )}
            </div>

            <div
              className={`rounded-xl p-8 border transition-all ${
                isEditMode ? "bg-amber-50/50 border-amber-200 shadow-inner" : "bg-gray-50 border-gray-200"
              }`}
            >
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-64 p-4 rounded-lg border border-amber-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 leading-relaxed"
                    value={editData.about_details ?? ""}
                    onChange={(e) => setEditData({ ...editData, about_details: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("about_details", editData.about_details ?? "")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Save size={16} /> Save Description
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.about_details || "Department details are currently being updated."}
                </p>
              )}
            </div>
          </section>

          {/* Hero Carousel — homepage-style highlights, synced with gallery.
              Falls back to the 3 most recent gallery pictures until admins
              explicitly flag items as highlights. */}
          <HeroCarousel
            images={
              isEditMode
                ? galleryList.filter((img) => img.is_highlight)
                : (() => {
                    const flagged = galleryList.filter((img) => img.is_highlight);
                    return flagged.length > 0 ? flagged.slice(0, 3) : galleryList.slice(0, 3);
                  })()
            }
            allImages={galleryList}
            isEditMode={isEditMode}
            onAdd={addSlide}
            onRemove={removeSlide}
            onUpdate={updateSlide}
            onSave={saveGallery}
            onToggleHighlight={toggleHighlight}
          />

          {/* Vision & Mission Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className={`rounded-xl p-8 transition-all ${isEditMode ? "ring-2 ring-amber-400 ring-offset-2" : ""} bg-gray-900`}>
              <div className="flex items-center gap-3 mb-5">
                <Target className="text-blue-400 h-6 w-6" />
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
              </div>
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-1 focus:ring-blue-400 outline-none"
                    value={editData.vision ?? ""}
                    onChange={(e) => setEditData({ ...editData, vision: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("vision", editData.vision ?? "")}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider"
                  >
                    Update Vision
                  </button>
                </div>
              ) : (
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {data.vision || "Our vision is currently being finalized."}
                </div>
              )}
            </div>

            {/* Mission Card */}
            <div className={`rounded-xl p-8 border transition-all ${isEditMode ? "bg-amber-50 border-amber-300 shadow-inner" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-5">
                <Lightbulb className="text-blue-600 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 rounded-lg bg-white text-gray-700 border border-amber-200 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={editData.mission ?? ""}
                    onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("mission", editData.mission ?? "")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider"
                  >
                    Update Mission
                  </button>
                </div>
              ) : (
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {data.mission || "Our mission statement is currently being updated."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}