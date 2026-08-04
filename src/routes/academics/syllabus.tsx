import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { BookOpen, Search, Download, Eye, RotateCcw, Plus, Trash2, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsSyllabusList,
  upsertAcademicsSyllabus,
  deleteAcademicsSyllabus
} from "@/lib/academics";
import { getAssetUrl, imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/syllabus")({
  component: SyllabusPage,
});

function SyllabusPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReg, setSelectedReg] = useState("R23");
  const [selectedCat, setSelectedCat] = useState("All"); // UG / PG
  const [selectedProg, setSelectedProg] = useState("All"); // B.Tech / M.Tech / MBA / MCA
  const [selectedSem, setSelectedSem] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");

  // State for Editing/Adding
  const [editSyllabusId, setEditSyllabusId] = useState<number | null>(null);
  const [sLevel, setSLevel] = useState<"UG" | "PG">("UG");
  const [sProgramName, setSProgramName] = useState<"B.Tech" | "M.Tech" | "MBA" | "MCA">("B.Tech");
  const [sBranch, setSBranch] = useState("");
  const [sRegulation, setSRegulation] = useState("R23");
  const [sAcademicYear, setSAcademicYear] = useState("2025-2026");
  const [sSemester, setSSemester] = useState("Semester 1");
  const [sSubjectName, setSSubjectName] = useState("");
  const [sPdfUrl, setSPdfUrl] = useState("");

  const { data: syllabusData = [], isLoading } = useQuery({
    queryKey: ["academics-syllabus"],
    queryFn: getAcademicsSyllabusList,
  });

  // Dynamic branch options collected from active syllabus records
  const branchOptions = useMemo(() => {
    const branches = syllabusData.map((item: any) => item.branch).filter(Boolean);
    return ["All", ...Array.from(new Set(branches))];
  }, [syllabusData]);

  // Mutations
  const saveSyllabusMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsSyllabus({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-syllabus"] });
      setEditSyllabusId(null);
      toast.success("Syllabus record saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteSyllabusMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsSyllabus({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-syllabus"] });
      toast.success("Syllabus record deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const startEditSyllabus = (item: any) => {
    setEditSyllabusId(item.id);
    setSLevel(item.level as any);
    setSProgramName(item.program_name as any);
    setSBranch(item.branch || "");
    setSRegulation(item.regulation || "R23");
    setSAcademicYear(item.academic_year || "2025-2026");
    setSSemester(item.semester || "Semester 1");
    setSSubjectName(item.subject_name || "");
    setSPdfUrl(item.pdf_url || "");
  };

  const startAddSyllabus = () => {
    setEditSyllabusId(-1);
    setSLevel(selectedCat === "All" ? "UG" : selectedCat as any);
    setSProgramName(selectedProg === "All" ? "B.Tech" : selectedProg as any);
    setSBranch("");
    setSRegulation(selectedReg === "All" ? "R23" : selectedReg);
    setSAcademicYear("2025-2026");
    setSSemester(selectedSem === "All" ? "Semester 1" : selectedSem);
    setSSubjectName("");
    setSPdfUrl("");
  };

  const filteredData = useMemo(() => {
    return syllabusData.filter((item) => {
      const matchesSearch = 
        item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.regulation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReg = selectedReg === "All" || item.regulation === selectedReg;
      const matchesCat = selectedCat === "All" || item.level === selectedCat;
      const matchesProg = selectedProg === "All" || item.program_name === selectedProg;
      const matchesSem = selectedSem === "All" || item.semester === selectedSem;
      const matchesBranch = selectedBranch === "All" || item.branch === selectedBranch;

      return matchesSearch && matchesReg && matchesCat && matchesProg && matchesSem && matchesBranch;
    });
  }, [syllabusData, searchTerm, selectedReg, selectedCat, selectedProg, selectedSem, selectedBranch]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedReg("R23");
    setSelectedCat("All");
    setSelectedProg("All");
    setSelectedSem("All");
    setSelectedBranch("All");
  };

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Course Syllabus"
        subtitle="Access structured, branch-wise syllabus records for all JNTU-GV academic regulations and semesters."
        image={campusImg}
      />
      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-6">

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900 shadow-lg backdrop-blur-md">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Manage and update structured semester-wise class syllabus and core courses.
          </p>
          <button 
            onClick={startAddSyllabus}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-900/20"
          >
            <Plus size={14} /> Add Syllabus Entry
          </button>
        </GlassCard>
      )}

      {/* Main Editing Syllabus Form */}
      {isEditMode && editSyllabusId !== null && (
        <GlassCard className="p-6 border-2 border-amber-300 space-y-4 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
            {editSyllabusId === -1 ? "Add Syllabus Record" : "Edit Syllabus Record"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Level</label>
              <select 
                value={sLevel} 
                onChange={(e) => setSLevel(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="UG">UG Program</option>
                <option value="PG">PG Program</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Program Name</label>
              <select 
                value={sProgramName} 
                onChange={(e) => setSProgramName(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Branch</label>
              <input 
                type="text" 
                placeholder="e.g. CSE, ECE"
                value={sBranch} 
                onChange={(e) => setSBranch(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Regulation</label>
              <input 
                type="text" 
                placeholder="e.g. R23, R20"
                value={sRegulation} 
                onChange={(e) => setSRegulation(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Academic Year</label>
              <input 
                type="text" 
                placeholder="e.g. 2025-2026"
                value={sAcademicYear} 
                onChange={(e) => setSAcademicYear(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Semester</label>
              <select 
                value={sSemester} 
                onChange={(e) => setSSemester(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i} value={`Semester ${i+1}`}>Semester {i+1}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1">Syllabus PDF URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={sPdfUrl} 
                onChange={(e) => setSPdfUrl(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-slate-500 block mb-1">Subject Name</label>
              <input 
                type="text" 
                value={sSubjectName} 
                placeholder="e.g. Advanced Data Structures"
                onChange={(e) => setSSubjectName(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setEditSyllabusId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveSyllabusMutation.mutate({
                id: editSyllabusId === -1 ? undefined : editSyllabusId,
                level: sLevel,
                program_name: sProgramName,
                branch: sBranch,
                regulation: sRegulation,
                academic_year: sAcademicYear,
                semester: sSemester,
                subject_name: sSubjectName,
                pdf_url: sPdfUrl
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </GlassCard>
      )}

      {/* Filter Toolbox */}
      <GlassCard className="p-6 space-y-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-blue-600 flex items-center gap-2">
          <span>Filter Controls</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search syllabus..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none placeholder:text-slate-400 font-sans"
            />
          </div>


          {/* Category (UG / PG) */}
          <select 
            value={selectedCat} 
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="All">All Categories (UG/PG)</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
          </select>

          {/* Program (B.Tech / M.Tech / MBA / MCA) */}
          <select 
            value={selectedProg} 
            onChange={(e) => setSelectedProg(e.target.value)}
            className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="All">All Programs</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
          </select>

          {/* Branch Filter */}
          <select 
            value={selectedBranch} 
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="All">All Branches</option>
            {branchOptions.filter(b => b !== "All").map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          {/* Semester */}
          <select 
            value={selectedSem} 
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="All">All Semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
            <option value="Semester 7">Semester 7</option>
            <option value="Semester 8">Semester 8</option>
          </select>
        </div>

        <div className="flex justify-end pt-2 font-sans">
          <button 
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 hover:bg-blue-100 transition-all duration-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </GlassCard>

      {/* Structured Table Layout */}
      <GlassCard className="p-6 overflow-hidden">
        {/* Regulation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto no-scrollbar">
          {[
            { label: "R25(PG)", value: "R25" },
            { label: "R23", value: "R23" },
            { label: "R20", value: "R20" },
            { label: "R19", value: "R19" },
            { label: "R16", value: "R16" },
            { label: "R13", value: "R13" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedReg(tab.value)}
              className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors relative ${
                selectedReg === tab.value 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
              {selectedReg === tab.value && (
                <motion.div 
                  layoutId="activeRegTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                />
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500 font-medium">
              Loading syllabus records from the database...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4">Program</th>
                  <th className="py-4 px-4">Branch</th>
                  <th className="py-4 px-4">Academic Year</th>
                  <th className="py-4 px-4">Semester</th>
                  <th className="py-4 px-4">Subject Name</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 group"
                      >
                        <td className="py-4 px-4 text-xs font-semibold text-slate-650 dark:text-slate-400">
                          <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold text-slate-500">
                            {item.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">{item.program_name}</td>
                        <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                            {item.branch}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium">{item.academic_year}</td>
                        <td className="py-4 px-4 text-xs text-slate-650 dark:text-slate-400 font-semibold">{item.semester}</td>
                        <td className="py-4 px-4 text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.subject_name}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2 relative z-20">
                            {item.pdf_url ? (
                              <>
                                <button 
                                  onClick={() => window.open(getAssetUrl(item.pdf_url), "_blank")}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                  title="View Syllabus Online"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => window.open(getAssetUrl(item.pdf_url), "_blank")}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                  title="Download Syllabus PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No File</span>
                            )}

                            {/* Admin Controls */}
                            {isEditMode && (
                              <>
                                <button 
                                  onClick={() => startEditSyllabus(item)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                                  title="Edit Entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => { if(confirm("Delete this syllabus record?")) deleteSyllabusMutation.mutate(item.id); }}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-slate-500 font-medium">
                        No syllabus records matching your active filters.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
        </div>
      </div>
    </div>
  );
}
