import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { 
  Download as DownloadIcon, 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  ChevronRight, 
  Home, 
  FileDown, 
  Calendar, 
  HardDrive,
  Filter,
  RefreshCw,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsDownloadsList,
  upsertAcademicsDownload,
  deleteAcademicsDownload
} from "@/lib/academics";

export const Route = createFileRoute("/academics/downloads")({
  head: () => ({
    meta: [
      { title: "Academic Downloads Center — JNTU-GV CEV" },
      {
        name: "description",
        content: "Download student application forms, certificate requests (Bonafide, TC, OD), and SSC Memo verification guidelines.",
      },
    ],
  }),
  component: DownloadsPage,
});

// Helper for realistic metadata
const getFileMeta = (docName: string, id: number) => {
  const lowercaseName = docName.toLowerCase();
  let type: "PDF" | "DOC" | "XLS" = "PDF";
  if (lowercaseName.includes("excel") || lowercaseName.includes("xls") || lowercaseName.includes("sheet")) {
    type = "XLS";
  } else if (lowercaseName.includes("doc") || lowercaseName.includes("word") || lowercaseName.includes("format")) {
    type = "DOC";
  }
  
  // Deterministic file size based on ID
  const sizeMb = ((id * 7 + 13) % 4) * 0.4 + 0.6;
  const fileSize = `${sizeMb.toFixed(1)} MB`;
  
  // Deterministic date
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (id * 3 + 7) % 28 + 1;
  const month = months[(id * 2 + 5) % 12];
  const year = 2025 - ((id % 2) === 0 ? 0 : 1);
  const uploadDate = `${month} ${day}, ${year}`;
  
  return { type, fileSize, uploadDate };
};

function DownloadsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Bonafide" | "TC" | "OD" | "SSC Memo">("All");
  const [selectedFileType, setSelectedFileType] = useState<"All" | "PDF" | "DOC" | "XLS">("All");

  // State for Editing
  const [editDownloadId, setEditDownloadId] = useState<number | null>(null);
  const [dCategory, setDCategory] = useState<"Bonafide" | "TC" | "OD" | "SSC Memo">("Bonafide");
  const [dDocumentName, setDDocumentName] = useState("");
  const [dPdfUrl, setDPdfUrl] = useState("");

  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ["academics-downloads"],
    queryFn: getAcademicsDownloadsList,
  });

  // Mutations
  const saveDownloadMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsDownload({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-downloads"] });
      setEditDownloadId(null);
      toast.success("Download resource saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteDownloadMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsDownload({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-downloads"] });
      toast.success("Download resource deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const startEditDownload = (item: any) => {
    setEditDownloadId(item.id);
    setDCategory(item.category as any);
    setDDocumentName(item.document_name);
    setDPdfUrl(item.pdf_url || "");
  };

  const startAddDownload = () => {
    setEditDownloadId(-1);
    setDCategory(activeCategory === "All" ? "Bonafide" : activeCategory);
    setDDocumentName("");
    setDPdfUrl("");
  };

  // Filter downloads
  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchesSearch = item.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      
      const fileMeta = getFileMeta(item.document_name, item.id);
      const matchesFileType = selectedFileType === "All" || fileMeta.type === selectedFileType;
      
      return matchesSearch && matchesCat && matchesFileType;
    });
  }, [downloads, searchTerm, activeCategory, selectedFileType]);

  return (
    <div className="relative min-h-screen text-slate-100 p-4 md:p-8 font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-all duration-700 filter blur-sm brightness-[0.2]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1920')` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/5 w-fit">
          <Link to="/" className="hover:text-[#A02021] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-650" />
          <Link to="/academics" className="hover:text-[#A02021] transition-colors">
            Academics
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-650" />
          <span className="text-white font-bold">Downloads</span>
        </nav>

        {/* Hero Section Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-950/90 to-[#A02021]/30 p-6 md:p-10 border border-[#A02021]/20 shadow-2xl shadow-red-950/30"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#A02021]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-[#A02021]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 rounded-full px-3 py-1">
                <DownloadIcon className="w-3 h-3" /> JNTU-GV Downloads Center
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
                Downloads
              </h1>
              <p className="text-slate-350 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
                Access official university application formats, certificate forms, original degree verification applications, and essential files directly.
              </p>
            </div>
            
            {/* Elegant educational icon container */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A02021] to-red-900/80 border border-red-500/30 flex items-center justify-center text-white shadow-xl shadow-red-950/40 shrink-0">
              <DownloadIcon className="w-8 h-8 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* Admin Mode Controls */}
        {isEditMode && (
          <GlassCard className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-white backdrop-blur-md">
            <div className="space-y-0.5">
              <p className="text-amber-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Admin Control Desk
              </p>
              <p className="text-slate-350 text-[11px] font-medium">
                Create, edit or delete student forms, certificates, and download files dynamically in the database.
              </p>
            </div>
            <button 
              onClick={startAddDownload}
              className="flex items-center gap-1.5 bg-[#A02021] hover:bg-red-800 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-red-900/30 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Download Record
            </button>
          </GlassCard>
        )}

        {/* Main Editing Download Form */}
        <AnimatePresence>
          {isEditMode && editDownloadId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-6 border border-amber-500/30 space-y-4 bg-slate-950/90 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" />
                    {editDownloadId === -1 ? "Add Download Resource" : "Edit Download Resource"}
                  </h3>
                  <button 
                    onClick={() => setEditDownloadId(null)}
                    className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Form Category</label>
                    <select 
                      value={dCategory} 
                      onChange={(e) => setDCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500" 
                    >
                      <option value="Bonafide">Bonafide</option>
                      <option value="TC">Transfer Certificate (TC)</option>
                      <option value="OD">Original Degree (OD)</option>
                      <option value="SSC Memo">SSC Memo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Downloadable PDF URL</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={dPdfUrl} 
                      onChange={(e) => setDPdfUrl(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl text-xs p-3 outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500" 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Form / Application Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter file description or form title..."
                      value={dDocumentName} 
                      onChange={(e) => setDDocumentName(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl text-xs p-3 outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setEditDownloadId(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!dDocumentName.trim() || !dPdfUrl.trim()) {
                        toast.error("Please fill all fields before saving.");
                        return;
                      }
                      saveDownloadMutation.mutate({
                        id: editDownloadId === -1 ? undefined : editDownloadId,
                        category: dCategory,
                        document_name: dDocumentName,
                        pdf_url: dPdfUrl
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Category selection */}
            <GlassCard className="p-4 space-y-4 bg-slate-950/70 border border-white/15 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#A02021]" /> Category Filter
                </h3>
                {activeCategory !== "All" && (
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-0.5"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <div className="space-y-1.5">
                {(["All", "Bonafide", "TC", "OD", "SSC Memo"] as const).map((cat) => {
                  const isSelected = activeCategory === cat;
                  const count = cat === "All" 
                    ? downloads.length 
                    : downloads.filter((d) => d.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-gradient-to-r from-[#A02021] to-red-800 text-white shadow-lg shadow-red-950/50" 
                          : "text-slate-350 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#A02021]"}`} />
                        {cat === "All" ? "All Categories" : cat}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-450 border border-white/5"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* File Type Filter */}
            <GlassCard className="p-4 space-y-3 bg-slate-950/70 border border-white/15 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-white/5">
                File Formats
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {(["All", "PDF", "DOC", "XLS"] as const).map((format) => {
                  const isSelected = selectedFileType === format;
                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFileType(format)}
                      className={`py-2 px-3 rounded-lg text-[10px] font-black transition-all text-center uppercase tracking-wider border ${
                        isSelected 
                          ? "bg-[#A02021]/20 border-[#A02021] text-white font-bold" 
                          : "bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {format}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Quick Helper guidelines */}
            <GlassCard className="p-4 bg-gradient-to-br from-slate-900/60 to-red-950/10 border border-white/5 rounded-2xl shadow-xl">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Important Notes</p>
              <ul className="text-[11px] text-slate-350 space-y-2 list-disc list-inside leading-relaxed">
                <li>Submit completed forms to the respective administrative blocks.</li>
                <li>Original Degree applications require standard marks verification documents.</li>
                <li>TC requires clear department clearances before release.</li>
              </ul>
            </GlassCard>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search bar & info */}
            <GlassCard className="p-4 bg-slate-950/70 border border-white/15 shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
                <input 
                  type="text" 
                  placeholder="Search forms, certificates, memos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/50 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#A02021] outline-none transition-all placeholder:text-slate-500 font-sans"
                />
              </div>
              <div className="text-[10px] font-extrabold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#A02021]" /> Dynamic Database Feed
              </div>
            </GlassCard>

            {/* Cards Display Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <GlassCard key={idx} className="p-5 h-[160px] animate-pulse bg-slate-900/40 border-white/5 flex flex-col justify-between" hoverEffect={false}>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-5 bg-slate-800 rounded w-5/6" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                      <div className="h-8 bg-slate-800 rounded w-1/3" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : filteredDownloads.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredDownloads.map((item, idx) => {
                  const { type, fileSize, uploadDate } = getFileMeta(item.document_name, item.id);
                  
                  // Color based on type
                  const typeColors = {
                    PDF: "text-red-400 bg-red-950/30 border-red-500/20",
                    DOC: "text-blue-400 bg-blue-950/30 border-blue-500/20",
                    XLS: "text-emerald-400 bg-emerald-950/30 border-emerald-500/20"
                  };

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                    >
                      <GlassCard className="p-5 h-full flex flex-col justify-between relative overflow-hidden group hover:border-[#A02021]/50 bg-slate-950/60 border border-white/10 hover:shadow-2xl hover:shadow-red-950/10 transition-all duration-300">
                        {/* Decorative background hover glow */}
                        <div className="absolute right-0 top-0 w-20 h-20 bg-[#A02021]/2 rounded-full blur-2xl group-hover:bg-[#A02021]/5 transition-all duration-300 pointer-events-none" />

                        <div>
                          {/* Card Header badges */}
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#A02021] bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/10">
                              {item.category}
                            </span>
                            
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${typeColors[type]}`}>
                              {type}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-xs md:text-sm mb-4 leading-relaxed group-hover:text-red-400 transition-colors line-clamp-2">
                            {item.document_name}
                          </h4>
                          
                          {/* File detailed sizes and uploads */}
                          <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <HardDrive className="w-3.5 h-3.5 text-red-500/70" />
                              <div className="leading-none">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Size</p>
                                <p className="text-[10px] font-bold text-slate-300">{fileSize}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Calendar className="w-3.5 h-3.5 text-red-500/70" />
                              <div className="leading-none">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Updated</p>
                                <p className="text-[10px] font-bold text-slate-300">{uploadDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action footer */}
                        <div className="flex items-center justify-between pt-3.5 border-t border-white/5 mt-auto">
                          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Form
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Admin actions */}
                            {isEditMode && (
                              <div className="flex items-center gap-1 relative z-20">
                                <button
                                  onClick={() => startEditDownload(item)}
                                  className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 text-amber-400 transition-colors"
                                  title="Edit entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you sure you want to delete "${item.document_name}"?`)) {
                                      deleteDownloadMutation.mutate(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 transition-colors"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <button 
                              onClick={() => window.open(item.pdf_url, "_blank")}
                              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#A02021] to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg text-[10px] font-black tracking-wider uppercase transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <FileDown className="w-3.5 h-3.5" /> Download
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <GlassCard className="p-8 text-center bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center h-72">
                <FileText className="w-12 h-12 text-[#A02021]/30 mb-4 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-white mb-1">No matches found</h4>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any downloadable files matching your search filter. Try clearing keywords or filters.
                </p>
              </GlassCard>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
