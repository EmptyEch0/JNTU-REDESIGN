import { useState } from "react";
import { X, Upload, Check, Search, Image as ImageIcon, FileText } from "lucide-react";
import { AdminUpload } from "@/components/AdminEditPanel";
import { toast } from "sonner";
import { SafeImage } from "@/components/SafeImage";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  allowedType?: "image" | "pdf" | "all";
}

// Preset media asset suggestions from local assets
const RECENT_ASSETS = [
  { name: "Campus Main Building", url: "/local-assets/uploads/photo-gallery/IMG_6832.JPG" },
  { name: "Cultural Celebrations", url: "/local-assets/uploads/photo-gallery/IMG_6840.JPG" },
  { name: "Advanced Engineering Labs", url: "/local-assets/uploads/photo-gallery/IMG_6844.JPG" },
  { name: "Library Reading Commons", url: "/local-assets/uploads/photo-gallery/IMG_6859.JPG" },
  { name: "Placement Drives & Talks", url: "/local-assets/uploads/photo-gallery/IMG_6920.JPG" },
  { name: "Academic Calendar PDF", url: "/local-assets/uploads/2026/08/ii-b-tech-academic-calendar-2026-2027.pdf" },
];

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  allowedType = "all",
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredAssets = RECENT_ASSETS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-[fade-in_0.15s_ease-out]">
      <div className="bg-card text-card-foreground w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[88vh] animate-[scale-in_0.2s_ease-out]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-muted/20 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-ink">Media Library & File Selector</h3>
              <p className="text-xs text-muted-foreground">Upload or choose assets for your department pages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/30 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-4 w-4" /> Upload New File
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "library"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-4 w-4" /> Asset Library
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {activeTab === "upload" ? (
            <div className="space-y-4 text-center">
              <div className="p-8 border-2 border-dashed border-border rounded-2xl bg-muted/20 space-y-3">
                <Upload className="h-8 w-8 mx-auto text-primary" />
                <h4 className="font-bold text-sm text-foreground">Upload Image or PDF</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Files are saved into organized university media folders for instant referencing.
                </p>

                <AdminUpload
                  value={uploadedUrl}
                  onChange={(url) => {
                    setUploadedUrl(url);
                    toast.success("File uploaded to media library!");
                  }}
                  module="departments"
                  category="media"
                  placeholder="Choose PDF or Image file"
                  className="max-w-md mx-auto"
                />
              </div>

              {uploadedUrl && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs text-foreground">
                  <span className="truncate max-w-xs font-mono text-[11px]">{uploadedUrl}</span>
                  <button
                    onClick={() => {
                      onSelect(uploadedUrl);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="h-3.5 w-3.5" /> Insert File
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search media files..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredAssets.map((asset, idx) => {
                  const isPdf = asset.url.endsWith(".pdf");
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelect(asset.url);
                        onClose();
                      }}
                      className="group cursor-pointer p-2.5 rounded-2xl bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left shadow-sm"
                    >
                      <div className="h-28 w-full rounded-xl overflow-hidden bg-muted relative mb-2 flex items-center justify-center">
                        {isPdf ? (
                          <div className="text-center p-2 text-muted-foreground">
                            <FileText className="h-7 w-7 mx-auto text-primary mb-1" />
                            <span className="text-[10px] font-bold uppercase">PDF Document</span>
                          </div>
                        ) : (
                          <SafeImage
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <p className="text-xs font-bold text-foreground truncate">{asset.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
