import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicCoursesOffered,
  upsertAcademicCourseOffered,
  deleteAcademicCourseOffered
} from "@/lib/academics";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { PageHeader } from "@/components/academics/ui/PageHeader";
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Search,
  ChevronDown,
  Filter,
  Check,
  Plus,
  Trash2,
  Edit2,
  Save
} from "lucide-react";

export const Route = createFileRoute("/academics/programs")({
  component: ProgramsOfferedPage,
});

// Dropdown hierarchy options structure
interface FilterOption {
  key: string;
  label: string;
  type: "all" | "category" | "program";
  parent?: string;
  value?: { type: string; subtype?: string };
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "all", label: "All Programs", type: "all" },
  // Undergraduate
  { key: "ug", label: "(1) Undergraduate (UG)", type: "category" },
  {
    key: "ug-btech",
    label: "1. B.Tech (Bachelor of Technology)",
    type: "program",
    parent: "ug",
    value: { type: "UG", subtype: "B.Tech" },
  },
  {
    key: "ug-bpharm",
    label: "2. B.Pharm (Bachelor of Pharmacy)",
    type: "program",
    parent: "ug",
    value: { type: "UG", subtype: "B.Pharm" },
  },
  // Postgraduate
  { key: "pg", label: "(2) Postgraduate (PG)", type: "category" },
  {
    key: "pg-mtech",
    label: "1. M.Tech (Master of Technology)",
    type: "program",
    parent: "pg",
    value: { type: "PG", subtype: "M.Tech" },
  },
  {
    key: "pg-mba",
    label: "2. MBA (Master of Business Administration)",
    type: "program",
    parent: "pg",
    value: { type: "PG", subtype: "MBA" },
  },
  {
    key: "pg-mca",
    label: "3. MCA (Master of Computer Applications)",
    type: "program",
    parent: "pg",
    value: { type: "PG", subtype: "MCA" },
  },
  // Research
  { key: "phd", label: "(3) Ph.D (Doctor of Philosophy)", type: "category" },
  {
    key: "phd-research",
    label: "1. Ph.D Programs",
    type: "program",
    parent: "phd",
    value: { type: "PhD", subtype: "PhD" },
  },
];

function ProgramsOfferedPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    FILTER_OPTIONS[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  // States for Editing
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [cName, setCName] = useState("");
  const [cDuration, setCDuration] = useState("4 Years");
  const [cYearStarted, setCYearStarted] = useState(2026);
  const [cIntake, setCIntake] = useState(60);
  const [cType, setCType] = useState("UG");
  const [cSubtype, setCSubtype] = useState("B.Tech");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["academic-courses-offered"],
    queryFn: getAcademicCoursesOffered,
  });

  // Mutations
  const saveCourseMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicCourseOffered({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-courses-offered"] });
      setEditCourseId(null);
      toast.success("Course details saved successfully!");
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicCourseOffered({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-courses-offered"] });
      toast.success("Course record deleted successfully!");
    }
  });

  const startEditCourse = (item: any) => {
    setEditCourseId(item.id);
    setCName(item.program_name);
    setCDuration(item.duration);
    setCYearStarted(item.year_started);
    setCIntake(item.intake);
    setCType(item.program_type);
    setCSubtype(item.program_subtype);
  };

  const startAddCourse = () => {
    setEditCourseId(-1);
    setCName("");
    setCDuration("4 Years");
    setCYearStarted(2026);
    setCIntake(60);
    setCType("UG");
    setCSubtype("B.Tech");
  };

  // Filtered courses selector
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Search matching
      const matchesSearch = c.program_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category matching
      if (selectedOption.type === "all") return true;

      if (selectedOption.type === "category") {
        if (selectedOption.key === "ug") return c.program_type === "UG";
        if (selectedOption.key === "pg") return c.program_type === "PG";
        if (selectedOption.key === "phd") return c.program_type === "PhD";
      }

      if (selectedOption.type === "program" && selectedOption.value) {
        return (
          c.program_type === selectedOption.value.type &&
          c.program_subtype === selectedOption.value.subtype
        );
      }

      return true;
    });
  }, [courses, selectedOption, searchQuery]);

  // Aggregate stats based on query
  const stats = useMemo(() => {
    const totalIntake = filteredCourses.reduce((sum, c) => sum + c.intake, 0);
    const ugCount = filteredCourses.filter((c) => c.program_type === "UG").length;
    const pgCount = filteredCourses.filter((c) => c.program_type === "PG").length;
    const phdCount = filteredCourses.filter((c) => c.program_type === "PhD").length;

    return {
      totalIntake,
      ugCount,
      pgCount,
      phdCount,
      totalPrograms: filteredCourses.length,
    };
  }, [filteredCourses]);

  const selectOption = (opt: FilterOption) => {
    setSelectedOption(opt);
    setIsOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Courses Offered" 
        subtitle="Discover academic excellence through our rigorously structured JNTU-GV curriculum. Explore B.Tech, B.Pharm, M.Tech, MBA, MCA, and research programs."
        icon={GraduationCap}
      />

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Update active academic courses, adjust durations, start years, or student intake records.
          </p>
          <button 
            onClick={startAddCourse}
            className="flex items-center gap-1 bg-[#A02021] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-800 transition-all shadow-md shadow-red-900/20"
          >
            <Plus size={14} /> Add Program Offering
          </button>
        </GlassCard>
      )}

      {/* Main Editing Course Form */}
      {isEditMode && editCourseId !== null && (
        <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
            {editCourseId === -1 ? "Add Academic Course Offering" : "Edit Academic Course Offering"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Program Type</label>
              <select 
                value={cType} 
                onChange={(e) => setCType(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="PhD">Doctoral (PhD)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Subtype / Category</label>
              <select 
                value={cSubtype} 
                onChange={(e) => setCSubtype(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 cursor-pointer" 
              >
                <option value="B.Tech">B.Tech</option>
                <option value="B.Pharm">B.Pharm</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
                <option value="PhD">PhD Program</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Course Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 4 Years, 2 Years"
                value={cDuration} 
                onChange={(e) => setCDuration(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Year of Starting</label>
              <input 
                type="number" 
                value={cYearStarted} 
                onChange={(e) => setCYearStarted(parseInt(e.target.value) || 2026)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Annual Student Intake Capacity</label>
              <input 
                type="number" 
                value={cIntake} 
                onChange={(e) => setCIntake(parseInt(e.target.value) || 60)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-bold text-slate-500 block mb-1">Course / Program Full Title</label>
              <input 
                type="text" 
                placeholder="e.g. B.Tech in CSE (Artificial Intelligence)"
                value={cName} 
                onChange={(e) => setCName(e.target.value)} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 font-sans">
            <button 
              onClick={() => setEditCourseId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => saveCourseMutation.mutate({
                id: editCourseId === -1 ? undefined : editCourseId,
                program_name: cName,
                duration: cDuration,
                year_started: cYearStarted,
                intake: cIntake,
                program_type: cType,
                program_subtype: cSubtype
              })}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Course Offering
            </button>
          </div>
        </GlassCard>
      )}

      {/* Quick Metrics Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Programs
            </p>
            <p className="text-xl font-bold text-slate-950 dark:text-white mt-0.5">
              {stats.totalPrograms}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Annual Intake
            </p>
            <p className="text-xl font-bold text-slate-955 dark:text-white mt-0.5">
              {stats.totalIntake} Seats
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              UG Programs
            </p>
            <p className="text-xl font-bold text-slate-955 dark:text-white mt-0.5">
              {stats.ugCount} courses
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              PG & PhD
            </p>
            <p className="text-xl font-bold text-slate-955 dark:text-white mt-0.5">
              {stats.pgCount + stats.phdCount} courses
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Search Bar Section */}
      <GlassCard className="p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Hierarchical Filter Dropdown */}
        <div className="relative flex-1 md:max-w-md">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Program Category
          </label>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-100 border border-slate-200 hover:border-blue-400 rounded-xl text-sm font-semibold text-slate-800 transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-400"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" />
              {selectedOption.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 z-50 max-h-[380px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl dark:bg-[#0F172A] dark:border-slate-800 backdrop-blur-md"
                >
                  <div className="p-2 space-y-1">
                    {FILTER_OPTIONS.map((opt) => {
                      if (opt.type === "all") {
                        return (
                          <button
                            key={opt.key}
                            onClick={() => selectOption(opt)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                              selectedOption.key === opt.key
                                ? "bg-blue-600 text-white"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {selectedOption.key === opt.key && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        );
                      }

                      if (opt.type === "category") {
                        return (
                          <button
                            key={opt.key}
                            onClick={() => selectOption(opt)}
                            className={`w-full flex items-center justify-between px-4 py-2 mt-2 rounded-xl text-left text-sm font-bold tracking-wide transition-all ${
                              selectedOption.key === opt.key
                                ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                : "text-blue-600/85 hover:bg-blue-50/50 dark:text-blue-400/85 dark:hover:bg-blue-950/20"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {selectedOption.key === opt.key && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        );
                      }

                      // Sub-hierarchy program
                      return (
                        <button
                          key={opt.key}
                          onClick={() => selectOption(opt)}
                          className={`w-full flex items-center justify-between pl-8 pr-4 py-2 rounded-xl text-left text-xs font-medium transition-all ${
                            selectedOption.key === opt.key
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                              : "text-slate-650 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedOption.key === opt.key && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Search Field */}
        <div className="flex-1 md:max-w-md">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Search Course Name
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch (e.g. CSE, VLSI, MBA)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm font-medium text-slate-800 outline-none transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </GlassCard>

      {/* Main Table Panel */}
      <GlassCard className="overflow-hidden shadow-xl border-slate-200/50 dark:border-slate-800/80">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider">
                Hydrating curriculum matrix...
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Programs Found
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Try selecting a different program category or refining your search query keyword.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/80">
                  <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest w-16 text-center">
                    S.No
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                    Program Name
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center w-28">
                    Duration
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center w-36">
                    Year of Starting
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center w-36">
                    Intake Capacity
                  </th>
                  {isEditMode && (
                    <th className="px-6 py-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center w-24">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                <AnimatePresence>
                  {filteredCourses.map((course, index) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="hover:bg-slate-50/50 transition-colors group dark:hover:bg-slate-900/25"
                    >
                      {/* Serial Number */}
                      <td className="px-6 py-4 text-center font-bold text-slate-400 dark:text-slate-650 text-xs">
                        {index + 1}
                      </td>

                      {/* Program Name */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.program_name}
                          </span>
                          <span className="inline-flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
                              {course.program_type}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              · {course.program_subtype}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                      </td>

                      {/* Starting Year */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {course.year_started}
                        </span>
                      </td>

                      {/* Intake */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800 whitespace-nowrap">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {course.intake} Seats
                        </span>
                      </td>

                      {/* Actions */}
                      {isEditMode && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => startEditCourse(course)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                              title="Edit Program Details"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => { if (confirm("Delete this program offering?")) deleteCourseMutation.mutate(course.id); }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors"
                              title="Delete Program"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
