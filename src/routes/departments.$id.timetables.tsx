import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { getTimetables, upsertTimetable, deleteTimetable } from "@/funcs/timetables.server";
import { useAdmin } from "@/context/AdminContext";
import { AdminUpload } from "@/components/AdminEditPanel";
import { SafeImage } from "@/components/SafeImage";
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Plus, Trash2, Save, Calendar, X, Eye, Download, FileText, 
  Search, Filter, Grid3x3, List, ChevronDown, ChevronUp 
} from "lucide-react";

export const Route = createFileRoute("/departments/$id/timetables")({
  component: TimetablesPage,
});

// Type for database response
type TimetableFromDB = {
  id: number;
  dept_id: string;
  level: string;
  program_name: string;
  year: string;
  semester: string;
  section: string | null;
  academic_year: string;
  title: string;
  image_url: string;
  sort_order: number | null;
  created_at: Date | null;
  updated_at: Date | null;
};

// Type for form data
type TimetableFormData = {
  id?: number;
  dept_id: string;
  level: "UG" | "PG";
  program_name: string;
  year: string;
  semester: string;
  section?: string | null;
  academic_year: string;
  title: string;
  image_url: string;
  sort_order?: number;
};

function TimetablesPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { id: routeSlug } = useParams({ from: "/departments/$id/timetables" });
  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(routeSlug || "");
  const queryClient = useQueryClient();

  const { data: timetables = [] } = useQuery({
    queryKey: ["timetables", data.id],
    queryFn: () => getTimetables({ data: { deptId: data.id } }),
    enabled: Boolean(data?.id),
  });

  // Filter states
  const [activeLevel, setActiveLevel] = useState<"UG" | "PG">("UG");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Editor states
  const [editing, setEditing] = useState<TimetableFormData | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Get unique years and semesters for filters
  const availableYears = useMemo(() => {
    const years = new Set(timetables.map(t => t.year));
    return Array.from(years).sort();
  }, [timetables]);

  const availableSemesters = useMemo(() => {
    const semesters = new Set(timetables.map(t => t.semester));
    return Array.from(semesters).sort();
  }, [timetables]);

  // Filter timetables
  const filtered = useMemo(() => {
    let result = timetables.filter((t: TimetableFromDB) => t.level === activeLevel);
    
    if (selectedYear !== "all") {
      result = result.filter(t => t.year === selectedYear);
    }
    if (selectedSemester !== "all") {
      result = result.filter(t => t.semester === selectedSemester);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.program_name.toLowerCase().includes(query) ||
        t.academic_year.includes(query)
      );
    }
    return result;
  }, [timetables, activeLevel, selectedYear, selectedSemester, searchQuery]);

  const saveMutation = useMutation({
    mutationFn: (payload: TimetableFormData) => upsertTimetable({ data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables", data.id] });
      toast.success("Timetable saved");
      setEditing(null);
    },
    onError: () => toast.error("Failed to save timetable"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTimetable({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables", data.id] });
      toast.success("Deleted");
    },
  });

  const startNew = () => {
    setEditing({
      dept_id: data.id,
      level: activeLevel,
      program_name: activeLevel === "UG" ? "B.Tech" : "M.Tech",
      year: "I",
      semester: "I",
      section: "",
      academic_year: "",
      title: "",
      image_url: "",
    });
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedSemester("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="text-blue-700 h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Timetables</h2>
              <p className="text-sm text-gray-500 mt-0.5">Academic timetables for {data.name}</p>
            </div>
          </div>
          {isEditMode && (
            <button
              onClick={startNew}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus size={18} /> Add Timetable
            </button>
          )}
        </div>

        {/* Level Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-6 inline-flex">
          {(["UG", "PG"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                activeLevel === lvl
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {lvl === "UG" ? "Undergraduate" : "Postgraduate"} ({timetables.filter(t => t.level === lvl).length})
            </button>
          ))}
        </div>

        {/* Editor Form */}
        {isEditMode && editing && (
          <div className="mb-8 bg-white rounded-2xl shadow-md border border-blue-100 p-6 space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                  {editing.id ? "Edit Timetable" : "New Timetable"}
                </span>
              </div>
              <button 
                onClick={() => setEditing(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Level
                </label>
                <select
                  value={editing.level}
                  onChange={(e) => setEditing({ ...editing, level: e.target.value as "UG" | "PG" })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                >
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Program
                </label>
                <input
                  placeholder="B.Tech / M.Tech"
                  value={editing.program_name}
                  onChange={(e) => setEditing({ ...editing, program_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Year
                </label>
                <input
                  placeholder="I / II / III / IV"
                  value={editing.year}
                  onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Semester
                </label>
                <input
                  placeholder="I / II"
                  value={editing.semester}
                  onChange={(e) => setEditing({ ...editing, semester: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Section (Optional)
                </label>
                <input
                  placeholder="A / B / C"
                  value={editing.section ?? ""}
                  onChange={(e) => setEditing({ ...editing, section: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Academic Year
                </label>
                <input
                  placeholder="2020-21"
                  value={editing.academic_year}
                  onChange={(e) => setEditing({ ...editing, academic_year: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                  Display Title
                </label>
                <input
                  placeholder="II B.Tech II Sem Timetable"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                Timetable Image
              </label>
              <AdminUpload
                value={editing.image_url}
                onChange={(url: string) => setEditing({ ...editing, image_url: url })}
                module="departments"
                category="timetables"
                dept={routeSlug || data.slug || data.id}
                name={`${editing.year || ""}-${editing.semester || ""}-${editing.title || "timetable"}`}
                placeholder="Upload timetable photo or PDF"
              />
            </div>

            <button
              onClick={() => saveMutation.mutate(editing)}
              disabled={!editing.image_url || !editing.title}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} /> Save Timetable
            </button>
          </div>
        )}

        {/* Filters and View Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search timetables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="all">All Semesters</option>
                {availableSemesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedYear !== "all" || selectedSemester !== "all" || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Grid view"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list" ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:text-gray-600"
                }`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-500">
            Showing {filtered.length} of {timetables.filter(t => t.level === activeLevel).length} timetables
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                No timetables found matching your filters.
              </p>
              {isEditMode && (
                <button
                  onClick={startNew}
                  className="mt-3 text-blue-700 text-sm font-semibold hover:text-blue-800 transition"
                >
                  + Add your first timetable
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((tt: TimetableFromDB) => (
                <div 
                  key={tt.id} 
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <button
                      onClick={() => setLightbox(tt.image_url)}
                      className="w-full h-full block"
                    >
                      <SafeImage
                        src={tt.image_url}
                        alt={tt.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(tt.image_url);
                        }}
                        className="p-2.5 bg-white/90 hover:bg-white rounded-xl text-gray-700 hover:text-blue-700 transition shadow-lg"
                        title="View full size"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(tt.image_url, tt.title);
                        }}
                        className="p-2.5 bg-white/90 hover:bg-white rounded-xl text-gray-700 hover:text-blue-700 transition shadow-lg"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        tt.level === 'UG' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {tt.level}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {tt.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{tt.program_name}</span>
                      <span>·</span>
                      <span>Year {tt.year}</span>
                      <span>·</span>
                      <span>Sem {tt.semester}</span>
                      {tt.section && (
                        <>
                          <span>·</span>
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                            Section {tt.section}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      {tt.academic_year}
                    </div>

                    {/* Admin Actions */}
                    {isEditMode && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                        <button
                          onClick={() => {
                            const formData: TimetableFormData = {
                              id: tt.id,
                              dept_id: tt.dept_id,
                              level: tt.level as "UG" | "PG",
                              program_name: tt.program_name,
                              year: tt.year,
                              semester: tt.semester,
                              section: tt.section,
                              academic_year: tt.academic_year,
                              title: tt.title,
                              image_url: tt.image_url,
                              sort_order: tt.sort_order ?? undefined,
                            };
                            setEditing(formData);
                          }}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => tt.id && deleteMutation.mutate(tt.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-300" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No timetables found matching your filters.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timetable</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Week</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((tt: TimetableFromDB) => {
                    const isExpanded = expandedItems.has(tt.id);
                    return (
                      <>
                        <tr 
                          key={tt.id} 
                          className="hover:bg-gray-50/50 transition cursor-pointer"
                          onClick={() => toggleExpand(tt.id)}
                        >
<td className="px-6 py-3">
  <div className="flex items-center gap-3">
    <div className="p-1.5 bg-gray-100 rounded-lg flex-shrink-0">
      <Calendar className="w-4 h-4 text-gray-500" />
    </div>
    <div>
      <div className="text-sm font-medium text-gray-900">{tt.title}</div>
      <div className="text-xs text-gray-400">
        Sem {tt.semester} · Year {tt.year} · {tt.academic_year}
        {tt.section && ` · Section ${tt.section}`}
      </div>
    </div>
  </div>
</td>
                          <td className="px-6 py-3">
                            <span className="text-sm text-gray-600">{tt.program_name}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-sm text-gray-600">
                              {tt.level === 'UG' ? 'B.Tech' : 'M.Tech'} Year {tt.year}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center gap-1">
                              <span className="text-sm text-gray-600">Sem {tt.semester}</span>
                              {tt.section && (
                                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-medium">
                                  Sec {tt.section}
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase ${
                              tt.level === 'UG' 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-purple-50 text-purple-700'
                            }`}>
                              {tt.level}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(tt.image_url);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(tt.image_url, tt.title);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                              {isEditMode && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const formData: TimetableFormData = {
                                        id: tt.id,
                                        dept_id: tt.dept_id,
                                        level: tt.level as "UG" | "PG",
                                        program_name: tt.program_name,
                                        year: tt.year,
                                        semester: tt.semester,
                                        section: tt.section,
                                        academic_year: tt.academic_year,
                                        title: tt.title,
                                        image_url: tt.image_url,
                                        sort_order: tt.sort_order ?? undefined,
                                      };
                                      setEditing(formData);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit"
                                  >
                                    <FileText size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (tt.id) deleteMutation.mutate(tt.id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                              <button 
                                className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(tt.id);
                                }}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="px-6 pb-4 bg-gray-50/30">
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleView(tt.image_url);
                                      }}
                                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                    >
                                      View Full Size
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(tt.image_url, tt.title);
                                      }}
                                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                    >
                                      Download
                                    </button>
                                  </div>
                                </div>
                                <img 
                                  src={tt.image_url} 
                                  alt={tt.title}
                                  className="max-h-80 mx-auto object-contain rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/e2e8f0/64748b?text=Timetable+Preview';
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img 
              src={lightbox} 
              alt="Timetable preview"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x1000/e2e8f0/64748b?text=Image+Not+Found';
              }}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const title = timetables.find(t => t.image_url === lightbox)?.title || 'timetable';
                  handleDownload(lightbox, title);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(lightbox);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition"
              >
                <Eye size={16} /> View Full Size
              </button>
            </div>
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              onClick={() => setLightbox(null)}
            >
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}