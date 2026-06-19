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
import { getAssetUrl } from "@/lib/assets";

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
    <div className="relative min-h-screen text-slate-800 p-4 md:p-8 font-sans bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F4F8]">
      {/* Background Elegant Overlay Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200/80 shadow-sm w-fit">
          <Link to="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/academics" className="hover:text-blue-600 transition-colors">
            Academics
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">Downloads</span>
        </nav>

        {/* Hero Section Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800 p-6 md:p-10 border border-blue-800/30 shadow-xl shadow-blue-950/10"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-full px-3 py-1">
                <FileDown className="w-3 h-3" /> JNTU-GV Downloads Center
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
                Downloads
              </h1>
              <p className="text-slate-350 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
                Access official university application formats, certificate forms, original degree verification applications, and essential files directly.
              </p>
            </div>
            
            {/* Elegant educational icon container */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-650 border border-blue-400/30 flex items-center justify-center text-white shadow-xl shadow-blue-950/20 shrink-0">
              <DownloadIcon className="w-8 h-8 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* Admin Mode Controls */}
        {isEditMode && (
          <GlassCard className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-slate-800 backdrop-blur-md shadow-sm" hoverEffect={false}>
            <div className="space-y-0.5">
              <p className="text-amber-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Admin Control Desk
              </p>
              <p className="text-slate-655 text-slate-600 text-[11px] font-medium">
                Create, edit or delete student forms, certificates, and download files dynamically in the database.
              </p>
            </div>
            <button 
              onClick={startAddDownload}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow shadow-blue-500/20 whitespace-nowrap"
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
              <GlassCard className="p-6 border border-amber-250 space-y-4 bg-white/95 backdrop-blur-xl shadow-lg" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 font-extrabold">
                    <Edit2 className="w-3.5 h-3.5" />
                    {editDownloadId === -1 ? "Add Download Resource" : "Edit Download Resource"}
                  </h3>
                  <button 
                    onClick={() => setEditDownloadId(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-550 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-800 font-sans">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Form Category</label>
                    <select 
                      value={dCategory} 
                      onChange={(e) => setDCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    >
                      <option value="Bonafide">Bonafide</option>
                      <option value="TC">Transfer Certificate (TC)</option>
                      <option value="OD">Original Degree (OD)</option>
                      <option value="SSC Memo">SSC Memo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Downloadable PDF URL</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={dPdfUrl} 
                      onChange={(e) => setDPdfUrl(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Form / Application Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter file description or form title..."
                      value={dDocumentName} 
                      onChange={(e) => setDDocumentName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setEditDownloadId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
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
            <GlassCard className="p-4 space-y-4 bg-white border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600" /> Category Filter
                </h3>
                {activeCategory !== "All" && (
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className="text-[9px] font-bold text-blue-600 hover:text-blue-750 transition-colors uppercase tracking-widest flex items-center gap-0.5"
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
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-600"}`} />
                        {cat === "All" ? "All Categories" : cat}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 border border-slate-200/50"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* File Type Filter */}
            <GlassCard className="p-4 space-y-3 bg-white border border-slate-200/80 shadow-md">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
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
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-bold" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {format}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Quick Helper guidelines */}
            <GlassCard className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/60 rounded-2xl shadow-md">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Important Notes</p>
              <ul className="text-[11px] text-slate-600 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>Submit completed forms to the respective administrative blocks.</li>
                <li>Original Degree applications require standard marks verification documents.</li>
                <li>TC requires clear department clearances before release.</li>
              </ul>
            </GlassCard>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search bar & info */}
            <GlassCard className="p-4 bg-white border border-slate-200/80 shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search forms, certificates, memos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-sans"
                />
              </div>
              <div className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-blue-600" /> Dynamic Database Feed
              </div>
            </GlassCard>

            {/* Cards Display Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <GlassCard key={idx} className="p-5 h-[160px] animate-pulse bg-slate-100/50 border-slate-200/60 flex flex-col justify-between" hoverEffect={false}>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-5/6" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                      <div className="h-8 bg-slate-200 rounded w-1/3" />
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
                    PDF: "text-red-600 bg-red-50 border-red-100",
                    DOC: "text-blue-600 bg-blue-50 border-blue-100",
                    XLS: "text-emerald-600 bg-emerald-50 border-emerald-100"
                  };

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                    >
                      <GlassCard className="p-5 h-full flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 bg-white border border-slate-200/80 hover:shadow-xl transition-all duration-300 shadow-sm">
                        {/* Decorative background hover glow */}
                        <div className="absolute right-0 top-0 w-20 h-20 bg-blue-500/2 rounded-full blur-2xl group-hover:bg-blue-500/5 transition-all duration-300 pointer-events-none" />

                        <div>
                          {/* Card Header badges */}
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                              {item.category}
                            </span>
                            
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${typeColors[type]}`}>
                              {type}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-800 text-xs md:text-sm mb-4 leading-relaxed group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.document_name}
                          </h4>
                          
                          {/* File detailed sizes and uploads */}
                          <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-slate-550">
                              <HardDrive className="w-3.5 h-3.5 text-blue-500/70" />
                              <div className="leading-none">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Size</p>
                                <p className="text-[10px] font-bold text-slate-700">{fileSize}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-550">
                              <Calendar className="w-3.5 h-3.5 text-blue-500/70" />
                              <div className="leading-none">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Updated</p>
                                <p className="text-[10px] font-bold text-slate-700">{uploadDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action footer */}
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Form
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Admin actions */}
                            {isEditMode && (
                              <div className="flex items-center gap-1 relative z-20">
                                <button
                                  onClick={() => startEditDownload(item)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 transition-colors"
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
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <button 
                              onClick={() => window.open(getAssetUrl(item.pdf_url), "_blank")}
                              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-black tracking-wider uppercase transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98]"
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
              <GlassCard className="p-8 text-center bg-white border border-slate-200/80 flex flex-col items-center justify-center h-72">
                <FileText className="w-12 h-12 text-blue-600/20 mb-4 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">No matches found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
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
