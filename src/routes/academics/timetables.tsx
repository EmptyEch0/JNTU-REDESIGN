import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { 
  CalendarRange, 
  Download, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  ChevronRight, 
  Home, 
  FileSpreadsheet,
  GraduationCap,
  Clock,
  BookOpen,
  User,
  SlidersHorizontal,
  Layers,
  X,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsTimetablesList,
  upsertAcademicsTimetable,
  deleteAcademicsTimetable
} from "@/lib/academics";
import { getAssetUrl, imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/timetables")({
  head: () => ({
    meta: [
      { title: "Academic Class Timetables — JNTU-GV CEV" },
      {
        name: "description",
        content: "Access regular weekly class timetables, examination schedules, and circulars for all UG & PG courses at JNTUGV.",
      },
    ],
  }),
  component: TimetablesPage,
});

// Helper for deterministic upload date
const getTimetableMeta = (id: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (id * 4 + 9) % 28 + 1;
  const month = months[(id * 3 + 4) % 12];
  const year = 2026;
  return `${month} ${day}, ${year}`;
};

function TimetablesPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  // Animated Tabs: UG | PG | Exams | Circulars
  const [activeTab, setActiveTab] = useState<"UG" | "PG" | "Exams" | "Circulars">("UG");
  
  // Dashboard Filters
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  // State for Editing
  const [editTimetableId, setEditTimetableId] = useState<number | null>(null);
  const [tLevel, setTLevel] = useState<"UG" | "PG">("UG");
  const [tProgramName, setTProgramName] = useState<"B.Tech" | "M.Tech" | "MBA" | "MCA">("B.Tech");
  const [tRegulation, setTRegulation] = useState("R23");
  const [tAcademicYear, setTAcademicYear] = useState("2025-2026");
  const [tBranch, setTBranch] = useState("");
  const [tSemester, setTSemester] = useState("Semester 1");
  const [tSubjectName, setTSubjectName] = useState("");
  const [tPdfUrl, setTPdfUrl] = useState("");

  const { data: timetables = [], isLoading } = useQuery({
    queryKey: ["academics-timetables"],
    queryFn: getAcademicsTimetablesList,
  });

  // Mutations
  const saveTimetableMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsTimetable({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-timetables"] });
      setEditTimetableId(null);
      toast.success("Timetable schedule saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save: " + err.message);
    }
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsTimetable({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-timetables"] });
      toast.success("Timetable schedule deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete: " + err.message);
    }
  });

  const startEditTimetable = (item: any) => {
    setEditTimetableId(item.id);
    setTLevel(item.level as any);
    setTProgramName(item.program_name as any);
    setTRegulation(item.regulation || "R23");
    setTAcademicYear(item.academic_year || "2025-2026");
    setTBranch(item.branch || "");
    setTSemester(item.semester || "Semester 1");
    setTSubjectName(item.subject_name);
    setTPdfUrl(item.pdf_url || "");
  };

  const startAddTimetable = () => {
    setEditTimetableId(-1);
    setTLevel(activeTab === "PG" ? "PG" : "UG");
    setTProgramName(activeTab === "PG" ? "M.Tech" : "B.Tech");
    setTRegulation("R23");
    setTAcademicYear("2025-2026");
    setTBranch("");
    setTSemester("Semester 1");
    setTSubjectName("");
    setTPdfUrl("");
  };

  // Determine Departments (Branches) dynamically from db records
  const uniqueDepts = useMemo(() => {
    const depts = new Set<string>();
    timetables.forEach((t) => {
      if (t.branch) depts.add(t.branch.trim().toUpperCase());
    });
    return Array.from(depts).sort();
  }, [timetables]);

  // Filter timetables based on search, activeTab, and dropdown dashboards
  const filteredTimetables = useMemo(() => {
    return timetables.filter((item) => {
      // 1. Tab filtering
      const isExam = item.subject_name.toLowerCase().includes("exam") || 
                     item.subject_name.toLowerCase().includes("mid-sem") || 
                     item.subject_name.toLowerCase().includes("end-sem") ||
                     item.subject_name.toLowerCase().includes("test");
                     
      const isCircular = item.subject_name.toLowerCase().includes("circular") || 
                         item.subject_name.toLowerCase().includes("notice") || 
                         item.subject_name.toLowerCase().includes("schedule");

      if (activeTab === "Exams") {
        if (!isExam) return false;
      } else if (activeTab === "Circulars") {
        if (!isCircular && !item.subject_name.toLowerCase().includes("calendar")) return false;
      } else {
        // UG or PG regular timetables (exclude circulars/exams if possible or keep them inside activeTab)
        if (item.level !== activeTab) return false;
        if (isExam || isCircular) return false;
      }

      // 2. Search keyword
      const matchesSearch = 
        item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.branch && item.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.regulation && item.regulation.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // 3. Department filter
      if (selectedDept !== "All" && item.branch.toUpperCase() !== selectedDept.toUpperCase()) {
        return false;
      }

      // 4. Semester filter
      if (selectedSemester !== "All" && item.semester !== selectedSemester) {
        return false;
      }

      // 5. Section filter (extracted from subject name or mocked)
      if (selectedSection !== "All") {
        const matchesSec = item.subject_name.toLowerCase().includes(`section ${selectedSection.toLowerCase()}`) || 
                            item.subject_name.toLowerCase().includes(`sec-${selectedSection.toLowerCase()}`) ||
                            item.subject_name.toLowerCase().includes(`sec ${selectedSection.toLowerCase()}`);
        if (!matchesSec) return false;
      }

      // 6. Year filter (I, II, III, IV Year - extracted from subject_name or academic_year)
      if (selectedYear !== "All") {
        const matchesYr = item.subject_name.toLowerCase().includes(selectedYear.toLowerCase()) ||
                          item.subject_name.toLowerCase().includes(`${selectedYear.split(" ")[0].toLowerCase()} year`) ||
                          item.semester.toLowerCase().includes(selectedYear.toLowerCase());
        if (!matchesYr) return false;
      }

      return true;
    });
  }, [timetables, activeTab, searchTerm, selectedDept, selectedSemester, selectedYear, selectedSection]);
  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Academic Time Tables"
        subtitle="View, preview, and download the latest class-wise, semester-wise, and branch-wise timetables, examination schedules, and academic calendars."
        image={campusImg}
      />
      
      <SubNav items={ACADEMICS_SUBNAV} />

      <div className="container-narrow space-y-6">

        {/* Admin Mode Controls */}
        {isEditMode && (
          <GlassCard className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-slate-800 backdrop-blur-md shadow-sm" hoverEffect={false}>
            <div className="space-y-0.5">
              <p className="text-amber-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Admin Control Desk
              </p>
              <p className="text-slate-600 text-[11px] font-medium">
                Add, edit, or delete batch schedules, weekly calendars, and exam timetables in real-time.
              </p>
            </div>
            <button 
              onClick={startAddTimetable}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Timetable Schedule
            </button>
          </GlassCard>
        )}

        {/* Main Editing Timetable Form */}
        <AnimatePresence>
          {isEditMode && editTimetableId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-6 border border-amber-400 bg-white/95 backdrop-blur-xl shadow-lg space-y-4" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-655 flex items-center gap-1.5 text-amber-700 font-extrabold">
                    <Edit2 className="w-3.5 h-3.5" />
                    {editTimetableId === -1 ? "Add Timetable Record" : "Edit Timetable Record"}
                  </h3>
                  <button 
                    onClick={() => setEditTimetableId(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-850">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Level Category</label>
                    <select 
                      value={tLevel} 
                      onChange={(e) => setTLevel(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    >
                      <option value="UG">UG Program</option>
                      <option value="PG">PG Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Specific Program</label>
                    <select 
                      value={tProgramName} 
                      onChange={(e) => setTProgramName(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Regulation Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. R23, R20"
                      value={tRegulation} 
                      onChange={(e) => setTRegulation(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Academic Year</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2025-2026"
                      value={tAcademicYear} 
                      onChange={(e) => setTAcademicYear(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Branch / Department</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CSE, ECE, EEE"
                      value={tBranch} 
                      onChange={(e) => setTBranch(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Semester Cycle</label>
                    <select 
                      value={tSemester} 
                      onChange={(e) => setTSemester(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                        <option key={i} value={`Semester ${i+1}`}>Semester {i+1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Timetable File PDF URL</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={tPdfUrl} 
                      onChange={(e) => setTPdfUrl(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Timetable Title / Batch Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. B.Tech CSE III Year I Semester Sec-A Regular Timetable"
                      value={tSubjectName} 
                      onChange={(e) => setTSubjectName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setEditTimetableId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!tSubjectName.trim() || !tPdfUrl.trim() || !tBranch.trim()) {
                        toast.error("Please fill in Subject Title, Branch, and PDF URL.");
                        return;
                      }
                      saveTimetableMutation.mutate({
                        id: editTimetableId === -1 ? undefined : editTimetableId,
                        level: tLevel,
                        program_name: tProgramName,
                        regulation: tRegulation,
                        academic_year: tAcademicYear,
                        branch: tBranch,
                        semester: tSemester,
                        subject_name: tSubjectName,
                        pdf_url: tPdfUrl
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

        {/* Dashboard Filter Hub */}
        <GlassCard className="p-5 bg-white border border-slate-200/80 shadow-lg space-y-4" hoverEffect={false}>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Academic Filter Hub
            </h3>
            <button 
              onClick={() => {
                setSelectedDept("All");
                setSelectedSemester("All");
                setSelectedYear("All");
                setSelectedSection("All");
                setSearchTerm("");
              }}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-800">
            {/* Department Filter */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Department</label>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 cursor-pointer transition-all"
              >
                <option value="All">All Departments</option>
                {uniqueDepts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Academic Year / Class</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 cursor-pointer transition-all"
              >
                <option value="All">All Years</option>
                <option value="I Year">I Year (1st Year)</option>
                <option value="II Year">II Year (2nd Year)</option>
                <option value="III Year">III Year (3rd Year)</option>
                <option value="IV Year">IV Year (4th Year)</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Semester Cycle</label>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 cursor-pointer transition-all"
              >
                <option value="All">All Semesters</option>
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i} value={`Semester ${i+1}`}>Semester {i+1}</option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Batch Section</label>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 cursor-pointer transition-all"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Animated Tabs: UG | PG | Exams | Circulars */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl w-full md:w-auto overflow-x-auto shadow-sm">
            {(["UG", "PG", "Exams", "Circulars"] as const).map((tab) => {
              const isSelected = activeTab === tab;
              const displayLabel = {
                UG: "UG Class Timetables",
                PG: "PG Class Timetables",
                Exams: "Exam Schedules",
                Circulars: "Academic Circulars"
              }[tab];

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    // Reset minor filters that might overlap
                    setSelectedSemester("All");
                    setSelectedYear("All");
                    setSelectedSection("All");
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-500/10" 
                      : "text-slate-655 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  {tab === "UG" && <GraduationCap className="w-3.5 h-3.5" />}
                  {tab === "PG" && <BookOpen className="w-3.5 h-3.5" />}
                  {tab === "Exams" && <CalendarRange className="w-3.5 h-3.5" />}
                  {tab === "Circulars" && <FileText className="w-3.5 h-3.5" />}
                  {displayLabel}
                </button>
              );
            })}
          </div>

          {/* Search bar inside timetables */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search schedules/circulars..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-sans shadow-sm"
            />
          </div>
        </div>

        {/* Timetables Render Content Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <GlassCard key={idx} className="p-6 h-[200px] animate-pulse bg-white border-slate-200 flex flex-col justify-between" hoverEffect={false}>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/6" />
                  </div>
                  <div className="h-5 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-8 bg-slate-100 rounded w-1/4" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredTimetables.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTimetables.map((item, idx) => {
              const updatedDate = getTimetableMeta(item.id);
              
              // Find matching branch name or prefix
              const branchName = item.branch || "General";
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                >
                  <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 bg-white border border-slate-200/80 transition-all duration-300">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/3 rounded-full blur-2xl group-hover:bg-blue-500/5 transition-all duration-300 pointer-events-none" />
                    
                    <div className="space-y-4">
                      {/* Top badging */}
                      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/80">
                          {item.program_name} · {branchName}
                        </span>
                        
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                          {item.regulation}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h4 className="font-extrabold text-slate-800 text-xs md:text-sm leading-relaxed group-hover:text-blue-600 transition-colors line-clamp-3">
                        {item.subject_name}
                      </h4>

                      {/* Details specs */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] font-medium text-slate-655 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Academic Cycle</p>
                          <p className="font-bold text-slate-700">{item.semester}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Academic Year</p>
                          <p className="font-bold text-slate-700">{item.academic_year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex flex-col justify-start">
                        <span>Updated</span>
                        <span className="text-slate-600 font-bold mt-0.5">{updatedDate}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Admin Action desk */}
                        {isEditMode && (
                          <div className="flex items-center gap-1 relative z-20">
                            <button
                              onClick={() => startEditTimetable(item)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-colors"
                              title="Edit schedule"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if(confirm(`Confirm delete schedule for "${item.subject_name}"?`)) {
                                  deleteTimetableMutation.mutate(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors"
                              title="Delete schedule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button 
                          onClick={() => window.open(getAssetUrl(item.pdf_url), "_blank")}
                          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-3.5 py-2 text-[10px] font-black tracking-wider uppercase transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Download className="w-3.5 h-3.5" /> View PDF
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-12 text-center bg-white border border-slate-200/80 shadow-md flex flex-col items-center justify-center h-80">
            <CalendarRange className="w-16 h-16 text-blue-500/30 mb-4 stroke-[1.3]" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">No timetables found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any timetable or schedules matching your selected filters for active departments, semesters, sections, or search terms. Try resetting filters.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
