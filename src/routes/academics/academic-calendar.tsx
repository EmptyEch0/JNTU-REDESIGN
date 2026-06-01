import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/academics/ui/PageHeader";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import { Calendar as CalendarIcon, Search, Download, Filter, Clock, AlertCircle, Save, Plus, Trash2, Edit2, X, FileText, Palmtree, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  getAcademicsCalendar, 
  upsertAcademicsCalendarEvent, 
  deleteAcademicsCalendarEvent 
} from "@/lib/academics";

export const Route = createFileRoute("/academics/academic-calendar")({
  component: AcademicCalendarPage,
});

function AcademicCalendarPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"UG" | "PG" | "PhD">("UG");
  const [activeSection, setActiveSection] = useState<"All" | "Academic Schedule" | "Examinations" | "Holidays">("All");

  // State for Editing
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [eventCategory, setEventCategory] = useState<"UG" | "PG" | "PhD">("UG");
  const [eventProgramName, setEventProgramName] = useState("B.Tech");
  const [eventRegulation, setEventRegulation] = useState("R23");
  const [eventAcademicYear, setEventAcademicYear] = useState("2025-2026");
  const [eventCalendarType, setEventCalendarType] = useState<"Academic Schedule" | "Examinations" | "Holidays">("Academic Schedule");
  const [eventPdfUrl, setEventPdfUrl] = useState("");

  const { data: calendarEvents = [], isLoading } = useQuery({
    queryKey: ["academics-calendar"],
    queryFn: getAcademicsCalendar,
  });

  // Mutations
  const saveEventMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsCalendarEvent({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-calendar"] });
      setEditEventId(null);
      toast.success("Academic Calendar record saved successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to save record: " + err.message);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsCalendarEvent({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-calendar"] });
      toast.success("Academic Calendar record deleted successfully!");
    },
    onError: (err: any) => {
      toast.error("Failed to delete record: " + err.message);
    }
  });

  const startEditEvent = (ev: any) => {
    setEditEventId(ev.id);
    setEventCategory(ev.level as any);
    setEventProgramName(ev.program_name);
    setEventRegulation(ev.regulation);
    setEventAcademicYear(ev.academic_year);
    // Align calendar_type value
    let mappedType = ev.calendar_type;
    if (mappedType === "Academic" || mappedType === "Academic Schedule") {
      mappedType = "Academic Schedule";
    }
    setEventCalendarType(mappedType as any);
    setEventPdfUrl(ev.pdf_url);
  };

  const startAddEvent = () => {
    setEditEventId(-1);
    setEventCategory(activeCategory);
    setEventProgramName(activeCategory === "UG" ? "B.Tech" : activeCategory === "PG" ? "M.Tech" : "PhD");
    setEventRegulation("R23");
    setEventAcademicYear("2025-2026");
    setEventCalendarType(
      activeSection === "All" ? "Academic Schedule" : activeSection as any
    );
    setEventPdfUrl("");
  };

  // Filter events based on level (active category), calendar_type (section), and search
  const filteredEvents = calendarEvents.filter((event) => {
    const matchesCategory = event.level === activeCategory;
    
    // Normalize type comparison
    const dbType = event.calendar_type === "Academic" ? "Academic Schedule" : event.calendar_type;
    const matchesSection = activeSection === "All" || dbType === activeSection;
    
    const matchesSearch = 
      event.program_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.regulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.academic_year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.calendar_type.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesCategory && matchesSection && matchesSearch;
  });

  // Calculate upcoming / latest calendar
  const latestCalendar = filteredEvents[0];

  const handleDownloadPDF = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("PDF file URL not available");
    }
  };

  return (
    <div 
      className="space-y-8 pb-16 min-h-screen bg-cover bg-center bg-no-repeat -mx-4 px-4 md:-mx-8 md:px-8"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.96), rgba(248,250,252,0.98)), url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068')"
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-4">
        <PageHeader 
          title="Academic Calendar" 
          subtitle="Explore official schedules, examinations cycles, and holiday planners for all courses."
          icon={CalendarIcon}
        />
        {latestCalendar && (
          <button 
            onClick={() => handleDownloadPDF(latestCalendar.pdf_url)}
            className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/20 mt-2"
          >
            <Download className="w-4 h-4" />
            Download Latest PDF ({latestCalendar.program_name})
          </button>
        )}
      </div>

      {/* Admin Mode Controls */}
      {isEditMode && (
        <GlassCard className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-slate-900">
          <p className="text-amber-800 text-xs font-semibold">
            <strong>Admin Edit Mode:</strong> Add or modify official academic calendars, exam schedules, and holiday files.
          </p>
          <button 
            onClick={startAddEvent}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus size={14} /> Add Calendar PDF
          </button>
        </GlassCard>
      )}

      {/* Main Editing Event Form */}
      {isEditMode && editEventId !== null && (
        <GlassCard className="p-6 border-2 border-amber-300 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-amber-200">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-850">
              {editEventId === -1 ? "Add Academic Calendar Document" : "Edit Academic Calendar Document"}
            </h3>
            <button 
              onClick={() => setEditEventId(null)}
              className="text-slate-400 hover:text-slate-650"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Academic Level</label>
              <select 
                value={eventCategory} 
                onChange={(e) => setEventCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              >
                <option value="UG">UG (Undergraduate)</option>
                <option value="PG">PG (Postgraduate)</option>
                <option value="PhD">PhD (Research)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Program Name</label>
              <input 
                type="text" 
                placeholder="e.g. B.Tech / M.Tech / MBA / MCA"
                value={eventProgramName} 
                onChange={(e) => setEventProgramName(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Regulation</label>
              <input 
                type="text" 
                placeholder="e.g. R23 / R20"
                value={eventRegulation} 
                onChange={(e) => setEventRegulation(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Academic Year</label>
              <input 
                type="text" 
                placeholder="e.g. 2025-2026"
                value={eventAcademicYear} 
                onChange={(e) => setEventAcademicYear(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Calendar Category</label>
              <select 
                value={eventCalendarType} 
                onChange={(e) => setEventCalendarType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              >
                <option value="Academic Schedule">Academic Schedule</option>
                <option value="Examinations">Examinations</option>
                <option value="Holidays">Holidays</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Calendar PDF URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/calendar.pdf"
                value={eventPdfUrl} 
                onChange={(e) => setEventPdfUrl(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs p-3 focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => setEditEventId(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-350 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (!eventProgramName || !eventRegulation || !eventAcademicYear || !eventPdfUrl) {
                  toast.error("Please fill in all fields before saving.");
                  return;
                }
                saveEventMutation.mutate({
                  id: editEventId === -1 ? undefined : editEventId,
                  level: eventCategory,
                  program_name: eventProgramName,
                  regulation: eventRegulation,
                  academic_year: eventAcademicYear,
                  calendar_type: eventCalendarType,
                  pdf_url: eventPdfUrl
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
            >
              <Save size={14} /> Save Record
            </button>
          </div>
        </GlassCard>
      )}

      {/* Program Categories Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl w-fit">
        {(["UG", "PG", "PhD"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveSection("All"); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeCategory === cat 
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" 
                : "text-slate-650 dark:text-slate-400 hover:text-blue-600"
            }`}
          >
            {cat === "UG" ? "UG Programs" : cat === "PG" ? "PG Programs" : "PhD Research"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Timeline list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Toolbar */}
          <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between overflow-visible z-20">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by program, regulation..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-550/50 outline-none transition-all placeholder:text-slate-500"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              {["All", "Academic Schedule", "Examinations", "Holidays"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveSection(tag as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSection === tag 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                      : "bg-slate-100 dark:bg-slate-800/50 text-slate-650 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Timeline / Card Elements */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500 font-medium">Loading Academic Calendars...</div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredEvents.map((event, idx) => {
                    const dbType = event.calendar_type === "Academic" ? "Academic Schedule" : event.calendar_type;
                    return (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <GlassCard className="p-5 group hover:border-blue-500/30 transition-all duration-300 relative h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              {/* Dynamic Icon */}
                              <div className={`p-2.5 rounded-xl ${
                                dbType === "Examinations" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40" 
                                : dbType === "Holidays" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" 
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                              }`}>
                                {dbType === "Examinations" ? <GraduationCap size={20} /> 
                                 : dbType === "Holidays" ? <Palmtree size={20} /> 
                                 : <CalendarIcon size={20} />}
                              </div>

                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                 dbType === 'Examinations' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' 
                                 : dbType === 'Holidays' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' 
                                 : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                              }`}>
                                {dbType}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                              {event.program_name} ({event.level})
                            </h3>
                            
                            <div className="text-xs text-slate-500 space-y-1 mt-2 mb-4">
                              <p><span className="font-semibold">Regulation:</span> {event.regulation}</p>
                              <p><span className="font-semibold">Academic Year:</span> {event.academic_year}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => handleDownloadPDF(event.pdf_url)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-slate-200 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              <Download size={14} /> Download PDF
                            </button>

                            {/* Admin Action Buttons */}
                            {isEditMode && (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => startEditEvent(event)}
                                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button 
                                  onClick={() => { if(confirm("Are you sure you want to delete this calendar record?")) deleteEventMutation.mutate(event.id); }}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 font-semibold text-sm">No academic calendars found matching your filters.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          <GlassCard className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none relative overflow-hidden shadow-xl">
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Active Reference Calendar
            </h3>
            {latestCalendar ? (
              <div>
                <p className="text-lg font-bold mb-1 line-clamp-2">{latestCalendar.program_name} ({latestCalendar.regulation})</p>
                <p className="text-blue-400 text-sm font-semibold mb-4">Academic Year: {latestCalendar.academic_year}</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-right">Latest addition for {activeCategory} level</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Select another category or add records to view reference metrics.</p>
            )}
          </GlassCard>

          <GlassCard className="p-5 flex gap-4 border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Official Notice:</strong> Academic calendars are designed and ratified by the College Academic Committee (CAC) in compliance with JNTU-GV guidelines. Any emergency rescheduling or holiday updates will be updated here in real-time.
            </p>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}

