import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { Image as ImageIcon, Maximize2, Filter, Camera, X } from "lucide-react";

export const Route = createFileRoute("/departments/$id/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as any;
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  if (!data?.gallery || data.gallery.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400">
        No photos available for this department.
      </div>
    );
  }

  // Extract unique categories dynamically
  const categories = ["All", ...new Set(data.gallery.map((img: any) => img.category))];

  const filteredImages =
    activeFilter === "All"
      ? data.gallery
      : data.gallery.filter((img: any) => img.category === activeFilter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header */}
      <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Camera size={20} />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">
              Visual Archives
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Photo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Gallery
            </span>
          </h2>
        </div>

        {/* Dynamic Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === cat
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((image: any) => (
          <div
            key={image.id}
            className="relative group break-inside-avoid rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                {image.category}
              </span>
              <h4 className="text-white font-bold text-lg leading-tight mb-1">{image.title}</h4>
              {image.description && (
                <p className="text-slate-300 text-xs line-clamp-2">{image.description}</p>
              )}
              <div className="mt-4 flex items-center gap-2 text-white/50 text-[10px] font-bold">
                <Maximize2 size={12} /> Click to expand
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2 block">
                {selectedImage.category}
              </span>
              <h3 className="text-white font-bold text-xl mb-1">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-slate-300 text-sm">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
