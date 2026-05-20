import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/academics/ui/PageHeader";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { FileText, Download, ChevronRight, Eye, Search, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsRegulations,
  upsertAcademicsRegulation,
  deleteAcademicsRegulation
} from "@/lib/academics";

export const Route = createFileRoute("/academics/regulations")({
  component: RegulationsPage,
});

function RegulationsPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"UG" | "PG" | "PhD">("UG");
  const [selectedBranch, setSelectedBranch] = useState<"All" | "B.Tech" | "M.Tech" | "MBA" | "MCA">("All");

  // States for Editing
  const [editRegId, setEditRegId] = useState<number | null>(null);
  const [regCategory, setRegCategory] = useState<"UG" | "PG" | "PhD">("UG");
  const [regBranch, setRegBranch] = useState("B.Tech");
  const [regCode, setRegCode] = useState("");
  const [regTitle, setRegTitle] = useState("");
  const [regFileUrl, setRegFileUrl] = useState("");

  const { data: regulations = [], isLoading } = useQuery({
    queryKey: ["academics-regulations"],
    queryFn: getAcademicsRegulations,
  });

  // Mutations
  const saveRegMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsRegulation({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-regulations"] });
      setEditRegId(null);
      toast.success("Regulation record saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save record: " + err.message);
    }
  });

  const deleteRegMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsRegulation({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-regulations"] });
      toast.success("Regulation record deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete record: " + err.message);
    }
  });

  const startEditReg = (reg: any) => {
    setEditRegId(reg.id);
    setRegCategory(reg.level as any);
    setRegBranch(reg.program_name);
    setRegCode(reg.regulation);
    setRegTitle(reg.title);
    setRegFileUrl(reg.pdf_url);
  };

  const startAddReg = () => {
    setEditRegId(-1);
    setRegCategory(activeCategory);
    setRegBranch(selectedBranch === "All" ? "B.Tech" : selectedBranch);
    setRegCode("R23");
    setRegTitle("");
    setRegFileUrl("");
  };

  // Filter regulations based on inputs
  const filteredRegulations = regulations.filter((reg) => {
    const matchesCategory = reg.level === activeCategory;
    const matchesBranch = selectedBranch === "All" || reg.program_name === selectedBranch;
    const matchesSearch = 
      reg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reg.regulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.program_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesBranch && matchesSearch;
  });

  return (
    <div 
      className="space-y-8 pb-16 min-h-screen bg-cover bg-center bg-no-repeat -mx-4 px-4 md:-mx-8 md:px-8"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.96), rgba(248,250,252,0.98)), url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073')"
      }}
    >
      <div className="pt-4">
        <PageHeader 
          title="Academic Regulations" 
          subtitle="Explore credit systems, evaluation policies, and academic guidelines for all programs and regulations."
          icon={FileText}
        />
      </div>

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900 font-sans">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Add or modify program regulation credit matrices and PDFs.
          </p>
          <button 
            onClick={startAddReg}
            className="flex items-center gap-1 bg-[#A02021] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-800 transition-all shadow-md shadow-red-900/20"
          >
            <Plus size={14} /> Add Regulation PDF
          </button>
        </GlassCard>
      )}

      {/* Main Editing Regulation Form */}
      {isEditMode && editRegId !== null && (
        <GlassCard className="p-6 border-2 border-amber-300 space-y-4 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-amber-200">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-850">
              {editRegId === -1 ? "Add New Academic Regulation" : "Edit Academic Regulation"}
            </h3>
            <button 
              onClick={() => setEditRegId(null)}
              className="text-slate-400 hover:text-slate-650"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Academic Level</label>
              <select 
                value={regCategory} 
                onChange={(e) => setRegCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer outline-none" 
              >
                <option value="UG">UG Program</option>
                <option value="PG">PG Program</option>
                <option value="PhD">PhD Program</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Program / Branch</label>
              <input 
                type="text" 
                placeholder="e.g. B.Tech / M.Tech / MBA / MCA"
                value={regBranch} 
                onChange={(e) => setRegBranch(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Regulation Code</label>
              <input 
                type="text" 
                placeholder="e.g. R23, R20"
                value={regCode} 
                onChange={(e) => setRegCode(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">PDF File URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/regulation.pdf"
                value={regFileUrl} 
                onChange={(e) => setRegFileUrl(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-slate-650 block mb-1">Regulation Title</label>
              <input 
                type="text" 
                placeholder="e.g. R23 B.Tech Academic Regulations"
                value={regTitle} 
                onChange={(e) => setRegTitle(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => setEditRegId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-350 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (!regBranch || !regCode || !regTitle || !regFileUrl) {
                  toast.error("Please fill in all fields before saving.");
                  return;
                }
                saveRegMutation.mutate({
                  id: editRegId === -1 ? undefined : editRegId,
                  level: regCategory,
                  program_name: regBranch,
                  regulation: regCode,
                  title: regTitle,
                  pdf_url: regFileUrl
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Record
            </button>
          </div>
        </GlassCard>
      )}

      {/* Program Category Filters */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl w-fit">
        {(["UG", "PG", "PhD"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedBranch("All"); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeCategory === cat 
                ? "bg-white dark:bg-slate-700 text-[#A02021] dark:text-white shadow-sm" 
                : "text-slate-650 dark:text-slate-400 hover:text-[#A02021]"
            }`}
          >
            {cat === "UG" ? "UG Regulations" : cat === "PG" ? "PG Regulations" : "PhD Regulations"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-5 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Search Regulations</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search code (R23, R20)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-105 dark:bg-slate-800/50 border border-slate-200/30 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#A02021]/50 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Branch Selection</label>
              <div className="relative font-sans">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-105 dark:bg-slate-800/50 rounded-xl text-xs font-semibold text-slate-750 dark:text-slate-300 border border-slate-200/30 focus:ring-2 focus:ring-[#A02021]/50 outline-none appearance-none cursor-pointer"
                >
                  <option value="All">All Branches</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 bg-gradient-to-br from-[#1E3A8A] via-blue-800 to-blue-950 text-white border-none shadow-lg">
            <h4 className="font-extrabold mb-1">Choice Based Credit System</h4>
            <p className="text-[11px] text-blue-100 leading-relaxed mt-2">
              JNTU-GV strictly adheres to the UGC CBCS pattern. Regulations outline core courses, professional electives, open electives, and mandatory non-credit courses.
            </p>
          </GlassCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Loading Academic Regulations...</div>
          ) : filteredRegulations.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredRegulations.map((reg, idx) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                  >
                    <GlassCard className="p-6 relative overflow-hidden group hover:border-[#A02021]/30 transition-all duration-300">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#A02021]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-red-105 text-[#A02021] dark:bg-red-950/40 dark:text-red-400 rounded-lg text-xs font-extrabold">
                                {reg.regulation} Code
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                {reg.program_name} · {reg.level}
                              </span>
                            </div>

                            {/* Admin edit buttons */}
                            {isEditMode && (
                              <div className="flex items-center gap-1.5 relative z-20">
                                <button 
                                  onClick={() => startEditReg(reg)}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg"
                                  title="Edit Regulation"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  onClick={() => { if(confirm("Are you sure you want to delete this regulation?")) deleteRegMutation.mutate(reg.id); }}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                  title="Delete Regulation"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#A02021] transition-colors">
                            {reg.title}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Ratified academic regulations, credit structure matrices, and graduation criteria policies.
                          </p>
                        </div>

                        <div className="flex sm:flex-row md:flex-col lg:flex-row gap-3 flex-shrink-0">
                          <button 
                            onClick={() => window.open(reg.pdf_url, "_blank")}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/25"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </button>
                          
                          <button 
                            onClick={() => window.open(reg.pdf_url, "_blank")}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#A02021] text-white rounded-xl text-xs font-bold hover:bg-red-850 transition-all shadow-md shadow-red-900/10"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs font-sans">
                        <div>
                          <p className="text-slate-450 mb-0.5">Evaluation Pattern</p>
                          <p className="font-semibold text-slate-900 dark:text-white">30% Mid / 70% End-Sem</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Passing Minimum</p>
                          <p className="font-semibold text-slate-900 dark:text-white">40% of marks</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Total Credits</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{reg.level === "UG" ? "160 Credits" : "68 Credits"}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-slate-500 bg-white/40 backdrop-blur-sm rounded-3xl border border-slate-200/50">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-semibold">No regulations found matching your query.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
