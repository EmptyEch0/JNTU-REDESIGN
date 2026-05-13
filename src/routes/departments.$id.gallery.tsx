import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Camera, Maximize2, X, Plus, Trash2, Save, Image as ImageIcon, Type, Tag, AlignLeft } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncGallery } from "@/lib/departments";
import { toast } from "sonner";

export const Route = createFileRoute("/departments/$id/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as any;
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [galleryList, setGalleryList] = useState<any[]>(data?.gallery || []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    if (data?.gallery) setGalleryList(data.gallery);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: any[]) => syncGallery({ data: { deptId: data.id, galleryList: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Gallery updated successfully!");
    }
  });

  const addImage = () => {
    const newImage = {
      id: crypto.randomUUID(),
      title: "New Photo",
      image_url: "",
      category: "Events",
      description: ""
    };
    setGalleryList([newImage, ...galleryList]);
  };

  const removeImage = (id: string) => {
    setGalleryList(galleryList.filter(img => img.id !== id));
  };

  const updateImage = (id: string, field: string, value: string) => {
    setGalleryList(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const categories = ["All", ...new Set(galleryList.map((img: any) => img.category))];
  const filteredImages = activeFilter === "All" 
    ? galleryList 
    : galleryList.filter((img: any) => img.category === activeFilter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header */}
      <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Camera size={20} />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">Visual Archives</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Gallery</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {isEditMode && (
            <div className="flex gap-2 pr-4 border-r border-slate-200">
              <button onClick={addImage} className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-full font-bold text-xs hover:bg-slate-200 transition-all">
                <Plus size={14} /> Add Image
              </button>
              <button onClick={() => mutation.mutate(galleryList)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                <Save size={14} /> Save Gallery
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === cat ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((image: any) => (
          <div
            key={image.id}
            className={`relative group break-inside-avoid rounded-[2rem] overflow-hidden bg-slate-100 border transition-all duration-500 ${isEditMode ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200 shadow-sm hover:shadow-2xl'}`}
          >
            {image.image_url ? (
              <img src={image.image_url} alt={image.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="h-48 flex items-center justify-center bg-slate-200 text-slate-400">
                <ImageIcon size={32} />
              </div>
            )}

            {isEditMode ? (
              <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                {/* Image URL Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><ImageIcon size={10}/> Source URL</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <input className="bg-transparent text-[10px] w-full outline-none font-medium" value={image.image_url} onChange={(e) => updateImage(image.id, "image_url", e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                {/* Title and Category Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><Type size={10}/> Title</label>
                    <input className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[11px] outline-none font-bold text-slate-800" value={image.title} onChange={(e) => updateImage(image.id, "title", e.target.value)} placeholder="Title" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><Tag size={10}/> Category</label>
                    <input className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] outline-none font-black uppercase text-indigo-600" value={image.category} onChange={(e) => updateImage(image.id, "category", e.target.value)} placeholder="Category" />
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1"><AlignLeft size={10}/> Description</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[11px] outline-none text-slate-500 min-h-[60px] resize-none" 
                    value={image.description} 
                    onChange={(e) => updateImage(image.id, "description", e.target.value)} 
                    placeholder="Brief details about this photo..."
                  />
                </div>

                <button onClick={() => removeImage(image.id)} className="w-full py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Trash2 size={12} /> Remove Image
                </button>
              </div>
            ) : (
              <div 
                className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">{image.category}</span>
                <h4 className="text-white font-bold text-lg leading-tight mb-1">{image.title}</h4>
                {image.description && (
                   <p className="text-slate-300 text-xs line-clamp-2 italic">"{image.description}"</p>
                )}
                <div className="mt-4 flex items-center gap-2 text-white/50 text-[10px] font-bold">
                  <Maximize2 size={12} /> Click to expand
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && !isEditMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"><X size={32} /></button>
          <div className="relative max-w-5xl w-full animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.image_url} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" alt="" />
            <div className="mt-6 text-center">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{selectedImage.category}</span>
              <h3 className="text-white text-2xl font-bold mt-1">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm leading-relaxed italic">"{selectedImage.description}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}